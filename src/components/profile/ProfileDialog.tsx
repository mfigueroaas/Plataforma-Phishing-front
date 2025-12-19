import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent } from '../ui/card';
import { User, Mail, Shield, Building2, Calendar, KeyRound, Check, X, Loader2 } from 'lucide-react';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user, resetPassword } = useAuth();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState(user?.email || '');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return 'Administrador';
      case 'operator':
        return 'Operador';
      case 'viewer':
        return 'Visualizador';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return 'bg-red-500';
      case 'operator':
        return 'bg-blue-500';
      case 'viewer':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetError('Por favor ingresa tu email');
      return;
    }

    setResetLoading(true);
    setResetError(null);
    setResetSuccess(false);

    try {
      await resetPassword(resetEmail);
      setResetSuccess(true);
      setTimeout(() => {
        setShowResetPassword(false);
        setResetSuccess(false);
      }, 3000);
    } catch (error: any) {
      setResetError(error.message || 'Error al enviar el correo de restablecimiento');
    } finally {
      setResetLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[280px]">
        <DialogHeader>
          <DialogTitle>Mi Perfil</DialogTitle>
          <DialogDescription>
            Información de tu cuenta y opciones de seguridad
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar y Nombre */}
          <div className="flex flex-col items-center space-y-3 py-2">
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
              <AvatarFallback className="bg-secondary text-white text-2xl">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <Badge className={`${getRoleColor(user.role)} text-white`}>
                {getRoleName(user.role)}
              </Badge>
            </div>
          </div>

          {/* Información del Usuario */}
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">Correo Electrónico</Label>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">ID de Usuario</Label>
                  <p className="text-sm font-medium font-mono">{user.uid}</p>
                </div>
              </div>

              {user.department && (
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs text-muted-foreground">Departamento</Label>
                    <p className="text-sm font-medium">{user.department}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">Último Acceso</Label>
                  <p className="text-sm font-medium">
                    {new Date(user.lastLogin).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección de Restablecer Contraseña */}
          {!showResetPassword ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowResetPassword(true);
                setResetEmail(user.email);
              }}
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Restablecer Contraseña
            </Button>
          ) : (
            <Card className="border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <KeyRound className="w-4 h-4" />
                    Restablecer Contraseña
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowResetPassword(false);
                      setResetError(null);
                      setResetSuccess(false);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reset-email">Correo Electrónico</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="tu@email.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Se enviará un enlace para restablecer tu contraseña a este correo
                  </p>
                </div>

                {resetError && (
                  <Alert variant="destructive">
                    <AlertDescription>{resetError}</AlertDescription>
                  </Alert>
                )}

                {resetSuccess && (
                  <Alert className="bg-green-50 text-green-900 border-green-200">
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                      ¡Correo enviado! Revisa tu bandeja de entrada para restablecer tu contraseña.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleResetPassword}
                    disabled={resetLoading || resetSuccess}
                    className="flex-1"
                  >
                    {resetLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {resetSuccess ? 'Enviado' : 'Enviar Enlace'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResetPassword(false);
                      setResetError(null);
                      setResetSuccess(false);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
