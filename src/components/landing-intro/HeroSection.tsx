import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

/**
 * Hero Section - Sección principal de introducción
 * Presenta el título principal y llamados a la acción
 */

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#0a1929] text-white py-20 md:py-32">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/20 via-transparent to-[#00A859]/10"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00A859]/10 border border-[#00A859]/20 text-[#00A859] text-sm">
              🛡️ Proyecto de Título - Escuela de Informática UTEM
            </span>
          </div>

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl">
            Plataforma de Phishing Simulado<br />
            y <span className="text-[#00A859]">Detección Defensiva</span>
          </h1>

          {/* Descripción */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Solución integral para concientizar y entrenar a la comunidad universitaria. Combina simulación de ataques con herramientas de defensa activa para disminuir la tasa de clics en correos maliciosos.
          </p>

          {/* CTAs */}
          <div className="flex justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="bg-[#00A859] hover:bg-[#008f4a] text-white px-8 group"
              onClick={onGetStarted}
            >
              Entrar a la Consola
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
