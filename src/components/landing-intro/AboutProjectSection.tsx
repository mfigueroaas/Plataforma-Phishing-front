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
   
    <section className="bg-[#0f1f2e]" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
      <div className="container mx-auto" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className="max-w-6xl mx-auto">
             <div style={{paddingTop: '1.25rem'}}></div>
          {/* Encabezado de sección */}
          <div className="text-center animate-fade-in" style={{ marginBottom: '1.5rem' }}>
            <div className="inline-block animate-bounce-subtle" style={{ marginBottom: '1rem' }}>
              <span className="inline-flex items-center rounded-full bg-[#00A859]/10 border border-[#00A859]/20 text-[#00A859] backdrop-blur-sm" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0rem', paddingBottom: '0.375rem', fontSize: '1.25rem', lineHeight: '1.5' }}>
                SOBRE EL PROYECTO
              </span>
            </div>
            <h2 style={{fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '2rem' }} className="text-white font-black animate-slide-up">
              Proyecto de <span className="text-[#00A859] inline-block hover:scale-110 transition-transform duration-300">Título Universitario</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto animate-fade-in-delay" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
              Desarrollado en la Escuela de Informática de la Universidad Tecnológica Metropolitana
            </p>
          </div>

          {/* Grid de 3 columnas - Autores, Institución, Objetivo */}
          <div style={{marginBottom: '1.25rem', gap: '2rem' }} className="grid grid-cols-1 md:grid-cols-3">
            {projectInfo.map((info, index) => (
              <div
                key={index}
                className="bg-[#1a2a3a] border border-white/10 hover:border-[#00A859]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00A859]/10 rounded-lg group hover:-translate-y-2 hover:scale-105 animate-slide-up"
                style={{animationDelay: `${index * 150}ms`, padding: '1.5rem'}}
              >
                <div className="space-y-4 flex flex-col items-center text-center">
                  {/* Icono */}
                  <div className="rounded-lg bg-[#00A859]/10 border border-[#00A859]/20 flex items-center justify-center group-hover:bg-[#00A859]/20 group-hover:scale-110 transition-all duration-300 group-hover:rotate-6" style={{ width: '3rem', height: '3rem' }}>
                    <info.icon className="text-[#00A859] group-hover:scale-110 transition-transform duration-300" style={{ width: '1.5rem', height: '1.5rem' }} />
                  </div>

                  {/* Título */}
                  <h3 className="text-white group-hover:text-[#00A859] transition-colors duration-300" style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>
                    {info.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-400" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                    {info.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Problema y Solución - Grid de 2 columnas */}
          <div style={{gap: '1.25rem'}} className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
            {/* Problema */}
            <div className="bg-[#1a2a3a] border border-white/10 hover:border-[#00A859]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#00A859]/10 rounded-lg group hover:-translate-y-2 animate-slide-up" style={{animationDelay: '450ms', padding: '1.5rem'}}>
              <div className="space-y-4 flex flex-col items-center text-center">
                <div className="rounded-lg bg-[#00A859]/10 border border-[#00A859]/20 flex items-center justify-center group-hover:bg-[#00A859]/20 group-hover:scale-110 transition-all duration-300 group-hover:rotate-12" style={{ width: '3rem', height: '3rem' }}>
                  <AlertTriangle className="text-[#00A859] group-hover:scale-110 transition-transform duration-300" style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <h3 className="text-white group-hover:text-[#00A859] transition-colors duration-300" style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>El Problema</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                  El phishing es la causa inicial de más del <span className="text-[#00A859] font-semibold">30%</span> de las brechas de seguridad. 
                  Las universidades tienen una superficie de ataque amplia (alumnos, docentes, administrativos) difícil de proteger.
                </p>
              </div>
            </div>

            {/* Solución */}
            <div className="bg-[#1a2a3a] border border-white/10 hover:border-[#00A859]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#00A859]/10 rounded-lg group hover:-translate-y-2 animate-slide-up" style={{animationDelay: '600ms', padding: '1.5rem'}}>
              <div className="space-y-4 flex flex-col items-center text-center">
                <div className="rounded-lg bg-[#00A859]/10 border border-[#00A859]/20 flex items-center justify-center group-hover:bg-[#00A859]/20 group-hover:scale-110 transition-all duration-300 group-hover:-rotate-12" style={{ width: '3rem', height: '3rem' }}>
                  <CheckCircle className="text-[#00A859] group-hover:scale-110 transition-transform duration-300" style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <h3 className="text-white group-hover:text-[#00A859] transition-colors duration-300" style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>La Solución</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                  Plataforma dual que permite <span className="text-[#00A859] font-semibold">(a)</span> lanzar campañas de simulación para educar 
                  y <span className="text-[#00A859] font-semibold">(b)</span> ofrecer un módulo de detección para analizar correos sospechosos reportados por usuarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{paddingTop: '4.1875rem'}}></div>
    </section>
  );
}
