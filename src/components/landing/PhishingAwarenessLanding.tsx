import { useState, useEffect } from "react";
import Slider from "react-slick";
import { motion } from "motion/react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Eye,
  Link2,
  Lock,
  Mail,
  Shield,
  UserX,
  XCircle,
} from "lucide-react";
import type { Settings } from "react-slick";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function PhishingAwarenessLanding() {
  const [showBars, setShowBars] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Ocultar barras cuando el scroll supera el 50% de la altura de la ventana
      const scrollThreshold = window.innerHeight * 0.5;
      const shouldShow = window.scrollY < scrollThreshold;
      setShowBars(shouldShow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Llamar inmediatamente para establecer estado inicial
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phishingIndicators = [
    {
      icon: Mail,
      title: "Remitente sospechoso",
      description:
        "Verifica siempre la dirección de correo del remitente. Los atacantes suelen usar dominios similares pero incorrectos.",
      example: "ejemplo: admin@paypa1.com en lugar de admin@paypal.com",
    },
    {
      icon: Link2,
      title: "Enlaces maliciosos",
      description:
        "Pasa el cursor sobre los enlaces antes de hacer clic. La URL real puede ser diferente al texto mostrado.",
      example: "Verifica que comience con https:// y el dominio sea legítimo",
    },
    {
      icon: AlertCircle,
      title: "Urgencia artificial",
      description:
        "Los ataques de phishing crean urgencia para que actúes sin pensar: 'Su cuenta será bloqueada en 24 horas'.",
      example: "Las empresas legítimas no amenazan con cerrar cuentas abruptamente",
    },
    {
      icon: UserX,
      title: "Solicitud de datos personales",
      description:
        "Ninguna empresa legítima te pedirá contraseñas, números de tarjeta o datos sensibles por correo.",
      example: "Los bancos NUNCA piden tu contraseña completa",
    },
  ];

  const goodPractices = [
    "Verifica la URL antes de ingresar credenciales",
    "Habilita la autenticación de dos factores (2FA)",
    "Mantén tu software y navegador actualizados",
    "Usa un gestor de contraseñas confiable",
    "Nunca compartas contraseñas por correo o mensajes",
    "Reporta correos sospechosos a tu departamento de TI",
  ];

  const realVsFake = [
    { type: "real" as const, domain: "https://amazon.com", reason: "Dominio oficial verificado" },
    {
      type: "fake" as const,
      domain: "https://amazοn.com",
      reason: "Usa caracteres unicode similares (ο en lugar de o)",
    },
    { type: "real" as const, domain: "https://paypal.com", reason: "Dominio oficial con certificado SSL" },
    {
      type: "fake" as const,
      domain: "https://paypal-security.com",
      reason: "Subdominio falso que parece legítimo",
    },
  ];

  const phishingReasons = [
    {
      title: "URL sospechosa",
      description: "El enlace en el correo no coincidía con el dominio oficial de la empresa",
      image:
        "https://images.unsplash.com/photo-1739903215568-8f05d85489ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGlzaGluZyUyMGVtYWlsJTIwc2NhbXxlbnwxfHx8fDE3NjY1NDI4NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Link2,
    },
    {
      title: "Página de login falsa",
      description: "La página solicitaba credenciales en un sitio que no era oficial",
      image:
        "https://images.unsplash.com/photo-1672839946212-aee298e40923?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWtlJTIwbG9naW4lMjBwYWdlfGVufDF8fHx8MTc2NjU0Mjg1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Shield,
    },
    {
      title: "Correo electrónico sospechoso",
      description: "El remitente usó una dirección de correo que no pertenece a la organización oficial",
      image:
        "https://images.unsplash.com/photo-1641928748469-f5aaf3e5da5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNwaWNpb3VzJTIwZW1haWwlMjBpbmJveHxlbnwxfHx8fDE3NjY1NDI4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Mail,
    },
    {
      title: "Alerta de seguridad falsa",
      description: "El mensaje creaba urgencia artificial para que actuaras sin verificar",
      image:
        "https://images.unsplash.com/photo-1751448555253-f39c06e29d82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlciUyMHNlY3VyaXR5JTIwd2FybmluZ3xlbnwxfHx8fDE3NjY1NDI4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: AlertTriangle,
    },
  ];

  const sliderSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: { arrows: false },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior fija */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 text-black text-center py-2 text-xs sm:text-sm md:text-base font-extrabold tracking-[0.35em] uppercase shadow-md transition-all duration-300 ${showBars ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #000000 0, #000000 10px, #ffeb3b 10px, #ffeb3b 20px)",
        }}
      />

      {/* Barra inferior fija */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 text-black text-center py-2 text-[10px] sm:text-xs md:text-sm font-extrabold tracking-[0.25em] uppercase shadow-[0_-2px_4px_rgba(0,0,0,0.25)] transition-all duration-300 ${showBars ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #000000 0, #000000 10px, #ffeb3b 10px, #ffeb3b 20px)",
        }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 md:mb-16 min-h-screen flex flex-col justify-center items-center">
          <motion.div
            initial={{ scale: 1.2, opacity: 0, y: 0 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 10 }}
            className="mb-12 flex flex-col items-center"
          >
            <Shield
              className="mx-auto text-[#2c5f7c] mb-4"
              style={{ width: '5rem', height: '10rem' }}
            />
            <motion.h1
              className="font-bold text-[#2c5f7c] mb-6 md:mb-8 px-4"
              style={{ fontSize: '2.5rem', lineHeight: '1.1' }}
              animate={{ scale: [1, 1.05, 1], y: [0, -6, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
            ¡Has Caído en un Phishing Educativo!
            </motion.h1>
          </motion.div>
          <motion.p
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 120, damping: 12 }}
            className="mt-3 md:mt-4 text-gray-600 max-w-5xl mx-auto mb-8 md:mb-10 px-4"
            style={{ fontSize: '1.5rem', lineHeight: '1.6' }}
          >
            No te preocupes, esto es una simulación con fines educativos. Sin embargo, si hubiera sido un ataque real, tus datos
            podrían haber sido comprometidos.
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 14 }}
            className="border-l-4 border-green-500 p-5 sm:p-6 md:p-8 max-w-4xl mx-auto rounded-r-lg shadow-sm"
            style={{ backgroundColor: '#c4eb5a83' }}
          >
            <p className="text-gray-700 text-center" style={{ fontSize: '1.25rem', lineHeight: '1.6' }}>
              <strong>Importante:</strong> Esta es una campaña de concientización sobre seguridad. Aprende de esta experiencia para
              protegerte de amenazas reales.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <h2 className="font-bold text-[#1e3a5f] mb-8 text-center" style={{ fontSize: '3rem', lineHeight: '1.2' }}>¿Por qué caíste?</h2>
          <div className="bg-white rounded-lg shadow-xl p-6">
            <Slider {...sliderSettings}>
              {phishingReasons.map((reason, index) => (
                <div key={index} className="px-4">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="md:w-1/2 flex justify-center">
                      <img
                        src={reason.image}
                        alt={reason.title}
                        style={{ width: 256, height: 256, minWidth: 256, minHeight: 256, maxWidth: 256, maxHeight: 256 }}
                        className="object-cover rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="md:w-1/2">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#1e3a5f]/10 p-3 rounded-lg">
                          <reason.icon className="text-[#1e3a5f]" style={{ width: '2rem', height: '2rem' }} />
                        </div>
                        <h3 className="font-bold text-[#1e3a5f]" style={{ fontSize: '1.5rem', lineHeight: '1.3' }}>{reason.title}</h3>
                      </div>
                      <p className="text-gray-700" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>{reason.description}</p>
                      <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                        <p className="text-red-800 font-semibold" style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>⚠️ Señal de alerta detectada</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </motion.div>

        <Tabs defaultValue="indicators" className="max-w-6xl mx-auto mb-16">
          <TabsList className="grid w-full grid-cols-3 mb-8" style={{ backgroundColor: '#e5e7eb' }}>
            <TabsTrigger value="indicators" style={{ backgroundColor: '#f3ff0788' }}>🔍 Indicadores</TabsTrigger>
            <TabsTrigger value="examples" style={{ backgroundColor: '#f3ff0788' }}>📊 Ejemplos</TabsTrigger>
            <TabsTrigger value="practices" style={{ backgroundColor: '#f3ff0788' }}>✅ Buenas Prácticas</TabsTrigger>
          </TabsList>

          <TabsContent value="indicators">
            <div className="grid md:grid-cols-2 gap-6">
              {phishingIndicators.map((indicator, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow bg-white">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#1e3a5f]/10 p-3 rounded-lg">
                        <indicator.icon className="text-[#1e3a5f]" style={{ width: '1.5rem', height: '1.5rem' }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-2" style={{ fontSize: '1.125rem', lineHeight: '1.4' }}>{indicator.title}</h3>
                        <p className="text-gray-600 mb-3" style={{ fontSize: '1rem', lineHeight: '1.5' }}>{indicator.description}</p>
                        <div className="bg-gray-50 p-3 rounded border-l-4 border-[#00d97e]">
                          <p className="text-gray-700" style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>{indicator.example}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="examples">
            <Card className="p-6 bg-white">
              <h3 className="font-bold mb-6 text-center" style={{ fontSize: '1.5rem', lineHeight: '1.3' }}>¿Puedes identificar cuál es real y cuál es phishing?</h3>
              <div className="space-y-4">
                {realVsFake.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: item.type === "real" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className={`p-4 rounded-lg border-2 ${
                      item.type === "real"
                        ? "bg-green-50 border-[#00d97e]"
                        : "bg-red-50 border-red-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {item.type === "real" ? (
                          <CheckCircle className="text-[#00d97e]" style={{ width: '1.5rem', height: '1.5rem' }} />
                        ) : (
                          <XCircle className="text-red-600" style={{ width: '1.5rem', height: '1.5rem' }} />
                        )}
                        <div>
                          <p className="font-mono font-bold" style={{ fontSize: '1rem', lineHeight: '1.4' }}>{item.domain}</p>
                          <p className="text-gray-600" style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>{item.reason}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full font-bold ${
                          item.type === "real" ? "bg-[#00d97e]/20 text-[#00d97e]" : "bg-red-200 text-red-800"
                        }`}
                        style={{ fontSize: '0.875rem', lineHeight: '1.4' }}
                      >
                        {item.type === "real" ? "LEGÍTIMO" : "PHISHING"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="practices">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-[#00d97e]" style={{ width: '2rem', height: '2rem' }} />
                  <h3 className="font-bold" style={{ fontSize: '1.25rem', lineHeight: '1.3' }}>Mejores Prácticas</h3>
                </div>
                <ul className="space-y-3">
                  {goodPractices.map((practice) => (
                    <motion.li
                      key={practice}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="text-[#00d97e] mt-0.5 flex-shrink-0" style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span className="text-gray-700" style={{ fontSize: '1rem', lineHeight: '1.5' }}>{practice}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#1e3a5f]/5 to-[#1e3a5f]/10 border-2 border-[#1e3a5f]/20">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="text-[#1e3a5f]" style={{ width: '2rem', height: '2rem' }} />
                  <h3 className="font-bold" style={{ fontSize: '1.25rem', lineHeight: '1.3' }}>Regla de Oro</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 font-semibold" style={{ fontSize: '1rem', lineHeight: '1.5' }}>Cuando recibas un correo sospechoso:</p>
                  <ol className="space-y-3 list-decimal list-inside text-gray-700" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                    <li>NO hagas clic en ningún enlace</li>
                    <li>NO descargues archivos adjuntos</li>
                    <li>NO proporciones información personal</li>
                    <li>Verifica directamente con la empresa</li>
                    <li>Reporta el correo a tu equipo de TI</li>
                  </ol>
                  <div className="bg-[#1e3a5f]/10 p-4 rounded-lg mt-4">
                    <p className="text-[#1e3a5f]" style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                      <strong>Recuerda:</strong> Es mejor ser precavido y verificar, que lamentarse por un error que pudo haberse
                      evitado.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <footer className="mt-16 text-center text-gray-600 pb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="text-gray-500" style={{ width: '1.25rem', height: '1.25rem' }} />
            <p className="font-semibold" style={{ fontSize: '1rem', lineHeight: '1.5' }}>Plataforma de Phishing Educativo</p>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>Educando para un entorno digital más seguro | La seguridad es responsabilidad de todos</p>
        </footer>
      </div>
    </div>
  );
}
