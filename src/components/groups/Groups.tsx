import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useGoPhishConfig } from '../gophish/ConfigContext';
import { usePermissions } from '../../hooks/usePermissions';
import { apiUserGroups, TargetUser, UserGroup, UserGroupCreate, UserGroupUpdate } from '../../lib/api/client';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { X, Users } from 'lucide-react';

export default function Groups() {
  const { user } = useAuth();
  const { activeConfig } = useGoPhishConfig();
  const { canCreateGroups, canEditGroups, canDeleteGroups } = usePermissions();

  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditingId, setIsEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [targets, setTargets] = useState<TargetUser[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const canUse = useMemo(() => !!user && !!activeConfig?.id, [user, activeConfig]);

  const loadGroups = async () => {
    if (!activeConfig?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiUserGroups.list(activeConfig.id);
      setGroups(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canUse) {
      loadGroups();
    }
  }, [canUse]);

  const openDialog = (group?: UserGroup) => {
    if (group) {
      setIsEditingId(group.local_id);
      setName(group.name);
      setTargets(group.targets || []);
    } else {
      setIsEditingId(null);
      setName('');
      setTargets([]);
    }
    setCsvFile(null);
    setNewEmail('');
    setNewFirstName('');
    setNewLastName('');
    setNewPosition('');
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditingId(null);
    setName('');
    setTargets([]);
    setCsvFile(null);
  };

  const parseCSVContent = (content: string) => {
    const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const parsed: TargetUser[] = [];
    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim());
      const [email, first_name, last_name, position] = parts;
      if (email) {
        parsed.push({ email, first_name, last_name, position });
      }
    }
    return parsed;
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    const content = await file.text();
    const parsed = parseCSVContent(content);
    setTargets(parsed);
  };

  const addTarget = () => {
    if (!newEmail.trim()) return;
    const newTarget: TargetUser = {
      email: newEmail.trim(),
      first_name: newFirstName || undefined,
      last_name: newLastName || undefined,
      position: newPosition || undefined,
    };
    setTargets([...targets, newTarget]);
    setNewEmail('');
    setNewFirstName('');
    setNewLastName('');
    setNewPosition('');
  };

  const removeTarget = (index: number) => {
    setTargets(targets.filter((_, i) => i !== index));
  };

  const handleSaveGroup = async () => {
    if (!activeConfig?.id || !name.trim()) {
      setError('El nombre del grupo es requerido');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isEditingId) {
        const payload: UserGroupUpdate = { name: name.trim(), targets };
        await apiUserGroups.update(activeConfig.id, isEditingId, payload);
      } else {
        const payload: UserGroupCreate = { name: name.trim(), targets };
        await apiUserGroups.create(activeConfig.id, payload);
      }
      await loadGroups();
      closeDialog();
    } catch (e: any) {
      setError(e?.message || 'Error al guardar grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupId: number) => {
    if (!activeConfig?.id) return;
    if (!confirm('¿Estás seguro de que deseas eliminar este grupo?')) return;

    setLoading(true);
    setError(null);
    try {
      await apiUserGroups.delete(activeConfig.id, groupId);
      await loadGroups();
    } catch (e: any) {
      setError(e?.message || 'Error al eliminar grupo');
    } finally {
      setLoading(false);
    }
  };

  if (!canUse) {
    return (
      <Alert>
        <AlertTitle>Configuración requerida</AlertTitle>
        <AlertDescription>
          Inicia sesión y selecciona una configuración de GoPhish para gestionar grupos.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Users className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Grupos de Usuarios Objetivo</h1>
            <p className="text-muted-foreground">Gestiona los grupos de objetivos para tus campañas</p>
          </div>
        </div>
        {canCreateGroups && (
          <Button onClick={() => openDialog()}>
            Crear Grupo
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Grupos existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-sm">Cargando…</div>}
          {!loading && groups.length === 0 && (
            <div className="text-sm text-muted-foreground">No hay grupos todavía.</div>
          )}
          {!loading && groups.length > 0 && (
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Nombre</TableHead>
                    <TableHead className="min-w-[80px]">Usuarios</TableHead>
                    <TableHead className="min-w-[100px]">Creado</TableHead>
                    <TableHead className="min-w-[100px]">Modificado</TableHead>
                    <TableHead className="min-w-[160px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map(g => (
                    <TableRow key={g.local_id}>
                      <TableCell className="font-medium">{g.name}</TableCell>
                      <TableCell>{g.targets?.length ?? 0}</TableCell>
                      <TableCell className="text-xs">{new Date(g.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs">{new Date(g.modified_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(g)}
                            disabled={!canEditGroups}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(g.local_id)}
                            disabled={!canDeleteGroups}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar grupo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="!w-[95vw] !max-w-[1400px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{isEditingId ? 'Editar Grupo' : 'Crear Nuevo Grupo'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-y-auto px-1">
            {/* Nombre del grupo */}
            <div>
              <label className="text-sm font-medium">Nombre del grupo *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Equipo Ventas Q1"
                disabled={loading}
              />
            </div>

            {/* Importar CSV */}
            <div>
              <label className="text-sm font-medium">Importar usuarios desde CSV</label>
              <p className="text-xs text-muted-foreground mb-2">Columnas: email, first_name, last_name, position</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                disabled={loading}
                className="block w-full text-sm border border-input rounded-md p-2"
              />
              {csvFile && <p className="text-xs text-green-600 mt-1">Archivo cargado: {csvFile.name}</p>}
            </div>

            {/* Agregar usuario manual */}
            <div className="border-t pt-4 bg-muted/30 p-3 rounded-md">
              <label className="text-sm font-medium block mb-3">Agregar usuario manualmente</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <Input
                  placeholder="Email *"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
                <Input
                  placeholder="Nombre"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
                <Input
                  placeholder="Apellido"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
                <Input
                  placeholder="Posición"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
              </div>
              <Button
                variant="secondary"
                onClick={addTarget}
                disabled={loading || !newEmail.trim()}
                className="w-full sticky bottom-0 z-30 shadow-lg"
              >
                Agregar usuario
              </Button>
            </div>

            {/* Tabla de usuarios */}
            {targets.length > 0 && (
              <div className="border-t pt-4">
                <label className="text-sm font-medium block mb-3">
                  Usuarios ({targets.length})
                </label>
                
                {/* Contenedor con altura FIJA y scroll horizontal en móvil */}
                <div className="border rounded-md w-full overflow-auto" style={{ height: '250px' }}>
                  <Table className="min-w-[600px]">
                    <TableHeader className="sticky top-0 bg-background z-10 border-b">
                      <TableRow>
                        <TableHead className="min-w-[200px]">Email</TableHead>
                        <TableHead className="min-w-[100px]">Nombre</TableHead>
                        <TableHead className="min-w-[100px]">Apellido</TableHead>
                        <TableHead className="min-w-[100px]">Posición</TableHead>
                        <TableHead className="w-[80px] sticky right-0 bg-background">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {targets.map((t, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-xs sm:text-sm break-all">{t.email}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{t.first_name || '-'}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{t.last_name || '-'}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{t.position || '-'}</TableCell>
                          <TableCell className="sticky right-0 bg-background">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTarget(idx)}
                              disabled={loading}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="sticky bottom-0 bg-background border-t pt-4 mt-4 -mx-1 px-1">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={closeDialog} disabled={loading} className="flex-1 sm:flex-none">
                Cancelar
              </Button>
              <Button onClick={handleSaveGroup} disabled={loading || !name.trim()} className="flex-1 sm:flex-none">
                {isEditingId ? 'Guardar cambios' : 'Crear grupo'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
