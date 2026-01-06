import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

/**
 * CTA Section - Llamado a la acción final
 * Invita a los usuarios a comenzar a usar la plataforma
 */

interface CTASectionProps {
  onGetStarted?: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#0a1929] text-white py-20">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/20 via-transparent to-[#00A859]/10"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00A859]/10 border border-[#00A859]/20 text-[#00A859] text-sm">
              🚀 Comienza ahora
            </span>
          </div>

          {/* Título */}
          <h2 className="text-3xl md:text-4xl">
            Empieza a proteger tu<br />
            organización hoy
          </h2>

          {/* Descripción */}
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Únete a la comunidad UTEM que está fortaleciendo su cultura de ciberseguridad. 
            Configura tu primera campaña en minutos.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="bg-[#00A859] hover:bg-[#008f4a] text-white px-8 group"
              onClick={onGetStarted}
            >
              Crear Campaña Ahora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Info adicional */}
          <div className="pt-8 text-sm text-gray-400">
            <p>✓ Sin costo | ✓ Soporte técnico incluido | ✓ Documentación completa</p>
          </div>
        </div>
      </div>
    </section>
  );
}
