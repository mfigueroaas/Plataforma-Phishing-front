/**
 * Stats Section - Estadísticas y métricas de impacto
 * Muestra los números clave de la plataforma
 */
export function StatsSection() {
  const stats = [
    {
      value: "95%",
      label: "Efectividad de campañas",
      description: "Los usuarios capacitados reconocen amenazas"
    },
    {
      value: "500+",
      label: "Plantillas Activas",
      description: "Biblioteca de escenarios reales"
    },
    {
      value: "10K+",
      label: "Usuarios Protegidos",
      description: "En la comunidad UTEM"
    },
    {
      value: "24/7",
      label: "Monitoreo Activo",
      description: "Detección continua de amenazas"
    }
  ];

  return (
    <section className="py-16 bg-[#0a1929]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              {/* Valor principal */}
              <div className="text-4xl md:text-5xl text-[#00A859] mb-2">
                {stat.value}
              </div>
              
              {/* Label */}
              <div className="text-white text-lg mb-1">
                {stat.label}
              </div>
              
              {/* Descripción */}
              <div className="text-gray-400 text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
