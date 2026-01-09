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
    <section className="relative overflow-hidden text-white" style={{ paddingTop: '5rem', paddingBottom: '5rem', marginBottom: '0', background: 'linear-gradient(135deg, #004d2e 0%, #12665b52 50%, #00a85a0b 100%)' }}>
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20"></div>
      
      <div className="container mx-auto relative z-10" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className="mx-auto text-center" style={{ maxWidth: '56rem' }}>

          {/* Título principal */}
          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700', marginBottom: '2rem' }}>
            Plataforma de Phishing Simulado<br />
            y <span className="text-[#00A859]">Detección Defensiva</span>
          </h1>

          {/* Descripción */}
          <p className="text-gray-300 mx-auto" style={{ fontSize: '1.125rem', lineHeight: '1.6', maxWidth: '42rem', marginBottom: '2rem' }}>
            Solución integral para concientizar y entrenar a la comunidad universitaria. Combina simulación de ataques con herramientas de defensa activa para disminuir la tasa de clics en correos maliciosos.
          </p>

          {/* CTAs */}
          <div className="flex justify-center items-center" style={{ paddingTop: '1rem' }}>
            <Button 
              className="bg-[#00A859] hover:bg-[#008f4a] text-white group"
              style={{ paddingLeft: '2rem', paddingRight: '2rem', paddingTop: '0.625rem', paddingBottom: '0.625rem', fontSize: '1rem', lineHeight: '1.5' }}
              onClick={onGetStarted}
            >
            Entrar a la Consola
              <ArrowRight className="group-hover:translate-x-1 transition-transform" style={{ marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem' }} />
            </Button>
          </div>
        </div>
      </div>
    
    </section>
    
  );
}
