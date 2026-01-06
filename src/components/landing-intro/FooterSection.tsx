import { Shield, Github, Mail, BookOpen, FileText } from 'lucide-react';

/**
 * Footer Section - Pie de página con enlaces y recursos
 * Información de contacto y navegación adicional
 */
export function FooterSection() {
  const footerLinks = {
    producto: [
      { label: "Características", href: "#features" },
      { label: "Cómo Funciona", href: "#how-it-works" },
      { label: "Casos de Uso", href: "#use-cases" },
      { label: "Precios", href: "#pricing" }
    ],
    recursos: [
      { label: "Documentación", href: "#docs", icon: BookOpen },
      { label: "API Reference", href: "#api", icon: FileText },
      { label: "Guías", href: "#guides" },
      { label: "Blog", href: "#blog" }
    ],
    empresa: [
      { label: "Sobre UTEM", href: "#about" },
      { label: "Equipo", href: "#team" },
      { label: "Contacto", href: "#contact" },
      { label: "Soporte", href: "#support" }
    ],
    legal: [
      { label: "Privacidad", href: "#privacy" },
      { label: "Términos de Uso", href: "#terms" },
      { label: "Política de Cookies", href: "#cookies" },
      { label: "Licencia", href: "#license" }
    ]
  };

  return (
    <footer className="bg-[#0a1929] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00A859] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white text-lg">UTEM</div>
                <div className="text-[#00A859] text-sm">Ciberseguridad</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Plataforma de phishing educativo para proteger a la comunidad universitaria 
              mediante capacitación práctica y simulaciones realistas.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com/utem" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#00A859]/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#00A859] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="mailto:ciberseguridad@utem.cl" 
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#00A859]/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#00A859] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-white text-lg font-semibold capitalize">{section}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-emerald-400 text-sm transition-colors flex items-center gap-1"
                    >
                      {link.label}
                      {'icon' in link && link.icon && <link.icon className="w-4 h-4 inline" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Universidad Tecnológica Metropolitana. Todos los derechos reservados.
          </div>
          <div className="text-gray-400 text-sm flex items-center gap-2">
            Hecho con ❤️ para la comunidad UTEM
          </div>
        </div>
      </div>
    </footer>
  );
}
