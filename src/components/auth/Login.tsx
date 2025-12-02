import { useState } from 'react';
import type React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { LoadingState } from '../ui/states';
import { Eye, EyeOff, Shield, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Componente de Login con Firebase Authentication
 * 
 * Endpoints Firebase requeridos:
 * - Firebase Auth SDK: signInWithEmailAndPassword()
 * - Firebase Auth SDK: signInWithPopup() para Google
 * - Firebase Auth SDK: GoogleAuthProvider()
 * - Firebase Auth SDK: sendPasswordResetEmail()
 * - Firebase Auth SDK: onAuthStateChanged()
 * 
 * Configuración Firebase requerida:
 * const firebaseConfig = {
 *   apiKey: "tu-api-key",
 *   authDomain: "tu-proyecto.firebaseapp.com",
 *   projectId: "tu-proyecto-id",
 *   // ... resto de configuración
 * };
 * 
 * Para Google Sign-In también necesitas:
 * 1. Habilitar Google provider en Firebase Console
 * 2. Configurar dominio autorizado en Firebase Console
 * 3. Agregar Google Client ID (opcional para mayor control)
 */

interface LoginProps {
  onLogin: (user: any) => void;
  onError?: (error: string) => void;
}

export function Login({ onLogin, onError }: LoginProps) {
  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al empezar a escribir
    if (error) setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const [{
        signInWithEmailAndPassword,
        setPersistence,
        browserLocalPersistence,
        browserSessionPersistence
      }, { auth }] = await Promise.all([
        import('firebase/auth'),
        import('../../firebase/config')
      ]);

      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const u = userCredential.user;
      onLogin({
        uid: u.uid,
        email: u.email,
        name: u.displayName || u.email?.split('@')[0] || 'Usuario', // Cambio aquí
        role: 'viewer', // Será sobrescrito por backend
        department: 'Ciberseguridad',
        lastLogin: new Date().toISOString(),
        provider: 'email'
      });
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Mapeo de errores Firebase a mensajes en español
      const errorMessages: Record<string, string> = {
        'auth/user-not-found': 'No existe una cuenta con este correo electrónico.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-email': 'El formato del correo electrónico no es válido.',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
        'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
        'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet.'
      };

      const message = errorMessages[error.code] || 'Error inesperado al iniciar sesión.';
      setError(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const [{ signInWithPopup, GoogleAuthProvider }, { auth }] = await Promise.all([
        import('firebase/auth'),
        import('../../firebase/config')
      ]);
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email && import.meta.env.VITE_GOOGLE_DOMAIN && !user.email.endsWith(`@${import.meta.env.VITE_GOOGLE_DOMAIN}`)) {
        throw new Error('UTEM_DOMAIN_REQUIRED');
      }

      onLogin({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
        role: 'user',
        department: 'Ciberseguridad',
        lastLogin: new Date().toISOString(),
        provider: 'google'
      });
    } catch (error: any) {
      console.error('Error en Google Sign-In:', error);
      
      // Mapeo de errores específicos de Google Auth
      const errorMessages: Record<string, string> = {
        'auth/popup-closed-by-user': 'Inicio de sesión cancelado por el usuario.',
        'auth/popup-blocked': 'El navegador bloqueó la ventana emergente. Permite ventanas emergentes para este sitio.',
        'auth/cancelled-popup-request': 'Solicitud de inicio de sesión cancelada.',
        'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet.',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
        'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este correo usando un método diferente.',
        'UTEM_DOMAIN_REQUIRED': 'Debes usar tu cuenta institucional de UTEM (@utem.cl) para acceder.'
      };

      const message = errorMessages[error.code] || errorMessages[error.message] || 'Error inesperado al iniciar sesión con Google.';
      setError(message);
      onError?.(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setError('Ingresa tu correo electrónico para restablecer la contraseña.');
      return;
    }

    setIsResettingPassword(true);
    setError(null);

    try {
      const [{ sendPasswordResetEmail }, { auth }] = await Promise.all([
        import('firebase/auth'),
        import('../../firebase/config')
      ]);
      await sendPasswordResetEmail(auth, formData.email);
      setResetEmailSent(true);
    } catch (error: any) {
      console.error('Error al enviar email de recuperación:', error);
      
      const errorMessages: Record<string, string> = {
        'auth/user-not-found': 'No existe una cuenta con este correo electrónico.',
        'auth/invalid-email': 'El formato del correo electrónico no es válido.'
      };

      const message = errorMessages[error.code] || 'Error al enviar el correo de recuperación.';
      setError(message);
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        {/* Header con branding UTEM */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-2xl">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl tracking-tight">UTEM Ciberseguridad</h1>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              Plataforma de Educación en Ciberseguridad
            </p>
          </div>
        </div>

        <Card className="border-border/50 shadow-lg mx-2 sm:mx-0">
          <CardHeader className="space-y-1 pb-4 px-4 sm:px-6">
            <CardTitle className="text-center text-lg sm:text-xl">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Ingresa con tu cuenta institucional UTEM
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 px-4 sm:px-6">
            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resetEmailSent && (
              <Alert className="border-secondary bg-secondary/10 animate-in slide-in-from-top-1">
                <Mail className="h-4 w-4 text-secondary" />
                <AlertDescription className="text-secondary-foreground">
                  Se ha enviado un correo con instrucciones para restablecer tu contraseña.
                </AlertDescription>
              </Alert>
            )}

            {/* Google Sign-In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 sm:h-12 bg-white hover:bg-gray-50 text-gray-900 border-gray-300 text-sm sm:text-base"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Conectando con Google...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </span>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu.correo@utem.cl"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    autoComplete="email"
                    aria-describedby="email-error"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tu contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                    autoComplete="current-password"
                    aria-describedby="password-error"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean | 'indeterminate') => setRememberMe(!!checked)}
                  />
                  <Label 
                    htmlFor="remember" 
                    className="text-sm cursor-pointer"
                  >
                    Recordar sesión
                  </Label>
                </div>

                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={isResettingPassword}
                  className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 py-0.5 transition-colors disabled:opacity-50"
                >
                  {isResettingPassword ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    '¿Olvidaste tu contraseña?'
                  )}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-sm sm:text-base"
                disabled={isLoading || isGoogleLoading || !formData.email || !formData.password}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión con Email'
                )}
              </Button>
            </form>

            {/* Información adicional */}
            <div className="pt-4 border-t text-center text-sm text-muted-foreground">
              <p>
                ¿Problemas para acceder?{' '}
                <a 
                  href="mailto:soporte.ciberseguridad@utem.cl" 
                  className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 py-0.5"
                >
                  Contacta soporte técnico
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer con información institucional */}
        <div className="text-center text-xs text-muted-foreground space-y-1 px-4">
          <p>Universidad Tecnológica Metropolitana</p>
          <p>Dirección de Tecnologías de la Información</p>
          <p className="mt-2">
            © 2024 UTEM. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}