import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Shield, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';

/**
 * LoginDialog - Modal de inicio de sesión
 * 
 * Componente de autenticación en formato dialog/modal con:
 * - Login con email/contraseña usando Firebase Auth
 * - Google Sign-In real
 * - Estados de loading/error
 * - Validación básica
 * - Diseño responsivo
 * 
 * Props:
 * @param open - Estado del modal
 * @param onOpenChange - Callback para cambiar estado del modal
 * @param onLogin - Callback exitoso con datos de usuario (opcional, el AuthContext maneja el estado)
 */

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  department: string;
  lastLogin: string;
}

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin?: (user: User) => void; // Ahora opcional
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Roles demo para selección rápida
  const demoAccounts = [
    { email: 'admin@utem.cl', role: 'Administrador', dept: 'Ciberseguridad' },
    { email: 'autor@utem.cl', role: 'Autor', dept: 'TI' },
    { email: 'revisor@utem.cl', role: 'Revisor', dept: 'Auditoría' },
  ];

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación básica
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Email inválido');
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      onOpenChange(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Credenciales inválidas');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Por favor intenta más tarde.');
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      await loginWithGoogle();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Google login error:', error);
      if (error.message === 'UTEM_DOMAIN_REQUIRED') {
        setError('Debes usar un correo @utem.cl para iniciar sesión');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('');
      } else {
        setError('Error al iniciar sesión con Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword('demo123');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-[#00A859] rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Iniciar Sesión
          </DialogTitle>
          <DialogDescription className="text-center">
            Accede a la plataforma UTEM Ciberseguridad
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="mt-4">
          {/* Tab de Email/Contraseña */}
          <TabsContent value="email" className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Institucional</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@utem.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#003366] hover:bg-[#002244]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>

            {/* Google Sign-In */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>

            {/* Link de ayuda */}
            <div className="text-center text-sm">
              <a href="#" className="text-[#00A859] hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </TabsContent>
        </Tabs>


        {/* Dev info */}
        <div className="mt-2 p-2 bg-black/5 dark:bg-white/5 rounded text-xs text-muted-foreground">
          <code>trabajo de titulo 2026</code>
        </div>
      </DialogContent>
    </Dialog>
  );
}
