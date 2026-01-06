import { useEffect, useState } from "react";
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
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWarning(false), 3000);
    return () => clearTimeout(timer);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-[#1e3a5f] text-white py-4 px-6 shadow-lg"
        >
          <div className="container mx-auto flex items-center justify-center gap-3">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <p className="font-semibold">¡ALERTA DE SEGURIDAD!</p>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-12 pt-24">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-12 min-h-[80vh] flex flex-col justify-center relative"
        >
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-red-100 via-orange-50 to-yellow-100 rounded-3xl -z-10 blur-3xl"
          />

          <div className="inline-block mb-6">
            <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 3, delay: 0.5 }}>
              <Shield className="w-24 h-24 mx-auto text-[#1e3a5f]" />
            </motion.div>
          </div>

          <h1 className="text-5xl font-bold text-[#1e3a5f] mb-4">⚠️ ¡Has Caído en un Phishing Educativo! ⚠️</h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl text-gray-700 max-w-3xl mx-auto mb-6"
          >
            No te preocupes, esto es una simulación con fines educativos. Sin embargo, si hubiera sido un ataque real, tus datos
            podrían haber sido comprometidos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-green-50 border-l-4 border-[#00d97e] p-4 max-w-2xl mx-auto rounded"
          >
            <p className="text-gray-800">
              <strong>Importante:</strong> Esta es una campaña de concientización sobre seguridad. Aprende de esta experiencia para
              protegerte de amenazas reales.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-red-600 mb-2">91%</div>
            <p className="text-gray-600">de los ciberataques comienzan con un correo de phishing</p>
          </Card>
          <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-orange-600 mb-2">$4.9M</div>
            <p className="text-gray-600">es el costo promedio de una brecha de datos</p>
          </Card>
          <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-yellow-600 mb-2">1 de 4</div>
            <p className="text-gray-600">empleados caen en ataques de phishing simulados</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-8 text-center">¿Por qué caíste?</h2>
          <div className="bg-white rounded-lg shadow-xl p-6">
            <Slider {...sliderSettings}>
              {phishingReasons.map((reason, index) => (
                <div key={reason.title} className="px-4">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="md:w-1/2">
                      <img src={reason.image} alt={reason.title} className="w-full h-64 object-cover rounded-lg shadow-lg" />
                    </div>
                    <div className="md:w-1/2">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#1e3a5f]/10 p-3 rounded-lg">
                          <reason.icon className="w-8 h-8 text-[#1e3a5f]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#1e3a5f]">{reason.title}</h3>
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed">{reason.description}</p>
                      <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                        <p className="text-sm text-red-800 font-semibold">⚠️ Señal de alerta detectada</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </motion.div>

        <Tabs defaultValue="indicators" className="max-w-6xl mx-auto mb-16">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="indicators">🔍 Indicadores</TabsTrigger>
            <TabsTrigger value="examples">📊 Ejemplos</TabsTrigger>
            <TabsTrigger value="practices">✅ Buenas Prácticas</TabsTrigger>
          </TabsList>

          <TabsContent value="indicators">
            <div className="grid md:grid-cols-2 gap-6">
              {phishingIndicators.map((indicator) => (
                <motion.div
                  key={indicator.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow bg-white">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#1e3a5f]/10 p-3 rounded-lg">
                        <indicator.icon className="w-6 h-6 text-[#1e3a5f]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{indicator.title}</h3>
                        <p className="text-gray-600 mb-3">{indicator.description}</p>
                        <div className="bg-gray-50 p-3 rounded border-l-4 border-[#00d97e]">
                          <p className="text-sm text-gray-700">{indicator.example}</p>
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
              <h3 className="text-2xl font-bold mb-6 text-center">¿Puedes identificar cuál es real y cuál es phishing?</h3>
              <div className="space-y-4">
                {realVsFake.map((item) => (
                  <motion.div
                    key={item.domain}
                    initial={{ opacity: 0, x: item.type === "real" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-lg border-2 ${
                      item.type === "real"
                        ? "bg-green-50 border-[#00d97e]"
                        : "bg-red-50 border-red-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {item.type === "real" ? (
                          <CheckCircle className="w-6 h-6 text-[#00d97e]" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                        <div>
                          <p className="font-mono font-bold">{item.domain}</p>
                          <p className="text-sm text-gray-600">{item.reason}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          item.type === "real" ? "bg-[#00d97e]/20 text-[#00d97e]" : "bg-red-200 text-red-800"
                        }`}
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
                  <Lock className="w-8 h-8 text-[#00d97e]" />
                  <h3 className="text-xl font-bold">Mejores Prácticas</h3>
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
                      <CheckCircle className="w-5 h-5 text-[#00d97e] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{practice}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#1e3a5f]/5 to-[#1e3a5f]/10 border-2 border-[#1e3a5f]/20">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-8 h-8 text-[#1e3a5f]" />
                  <h3 className="text-xl font-bold">Regla de Oro</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 font-semibold">Cuando recibas un correo sospechoso:</p>
                  <ol className="space-y-3 list-decimal list-inside text-gray-700">
                    <li>NO hagas clic en ningún enlace</li>
                    <li>NO descargues archivos adjuntos</li>
                    <li>NO proporciones información personal</li>
                    <li>Verifica directamente con la empresa</li>
                    <li>Reporta el correo a tu equipo de TI</li>
                  </ol>
                  <div className="bg-[#1e3a5f]/10 p-4 rounded-lg mt-4">
                    <p className="text-sm text-[#1e3a5f]">
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
            <Shield className="w-5 h-5 text-gray-500" />
            <p className="font-semibold">Plataforma de Phishing Educativo</p>
          </div>
          <p className="text-sm">Educando para un entorno digital más seguro | La seguridad es responsabilidad de todos</p>
        </footer>
      </div>
    </div>
  );
}
