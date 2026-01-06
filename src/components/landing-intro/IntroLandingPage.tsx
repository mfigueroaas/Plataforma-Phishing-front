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
    <div className="min-h-screen bg-[#0a1929] text-white relative">
      {/* Navegación superior */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1929] border-b border-white/10 shadow-lg shadow-black/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00A859] rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-white">UTEM</div>
                <div className="text-[#00A859] text-sm leading-none">Ciberseguridad</div>
              </div>
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors px-2">
                Sobre el Proyecto
              </a>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors px-2">
                Características
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors px-2">
                Cómo Funciona
              </a>
            </div>

            {/* CTAs Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                className="bg-[#00A859] hover:bg-[#008f4a] text-white"
                onClick={openLoginDialog}
              >
                Entrar a la Consola
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0f1f2e] border-t border-white/10">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <a 
                href="#about" 
                className="block text-gray-300 hover:text-white py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre el Proyecto
              </a>
              <a 
                href="#features" 
                className="block text-gray-300 hover:text-white py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Características
              </a>
              <a 
                href="#how-it-works" 
                className="block text-gray-300 hover:text-white py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cómo Funciona
              </a>
              <div className="pt-3 border-t border-white/10">
                <Button 
                  className="w-full bg-[#00A859] hover:bg-[#008f4a] text-white"
                  onClick={openLoginDialog}
                >
                  Entrar a la Consola
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Secciones principales - añadir padding top para compensar el navbar fixed */}
      <div className="pt-16 md:pt-20">
        <HeroSection onGetStarted={openLoginDialog} />
      
      <div id="about">
        <AboutProjectSection />
      </div>
      
      <div id="features">
        <FeaturesSection />
      </div>
      
      <div id="how-it-works">
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
