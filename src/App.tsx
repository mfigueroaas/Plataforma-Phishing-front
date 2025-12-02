import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { CampaignList } from './components/campaigns/CampaignList';
import { CreateCampaign } from './components/campaigns/CreateCampaign';
import { TemplateEditor } from './components/templates/TemplateEditor';
import { Settings } from './components/settings/Settings';
import { LandingPage } from './components/landing/LandingPage';
import { Login } from './components/auth/Login';
import { useIsMobile } from './components/ui/use-mobile';
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { Menu, Shield } from 'lucide-react';

/**
 * Aplicación principal con sistema de autenticación Firebase
 * 
 * Configuración Firebase requerida en /firebase/config.js:
 * 
 * import { initializeApp } from 'firebase/app';
 * import { getAuth } from 'firebase/auth';
 * 
 * const firebaseConfig = {
 *   apiKey: "tu-api-key",
 *   authDomain: "utem-ciberseguridad.firebaseapp.com",
 *   projectId: "utem-ciberseguridad",
 *   storageBucket: "utem-ciberseguridad.appspot.com",
 *   messagingSenderId: "123456789",
 *   appId: "1:123456789:web:abcdef123456"
 * };
 * 
 * const app = initializeApp(firebaseConfig);
 * export const auth = getAuth(app);
 */

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  department: string;
  lastLogin: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Verificar autenticación con Firebase al cargar la app
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const [{ onAuthStateChanged }, { auth }] = await Promise.all([
        import('firebase/auth'),
        import('./firebase/config')
      ]);
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Usuario UTEM',
            role: 'user', // TODO: obtener de Firestore o custom claims
            department: 'Ciberseguridad',
            lastLogin: new Date().toISOString()
          });
        } else {
          setUser(null);
        }
        setAuthLoading(false);
      });
    })();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const handleLogin = (userData: User) => {
    // Después de login, el listener de Firebase actualizará el estado.
    setUser(userData);
  };

  const handleLogout = async () => {
    const [{ signOut }, { auth }] = await Promise.all([
      import('firebase/auth'),
      import('./firebase/config')
    ]);
    await signOut(auth);
    setCurrentPage('dashboard');
    setMobileMenuOpen(false);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    if (isMobile) {
      setMobileMenuOpen(false); // Cerrar menú móvil al navegar
    }
  };

  // Simulación de diferentes vistas basadas en URL params
  const urlParams = new URLSearchParams(window.location.search);
  const isLandingPage = urlParams.get('landing') === 'true';
  
  if (isLandingPage) {
    return <LandingPage campaignId={urlParams.get('c') || 'demo'} userId={urlParams.get('u') || 'demo'} />;
  }

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Mostrar login si no hay usuario autenticado
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderMainContent = () => {
    if (currentPage === 'campaigns' && isCreatingCampaign) {
      return <CreateCampaign />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'campaigns':
        return <CampaignList />;
      case 'detection':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl">Módulo de Detección</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Sistema avanzado de detección y análisis de amenazas en desarrollo...
            </p>
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">🛡️ Funcionalidades Planificadas</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Detección automática de emails de phishing</li>
                <li>• Análisis de URLs maliciosas en tiempo real</li>
                <li>• Monitoreo de dominios sospechosos</li>
                <li>• Alertas tempranas de amenazas</li>
                <li>• Dashboard de inteligencia de amenazas</li>
                <li>• Integración con feeds de amenazas externos</li>
                <li>• Análisis de reputación de remitentes</li>
                <li>• Sistema de scoring de riesgo</li>
              </ul>
            </div>
            <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <h3 className="font-medium mb-2 text-accent-foreground">📊 Endpoints de API</h3>
              <ul className="text-sm text-muted-foreground space-y-1 font-mono">
                <li>• POST /api/detection/analyze-email</li>
                <li>• GET /api/detection/threats/&#123;id&#125;</li>
                <li>• POST /api/detection/url-scan</li>
                <li>• GET /api/detection/dashboard</li>
                <li>• POST /api/detection/threat-feed</li>
              </ul>
            </div>
          </div>
        );
      case 'templates':
        return <TemplateEditor />;
      case 'settings':
      case 'account':
        return <Settings />;
      case 'users':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl">Usuarios y Grupos</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Módulo de gestión de usuarios en desarrollo...
            </p>
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">🔧 Funcionalidades Planificadas</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Crear y gestionar grupos de usuarios</li>
                <li>• Importar usuarios desde CSV/LDAP</li>
                <li>• Asignar roles y permisos</li>
                <li>• Historial de participación en campañas</li>
              </ul>
            </div>
          </div>
        );
      case 'landing':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl">Páginas de Destino</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Editor de landing pages educativas en desarrollo...
            </p>
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">🔧 Funcionalidades Planificadas</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Editor visual de landing pages</li>
                <li>• Plantillas de páginas educativas</li>
                <li>• Captura de credenciales (para entrenamiento)</li>
                <li>• Métricas de interacción</li>
              </ul>
            </div>
          </div>
        );
      case 'sending':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl">Perfiles de Envío</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Gestión avanzada de perfiles SMTP en desarrollo...
            </p>
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">🔧 Funcionalidades Planificadas</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Configuración detallada de SMTP</li>
                <li>• Pruebas de entregabilidad</li>
                <li>• Monitoreo de reputación</li>
                <li>• Rotación automática de servidores</li>
              </ul>
            </div>
          </div>
        );
      case 'management':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl">Gestión de Usuarios</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Panel administrativo en desarrollo...
            </p>
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">🔧 Funcionalidades Planificadas</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gestión de roles: autor, revisor, aprobador, admin</li>
                <li>• Flujo de aprobaciones pendientes</li>
                <li>• Auditoria de acciones</li>
                <li>• Configuración de permisos granulares</li>
              </ul>
            </div>
          </div>
        );
      case 'webhooks':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl">Webhooks</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Configuración de webhooks y integraciones en desarrollo...
            </p>
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">🔧 Funcionalidades Planificadas</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Webhooks para eventos de campaña</li>
                <li>• Integración con Slack/Teams</li>
                <li>• Notificaciones en tiempo real</li>
                <li>• API para sistemas externos</li>
              </ul>
            </div>
          </div>
        );
      case 'guide':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl">Guía de Usuario</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Documentación y tutoriales en desarrollo...
            </p>
          </div>
        );
      case 'api':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl">Documentación API</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Referencia completa de la API en desarrollo...
            </p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  // Versión móvil con Sheet/Drawer
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header móvil */}
        <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between border-b">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <Sidebar 
                currentPage={currentPage} 
                onPageChange={handlePageChange}
                user={user}
                onLogout={handleLogout}
                isMobile={true}
              />
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-sm">UTEM Ciberseguridad</span>
            </div>
          </div>
          
          <div className="w-10"></div> {/* Spacer para centrar el título */}
        </header>

        {/* Contenido principal móvil */}
        <main className="overflow-auto">
          {renderMainContent()}
        </main>
      </div>
    );
  }

  // Versión desktop
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        user={user}
        onLogout={handleLogout}
        isMobile={false}
      />
      <main className="flex-1 overflow-auto">
        {renderMainContent()}
      </main>
    </div>
  );
}