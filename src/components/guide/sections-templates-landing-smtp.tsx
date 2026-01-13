import { GuideSection } from './types';
import { FileText, Globe, Mail as MailIcon, Code, Eye, Palette } from 'lucide-react';
import { InfoBox, Tip, Warning, StepByStep, CodeBlock, SuccessBox } from './GuideSection';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export const templatesLandingSmtpSections: GuideSection[] = [
  {
    id: 'plantillas-email',
    title: '6. Plantillas de Email',
    icon: FileText,
    subsections: [
      {
        id: 'que-es-plantilla',
        title: '¿Qué es una Plantilla de Email?',
        searchKeywords: ['plantilla', 'email', 'template', 'correo', 'mensaje'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                Una <strong>plantilla de email</strong> es el mensaje que los usuarios recibirán 
                en su bandeja de entrada. Es la simulación del correo de phishing que usarás 
                para probar su conocimiento.
              </p>

              <h4 className="font-semibold">Componentes de una Plantilla</h4>
              <div className="space-y-3">
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">📧 Asunto (Subject)</h5>
                  <p className="text-sm">
                    La línea de asunto que aparece en la bandeja de entrada.
                  </p>
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    Ejemplo: "Urgente: Actualice su contraseña ahora"
                  </div>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">✉️ Remitente (From)</h5>
                  <p className="text-sm">
                    El nombre y email que aparece como remitente.
                  </p>
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    Ejemplo: "IT Support &lt;soporte@empresa.com&gt;"
                  </div>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">📝 Contenido HTML</h5>
                  <p className="text-sm">
                    El cuerpo del mensaje con formato, imágenes y el botón/link de phishing.
                  </p>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">📄 Contenido Texto Plano</h5>
                  <p className="text-sm">
                    Versión sin formato para clientes de email que no soportan HTML.
                  </p>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">Variables Dinámicas</h4>
              <p>Puedes personalizar emails usando variables:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><code>{'{{.FirstName}}'}</code> - Nombre del usuario</li>
                <li><code>{'{{.LastName}}'}</code> - Apellido del usuario</li>
                <li><code>{'{{.Email}}'}</code> - Email del usuario</li>
                <li><code>{'{{.Position}}'}</code> - Cargo del usuario</li>
                <li><code>{'{{.URL}}'}</code> - Link de tracking único</li>
              </ul>

              <Tip title="Personalización Aumenta Efectividad">
                Emails personalizados ("Hola Juan") son más creíbles que genéricos ("Estimado usuario").
              </Tip>

              <Warning title="Evita Contenido Ofensivo">
                Aunque es una simulación, mantén el contenido profesional. No uses amenazas 
                extremas o lenguaje inapropiado.
              </Warning>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <h4 className="font-semibold">Estructura de una Plantilla</h4>
              <CodeBlock language="json">
{`{
  "name": "Actualización de Seguridad",
  "subject": "Urgente: Actualice su contraseña",
  "from": "IT Support <soporte@empresa.com>",
  "html": "<html>...</html>",
  "text": "Versión en texto plano...",
  "attachments": []
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Variables de GoPhish</h4>
              <p>GoPhish usa sintaxis de template de Go (text/template):</p>
              <div className="space-y-2 text-sm">
                <Card className="p-3">
                  <strong>Variable:</strong> <code>{'{{.FirstName}}'}</code><br/>
                  <strong>Descripción:</strong> Nombre del target<br/>
                  <strong>Ejemplo:</strong> Juan
                </Card>
                <Card className="p-3">
                  <strong>Variable:</strong> <code>{'{{.URL}}'}</code><br/>
                  <strong>Descripción:</strong> URL única de tracking<br/>
                  <strong>Ejemplo:</strong> https://landing.com/track?rid=abc123
                </Card>
                <Card className="p-3">
                  <strong>Variable:</strong> <code>{'{{.Tracker}}'}</code><br/>
                  <strong>Descripción:</strong> Imagen de tracking 1x1px<br/>
                  <strong>Uso:</strong> Detectar apertura de emails
                </Card>
                <Card className="p-3">
                  <strong>Variable:</strong> <code>{'{{.TrackingURL}}'}</code><br/>
                  <strong>Descripción:</strong> URL base de tracking<br/>
                  <strong>Ejemplo:</strong> https://gophish.com
                </Card>
              </div>

              <h4 className="font-semibold mt-6">Ejemplo de HTML con Variables</h4>
              <CodeBlock language="html">
{`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Actualización de Seguridad</title>
</head>
<body style="font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto;">
    <h2>Hola {{.FirstName}},</h2>
    <p>
      Hemos detectado actividad sospechosa en tu cuenta 
      <strong>{{.Email}}</strong>.
    </p>
    <p>
      Por favor, verifica tu identidad haciendo clic en el 
      siguiente botón:
    </p>
    <a href="{{.URL}}" 
       style="display: inline-block; background: #007bff; 
              color: white; padding: 10px 20px; 
              text-decoration: none; border-radius: 5px;">
      Verificar Ahora
    </a>
    <p style="color: #666; font-size: 12px; margin-top: 20px;">
      Si no solicitaste esto, ignora este mensaje.
    </p>
  </div>
  {{.Tracker}}
</body>
</html>`}
              </CodeBlock>

              <InfoBox title="Tracking de Apertura">
                La variable <code>{'{{.Tracker}}'}</code> inserta una imagen invisible 
                que notifica a GoPhish cuando el email es abierto.
              </InfoBox>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">API de Plantillas</h4>
              <CodeBlock language="bash">
{`# Listar plantillas
GET /api/v1/gophish/:config_id/templates

# Crear plantilla
POST /api/v1/gophish/:config_id/templates
{
  "name": "Security Update",
  "subject": "Action Required: Update Password",
  "html": "<html>...</html>",
  "text": "Plain text version",
  "from": "IT Support <it@company.com>"
}

# Obtener plantilla
GET /api/v1/gophish/:config_id/templates/:id

# Actualizar plantilla
PUT /api/v1/gophish/:config_id/templates/:id

# Eliminar plantilla
DELETE /api/v1/gophish/:config_id/templates/:id`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Procesamiento de Variables en GoPhish</h4>
              <CodeBlock language="go">
{`// GoPhish usa text/template de Go
import "text/template"

type EmailContext struct {
    FirstName    string
    LastName     string
    Email        string
    Position     string
    URL          string
    Tracker      string
    TrackingURL  string
    RId          string  // Result ID único
}

func RenderEmail(tmpl string, target Target, rid string) (string, error) {
    t, err := template.New("email").Parse(tmpl)
    if err != nil {
        return "", err
    }
    
    ctx := EmailContext{
        FirstName:   target.FirstName,
        LastName:    target.LastName,
        Email:       target.Email,
        Position:    target.Position,
        URL:         fmt.Sprintf("%s?rid=%s", landingURL, rid),
        Tracker:     fmt.Sprintf("<img src='%s/track?rid=%s' />", baseURL, rid),
        TrackingURL: baseURL,
        RId:         rid,
    }
    
    var buf bytes.Buffer
    if err := t.Execute(&buf, ctx); err != nil {
        return "", err
    }
    
    return buf.String(), nil
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Validación y Sanitización</h4>
              <CodeBlock language="typescript">
{`// Frontend: validación antes de enviar
const validateTemplate = (template: EmailTemplate): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // 1. Validar que exista {{.URL}}
  if (!template.html.includes('{{.URL}}')) {
    errors.push({
      field: 'html',
      message: 'La plantilla debe incluir {{.URL}} para tracking'
    });
  }
  
  // 2. Validar sintaxis de variables
  const invalidVars = template.html.match(/{{[^}]*}}/g)?.filter(v => 
    !['{{.FirstName}}', '{{.LastName}}', '{{.Email}}', 
      '{{.Position}}', '{{.URL}}', '{{.Tracker}}'].includes(v)
  );
  
  if (invalidVars && invalidVars.length > 0) {
    errors.push({
      field: 'html',
      message: \`Variables inválidas: \${invalidVars.join(', ')}\`
    });
  }
  
  // 3. Validar que el asunto no esté vacío
  if (!template.subject.trim()) {
    errors.push({
      field: 'subject',
      message: 'El asunto es requerido'
    });
  }
  
  return errors;
};`}
              </CodeBlock>

              <Warning title="Escapado de Contenido">
                Si permites contenido generado por usuarios, usa DOMPurify para 
                prevenir XSS en la vista previa de plantillas.
              </Warning>
            </div>
          ),
        },
      },
      {
        id: 'crear-plantilla',
        title: 'Crear y Editar Plantillas',
        searchKeywords: ['crear plantilla', 'editar template', 'diseñar email'],
        content: {
          basico: (
            <div className="space-y-4">
              <StepByStep 
                title="Crear una Plantilla desde Cero"
                steps={[
                  {
                    title: 'Ir a "Plantillas de Email"',
                    content: <p>En el menú lateral, selecciona la opción de plantillas.</p>
                  },
                  {
                    title: 'Clic en "Nueva Plantilla"',
                    content: <p>Botón verde en la parte superior.</p>
                  },
                  {
                    title: 'Completar información básica',
                    content: (
                      <div>
                        <ul className="list-disc list-inside space-y-2">
                          <li><strong>Nombre:</strong> Identificador interno (ej: "Plantilla IT Q1")</li>
                          <li><strong>Asunto:</strong> Lo que verá el usuario (ej: "Actualice su contraseña")</li>
                          <li><strong>Remitente:</strong> Nombre y email (ej: "IT Support &lt;it@empresa.com&gt;")</li>
                        </ul>
                      </div>
                    )
                  },
                  {
                    title: 'Diseñar el contenido HTML',
                    content: (
                      <div>
                        <p>Usa el editor visual o escribe HTML directamente. Incluye:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Saludo personalizado con <code>{'{{.FirstName}}'}</code></li>
                          <li>Mensaje creíble del "atacante"</li>
                          <li>Botón o link con <code>{'{{.URL}}'}</code></li>
                          <li>Imagen de tracking <code>{'{{.Tracker}}'}</code> al final</li>
                        </ul>
                      </div>
                    )
                  },
                  {
                    title: 'Agregar versión de texto plano',
                    content: <p>Copia el contenido sin HTML para clientes que no soportan formato.</p>
                  },
                  {
                    title: 'Vista previa',
                    content: <p>Haz clic en "Vista Previa" para ver cómo se verá el email.</p>
                  },
                  {
                    title: 'Guardar plantilla',
                    content: <p>Si todo se ve correcto, guarda la plantilla.</p>
                  },
                ]} 
              />

              <h4 className="font-semibold mt-6">Plantillas Prediseñadas</h4>
              <p>
                La plataforma incluye plantillas prediseñadas que puedes usar o modificar:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Actualización de Contraseña:</strong> Simula mensaje de IT pidiendo cambio de password</li>
                <li><strong>Factura Pendiente:</strong> Simula correo de pagos/finanzas</li>
                <li><strong>Confirmación de Envío:</strong> Simula notificación de courier</li>
                <li><strong>Alerta de Seguridad:</strong> Simula notificación de acceso sospechoso</li>
              </ul>

              <Tip title="Usa Plantillas como Base">
                Es más fácil modificar una plantilla existente que crear desde cero. 
                Importa una plantilla prediseñada y personalízala.
              </Tip>
            </div>
          ),
        },
      },
    ],
  },

  {
    id: 'landing-pages',
    title: '7. Landing Pages',
    icon: Globe,
    subsections: [
      {
        id: 'que-es-landing',
        title: '¿Qué es una Landing Page?',
        searchKeywords: ['landing page', 'pagina destino', 'formulario', 'captura'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                Una <strong>Landing Page</strong> (página de destino) es el sitio web al que 
                llegan los usuarios cuando hacen clic en el link del email de phishing. 
                Aquí simulas la página falsa de login o formulario.
              </p>

              <h4 className="font-semibold">Propósito de la Landing Page</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Simular una página legítima (login de Office 365, banca, etc.)</li>
                <li>Capturar credenciales que los usuarios ingresen (simulado)</li>
                <li>Redirigir a página educativa después del "envío"</li>
                <li>Registrar qué usuarios cayeron en el phishing</li>
              </ul>

              <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 mt-4">
                <h5 className="font-semibold text-sm mb-2">Ejemplo de Flujo</h5>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Usuario recibe email: "Actualice su contraseña de Office 365"</li>
                  <li>Hace clic en el botón del email</li>
                  <li>Llega a landing page que simula login de Microsoft</li>
                  <li>Ingresa email y contraseña (fake)</li>
                  <li>Al enviar, ve mensaje: "⚠️ Esto fue una prueba de phishing"</li>
                  <li>Es redirigido a página de capacitación</li>
                </ol>
              </Card>

              <h4 className="font-semibold mt-6">Elementos de una Landing Page</h4>
              <div className="space-y-3">
                <Card className="p-3">
                  <h5 className="font-semibold text-sm">🎨 Diseño Visual</h5>
                  <p className="text-sm mt-1">Logo, colores y estilo que imita la marca real</p>
                </Card>
                <Card className="p-3">
                  <h5 className="font-semibold text-sm">📝 Formulario</h5>
                  <p className="text-sm mt-1">Campos para capturar datos (email, contraseña, etc.)</p>
                </Card>
                <Card className="p-3">
                  <h5 className="font-semibold text-sm">🔗 Redirect URL</h5>
                  <p className="text-sm mt-1">Página a la que se redirige después de enviar</p>
                </Card>
                <Card className="p-3">
                  <h5 className="font-semibold text-sm">📊 Capture Data</h5>
                  <p className="text-sm mt-1">Registra qué campos envió el usuario</p>
                </Card>
              </div>

              <Warning title="Ética y Transparencia">
                Siempre redirige a una página educativa después de capturar datos. 
                Los usuarios deben saber inmediatamente que fue una simulación.
              </Warning>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <h4 className="font-semibold">Estructura de una Landing Page</h4>
              <CodeBlock language="json">
{`{
  "name": "Office 365 Login",
  "html": "<html>...</html>",
  "capture_credentials": true,
  "capture_passwords": true,
  "redirect_url": "https://empresa.com/security-training"
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Captura de Formularios</h4>
              <p>
                GoPhish detecta automáticamente formularios en tu HTML y captura los datos enviados:
              </p>
              <CodeBlock language="html">
{`<form method="POST" action="#">
  <input type="email" name="email" placeholder="Email" required />
  <input type="password" name="password" placeholder="Contraseña" required />
  <button type="submit">Iniciar Sesión</button>
</form>`}
              </CodeBlock>

              <InfoBox title="Captura Automática">
                No necesitas configurar la captura manualmente. GoPhish intercepta 
                cualquier POST del formulario y registra los datos.
              </InfoBox>

              <h4 className="font-semibold mt-6">Variables Disponibles en Landing Page</h4>
              <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                <li><code>{'{{.FirstName}}'}</code> - Nombre del target</li>
                <li><code>{'{{.LastName}}'}</code> - Apellido</li>
                <li><code>{'{{.Email}}'}</code> - Email del target</li>
                <li><code>{'{{.RId}}'}</code> - Result ID único para tracking</li>
              </ul>

              <h4 className="font-semibold mt-6">Ejemplo de Landing con Personalización</h4>
              <CodeBlock language="html">
{`<!DOCTYPE html>
<html>
<head>
  <title>Office 365 - Inicio de Sesión</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; }
    .container { max-width: 400px; margin: 100px auto; }
    .logo { text-align: center; margin-bottom: 20px; }
    input { width: 100%; padding: 10px; margin: 5px 0; }
    button { width: 100%; padding: 10px; background: #0078d4; 
             color: white; border: none; cursor: pointer; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://..../office365-logo.png" width="200" />
    </div>
    <h2>Hola {{.FirstName}}</h2>
    <p>Inicia sesión con tu cuenta de empresa</p>
    <form method="POST">
      <input type="email" name="email" value="{{.Email}}" readonly />
      <input type="password" name="password" placeholder="Contraseña" />
      <button type="submit">Iniciar Sesión</button>
    </form>
  </div>
</body>
</html>`}
              </CodeBlock>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">Manejo de Eventos en Landing Page</h4>
              <CodeBlock language="go">
{`// GoPhish captura eventos de landing page
type Event struct {
    CampaignId int
    Email      string
    Time       time.Time
    Message    string
    Details    string
}

// Eventos generados automáticamente:
// 1. "Clicked Link" - Usuario abre la landing page
// 2. "Submitted Data" - Usuario envía el formulario

func HandleLandingPage(w http.ResponseWriter, r *http.Request) {
    rid := r.URL.Query().Get("rid")
    
    // Registrar apertura de página
    logEvent(Event{
        CampaignId: getCampaignByRId(rid),
        Email:      getEmailByRId(rid),
        Time:       time.Now(),
        Message:    "Clicked Link",
    })
    
    if r.Method == "POST" {
        // Capturar datos del formulario
        r.ParseForm()
        credentials := make(map[string]string)
        for key, values := range r.Form {
            credentials[key] = values[0]
        }
        
        // Registrar envío de datos
        logEvent(Event{
            CampaignId: getCampaignByRId(rid),
            Email:      getEmailByRId(rid),
            Time:       time.Now(),
            Message:    "Submitted Data",
            Details:    jsonEncode(credentials),
        })
        
        // Redirigir
        http.Redirect(w, r, landingPage.RedirectURL, 302)
    }
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Clonación de Sitios Reales</h4>
              <p>GoPhish incluye una herramienta para clonar sitios web automáticamente:</p>
              <CodeBlock language="bash">
{`# Endpoint de clonación
POST /api/v1/util/import/site
{
  "url": "https://login.microsoft.com",
  "include_resources": true
}

# Responde con HTML descargado y recursos`}
              </CodeBlock>

              <CodeBlock language="typescript">
{`// Frontend: función para clonar sitio
const cloneSite = async (url: string): Promise<string> => {
  const response = await fetch(\`/api/v1/util/import/site\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      url, 
      include_resources: true 
    })
  });
  
  const data = await response.json();
  return data.html; // HTML clonado
};`}
              </CodeBlock>

              <Warning title="Aspectos Legales">
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>Solo clona sitios para simulaciones internas autorizadas</li>
                  <li>No uses logos reales sin permiso legal</li>
                  <li>Documenta aprobación de gerencia antes de ejecutar</li>
                  <li>Cumple con políticas de uso aceptable de la empresa</li>
                </ul>
              </Warning>

              <h4 className="font-semibold mt-6">Ejemplo de Redirect Educativo</h4>
              <CodeBlock language="html">
{`<!-- Página de educación post-phishing -->
<!DOCTYPE html>
<html>
<head>
  <title>⚠️ Alerta de Seguridad</title>
</head>
<body>
  <div style="max-width: 600px; margin: 50px auto; 
              padding: 20px; border: 3px solid #ff6b6b;">
    <h1 style="color: #ff6b6b;">⚠️ ¡Acabas de Caer en un Phishing!</h1>
    <p>
      Esto fue una <strong>simulación de phishing</strong> realizada 
      por el equipo de seguridad de la empresa.
    </p>
    <h3>¿Qué hiciste mal?</h3>
    <ul>
      <li>Hiciste clic en un link sospechoso</li>
      <li>Ingresaste tus credenciales en un sitio no verificado</li>
    </ul>
    <h3>¿Cómo identificar phishing real?</h3>
    <ul>
      <li>Verifica la URL (dominio correcto)</li>
      <li>Busca certificado HTTPS</li>
      <li>Desconfía de urgencias ("Actualice ahora o perderá acceso")</li>
      <li>Reporta correos sospechosos a IT</li>
    </ul>
    <a href="/security-training" 
       style="display: inline-block; padding: 10px 20px; 
              background: #4caf50; color: white; 
              text-decoration: none; margin-top: 20px;">
      Ir a Capacitación de Seguridad
    </a>
  </div>
</body>
</html>`}
              </CodeBlock>
            </div>
          ),
        },
      },
    ],
  },

  {
    id: 'smtp',
    title: '8. Perfiles SMTP',
    icon: MailIcon,
    subsections: [
      {
        id: 'que-es-smtp',
        title: '¿Qué es un Perfil de Envío (SMTP)?',
        searchKeywords: ['smtp', 'envio', 'correo', 'mail server', 'email'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                Un <strong>Perfil de Envío (SMTP)</strong> es la configuración del servidor 
                de correo que usarás para enviar los emails de phishing simulado. 
                SMTP significa "Simple Mail Transfer Protocol" (Protocolo Simple de Transferencia de Correo).
              </p>

              <h4 className="font-semibold">¿Para Qué Sirve?</h4>
              <p>
                Sin un perfil SMTP, no puedes enviar emails. Es como tener un sobre escrito 
                pero sin una oficina de correos para enviarlo.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">📧 Servidor SMTP</h5>
                  <p className="text-sm">
                    La dirección del servidor de correo (ej: smtp.gmail.com)
                  </p>
                </Card>
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">🔢 Puerto</h5>
                  <p className="text-sm">
                    Número de puerto (587 para TLS, 465 para SSL)
                  </p>
                </Card>
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">👤 Usuario</h5>
                  <p className="text-sm">
                    Email o username para autenticar
                  </p>
                </Card>
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">🔐 Contraseña</h5>
                  <p className="text-sm">
                    Contraseña o app password del servidor
                  </p>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">Opciones de SMTP</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Gmail/Google Workspace:</strong> Fácil pero limitado (500 emails/día)</li>
                <li><strong>Office 365:</strong> Bueno para empresas con licencias Microsoft</li>
                <li><strong>SendGrid/Mailgun:</strong> Servicios dedicados para envíos masivos</li>
                <li><strong>Servidor Propio:</strong> Control total pero requiere mantenimiento</li>
              </ul>

              <Warning title="Límites de Envío">
                La mayoría de servicios tienen límites diarios. Gmail permite ~500 emails/día. 
                Para campañas grandes (&gt;1000 usuarios), usa un servicio dedicado.
              </Warning>

              <Tip title="Prueba con Email Personal">
                Antes de campañas reales, crea un perfil con tu email personal y 
                envíate una prueba para verificar que funciona.
              </Tip>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <h4 className="font-semibold">Configuraciones Comunes de SMTP</h4>
              
              <div className="space-y-3">
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">Gmail (Personal/Workspace)</h5>
                  <CodeBlock language="text">
{`Host: smtp.gmail.com
Puerto: 587 (TLS) o 465 (SSL)
Usuario: tu-email@gmail.com
Contraseña: App Password (no tu contraseña normal)
From: "Nombre Mostrado" <tu-email@gmail.com>`}
                  </CodeBlock>
                  <InfoBox title="App Password de Gmail">
                    No uses tu contraseña normal. Ve a Configuración → Seguridad → 
                    Contraseñas de aplicación y genera una.
                  </InfoBox>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">Office 365</h5>
                  <CodeBlock language="text">
{`Host: smtp.office365.com
Puerto: 587
Usuario: tu-email@empresa.com
Contraseña: Contraseña de Office 365
From: "IT Support" <it@empresa.com>`}
                  </CodeBlock>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">SendGrid</h5>
                  <CodeBlock language="text">
{`Host: smtp.sendgrid.net
Puerto: 587
Usuario: apikey (literal)
Contraseña: Tu SendGrid API Key
From: verificado@tudominio.com`}
                  </CodeBlock>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">Opciones Avanzadas</h4>
              <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                <li><strong>Ignore Certificate Errors:</strong> Solo para desarrollo/testing</li>
                <li><strong>Custom Headers:</strong> Agregar headers personalizados a emails</li>
                <li><strong>Max Connections:</strong> Número de conexiones paralelas al SMTP</li>
              </ul>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">Estructura de un Perfil SMTP</h4>
              <CodeBlock language="json">
{`{
  "name": "Office 365 Corporate",
  "host": "smtp.office365.com:587",
  "username": "phishing@empresa.com",
  "password": "encrypted_password",
  "from_address": "IT Security <security@empresa.com>",
  "ignore_cert_errors": false,
  "headers": [
    {"key": "X-Mailer", "value": "GoPhish"},
    {"key": "X-Priority", "value": "1"}
  ]
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Almacenamiento Seguro de Credenciales</h4>
              <CodeBlock language="go">
{`// Backend: cifrado de contraseñas SMTP
import "golang.org/x/crypto/bcrypt"

func EncryptSMTPPassword(password string, key []byte) (string, error) {
    // Usar AES-256 para cifrar
    ciphertext, err := encrypt([]byte(password), key)
    if err != nil {
        return "", err
    }
    return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func DecryptSMTPPassword(encrypted string, key []byte) (string, error) {
    ciphertext, _ := base64.StdEncoding.DecodeString(encrypted)
    plaintext, err := decrypt(ciphertext, key)
    if err != nil {
        return "", err
    }
    return string(plaintext), nil
}

// La key de cifrado debe estar en variables de entorno
// NUNCA en el código fuente
var encryptionKey = []byte(os.Getenv("SMTP_ENCRYPTION_KEY"))`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Testing de Conexión SMTP</h4>
              <CodeBlock language="go">
{`func TestSMTPConnection(profile SMTPProfile) error {
    // Parsear host y puerto
    host, portStr, err := net.SplitHostPort(profile.Host)
    if err != nil {
        return fmt.Errorf("invalid host format: %v", err)
    }
    
    port, _ := strconv.Atoi(portStr)
    
    // Conectar al servidor
    dialer := &mail.Dialer{
        Host:     host,
        Port:     port,
        Username: profile.Username,
        Password: profile.Password,
        SSL:      port == 465,
    }
    
    if profile.IgnoreCertErrors {
        dialer.TLSConfig = &tls.Config{InsecureSkipVerify: true}
    }
    
    // Intentar enviar email de prueba
    sender, err := dialer.Dial()
    if err != nil {
        return fmt.Errorf("connection failed: %v", err)
    }
    defer sender.Close()
    
    // Enviar mensaje de prueba
    testEmail := mail.NewMessage()
    testEmail.SetHeader("From", profile.FromAddress)
    testEmail.SetHeader("To", profile.Username)
    testEmail.SetHeader("Subject", "SMTP Test - GoPhish")
    testEmail.SetBody("text/plain", "This is a test email")
    
    if err := sender.Send(testEmail); err != nil {
        return fmt.Errorf("send failed: %v", err)
    }
    
    return nil
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Rate Limiting y Throttling</h4>
              <CodeBlock language="go">
{`// Evitar ser bloqueado por enviar demasiado rápido
type RateLimiter struct {
    maxPerSecond int
    delay        time.Duration
}

func (rl *RateLimiter) SendCampaignEmails(
    campaign Campaign, 
    profile SMTPProfile,
) error {
    for _, target := range campaign.Targets {
        // Enviar email
        if err := sendEmail(target, profile); err != nil {
            log.Printf("Failed to send to %s: %v", target.Email, err)
            continue
        }
        
        // Esperar para no exceder límite
        time.Sleep(rl.delay)
    }
    return nil
}

// Uso:
limiter := &RateLimiter{
    maxPerSecond: 10,  // 10 emails/segundo
    delay:        100 * time.Millisecond,
}
limiter.SendCampaignEmails(campaign, smtpProfile)`}
              </CodeBlock>

              <Warning title="SPF, DKIM y DMARC">
                Para evitar que tus emails sean marcados como spam, configura:
                <ul className="list-disc list-inside text-sm mt-2">
                  <li><strong>SPF:</strong> Autoriza tu servidor SMTP en DNS</li>
                  <li><strong>DKIM:</strong> Firma digital de emails</li>
                  <li><strong>DMARC:</strong> Política de autenticación</li>
                </ul>
                Consulta con tu administrador de IT o proveedor de dominio.
              </Warning>
            </div>
          ),
        },
      },
      {
        id: 'crear-smtp',
        title: 'Crear un Perfil SMTP',
        searchKeywords: ['crear smtp', 'configurar correo', 'nuevo perfil'],
        content: {
          basico: (
            <div className="space-y-4">
              <StepByStep 
                title="Configurar Gmail como SMTP"
                steps={[
                  {
                    title: 'Generar App Password en Gmail',
                    content: (
                      <div>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Ve a myaccount.google.com</li>
                          <li>Seguridad → Verificación en dos pasos (activarla)</li>
                          <li>Seguridad → Contraseñas de aplicaciones</li>
                          <li>Selecciona "Correo" y "Otro dispositivo personalizado"</li>
                          <li>Copia la contraseña de 16 caracteres</li>
                        </ol>
                      </div>
                    )
                  },
                  {
                    title: 'Ir a "Perfiles SMTP" en la plataforma',
                    content: <p>Menú lateral → Perfiles SMTP → Nuevo Perfil</p>
                  },
                  {
                    title: 'Completar formulario',
                    content: (
                      <div>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Nombre: "Gmail Personal"</li>
                          <li>Host: smtp.gmail.com:587</li>
                          <li>Usuario: tu-email@gmail.com</li>
                          <li>Contraseña: [App Password de 16 caracteres]</li>
                          <li>From: "IT Security" &lt;tu-email@gmail.com&gt;</li>
                        </ul>
                      </div>
                    )
                  },
                  {
                    title: 'Probar conexión',
                    content: <p>Haz clic en "Enviar Email de Prueba" para verificar.</p>
                  },
                  {
                    title: 'Guardar perfil',
                    content: <p>Si la prueba es exitosa, guarda el perfil.</p>
                  },
                ]} 
              />

              <SuccessBox title="Perfil Listo">
                Una vez guardado, puedes usar este perfil en tus campañas para enviar emails.
              </SuccessBox>
            </div>
          ),
        },
      },
    ],
  },
];
