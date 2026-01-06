import { 
  Shield, 
  Mail, 
  BarChart3, 
  Users, 
  Zap, 
  Lock 
} from 'lucide-react';
import { Card } from '../ui/card';

/**
 * Features Section - Características principales de la plataforma
 * Grid responsive de features con iconos
 */
export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Motor de Campañas",
      description: "Creación y lanzamiento de simulaciones de phishing vía API. Lanza campañas educativas realistas para entrenar a tu comunidad.",
      color: "text-[#00A859]"
    },
    {
      icon: Lock,
      title: "Detección Defensiva",
      description: "Analiza URLs y correos sospechosos con heurísticas (SPF/DKIM, reputación) e integración con Google Safe Browsing y URLScan.",
      color: "text-[#00A859]"
    },
    {
      icon: BarChart3,
      title: "Dashboard Administrativo",
      description: "Visualización en tiempo real de métricas: tasa de apertura, clics, reportes y evolución del comportamiento de usuarios.",
      color: "text-[#00A859]"
    },
    {
      icon: Users,
      title: "Autenticación SSO",
      description: "Integración completa con Single Sign-On para gestión segura de usuarios. Autenticación centralizada con OAuth 2.0/Firebase.",
      color: "text-[#00A859]"
    },
    {
      icon: Mail,
      title: "Reportabilidad",
      description: "Generación de informes exportables en PDF/CSV con indicadores de desempeño y análisis de vulnerabilidades detectadas.",
      color: "text-[#00A859]"
    },
    {
      icon: Zap,
      title: "Arquitectura Escalable",
      description: "Microservicios contenerizados con Docker. Stack moderno: React/Next.js, FastAPI/Node.js/Go, PostgreSQL.",
      color: "text-[#00A859]"
    }
  ];

  return (
    <section className="py-20 bg-[#0f1f2e]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Encabezado de sección */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00A859]/10 border border-[#00A859]/20 text-[#00A859] text-xl">
              FUNCIONALIDADES
            </span>
          </div>
          <h2 style={{fontSize: '2.5rem'}} className="text-white mb-8 font-black leading-tight">
            Funcionalidades <span className="text-[#00A859]">Clave del Sistema</span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Solución dual que combina simulación de ataques con detección defensiva. 
            Todo lo necesario para reducir vulnerabilidades en tu organización.
          </p>
        </div>

        {/* Grid de características */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-[#1a2a3a] border-white/10 hover:border-[#00A859]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00A859]/10 p-6"
            >
              <div className="space-y-4 flex flex-col items-center text-center">
                {/* Icono */}
                <div className="w-12 h-12 rounded-lg bg-[#00A859]/10 border border-[#00A859]/20 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[#00A859]" />
                </div>

                {/* Título */}
                <h3 className="text-white text-xl">
                  {feature.title}
                </h3>

                {/* Descripción */}
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
