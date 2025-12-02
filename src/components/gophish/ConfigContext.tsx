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
  const [configs, setConfigs] = useState<GoPhishConfig[]>([]);
  const [activeConfig, setActiveConfig] = useState<GoPhishConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuraciones al montar o cambiar usuario
  useEffect(() => {
    if (user && token) {
      refreshConfigs();
    } else {
      setConfigs([]);
      setActiveConfig(null);
      setLoading(false);
    }
  }, [user, token]);

  const refreshConfigs = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await apiGoPhishConfigs.list();
      setConfigs(data);
      
      // Recuperar última configuración activa del localStorage
      const savedConfigId = localStorage.getItem('activeGoPhishConfigId');
      if (savedConfigId) {
        const saved = data.find(c => c.id === parseInt(savedConfigId));
        if (saved) {
          setActiveConfig(saved);
        } else if (data.length > 0) {
          setActiveConfig(data[0]);
          localStorage.setItem('activeGoPhishConfigId', data[0].id.toString());
        }
      } else if (data.length > 0) {
        setActiveConfig(data[0]);
        localStorage.setItem('activeGoPhishConfigId', data[0].id.toString());
      }
    } catch (e: any) {
      setError(e.message || 'Error al cargar configuraciones');
      console.error('Error cargando configs:', e);
    } finally {
      setLoading(false);
    }
  };

  const setActiveConfigId = (id: number) => {
    const config = configs.find(c => c.id === id);
    if (config) {
      setActiveConfig(config);
      localStorage.setItem('activeGoPhishConfigId', id.toString());
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