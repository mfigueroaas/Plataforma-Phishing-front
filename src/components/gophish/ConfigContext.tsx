import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiGoPhishConfigs, GoPhishConfig } from '../../lib/api/client';
import { useAuth } from '../auth/AuthContext';

interface ConfigContextType {
  configs: GoPhishConfig[];
  activeConfig: GoPhishConfig | null;
  loading: boolean;
  error: string | null;
  setActiveConfigId: (id: number) => void;
  refreshConfigs: () => Promise<void>;
  createConfig: (data: { name: string; base_url: string; api_key: string }) => Promise<GoPhishConfig>;
  updateConfig: (id: number, data: Partial<GoPhishConfig>) => Promise<void>;
  deleteConfig: (id: number) => Promise<void>;
  testConfig: (id: number) => Promise<{ ok: boolean; status: number; snippet?: string; error?: string }>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function useGoPhishConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useGoPhishConfig debe ser usado dentro de un ConfigProvider');
  }
  return context;
}

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const { user, token } = useAuth();
  // Cargar configs cacheadas inmediatamente
  const [configs, setConfigs] = useState<GoPhishConfig[]>(() => {
    try {
      const cached = sessionStorage.getItem('gophish_configs_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [activeConfig, setActiveConfig] = useState<GoPhishConfig | null>(() => {
    try {
      const cached = sessionStorage.getItem('gophish_active_config_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuraciones al montar o cambiar usuario/token - OPTIMIZADO
  useEffect(() => {
    let isMounted = true;

    if (user) {
      if (token) {
        // Solo cargar si no tenemos cache válido
        const hasCache = configs.length > 0;
        if (!hasCache) {
          refreshConfigs();
        } else {
          // Ya tenemos cache, solo marcar como no loading
          setLoading(false);
        }

        // Refrescar en segundo plano después de 500ms si hay cache
        if (hasCache && isMounted) {
          setTimeout(() => {
            if (isMounted) {
              refreshConfigs();
            }
          }, 500);
        }
      } else {
        // Hay usuario cacheado pero aún no hay token: esperar sin limpiar caches
        setLoading(true);
      }
    } else {
      // No hay usuario: limpiar caches y estado
      setConfigs([]);
      setActiveConfig(null);
      sessionStorage.removeItem('gophish_configs_cache');
      sessionStorage.removeItem('gophish_active_config_cache');
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id, token]);

  const refreshConfigs = async () => {
    if (!token) return;
    
    const perfStart = performance.now();
    setLoading(true);
    setError(null);
    
    // Optimización: leer savedConfigId antes de la llamada API
    const savedConfigId = localStorage.getItem('activeGoPhishConfigId');
    
    try {
      const data = await apiGoPhishConfigs.list();
      setConfigs(data);
      sessionStorage.setItem('gophish_configs_cache', JSON.stringify(data)); // Cache
      
      // Recuperar última configuración activa del localStorage
      let selectedConfig = null;
      if (savedConfigId) {
        const saved = data.find(c => c.id === parseInt(savedConfigId));
        if (saved) {
          selectedConfig = saved;
        } else if (data.length > 0) {
          selectedConfig = data[0];
          localStorage.setItem('activeGoPhishConfigId', data[0].id.toString());
        }
      } else if (data.length > 0) {
        selectedConfig = data[0];
        localStorage.setItem('activeGoPhishConfigId', data[0].id.toString());
      }
      
      if (selectedConfig) {
        setActiveConfig(selectedConfig);
        sessionStorage.setItem('gophish_active_config_cache', JSON.stringify(selectedConfig));
      }
    } catch (e: any) {
      setError(e.message || 'Error al cargar configuraciones');
      console.error('Error cargando configs:', e);
    } finally {
      setLoading(false);
      const perfEnd = performance.now();
      console.log(`[Config] Configs loaded in ${(perfEnd - perfStart).toFixed(0)}ms`);
    }
  };

  const setActiveConfigId = (id: number) => {
    const config = configs.find(c => c.id === id);
    if (config) {
      setActiveConfig(config);
      localStorage.setItem('activeGoPhishConfigId', id.toString());
      sessionStorage.setItem('gophish_active_config_cache', JSON.stringify(config));
    }
  };

  const createConfig = async (data: { name: string; base_url: string; api_key: string }): Promise<GoPhishConfig> => {
    const newConfig = await apiGoPhishConfigs.create(data);
    await refreshConfigs();
    return newConfig;
  };

  const updateConfig = async (id: number, data: Partial<GoPhishConfig>): Promise<void> => {
    await apiGoPhishConfigs.update(id, data);
    await refreshConfigs();
  };

  const deleteConfig = async (id: number): Promise<void> => {
    await apiGoPhishConfigs.delete(id);
    if (activeConfig?.id === id) {
      setActiveConfig(null);
      localStorage.removeItem('activeGoPhishConfigId');
    }
    await refreshConfigs();
  };

  const testConfig = async (id: number) => {
    return await apiGoPhishConfigs.test(id);
  };

  const value: ConfigContextType = {
    configs,
    activeConfig,
    loading,
    error,
    setActiveConfigId,
    refreshConfigs,
    createConfig,
    updateConfig,
    deleteConfig,
    testConfig
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}