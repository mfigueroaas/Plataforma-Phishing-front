import { GuideSection } from './types';
import { BookOpen, HelpCircle, AlertCircle, CheckCircle, Wrench } from 'lucide-react';
import { InfoBox, Tip, Warning, StepByStep, CodeBlock, SuccessBox } from './GuideSection';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export const annexesSections: GuideSection[] = [
  {
    id: 'anexo-casos-uso',
    title: 'Anexo A: Casos de Uso Comunes',
    icon: CheckCircle,
    subsections: [
      {
        id: 'casos-uso-empresariales',
        title: 'Escenarios Empresariales',
        searchKeywords: ['casos uso', 'ejemplos', 'escenarios', 'templates', 'plantillas'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>Estos son los casos de uso más comunes en empresas que implementan la plataforma:</p>

              <h4 className="font-semibold">1. Onboarding de Nuevos Empleados</h4>
              <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <p className="text-sm"><strong>Objetivo:</strong> Educar desde el primer día</p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li><strong>Frecuencia:</strong> Primera semana de ingreso</li>
                  <li><strong>Plantilla:</strong> "Actualización de Contraseña IT"</li>
                  <li><strong>Grupo:</strong> "Nuevos Empleados - Mes Actual"</li>
                  <li><strong>Complejidad:</strong> Baja (obvio que es simulación)</li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">2. Evaluación Trimestral General</h4>
              <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200">
                <p className="text-sm"><strong>Objetivo:</strong> Medir nivel de conciencia general</p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li><strong>Frecuencia:</strong> Cada 3 meses</li>
                  <li><strong>Plantilla:</strong> Variar entre "Factura Pendiente", "Entrega de Paquete"</li>
                  <li><strong>Grupo:</strong> "Todos los Empleados"</li>
                  <li><strong>Complejidad:</strong> Media</li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">3. Evaluación de Alto Riesgo (Ejecutivos/Finanzas)</h4>
              <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200">
                <p className="text-sm"><strong>Objetivo:</strong> Proteger usuarios con acceso crítico</p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li><strong>Frecuencia:</strong> Mensual</li>
                  <li><strong>Plantilla:</strong> "Wire Transfer Approval", "CEO Email Request"</li>
                  <li><strong>Grupo:</strong> "Ejecutivos + Finanzas"</li>
                  <li><strong>Complejidad:</strong> Alta (spear phishing sofisticado)</li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">4. Post-Incidente Real</h4>
              <Card className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200">
                <p className="text-sm"><strong>Objetivo:</strong> Reforzar después de un ataque real</p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li><strong>Frecuencia:</strong> 2 semanas después de incidente</li>
                  <li><strong>Plantilla:</strong> Similar al ataque real detectado</li>
                  <li><strong>Grupo:</strong> Departamento afectado</li>
                  <li><strong>Complejidad:</strong> Idéntica al ataque real</li>
                </ul>
              </Card>

              <Tip title="Personaliza por Departamento">
                Usa plantillas relevantes: "Actualización de CRM" para ventas, 
                "Alerta de Servidor" para IT, "Nómina" para RRHH.
              </Tip>
            </div>
          ),
        },
      },
    ],
  },

  {
    id: 'anexo-faq',
    title: 'Anexo B: Preguntas Frecuentes',
    icon: HelpCircle,
    subsections: [
      {
        id: 'faq-general',
        title: 'Preguntas Generales',
        searchKeywords: ['faq', 'preguntas', 'frecuentes', 'dudas', 'ayuda'],
        content: {
          basico: (
            <div className="space-y-4">
              <h4 className="font-semibold">¿Cuántas campañas debo ejecutar al año?</h4>
              <Card className="p-4">
                <p className="text-sm">
                  <strong>Recomendación:</strong> Mínimo 4 campañas al año (1 por trimestre). 
                  Empresas con alta exposición pueden hacer 1 mensual.
                </p>
                <p className="text-sm mt-2">
                  <strong>Razón:</strong> El efecto de capacitación disminuye con el tiempo. 
                  Mantener frecuencia regular asegura que la seguridad esté presente en la mente de los usuarios.
                </p>
              </Card>

              <h4 className="font-semibold mt-6">¿Debo avisar antes de ejecutar una campaña?</h4>
              <Card className="p-4">
                <p className="text-sm">
                  <strong>NO.</strong> El propósito es evaluar la reacción natural de los usuarios. 
                  Si les avisas, estarán en "modo alerta" y los resultados no serán realistas.
                </p>
                <p className="text-sm mt-2">
                  <strong>Alternativa:</strong> Puedes enviar un comunicado general diciendo 
                  "ejecutaremos simulaciones de phishing durante el año" sin especificar cuándo.
                </p>
              </Card>

              <h4 className="font-semibold mt-6">¿Qué hacer con usuarios que siempre caen?</h4>
              <Card className="p-4">
                <ol className="list-decimal list-inside text-sm space-y-2">
                  <li>Primera vez: Email educativo automático</li>
                  <li>Segunda vez: Capacitación virtual obligatoria (30 min)</li>
                  <li>Tercera vez: Reunión 1-on-1 con su supervisor</li>
                  <li>Cuarta vez: Evaluación de desempeño / acción de RRHH</li>
                </ol>
              </Card>

              <h4 className="font-semibold mt-6">¿Los emails de campaña pueden ir a spam?</h4>
              <Card className="p-4">
                <p className="text-sm">
                  <strong>Sí, es posible.</strong> Para evitarlo:
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Usa un dominio propio (no Gmail gratuito)</li>
                  <li>Configura SPF, DKIM y DMARC en tu DNS</li>
                  <li>No uses palabras "spammy" en asuntos</li>
                  <li>Mantén volumen de envío bajo (no miles en minutos)</li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">¿Puedo usar logos reales de marcas (Microsoft, Google)?</h4>
              <Card className="p-4">
                <p className="text-sm">
                  <strong>Legalmente complicado.</strong> Estrictamente hablando, usar logos sin permiso 
                  viola derechos de marca. Sin embargo, para simulaciones educativas internas:
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>✅ OK: Simulaciones internas con fines educativos</li>
                  <li>❌ NO OK: Compartir plantillas públicamente</li>
                  <li>✅ Mejor: Documenta aprobación legal/gerencial</li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">¿Qué hago si un usuario se queja o se ofende?</h4>
              <Card className="p-4">
                <p className="text-sm">
                  <strong>Respuesta estándar:</strong> Explicar que es parte del programa de seguridad 
                  aprobado por gerencia, con objetivo educativo. No es para avergonzar, sino para proteger.
                </p>
                <Tip title="Prepara un Email Tipo">
                  Ten preparada una respuesta estándar para usuarios molestos. Incluye: 
                  propósito, beneficio para la empresa, próximos pasos de capacitación.
                </Tip>
              </Card>
            </div>
          ),
        },
      },
    ],
  },

  {
    id: 'anexo-glosario',
    title: 'Anexo C: Glosario de Términos',
    icon: BookOpen,
    subsections: [
      {
        id: 'terminos-tecnicos',
        title: 'Términos Técnicos',
        searchKeywords: ['glosario', 'terminos', 'definiciones', 'vocabulario', 'diccionario'],
        content: {
          basico: (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Términos de Phishing</h4>
              <div className="space-y-3">
                <Card className="p-3">
                  <strong className="text-sm">Phishing</strong>
                  <p className="text-sm mt-1">
                    Técnica de ingeniería social donde atacantes se hacen pasar por entidades 
                    confiables para robar información sensible (contraseñas, datos bancarios).
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">Spear Phishing</strong>
                  <p className="text-sm mt-1">
                    Phishing dirigido a individuos específicos (ejecutivos, finanzas) con mensajes 
                    personalizados. Más peligroso que phishing masivo.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">Whaling</strong>
                  <p className="text-sm mt-1">
                    Spear phishing dirigido específicamente a ejecutivos de alto nivel (CEO, CFO). 
                    El objetivo es acceder a información corporativa crítica.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">Landing Page</strong>
                  <p className="text-sm mt-1">
                    Página web falsa donde los usuarios "caen" al hacer clic en el email. 
                    Simula una página legítima (login, formulario) para capturar credenciales.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">Template / Plantilla</strong>
                  <p className="text-sm mt-1">
                    Diseño predefinido de email de phishing con asunto, remitente y contenido HTML.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">SMTP (Simple Mail Transfer Protocol)</strong>
                  <p className="text-sm mt-1">
                    Protocolo estándar para envío de correos electrónicos. Necesitas configurar 
                    un servidor SMTP para enviar campañas.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">Tracking Pixel</strong>
                  <p className="text-sm mt-1">
                    Imagen invisible de 1x1 píxel que se carga cuando un usuario abre el email. 
                    Permite detectar si el correo fue abierto.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">Click Rate / Tasa de Clics</strong>
                  <p className="text-sm mt-1">
                    Porcentaje de usuarios que hicieron clic en el link del email. 
                    Métrica clave para medir vulnerabilidad.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">Submit Rate / Tasa de Envío de Datos</strong>
                  <p className="text-sm mt-1">
                    Porcentaje de usuarios que no solo hicieron clic, sino que también 
                    enviaron credenciales en la landing page. Indica alto riesgo.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">GoPhish</strong>
                  <p className="text-sm mt-1">
                    Framework open-source para ejecutar campañas de phishing simulado. 
                    Motor detrás de esta plataforma.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">Target / Objetivo</strong>
                  <p className="text-sm mt-1">
                    Usuario individual incluido en un grupo que recibirá el email de campaña.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">Result ID (RId)</strong>
                  <p className="text-sm mt-1">
                    Identificador único generado para cada usuario en una campaña. 
                    Permite tracking individual de eventos.
                  </p>
                </Card>
              </div>

              <h4 className="font-semibold text-lg mt-8">Términos de Seguridad General</h4>
              <div className="space-y-3">
                <Card className="p-3">
                  <strong className="text-sm">Ingeniería Social</strong>
                  <p className="text-sm mt-1">
                    Manipulación psicológica para que personas revelen información confidencial 
                    o realicen acciones que comprometan la seguridad.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">Malware</strong>
                  <p className="text-sm mt-1">
                    Software malicioso diseñado para dañar, robar o tomar control de sistemas. 
                    Puede distribuirse vía phishing.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">Ransomware</strong>
                  <p className="text-sm mt-1">
                    Tipo de malware que cifra archivos y exige rescate para desbloquearlos. 
                    Muchas infecciones empiezan con phishing.
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">2FA / MFA (Two-Factor / Multi-Factor Authentication)</strong>
                  <p className="text-sm mt-1">
                    Autenticación de múltiples factores. Requiere algo que sabes (contraseña) + 
                    algo que tienes (código SMS, app autenticador).
                  </p>
                </Card>

                <Card className="p-3">
                  <strong className="text-sm">Zero Trust</strong>
                  <p className="text-sm mt-1">
                    Modelo de seguridad que asume que ninguna entidad es confiable por defecto. 
                    Verifica siempre, nunca confía automáticamente.
                  </p>
                </Card>
              </div>
            </div>
          ),
        },
      },
    ],
  },

  {
    id: 'anexo-mejores-practicas',
    title: 'Anexo D: Mejores Prácticas',
    icon: CheckCircle,
    subsections: [
      {
        id: 'checklist-campana',
        title: 'Checklist Pre-Campaña',
        searchKeywords: ['checklist', 'mejores practicas', 'best practices', 'recomendaciones'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                Usa este checklist antes de lanzar cualquier campaña para asegurar éxito:
              </p>

              <h4 className="font-semibold">✅ Antes de Crear la Campaña</h4>
              <Card className="p-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Obtener aprobación de gerencia/legal para ejecutar simulaciones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Documentar objetivo de la campaña (onboarding, evaluación, post-incidente)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Definir audiencia objetivo (departamento, nivel de riesgo)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Preparar material educativo para usuarios que caigan</span>
                  </li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">✅ Configuración Técnica</h4>
              <Card className="p-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Plantilla de email incluye {'{{.URL}}'} y {'{{.Tracker}}'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Landing page tiene formulario funcional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Landing page redirige a página educativa después de envío</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Perfil SMTP probado y funcional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Grupo de objetivos actualizado (sin usuarios inactivos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Configurado SPF/DKIM/DMARC en DNS para evitar spam</span>
                  </li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">✅ Antes de Lanzar</h4>
              <Card className="p-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Enviar email de prueba a ti mismo primero</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Verificar que tracking funciona (abrir email, hacer clic, enviar datos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Revisar ortografía y gramática del email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Confirmar que la fecha/hora de lanzamiento es correcta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Notificar a equipo IT/Seguridad que se ejecutará campaña</span>
                  </li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">✅ Durante la Campaña</h4>
              <Card className="p-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Monitorear dashboard cada 2-4 horas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Responder dudas de usuarios que reporten el email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Verificar que no hay errores de envío masivos</span>
                  </li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">✅ Después de la Campaña</h4>
              <Card className="p-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Exportar resultados y generar reporte</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Enviar email educativo a usuarios que cayeron</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Programar capacitación para usuarios de alto riesgo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Presentar resultados a gerencia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Documentar lecciones aprendidas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span>Programar siguiente campaña (3-6 meses después)</span>
                  </li>
                </ul>
              </Card>
            </div>
          ),
        },
      },
    ],
  },

  {
    id: 'anexo-troubleshooting',
    title: 'Anexo E: Solución de Problemas',
    icon: Wrench,
    subsections: [
      {
        id: 'problemas-comunes',
        title: 'Problemas Comunes y Soluciones',
        searchKeywords: ['problemas', 'errores', 'troubleshooting', 'soluciones', 'ayuda'],
        content: {
          basico: (
            <div className="space-y-4">
              <h4 className="font-semibold">🚫 Problema: Emails no se envían</h4>
              <Card className="p-4 border-red-200">
                <p className="text-sm font-semibold mb-2">Posibles Causas:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Credenciales SMTP incorrectas</li>
                  <li>Puerto bloqueado por firewall</li>
                  <li>Servidor SMTP rechaza conexión</li>
                  <li>Límite de envío diario alcanzado</li>
                </ul>
                <p className="text-sm font-semibold mt-3 mb-2">Soluciones:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Verifica usuario/contraseña en perfil SMTP</li>
                  <li>Prueba conexión con "Enviar Email de Prueba"</li>
                  <li>Revisa logs de GoPhish en servidor</li>
                  <li>Contacta a proveedor de email (Gmail, Office 365)</li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">📧 Problema: Emails van a carpeta de spam</h4>
              <Card className="p-4 border-orange-200">
                <p className="text-sm font-semibold mb-2">Posibles Causas:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Falta configuración SPF/DKIM/DMARC</li>
                  <li>Dominio nuevo sin reputación</li>
                  <li>Contenido del email parece spam</li>
                  <li>Volumen de envío muy alto</li>
                </ul>
                <p className="text-sm font-semibold mt-3 mb-2">Soluciones:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Configura registros DNS (SPF, DKIM, DMARC)</li>
                  <li>Usa dominio corporativo establecido</li>
                  <li>Evita palabras "urgente", "gratis", "haz clic aquí"</li>
                  <li>Reduce velocidad de envío (usar Send By Date)</li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">🔗 Problema: Links de tracking no funcionan</h4>
              <Card className="p-4 border-yellow-200">
                <p className="text-sm font-semibold mb-2">Posibles Causas:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Plantilla no incluye {'{{.URL}}'}</li>
                  <li>GoPhish servidor caído</li>
                  <li>Firewall bloqueando acceso a landing page</li>
                </ul>
                <p className="text-sm font-semibold mt-3 mb-2">Soluciones:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Edita plantilla y agrega {'{{.URL}}'} en botón/link</li>
                  <li>Verifica que GoPhish está corriendo (systemctl status gophish)</li>
                  <li>Prueba acceder a landing page desde navegador externo</li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">👁️ Problema: Tracking de apertura no registra</h4>
              <Card className="p-4 border-blue-200">
                <p className="text-sm font-semibold mb-2">Posibles Causas:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Cliente de email bloquea imágenes automáticamente</li>
                  <li>Plantilla no incluye {'{{.Tracker}}'}</li>
                </ul>
                <p className="text-sm font-semibold mt-3 mb-2">Soluciones:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Acepta que tracking de apertura no es 100% preciso</li>
                  <li>Agrega {'{{.Tracker}}'} al final del HTML</li>
                  <li>Enfócate en clics (más confiables que aperturas)</li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">❌ Problema: Error "Connection Refused" al crear campaña</h4>
              <Card className="p-4 border-red-200">
                <p className="text-sm font-semibold mb-2">Posibles Causas:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>GoPhish no está corriendo</li>
                  <li>Configuración de GoPhish incorrecta en plataforma</li>
                  <li>Firewall bloqueando comunicación entre backend y GoPhish</li>
                </ul>
                <p className="text-sm font-semibold mt-3 mb-2">Soluciones:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Reinicia servicio GoPhish</li>
                  <li>Verifica URL y API key en "Configuración GoPhish"</li>
                  <li>Revisa logs del backend para más detalles</li>
                </ul>
              </Card>

              <Warning title="¿Necesitas Más Ayuda?">
                <p className="text-sm">
                  Si ninguna solución funciona, revisa los logs del sistema:
                </p>
                <ul className="list-disc list-inside text-sm mt-2">
                  <li><strong>GoPhish:</strong> /var/log/gophish/gophish.log</li>
                  <li><strong>Backend:</strong> journalctl -u backend-service</li>
                  <li><strong>Frontend:</strong> Console del navegador (F12)</li>
                </ul>
              </Warning>
            </div>
          ),
        },
      },
    ],
  },
];
