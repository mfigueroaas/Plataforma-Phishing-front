import { Button } from '../ui/button';
import { Shield } from 'lucide-react';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { StatsSection } from './StatsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { AboutProjectSection } from './AboutProjectSection';
import { CTASection } from './CTASection';
import { FooterSection } from './FooterSection';
import { LoginDialog } from '../auth/LoginDialog';
import { useState } from 'react';

/**
 * IntroLandingPage - Landing page de introducción a la plataforma
 * 
 * Página de bienvenida que presenta UTEM Ciberseguridad con diseño
 * profesional similar a PhishGuard pero adaptado a la identidad UTEM.
 * 
 * Características:
 * - Diseño oscuro con colores institucionales UTEM
 * - Navegación sticky responsive
 * - Secciones: Hero, Features, Stats, How it Works, CTA, Footer
 * - Modal de login integrado
 * - Accesible (WCAG AA)
 * - Optimizado para móviles
 * - Anotaciones para desarrolladores
 * 
 * Props:
 * @param onLogin - Callback cuando el usuario inicia sesión exitosamente
 */

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  department: string;
  lastLogin: string;
}

interface IntroLandingPageProps {
  onLogin: (user: User) => void;
}

export function IntroLandingPage({ onLogin }: IntroLandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleLogin = (user: User) => {
    onLogin(user);
  };

  const openLoginDialog = () => {
    setLoginDialogOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a1929] text-white relative overflow-x-hidden">
      {/* Navegación superior */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1929] border-b border-white/10 shadow-lg shadow-black/20">
        <div className="w-full" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', maxWidth: '100%' }}>
          <div className="flex items-center justify-between" style={{ height: '3.5rem' }}>
            {/* Botón hamburguesa móvil */}
            <button
              className="lg:hidden text-white hover:text-[#00A859] transition-colors flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center flex-shrink-0" style={{ gap: '0.5rem' }}>
              <div className="bg-[#00A859] rounded-lg flex items-center justify-center" style={{ width: '2.25rem', height: '2.25rem' }}>
                <Shield className="text-white" style={{ width: '1.25rem', height: '1.25rem' }} />
              </div>
              <div className="hidden md:block">
                <div className="text-white" style={{ fontSize: '0.875rem', lineHeight: '1.2' }}>UTEM</div>
                <div className="text-[#00A859]" style={{ fontSize: '0.7rem', lineHeight: '1' }}>Ciberseguridad</div>
              </div>
            </div>
           
            {/* CTAs Desktop */}
            <div className="flex items-center flex-shrink-0 ml-auto" style={{ gap: '0.5rem' }}>
              <Button 
                className="hidden lg:flex bg-[#00A859] hover:bg-[#008f4a] text-white"
                style={{ fontSize: '0.875rem', paddingLeft: '1rem', paddingRight: '1rem' }}
                onClick={openLoginDialog}
              >
                Consola
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0f1f2e] border-t border-white/10">
            <div className="container mx-auto space-y-3" style={{ padding: '1rem' }}>
              <a 
                href="#sobre-proyecto" 
                className="block text-white font-semibold bg-[#00A859]/10 hover:bg-[#00A859]/20 border border-[#00A859]/30 hover:border-[#00A859] transition-all duration-300 rounded-lg text-center"
                style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', fontSize: '0.875rem', lineHeight: '1.5' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre el Proyecto
              </a>
              <a 
                href="#caracteristicas" 
                className="block text-white font-semibold bg-[#00A859]/10 hover:bg-[#00A859]/20 border border-[#00A859]/30 hover:border-[#00A859] transition-all duration-300 rounded-lg text-center"
                style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', fontSize: '0.875rem', lineHeight: '1.5' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Características
              </a>
              <a 
                href="#como-funciona" 
                className="block text-white font-semibold bg-[#00A859]/10 hover:bg-[#00A859]/20 border border-[#00A859]/30 hover:border-[#00A859] transition-all duration-300 rounded-lg text-center"
                style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', fontSize: '0.875rem', lineHeight: '1.5' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                ¿Cómo Funciona?
              </a>
              
            </div>
          </div>
        )}
        
      </nav>

      {/* Secciones principales - añadir padding top para compensar el navbar fixed */}
      <div style={{paddingTop: '67px'}}>
        <HeroSection onGetStarted={openLoginDialog} />
      
        <div id="sobre-proyecto">
          <AboutProjectSection />
        </div>
        
        <div id="caracteristicas">
          <FeaturesSection />
        </div>
        
        <div id="como-funciona">
          <HowItWorksSection />
        </div>

        {/* Footer simple */}
        <footer className="bg-[#0a1929] border-t border-white/10 py-8">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 Universidad Tecnológica Metropolitana
            </p>
          </div>
        </footer>
      </div>

      {/* Modal de Login */}
      <LoginDialog 
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        onLogin={handleLogin}
      />
    </div>
  );
}
