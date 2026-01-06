import { FileText, Send, BarChart, GraduationCap } from 'lucide-react';

/**
 * How It Works Section - Cómo funciona la plataforma
 * Explica el proceso paso a paso
 */
export function HowItWorksSection() {
  const steps = [
    {
      icon: FileText,
      number: "01",
      title: "Crea Campañas Simuladas",
      description: "Diseña y lanza simulaciones de phishing educativas. Selecciona grupos objetivo y configura escenarios realistas basados en amenazas actuales.",
      endpoint: "POST /api/campaigns"
    },
    {
      icon: Send,
      number: "02",
      title: "Detecta Amenazas Reales",
      description: "Analiza correos y URLs sospechosas reportadas por usuarios. El módulo de detección valida SPF/DKIM y consulta APIs de seguridad.",
      endpoint: "POST /api/detection/analyze"
    },
    {
      icon: BarChart,
      number: "03",
      title: "Monitorea en Tiempo Real",
      description: "Dashboard con métricas clave: tasa de clics, reportes de usuarios y alertas de seguridad. Identifica patrones y vulnerabilidades.",
      endpoint: "GET /api/analytics/dashboard"
    },
    {
      icon: GraduationCap,
      number: "04",
      title: "Genera Informes",
      description: "Exporta reportes en PDF/CSV con indicadores de desempeño. Mide la evolución y efectividad de las capacitaciones realizadas.",
      endpoint: "GET /api/reports/export"
    }
  ];

  return (
    <section className="py-32 bg-[#0f1f2e] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        {/* Encabezado */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4 animate-bounce-subtle">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00A859]/10 border border-[#00A859]/20 text-[#00A859] text-xl backdrop-blur-sm">
              PROCESO
            </span>
          </div>
          <h2 style={{fontSize: '2.5rem'}} className="text-white mb-8 font-black leading-tight animate-slide-up">
            Cómo funciona <span className="text-[#00A859] inline-block hover:scale-110 transition-transform duration-300">el Sistema</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-fade-in-delay">
            Flujo completo: desde la simulación de ataques hasta la detección y análisis de amenazas reales
          </p>
        </div>

        {/* Steps */}
        <div style={{gap: '10px'}} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative animate-slide-up" style={{animationDelay: `${index * 150}ms`}}>
              {/* Conector visual (solo desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#00A859]/30 to-transparent animate-pulse"></div>
              )}

              <div className="relative bg-[#1a2a3a] border border-white/10 rounded-lg p-6 hover:border-[#00A859]/50 transition-all duration-500 group hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#00A859]/20">
                <div className="flex flex-col">
                  {/* Banner con número e ícono - ancho completo */}
                  <div className="flex items-center gap-4 bg-[#00A859]/10 rounded-lg py-3 px-5 mb-6 group-hover:bg-[#00A859]/20 transition-all duration-300">
                    {/* Número */}
                    <div className="w-12 h-12 bg-[#00A859] rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#00A859]/50">
                      {step.number}
                    </div>
                    
                    {/* Ícono - centrado en su contenedor */}
                    <div className="flex-1 flex justify-center">
                      <div className="w-12 h-12 rounded-lg bg-[#00A859]/20 border border-[#00A859]/40 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                        <step.icon className="w-6 h-6 text-[#00A859] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-3 text-center group-hover:text-[#00A859] transition-colors duration-300">
                    {step.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-400 text-sm leading-relaxed text-center group-hover:text-gray-300 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
          <div style={{paddingTop: '67px'}}></div>
              <div style={{paddingTop: '67px'}}></div>
    </section>
  );
}
