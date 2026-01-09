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
    <section className="bg-[#0f1f2e]" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
      <div className="container mx-auto" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        {/* Encabezado de sección */}
        <div className="text-center animate-fade-in" style={{ marginBottom: '2rem' }}>
          <div className="inline-block animate-bounce-subtle" style={{ marginBottom: '1rem' }}>
            <span className="inline-flex items-center rounded-full bg-[#00A859]/10 border border-[#00A859]/20 text-[#00A859] backdrop-blur-sm" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.375rem', paddingBottom: '0.375rem', fontSize: '1.25rem', lineHeight: '1.5' }}>
              FUNCIONALIDADES
            </span>
          </div>
          <h2 style={{fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '2rem' }} className="text-white font-black animate-slide-up">
            Funcionalidades <span className="text-[#00A859] inline-block hover:scale-110 transition-transform duration-300">Clave del Sistema</span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto animate-fade-in-delay" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
            Solución dual que combina simulación de ataques con detección defensiva. 
            Todo lo necesario para reducir vulnerabilidades en tu organización.
          </p>
        </div>

        {/* Grid de características */}
        <div style={{gap: '1rem'}} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-[#1a2a3a] border-white/10 hover:border-[#00A859]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#00A859]/10 group hover:-translate-y-2 hover:scale-105 animate-slide-up"
              style={{animationDelay: `${index * 100}ms`, padding: '1rem'}}
            >
              <div className="space-y-4 flex flex-col items-center text-center">
                {/* Icono */}
                <div className="rounded-lg bg-[#00A859]/10 border border-[#00A859]/20 flex items-center justify-center group-hover:bg-[#00A859]/20 group-hover:scale-110 transition-all duration-300 group-hover:rotate-6" style={{ width: '3rem', height: '3rem' }}>
                  <feature.icon className="text-[#00A859] group-hover:scale-110 transition-transform duration-300" style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>

                {/* Título */}
                <h3 className="text-white group-hover:text-[#00A859] transition-colors duration-300" style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>
                  {feature.title}
                </h3>

                {/* Descripción */}
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
          <div style={{paddingTop: '1rem'}}></div>
    </section>
  );
}
