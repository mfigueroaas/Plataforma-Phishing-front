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
import { X } from 'lucide-react';

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Grupos de Usuarios Objetivo</h1>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Usuarios</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead>Modificado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map(g => (
                  <TableRow key={g.local_id}>
                    <TableCell>{g.name}</TableCell>
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
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar grupo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="!w-[95vw] !max-w-[1400px] max-h-[90vh] !overflow-hidden">
          <DialogHeader>
            <DialogTitle>{isEditingId ? 'Editar Grupo' : 'Crear Nuevo Grupo'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
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
            <div className="border-t pt-4">
              <label className="text-sm font-medium block mb-3">Agregar usuario manualmente</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <Input
                  placeholder="Email *"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={loading}
                />
                <Input
                  placeholder="Nombre"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  disabled={loading}
                />
                <Input
                  placeholder="Apellido"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  disabled={loading}
                />
                <Input
                  placeholder="Posición"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button
                variant="secondary"
                onClick={addTarget}
                disabled={loading || !newEmail.trim()}
                className="w-full"
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
                
                {/* Contenedor con altura FIJA usando inline styles */}
                <div
                  className="border rounded-md w-full"
                  style={{ height: '250px', overflowY: 'auto', overflowX: 'hidden', display: 'block' }}
                >
                    <Table className="w-full table-fixed">
                      <TableHeader className="sticky top-0 bg-background z-10 border-b">
                        <TableRow>
                          <TableHead className="w-1/2">Email</TableHead>
                          <TableHead className="w-[15%] whitespace-nowrap">Nombre</TableHead>
                          <TableHead className="w-[15%] whitespace-nowrap">Apellido</TableHead>
                          <TableHead className="w-[15%] whitespace-nowrap">Posición</TableHead>
                          <TableHead className="w-12 sticky right-0 bg-background z-20">Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {targets.map((t, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-sm break-words max-w-[1px]">{t.email}</TableCell>
                            <TableCell className="text-sm whitespace-nowrap">{t.first_name || '-'}</TableCell>
                            <TableCell className="text-sm whitespace-nowrap">{t.last_name || '-'}</TableCell>
                            <TableCell className="text-sm whitespace-nowrap">{t.position || '-'}</TableCell>
                            <TableCell className="sticky right-0 bg-background z-20 pl-2">
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

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSaveGroup} disabled={loading || !name.trim()}>
              {isEditingId ? 'Guardar cambios' : 'Crear grupo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
