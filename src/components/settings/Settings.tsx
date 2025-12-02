import { useState } from 'react';
import { useGoPhishConfig } from '../gophish/ConfigContext';
import { useAuth } from '../auth/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Server, Mail, Shield, Key, Plus, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function Settings() {
  const { user, canCreate, canEdit, canDelete, isAdmin } = useAuth();
  const {
    configs,
    activeConfig,
    loading: configLoading,
    error: configError,
    setActiveConfigId,
    createConfig,
    deleteConfig,
    testConfig
  } = useGoPhishConfig();

  const [newConfig, setNewConfig] = useState({ name: '', base_url: '', api_key: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [testResults, setTestResults] = useState<Record<number, { ok: boolean; status: number; snippet?: string; error?: string }>>({});
  const [testingIds, setTestingIds] = useState<Set<number>>(new Set());

  const handleCreateConfig = async () => {
    if (!newConfig.name || !newConfig.base_url || !newConfig.api_key) {
      alert('Completa todos los campos');
      return;
    }

    setIsCreating(true);
    try {
      await createConfig(newConfig);
      setNewConfig({ name: '', base_url: '', api_key: '' });
      alert('Configuración creada exitosamente');
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTestConfig = async (id: number) => {
    setTestingIds(prev => new Set(prev).add(id));
    try {
      const result = await testConfig(id);
      setTestResults(prev => ({ ...prev, [id]: result }));
    } catch (e: any) {
      setTestResults(prev => ({ ...prev, [id]: { ok: false, status: 0, error: e.message } }));
    } finally {
      setTestingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDeleteConfig = async (id: number) => {
    if (!confirm('¿Eliminar esta configuración?')) return;
    try {
      await deleteConfig(id);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona las conexiones con GoPhish y configuraciones del sistema
        </p>
      </div>

      <Tabs defaultValue="gophish" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gophish">
            <Server className="w-4 h-4 mr-2" />
            GoPhish
          </TabsTrigger>
          <TabsTrigger value="smtp">
            <Mail className="w-4 h-4 mr-2" />
            SMTP
          </TabsTrigger>
          {isAdmin() && (
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Seguridad
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="gophish" className="space-y-4">
          {configError && (
            <Alert variant="destructive">
              <AlertDescription>{configError}</AlertDescription>
            </Alert>
          )}

          {/* Configuración Activa */}
          {activeConfig && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Configuración Activa</span>
                  <Badge variant="secondary">ID: {activeConfig.id}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Nombre:</strong> {activeConfig.name}</p>
                  <p><strong>URL:</strong> {activeConfig.base_url}</p>
                  <p><strong>Creada:</strong> {new Date(activeConfig.created_at).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Crear Nueva Configuración */}
          {canCreate() && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nueva Configuración GoPhish
                </CardTitle>
                <CardDescription>
                  Agrega una instancia de GoPhish para gestionar campañas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="config-name">Nombre</Label>
                    <Input
                      id="config-name"
                      placeholder="GoPhish Producción"
                      value={newConfig.name}
                      onChange={e => setNewConfig(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="config-url">URL Base</Label>
                    <Input
                      id="config-url"
                      placeholder="https://gophish.ejemplo.com"
                      value={newConfig.base_url}
                      onChange={e => setNewConfig(prev => ({ ...prev, base_url: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="config-apikey">API Key</Label>
                  <Input
                    id="config-apikey"
                    type="password"
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                    value={newConfig.api_key}
                    onChange={e => setNewConfig(prev => ({ ...prev, api_key: e.target.value }))}
                  />
                </div>
                <Button onClick={handleCreateConfig} disabled={isCreating}>
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Crear Configuración
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Lista de Configuraciones */}
          <Card>
            <CardHeader>
              <CardTitle>Configuraciones Existentes</CardTitle>
              <CardDescription>Tus instancias de GoPhish configuradas</CardDescription>
            </CardHeader>
            <CardContent>
              {configLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : configs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No hay configuraciones</p>
              ) : (
                <div className="space-y-4">
                  {configs.map(config => {
                    const testResult = testResults[config.id];
                    const isTesting = testingIds.has(config.id);
                    const isActive = activeConfig?.id === config.id;

                    return (
                      <div key={config.id} className={`p-4 border rounded-lg ${isActive ? 'border-primary bg-primary/5' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{config.name}</h4>
                              {isActive && <Badge variant="default">Activa</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{config.base_url}</p>
                            <p className="text-xs text-muted-foreground">ID: {config.id} | Propietario: {config.owner_userid}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!isActive && (
                              <Button size="sm" variant="outline" onClick={() => setActiveConfigId(config.id)}>
                                Activar
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => handleTestConfig(config.id)} disabled={isTesting}>
                              {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Probar'}
                            </Button>
                            {canDelete() && (
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteConfig(config.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        {testResult && (
                          <div className={`mt-2 p-2 rounded text-sm ${testResult.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {testResult.ok ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Conexión exitosa (HTTP {testResult.status})</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <XCircle className="w-4 h-4" />
                                <span>{testResult.error || 'Error de conexión'}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smtp">
          <Card>
            <CardHeader>
              <CardTitle>Configuración SMTP</CardTitle>
              <CardDescription>Placeholder para configurar servidores de correo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Implementación pendiente</p>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin() && (
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Seguridad y Permisos</CardTitle>
                <CardDescription>Gestión de roles y accesos (solo platform_admin)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Implementación pendiente</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}