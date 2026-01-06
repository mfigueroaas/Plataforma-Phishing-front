import { Code2, Database, Server, Shield, Boxes, Cloud } from 'lucide-react';

/**
 * Tech Stack Section - Stack tecnológico del proyecto
 * Arquitectura y tecnologías utilizadas
 */
export function TechStackSection() {
  const techCategories = [
    {
      icon: Code2,
      category: "Frontend",
      technologies: ["React 18", "Next.js", "TypeScript", "Tailwind CSS"],
      color: "text-blue-400"
    },
    {
      icon: Server,
      category: "Backend",
      technologies: ["FastAPI", "Node.js", "Go", "REST API"],
      color: "text-green-400"
    },
    {
      icon: Database,
      category: "Base de Datos",
      technologies: ["PostgreSQL", "Firestore", "Redis Cache"],
      color: "text-purple-400"
    },
    {
      icon: Shield,
      category: "Seguridad",
      technologies: ["OAuth 2.0", "Firebase Auth", "JWT", "Keycloak"],
      color: "text-red-400"
    },
    {
      icon: Cloud,
      category: "Infraestructura",
      technologies: ["Docker", "Microservicios", "Docker Compose"],
      color: "text-cyan-400"
    },
    {
      icon: Boxes,
      category: "Integraciones",
      technologies: ["Google Safe Browsing", "URLScan", "GoPhish API"],
      color: "text-orange-400"
    }
  ];

  return (
    <section className="py-20 bg-[#0a1929]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00A859]/10 border border-[#00A859]/20 text-[#00A859] text-sm">
                TECNOLOGÍAS
              </span>
            </div>
            <h2 style={{fontSize: '2.5rem'}} className="text-white mb-8 font-black leading-tight">
              Stack <span className="text-[#00A859]">Tecnológico</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Arquitectura moderna basada en microservicios contenerizados para escalabilidad y modularidad
            </p>
          </div>

          {/* Grid de tecnologías */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techCategories.map((category, index) => (
              <div
                key={index}
                className="bg-[#0f1f2e] border border-white/10 rounded-lg p-6 hover:border-[#00A859]/30 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icono y categoría */}
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#00A859]/10 border border-[#00A859]/20 flex items-center justify-center">
                      <category.icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <h3 className="text-white text-lg">{category.category}</h3>
                  </div>

                  {/* Lista de tecnologías */}
                  <ul className="space-y-2">
                    {category.technologies.map((tech, techIndex) => (
                      <li
                        key={techIndex}
                        className="flex items-center justify-center gap-2 text-gray-400 text-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00A859]"></span>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Nota sobre arquitectura */}
          <div className="mt-10 text-center">
            <div className="inline-block bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4">
              <p className="text-slate-400 text-sm">
                <span className="text-emerald-400 font-semibold">Arquitectura escalable:</span> Microservicios independientes contenerizados con Docker, 
                comunicación vía REST API y base de datos PostgreSQL para persistencia de datos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
