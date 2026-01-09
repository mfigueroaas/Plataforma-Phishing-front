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
    <section className="bg-[#0f1f2e]" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
      <div className="container mx-auto" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        {/* Encabezado */}
        {/* ⬇️ AQUÍ: marginBottom controla el espacio entre el texto y las cards ⬇️ */}
        <div className="text-center animate-fade-in" style={{ marginBottom: '1rem' }}>
          <div className="inline-block animate-bounce-subtle" style={{ marginBottom: '1rem' }}>
            <span className="inline-flex items-center rounded-full bg-[#00A859]/10 border border-[#00A859]/20 text-[#00A859] backdrop-blur-sm" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.375rem', paddingBottom: '0.375rem', fontSize: '1.25rem', lineHeight: '1.5' }}>
              PROCESO
            </span>
          </div>
          <h2 style={{fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '1rem'}} className="text-white font-black animate-slide-up">
            Cómo funciona <span className="text-[#00A859] inline-block hover:scale-110 transition-transform duration-300">el Sistema</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto animate-fade-in-delay" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
            Flujo completo: desde la simulación de ataques hasta la detección y análisis de amenazas reales
          </p>
        </div>

        {/* Steps */}
        <div style={{gap: '1rem'}} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative animate-slide-up" style={{animationDelay: `${index * 150}ms`}}>
              {/* Conector visual (solo desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute bg-gradient-to-r from-[#00A859]/30 to-transparent animate-pulse" style={{ top: '1rem', left: '60%', width: '80%', height: '0.125rem' }}></div>
              )}

              <div className="relative bg-[#1a2a3a] border border-white/10 rounded-lg hover:border-[#00A859]/50 transition-all duration-500 group hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#00A859]/20" style={{ padding: '1rem' }}>
                <div className="flex flex-col">
                  {/* Banner con número e ícono - ancho completo */}
                  <div className="flex items-center transition-all duration-300" style={{ gap: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1.25rem', paddingRight: '1.25rem', marginBottom: '1.5rem' }}>
             
                    {/* Ícono - centrado en su contenedor */}
                    <div className="flex-1 flex justify-center">
                      <div className="rounded-lg bg-[#00A859]/20 border border-[#00A859]/40 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" style={{ width: '3rem', height: '3rem' }}>
                        <step.icon className="text-[#00A859] group-hover:scale-110 transition-transform duration-300" style={{ width: '1.5rem', height: '1.5rem' }} />
                      </div>
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="text-white font-bold text-center group-hover:text-[#00A859] transition-colors duration-300" style={{ fontSize: '1.25rem', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                    {step.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-400 text-center group-hover:text-gray-300 transition-colors duration-300" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{paddingTop: '1rem'}}></div>
    </section>
  );
}
