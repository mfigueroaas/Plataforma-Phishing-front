import { Users, GraduationCap, Target, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * About Project Section - Información del proyecto de título
 * Contexto académico, autores y propósito
 */
export function AboutProjectSection() {
  const projectInfo = [
    {
      icon: Users,
      title: "Autores",
      description: "Gabriel Soto, Marcelo Figueroa y Aarón Silva"
    },
    {
      icon: GraduationCap,
      title: "Institución",
      description: "Universidad Tecnológica Metropolitana (UTEM) - Escuela de Informática"
    },
    {
      icon: Target,
      title: "Objetivo",
      description: "Disminuir la tasa de clics en correos maliciosos y aumentar los reportes de amenazas"
     
    }
       
  ];

  return (
   
    <section className="py-32 bg-[#0f1f2e]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
             <div style={{paddingTop: '20px'}}></div>
          {/* Encabezado de sección */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-4 animate-bounce-subtle">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00A859]/10 border border-[#00A859]/20 text-[#00A859] text-xl backdrop-blur-sm">
                SOBRE EL PROYECTO
              </span>
            </div>
            <h2 style={{fontSize: '2.5rem'}} className="text-white mb-8 font-black leading-tight animate-slide-up">
              Proyecto de <span className="text-[#00A859] inline-block hover:scale-110 transition-transform duration-300">Título Universitario</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-fade-in-delay">
              Desarrollado en la Escuela de Informática de la Universidad Tecnológica Metropolitana
            </p>
          </div>

          {/* Grid de 3 columnas - Autores, Institución, Objetivo */}
          <div style={{marginBottom: '20px'}} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {projectInfo.map((info, index) => (
              <div
                key={index}
                className="bg-[#1a2a3a] border border-white/10 hover:border-[#00A859]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00A859]/10 rounded-lg p-6 group hover:-translate-y-2 hover:scale-105 animate-slide-up"
                style={{animationDelay: `${index * 150}ms`}}
              >
                <div className="space-y-4 flex flex-col items-center text-center">
                  {/* Icono */}
                  <div className="w-12 h-12 rounded-lg bg-[#00A859]/10 border border-[#00A859]/20 flex items-center justify-center group-hover:bg-[#00A859]/20 group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
                    <info.icon className="w-6 h-6 text-[#00A859] group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Título */}
                  <h3 className="text-white text-xl group-hover:text-[#00A859] transition-colors duration-300">
                    {info.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-400 leading-relaxed">
                    {info.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Problema y Solución - Grid de 2 columnas */}
          <div style={{gap: '20px'}} className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
            {/* Problema */}
            <div className="bg-[#1a2a3a] border border-white/10 hover:border-[#00A859]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#00A859]/10 rounded-lg p-6 group hover:-translate-y-2 animate-slide-up" style={{animationDelay: '450ms'}}>
              <div className="space-y-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-[#00A859]/10 border border-[#00A859]/20 flex items-center justify-center group-hover:bg-[#00A859]/20 group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
                  <AlertTriangle className="w-6 h-6 text-[#00A859] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-white text-xl group-hover:text-[#00A859] transition-colors duration-300">El Problema</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  El phishing es la causa inicial de más del <span className="text-[#00A859] font-semibold">30%</span> de las brechas de seguridad. 
                  Las universidades tienen una superficie de ataque amplia (alumnos, docentes, administrativos) difícil de proteger.
                </p>
              </div>
            </div>

            {/* Solución */}
            <div className="bg-[#1a2a3a] border border-white/10 hover:border-[#00A859]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#00A859]/10 rounded-lg p-6 group hover:-translate-y-2 animate-slide-up" style={{animationDelay: '600ms'}}>
              <div className="space-y-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-[#00A859]/10 border border-[#00A859]/20 flex items-center justify-center group-hover:bg-[#00A859]/20 group-hover:scale-110 transition-all duration-300 group-hover:-rotate-12">
                  <CheckCircle className="w-6 h-6 text-[#00A859] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-white text-xl group-hover:text-[#00A859] transition-colors duration-300">La Solución</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Plataforma dual que permite <span className="text-[#00A859] font-semibold">(a)</span> lanzar campañas de simulación para educar 
                  y <span className="text-[#00A859] font-semibold">(b)</span> ofrecer un módulo de detección para analizar correos sospechosos reportados por usuarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{paddingTop: '67px'}}></div>
    </section>
  );
}
