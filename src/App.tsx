import { useState } from 'react';
import { useAuth } from './components/auth/AuthContext'; // ⬅️ Usar contexto
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { CampaignList } from './components/campaigns/CampaignList';
import { CreateCampaign } from './components/campaigns/CreateCampaign';
import { TemplateEditor } from './components/templates/TemplateEditor';
import { Settings } from './components/settings/Settings';
import { LandingPages } from './components/landing/LandingPages';
import { IntroLandingPage } from './components/landing-intro/IntroLandingPage';
import { PhishingAwarenessLanding } from './components/landing/PhishingAwarenessLanding';
import { Login } from './components/auth/Login';
import { useIsMobile } from './components/ui/use-mobile';
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { Menu, Shield, BookOpen } from 'lucide-react';
import { SendingProfiles } from './components/sending/SendingProfiles';
import Groups from './components/groups/Groups';
import { PerformanceDebug } from './components/ui/performance-debug';
import { SecurityDashboard } from './components/security/SecurityDashboard';
import { ErrorBoundary } from './components/ui/error-boundary';
import { UserManagement } from './components/admin/UserManagement';
import { AIPhishingDetector } from './components/security/AIPhishingDetector';
import { UserGuide } from './components/guide/UserGuide';


export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // ⬇️ USAR AUTHCONTEXT en lugar de estado local
  const { user, loading: authLoading, logout } = useAuth();

  // ⬇️ ELIMINAR useEffect de Firebase (ya está en AuthContext)
  // ⬇️ ELIMINAR handleLogin (Login ya no lo necesita con AuthContext)

  const handleLogout = async () => {
    await logout();
    setCurrentPage('dashboard');
    setMobileMenuOpen(false);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const urlParams = new URLSearchParams(window.location.search);
  const isAwarenessLanding = pathname === '/concientizacion';
  const isLandingPage = urlParams.get('landing') === 'true';
  
  if (isAwarenessLanding) {
    return <PhishingAwarenessLanding />;
  }

  if (isLandingPage) {
    return <LandingPages />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // ⬇️ Mostrar IntroLandingPage en lugar de Login
    return <IntroLandingPage onLogin={(userData) => {
      // El login se maneja internamente por LoginDialog y AuthContext
      console.log('Usuario logueado:', userData);
    }} />;
  }

  const renderMainContent = () => {
    if (currentPage === 'campaigns' && isCreatingCampaign) {
      return <CreateCampaign onBack={() => setIsCreatingCampaign(false)} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            onCreateClick={() => {
              setCurrentPage('campaigns');
              setIsCreatingCampaign(true);
            }}
            onViewDetails={() => setCurrentPage('campaigns')}
          />
        );
      case 'campaigns':
        return <CampaignList onCreateClick={() => setIsCreatingCampaign(true)} />;
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
        return <Groups />;
      case 'landing':
        return <LandingPages />;
      case 'sending':
        return <SendingProfiles />;
      case 'security':
        return (
          <ErrorBoundary>
            <SecurityDashboard />
          </ErrorBoundary>
        );
      case 'ai-detector':
        return (
          <ErrorBoundary>
            <AIPhishingDetector />
          </ErrorBoundary>
        );
      case 'management':
        return <UserManagement />;
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
        return <UserGuide />;
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

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
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
          
          <div className="w-10"></div>
        </header>

        <main className="overflow-auto">
          {renderMainContent()}
        </main>
      </div>
    );
  }

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
      
      {/* Debug de performance - solo en desarrollo */}
      <PerformanceDebug />
    </div>
  );
}