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
    <section className="py-32 bg-[#0f1f2e]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Encabezado de sección */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4 animate-bounce-subtle">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00A859]/10 border border-[#00A859]/20 text-[#00A859] text-xl backdrop-blur-sm">
              FUNCIONALIDADES
            </span>
          </div>
          <h2 style={{fontSize: '2.5rem'}} className="text-white mb-8 font-black leading-tight animate-slide-up">
            Funcionalidades <span className="text-[#00A859] inline-block hover:scale-110 transition-transform duration-300">Clave del Sistema</span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-fade-in-delay">
            Solución dual que combina simulación de ataques con detección defensiva. 
            Todo lo necesario para reducir vulnerabilidades en tu organización.
          </p>
        </div>

        {/* Grid de características */}
        <div style={{gap: '10px'}} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-[#1a2a3a] border-white/10 hover:border-[#00A859]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#00A859]/10 p-6 group hover:-translate-y-2 hover:scale-105 animate-slide-up"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <div className="space-y-4 flex flex-col items-center text-center">
                {/* Icono */}
                <div className="w-12 h-12 rounded-lg bg-[#00A859]/10 border border-[#00A859]/20 flex items-center justify-center group-hover:bg-[#00A859]/20 group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
                  <feature.icon className="w-6 h-6 text-[#00A859] group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Título */}
                <h3 className="text-white text-xl group-hover:text-[#00A859] transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Descripción */}
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
          <div style={{paddingTop: '67px'}}></div>
    </section>
  );
}
