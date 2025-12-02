import { useState, useEffect } from 'react';
import { useGoPhishConfig } from '../gophish/ConfigContext';
import { useAuth } from '../auth/AuthContext';
import { apiSendingProfiles, SendingProfile, SendingProfileCreate, SendingProfileHeader } from '../../lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Send, Plus, Trash2, Edit, Loader2, AlertCircle, Mail, Server, Key, X } from 'lucide-react';

export function SendingProfiles() {
  const { activeConfig } = useGoPhishConfig();
  const { canCreate, canEdit, canDelete } = useAuth();
  
  const [profiles, setProfiles] = useState<SendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SendingProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<SendingProfileCreate>({
    name: '',
    interface_type: 'SMTP',
    from_address: '',
    host: '',
    username: '',
    password: '',
    ignore_cert_errors: true,
    headers: []
  });

  const [newHeader, setNewHeader] = useState<SendingProfileHeader>({ key: '', value: '' });

  useEffect(() => {
    if (activeConfig) {
      loadProfiles();
    } else {
      setLoading(false);
      setError('No hay configuración activa. Por favor selecciona una en Configuración.');
    }
  }, [activeConfig]);

  const loadProfiles = async () => {
    if (!activeConfig) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await apiSendingProfiles.list(activeConfig.id);
      setProfiles(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar perfiles de envío');
      console.error('Error cargando sending profiles:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!activeConfig) return;
    if (!formData.name || !formData.from_address || !formData.host || !formData.username || !formData.password) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSaving(true);
    try {
      await apiSendingProfiles.create(activeConfig.id, formData);
      await loadProfiles();
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!activeConfig || !editingProfile) return;

    setIsSaving(true);
    try {
      await apiSendingProfiles.update(activeConfig.id, editingProfile.local_id, formData);
      await loadProfiles();
      setIsEditDialogOpen(false);
      setEditingProfile(null);
      resetForm();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (profileId: number) => {
    if (!activeConfig) return;
    if (!confirm('¿Estás seguro de eliminar este perfil de envío?')) return;

    try {
      await apiSendingProfiles.delete(activeConfig.id, profileId);
      await loadProfiles();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  const openEditDialog = (profile: SendingProfile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name,
      interface_type: profile.interface_type,
      from_address: profile.from_address,
      host: profile.host,
      username: profile.username,
      password: '', // No mostramos la contraseña actual
      ignore_cert_errors: profile.ignore_cert_errors,
      headers: profile.headers || []
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      interface_type: 'SMTP',
      from_address: '',
      host: '',
      username: '',
      password: '',
      ignore_cert_errors: true,
      headers: []
    });
    setNewHeader({ key: '', value: '' });
  };

  const addHeader = () => {
    if (!newHeader.key || !newHeader.value) return;
    setFormData(prev => ({
      ...prev,
      headers: [...(prev.headers || []), newHeader]
    }));
    setNewHeader({ key: '', value: '' });
  };

  const removeHeader = (index: number) => {
    setFormData(prev => ({
      ...prev,
      headers: (prev.headers || []).filter((_, i) => i !== index)
    }));
  };

  if (!activeConfig) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No hay configuración GoPhish activa. Por favor configura una en la sección de Configuración.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfiles de Envío</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los servidores SMTP para envío de correos
          </p>
        </div>
        {canCreate() && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Perfil
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : profiles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Send className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay perfiles de envío configurados</p>
            {canCreate() && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Perfil
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {profiles.map(profile => (
            <Card key={profile.local_id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      {profile.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>{profile.from_address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Server className="w-3 h-3" />
                          <span>{profile.host}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Key className="w-3 h-3" />
                          <span>{profile.username}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{profile.interface_type}</Badge>
                    {profile.ignore_cert_errors && (
                      <Badge variant="outline">Ignorar SSL</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>ID Local: {profile.local_id} | GoPhish ID: {profile.gophish_id}</p>
                    <p>Creado: {new Date(profile.created_at).toLocaleString()}</p>
                    {profile.headers && profile.headers.length > 0 && (
                      <p>Headers personalizados: {profile.headers.length}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {canEdit() && (
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(profile)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                    {canDelete() && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(profile.local_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Perfil de Envío</DialogTitle>
            <DialogDescription>
              Configura un servidor SMTP para enviar correos de campañas
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  placeholder="Gmail SMTP"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interface_type">Tipo</Label>
                <Input
                  id="interface_type"
                  value="SMTP"
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="from_address">Dirección Remitente *</Label>
              <Input
                id="from_address"
                type="email"
                placeholder="ejemplo@dominio.com"
                value={formData.from_address}
                onChange={e => setFormData(prev => ({ ...prev, from_address: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="host">Host SMTP *</Label>
              <Input
                id="host"
                placeholder="smtp.gmail.com:587"
                value={formData.host}
                onChange={e => setFormData(prev => ({ ...prev, host: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario *</Label>
                <Input
                  id="username"
                  placeholder="usuario@dominio.com"
                  value={formData.username}
                  onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ignore_cert"
                checked={formData.ignore_cert_errors}
                onCheckedChange={checked => setFormData(prev => ({ ...prev, ignore_cert_errors: checked }))}
              />
              <Label htmlFor="ignore_cert" className="cursor-pointer">
                Ignorar errores de certificado SSL
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Headers Personalizados (opcional)</Label>
              <div className="space-y-2">
                {formData.headers?.map((header, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={header.key} disabled className="flex-1" />
                    <Input value={header.value} disabled className="flex-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHeader(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Clave (ej: X-Custom-Header)"
                    value={newHeader.key}
                    onChange={e => setNewHeader(prev => ({ ...prev, key: e.target.value }))}
                  />
                  <Input
                    placeholder="Valor"
                    value={newHeader.value}
                    onChange={e => setNewHeader(prev => ({ ...prev, value: e.target.value }))}
                  />
                  <Button onClick={addHeader} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Similar estructura */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Perfil de Envío</DialogTitle>
            <DialogDescription>
              Modifica la configuración del servidor SMTP
            </DialogDescription>
          </DialogHeader>
          
          {/* Mismo contenido que Create Dialog */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-interface_type">Tipo</Label>
                <Input
                  id="edit-interface_type"
                  value="SMTP"
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-from_address">Dirección Remitente *</Label>
              <Input
                id="edit-from_address"
                type="email"
                value={formData.from_address}
                onChange={e => setFormData(prev => ({ ...prev, from_address: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-host">Host SMTP *</Label>
              <Input
                id="edit-host"
                value={formData.host}
                onChange={e => setFormData(prev => ({ ...prev, host: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Usuario *</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Nueva Contraseña (dejar vacío para mantener)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-ignore_cert"
                checked={formData.ignore_cert_errors}
                onCheckedChange={checked => setFormData(prev => ({ ...prev, ignore_cert_errors: checked }))}
              />
              <Label htmlFor="edit-ignore_cert" className="cursor-pointer">
                Ignorar errores de certificado SSL
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Headers Personalizados</Label>
              <div className="space-y-2">
                {formData.headers?.map((header, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={header.key} disabled className="flex-1" />
                    <Input value={header.value} disabled className="flex-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHeader(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Clave"
                    value={newHeader.key}
                    onChange={e => setNewHeader(prev => ({ ...prev, key: e.target.value }))}
                  />
                  <Input
                    placeholder="Valor"
                    value={newHeader.value}
                    onChange={e => setNewHeader(prev => ({ ...prev, value: e.target.value }))}
                  />
                  <Button onClick={addHeader} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Edit className="w-4 h-4 mr-2" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}