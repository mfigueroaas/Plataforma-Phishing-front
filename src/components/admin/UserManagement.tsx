import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiUsers, BackendUser, CreateUserRequest } from '../../lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { Plus, Trash2, UserCog, AlertTriangle } from 'lucide-react';

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // Form states
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'viewer' | 'operator' | 'platform_admin'>('viewer');
  const [editRole, setEditRole] = useState<'viewer' | 'operator' | 'platform_admin'>('viewer');

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiUsers.listAll();
      setUsers(data);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'platform_admin') {
      loadUsers();
    }
  }, [currentUser]);

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserName) {
      setError('Email y nombre son requeridos');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data: CreateUserRequest = {
        email: newUserEmail,
        name: newUserName,
        role: newUserRole
      };
      await apiUsers.create(data);
      await loadUsers();
      setCreateDialogOpen(false);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserRole('viewer');
    } catch (e: any) {
      setError(e?.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiUsers.updateRole(userId, { role: editRole });
      await loadUsers();
      setEditingUserId(null);
    } catch (e: any) {
      setError(e?.message || 'Error al actualizar rol');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${userName}?`)) return;

    setLoading(true);
    setError(null);
    try {
      await apiUsers.delete(userId);
      await loadUsers();
    } catch (e: any) {
      setError(e?.message || 'Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return <Badge variant="default">Platform Admin</Badge>;
      case 'operator':
        return <Badge variant="secondary">Operator</Badge>;
      case 'viewer':
        return <Badge variant="outline">Viewer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return 'Acceso total a la plataforma';
      case 'operator':
        return 'Puede gestionar campañas y recursos';
      case 'viewer':
        return 'Solo lectura';
      default:
        return '';
    }
  };

  if (currentUser?.role !== 'platform_admin') {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Acceso denegado</AlertTitle>
          <AlertDescription>
            Solo los administradores de plataforma pueden acceder a esta sección.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra usuarios y sus permisos en la plataforma
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Ingresa los datos del nuevo usuario. Se enviará un correo de invitación.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Juan Pérez"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select value={newUserRole} onValueChange={(value: any) => setNewUserRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Viewer</span>
                        <span className="text-xs text-muted-foreground">Solo lectura</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="operator">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Operator</span>
                        <span className="text-xs text-muted-foreground">Gestión de campañas</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="platform_admin">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Platform Admin</span>
                        <span className="text-xs text-muted-foreground">Acceso total</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser} disabled={loading}>
                Crear Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>
            {loading ? 'Cargando...' : `${users.length} usuario(s) en la plataforma`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && users.length === 0 ? (
            <div className="text-sm text-muted-foreground">Cargando usuarios…</div>
          ) : users.length === 0 ? (
            <div className="text-sm text-muted-foreground">No hay usuarios registrados.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <div className="flex gap-2 items-center">
                          <Select value={editRole} onValueChange={(value: any) => setEditRole(value)}>
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="viewer">Viewer</SelectItem>
                              <SelectItem value="operator">Operator</SelectItem>
                              <SelectItem value="platform_admin">Platform Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" onClick={() => handleUpdateRole(user.id)} disabled={loading}>
                            Guardar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingUserId(null)}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getRoleBadge(user.role)}
                          <span className="text-xs text-muted-foreground">
                            {getRoleDescription(user.role)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('es-CL')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {editingUserId !== user.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingUserId(user.id);
                              setEditRole(user.role);
                            }}
                            disabled={user.id === currentUser?.id}
                          >
                            <UserCog className="w-4 h-4 mr-1" />
                            Cambiar Rol
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={user.id === currentUser?.id || loading}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Role Hierarchy Info */}
      <Card>
        <CardHeader>
          <CardTitle>Jerarquía de Roles</CardTitle>
          <CardDescription>
            Descripción de los permisos por rol
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">Platform Admin</Badge>
              <span className="text-sm font-medium">Nivel más alto</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Acceso completo a todos los recursos, incluyendo gestión de usuarios, configuraciones de GoPhish, y todas las operaciones de campañas.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Operator</Badge>
              <span className="text-sm font-medium">Operador de campañas</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Puede crear, editar y eliminar campañas, templates, grupos, landing pages y perfiles de envío. No puede gestionar usuarios.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Viewer</Badge>
              <span className="text-sm font-medium">Solo lectura</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Puede ver todos los recursos, estadísticas y resultados de campañas. No puede crear, editar o eliminar ningún recurso.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
