import { useEffect, useState } from 'react';
import { Badge } from './badge';

interface PerformanceMetrics {
  authTime?: number;
  configTime?: number;
  renderTime?: number;
  cached: boolean;
}

/**
 * Componente de debug para mostrar métricas de rendimiento
 * Solo visible en desarrollo
 */
export function PerformanceDebug() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cached: false
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Solo en desarrollo
    if (import.meta.env.DEV) {
      // Revisar cache
      const hasCache = !!(
        sessionStorage.getItem('auth_user_cache') &&
        sessionStorage.getItem('gophish_configs_cache')
      );

      setMetrics(prev => ({
        ...prev,
        cached: hasCache
      }));

      // Escuchar logs de consola para capturar tiempos
      const originalLog = console.log;
      console.log = (...args) => {
        const msg = args.join(' ');
        
        if (msg.includes('[Auth] Auth check completed in')) {
          const time = parseFloat(msg.match(/(\d+)ms/)?.[1] || '0');
          setMetrics(prev => ({ ...prev, authTime: time }));
        }
        
        if (msg.includes('[Config] Configs loaded in')) {
          const time = parseFloat(msg.match(/(\d+)ms/)?.[1] || '0');
          setMetrics(prev => ({ ...prev, configTime: time }));
        }
        
        originalLog(...args);
      };

      // Medir tiempo de primer render
      const renderTime = performance.now();
      setMetrics(prev => ({ ...prev, renderTime }));

      return () => {
        console.log = originalLog;
      };
    }
  }, []);

  // No mostrar en producción
  if (!import.meta.env.DEV) return null;

  // Toggle con doble click en esquina
  return (
    <>
      {/* Trigger invisible */}
      <div
        className="fixed top-0 right-0 w-16 h-16 z-[9999] cursor-pointer"
        onDoubleClick={() => setVisible(!visible)}
        title="Double-click para ver métricas"
      />
      
      {/* Panel de métricas */}
      {visible && (
        <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-white p-4 rounded-lg shadow-2xl text-xs font-mono space-y-2 min-w-[250px]">
          <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-2">
            <span className="font-bold">⚡ Performance</span>
            <button
              onClick={() => setVisible(false)}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Cache:</span>
              <Badge variant={metrics.cached ? 'default' : 'destructive'} className="text-[10px]">
                {metrics.cached ? 'HIT' : 'MISS'}
              </Badge>
            </div>
            
            {metrics.authTime !== undefined && (
              <div className="flex justify-between">
                <span>Auth:</span>
                <Badge 
                  variant={metrics.authTime < 500 ? 'default' : 'destructive'}
                  className="text-[10px]"
                >
                  {metrics.authTime.toFixed(0)}ms
                </Badge>
              </div>
            )}
            
            {metrics.configTime !== undefined && (
              <div className="flex justify-between">
                <span>Configs:</span>
                <Badge 
                  variant={metrics.configTime < 300 ? 'default' : 'destructive'}
                  className="text-[10px]"
                >
                  {metrics.configTime.toFixed(0)}ms
                </Badge>
              </div>
            )}
            
            {metrics.renderTime !== undefined && (
              <div className="flex justify-between">
                <span>First Render:</span>
                <Badge 
                  variant={metrics.renderTime < 1000 ? 'default' : 'destructive'}
                  className="text-[10px]"
                >
                  {metrics.renderTime.toFixed(0)}ms
                </Badge>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-white/20 text-[10px] text-white/60">
            <div>💡 Double-click esquina superior derecha para toggle</div>
          </div>

          <div className="pt-1 space-y-1 text-[10px]">
            <button
              onClick={() => {
                sessionStorage.clear();
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 px-2 py-1 rounded"
            >
              🧪 Clear Cache & Reload
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-2 py-1 rounded"
            >
              🔄 Reload (test cache)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
