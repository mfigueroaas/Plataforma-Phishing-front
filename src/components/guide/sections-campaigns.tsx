import { GuideSection } from './types';
import { Target, Play, BarChart2, AlertTriangle, CheckCircle2, Calendar, FileText, Users, Globe, Mail } from 'lucide-react';
import { InfoBox, Tip, Warning, StepByStep, CodeBlock, SuccessBox } from './GuideSection';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export const campaignsSections: GuideSection[] = [
  {
    id: 'campanas',
    title: '9. Campañas de Phishing',
    icon: Target,
    subsections: [
      {
        id: 'que-es-campana',
        title: '¿Qué es una Campaña?',
        searchKeywords: ['campaña', 'campaign', 'simulacion', 'phishing', 'ejecutar'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                Una <strong>campaña</strong> es el proceso completo de enviar emails de phishing 
                simulado a un grupo de usuarios y monitorear sus respuestas. Es la culminación 
                de todo lo que has configurado (plantillas, grupos, landing pages, SMTP).
              </p>

              <h4 className="font-semibold">Componentes de una Campaña</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-primary" />
                    <h5 className="font-semibold text-sm">Nombre de la Campaña</h5>
                  </div>
                  <p className="text-sm">Identificador único (ej: "Campaña Q1 2024 - IT")</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h5 className="font-semibold text-sm">Plantilla de Email</h5>
                  </div>
                  <p className="text-sm">El email que recibirán los usuarios</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <h5 className="font-semibold text-sm">Grupo de Objetivos</h5>
                  </div>
                  <p className="text-sm">Lista de usuarios a quienes enviar</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    <h5 className="font-semibold text-sm">Landing Page</h5>
                  </div>
                  <p className="text-sm">Página falsa donde capturar credenciales</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-orange-600" />
                    <h5 className="font-semibold text-sm">Perfil SMTP</h5>
                  </div>
                  <p className="text-sm">Servidor de correo para enviar emails</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-red-600" />
                    <h5 className="font-semibold text-sm">Fecha de Lanzamiento</h5>
                  </div>
                  <p className="text-sm">Cuándo enviar (inmediato o programado)</p>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">Flujo de una Campaña</h4>
              <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <ol className="list-decimal list-inside space-y-3 text-sm">
                  <li>
                    <strong>Planificación:</strong> Seleccionas plantilla, grupo, landing page y SMTP
                  </li>
                  <li>
                    <strong>Lanzamiento:</strong> La campaña envía emails a todos los usuarios del grupo
                  </li>
                  <li>
                    <strong>Monitoreo:</strong> En tiempo real ves quién abre, hace clic y envía datos
                  </li>
                  <li>
                    <strong>Análisis:</strong> Al finalizar, revisas estadísticas y generas reportes
                  </li>
                  <li>
                    <strong>Capacitación:</strong> Contactas a usuarios vulnerables para entrenarlos
                  </li>
                </ol>
              </Card>

              <h4 className="font-semibold mt-6">Estados de una Campaña</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Programada</Badge>
                  <span className="text-sm">Creada pero no iniciada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600">En Progreso</Badge>
                  <span className="text-sm">Enviando emails activamente</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Completada</Badge>
                  <span className="text-sm">Todos los emails enviados</span>
                </div>
              </div>

              <Warning title="No Pausar Campañas a Mitad">
                Una vez iniciada una campaña, déjala completarse. Pausar puede generar 
                inconsistencias en los datos de tracking.
              </Warning>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <h4 className="font-semibold">Estructura de una Campaña</h4>
              <CodeBlock language="json">
{`{
  "id": 123,
  "name": "Q1 2024 IT Security Test",
  "created_date": "2024-01-15T10:00:00Z",
  "launch_date": "2024-01-20T09:00:00Z",
  "completed_date": null,
  "status": "In progress",
  "template": {
    "id": 5,
    "name": "Password Reset Urgent"
  },
  "page": {
    "id": 3,
    "name": "Office 365 Login"
  },
  "smtp": {
    "id": 2,
    "name": "Corporate SMTP"
  },
  "groups": [
    {
      "id": 10,
      "name": "IT Department",
      "num_targets": 45
    }
  ],
  "results": [
    {
      "email": "user@empresa.com",
      "status": "Submitted Data",
      "send_date": "2024-01-20T09:05:00Z",
      "reported": false
    }
  ],
  "stats": {
    "total": 45,
    "sent": 45,
    "opened": 28,
    "clicked": 12,
    "submitted_data": 5,
    "reported": 0
  }
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Eventos de Campaña (Timeline)</h4>
              <p>GoPhish registra cada interacción del usuario:</p>
              <div className="space-y-2 text-sm">
                <Card className="p-3">
                  <strong>Email Sent:</strong> Email entregado al servidor SMTP
                </Card>
                <Card className="p-3">
                  <strong>Email Opened:</strong> Usuario abre el email (vía pixel de tracking)
                </Card>
                <Card className="p-3">
                  <strong>Clicked Link:</strong> Usuario hace clic en el link/botón
                </Card>
                <Card className="p-3">
                  <strong>Submitted Data:</strong> Usuario envía formulario en landing page
                </Card>
                <Card className="p-3">
                  <strong>Email Reported:</strong> Usuario reporta el email como sospechoso (opcional)
                </Card>
              </div>

              <InfoBox title="Timeline Detallada">
                En la vista de resultados de campaña, puedes ver una línea de tiempo 
                por usuario mostrando todos los eventos con timestamp exacto.
              </InfoBox>

              <h4 className="font-semibold mt-6">Programación de Envíos</h4>
              <p>Puedes programar campañas para enviar en fechas específicas:</p>
              <CodeBlock language="json">
{`{
  "name": "Campaña Programada",
  "launch_date": "2024-02-01T08:00:00Z",  // Enviar el 1 de febrero a las 8am
  "send_by_date": "2024-02-01T09:00:00Z",  // Terminar envíos antes de las 9am
  ...
}`}
              </CodeBlock>
              <p className="text-sm mt-2">
                GoPhish distribuye los envíos uniformemente entre <code>launch_date</code> y{' '}
                <code>send_by_date</code> para evitar picos de carga.
              </p>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">API de Campañas</h4>
              <CodeBlock language="bash">
{`# Crear campaña
POST /api/v1/gophish/:config_id/campaigns
{
  "name": "Q1 Security Awareness",
  "template": {"name": "Password Reset"},
  "page": {"name": "Office 365 Login"},
  "smtp": {"name": "Corporate SMTP"},
  "groups": [{"name": "IT Department"}],
  "launch_date": "2024-02-01T08:00:00Z",
  "send_by_date": "2024-02-01T10:00:00Z"
}

# Listar campañas
GET /api/v1/gophish/:config_id/campaigns

# Obtener detalles de campaña
GET /api/v1/gophish/:config_id/campaigns/:id

# Obtener resultados detallados
GET /api/v1/gophish/:config_id/campaigns/:id/results

# Completar campaña manualmente
POST /api/v1/gophish/:config_id/campaigns/:id/complete

# Eliminar campaña
DELETE /api/v1/gophish/:config_id/campaigns/:id`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Lógica de Envío de Emails</h4>
              <CodeBlock language="go">
{`// GoPhish: campaignscheduler.go
func (cs *CampaignScheduler) LaunchCampaign(c *Campaign) error {
    // 1. Validar que todos los componentes existen
    if err := cs.validateCampaign(c); err != nil {
        return err
    }
    
    // 2. Generar result IDs únicos para cada target
    for _, target := range c.Groups[0].Targets {
        result := &Result{
            CampaignId: c.Id,
            Email:      target.Email,
            FirstName:  target.FirstName,
            LastName:   target.LastName,
            Position:   target.Position,
            Status:     "Sending",
            RId:        generateRandomID(),
        }
        db.Save(result)
    }
    
    // 3. Calcular intervalo entre envíos
    totalTargets := len(c.Groups[0].Targets)
    duration := c.SendByDate.Sub(c.LaunchDate)
    interval := duration / time.Duration(totalTargets)
    
    // 4. Programar envíos
    go func() {
        for i, result := range c.Results {
            time.Sleep(time.Duration(i) * interval)
            cs.sendEmail(c, result)
        }
        c.Status = "Completed"
        c.CompletedDate = time.Now()
        db.Save(c)
    }()
    
    return nil
}

func (cs *CampaignScheduler) sendEmail(c *Campaign, r *Result) error {
    // 1. Renderizar template con datos del target
    emailHTML := renderTemplate(c.Template.HTML, r)
    emailText := renderTemplate(c.Template.Text, r)
    
    // 2. Crear mensaje SMTP
    msg := mail.NewMessage()
    msg.SetHeader("From", c.SMTP.FromAddress)
    msg.SetHeader("To", r.Email)
    msg.SetHeader("Subject", c.Template.Subject)
    msg.SetBody("text/html", emailHTML)
    msg.AddAlternative("text/plain", emailText)
    
    // 3. Enviar vía SMTP
    dialer := getDialer(c.SMTP)
    if err := dialer.Send(msg); err != nil {
        r.Status = "Error"
        r.SendDate = time.Now()
        db.Save(r)
        return err
    }
    
    // 4. Registrar evento
    event := &Event{
        CampaignId: c.Id,
        Email:      r.Email,
        Time:       time.Now(),
        Message:    "Email Sent",
    }
    db.Save(event)
    
    r.Status = "Sent"
    r.SendDate = time.Now()
    db.Save(r)
    
    return nil
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Tracking de Eventos</h4>
              <CodeBlock language="go">
{`// Endpoint de tracking de apertura de email
func TrackEmailOpen(w http.ResponseWriter, r *http.Request) {
    rid := r.URL.Query().Get("rid")
    
    result := models.GetResultByRId(rid)
    if result == nil {
        http.NotFound(w, r)
        return
    }
    
    // Registrar evento solo si es primera apertura
    if result.Status == "Sent" {
        event := &models.Event{
            CampaignId: result.CampaignId,
            Email:      result.Email,
            Time:       time.Now(),
            Message:    "Email Opened",
        }
        db.Save(event)
        
        result.Status = "Opened"
        db.Save(result)
    }
    
    // Devolver imagen transparente 1x1
    w.Header().Set("Content-Type", "image/png")
    w.Write(transparentPixel)
}

// Endpoint de tracking de clic en link
func TrackLinkClick(w http.ResponseWriter, r *http.Request) {
    rid := r.URL.Query().Get("rid")
    
    result := models.GetResultByRId(rid)
    if result == nil {
        http.NotFound(w, r)
        return
    }
    
    event := &models.Event{
        CampaignId: result.CampaignId,
        Email:      result.Email,
        Time:       time.Now(),
        Message:    "Clicked Link",
    }
    db.Save(event)
    
    result.Status = "Clicked Link"
    db.Save(result)
    
    // Redirigir a landing page
    campaign := models.GetCampaign(result.CampaignId)
    http.Redirect(w, r, campaign.Page.URL, 302)
}`}
              </CodeBlock>

              <Warning title="GDPR y Privacidad">
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>Los datos capturados son sensibles (credenciales aunque falsas)</li>
                  <li>Almacena solo hash de contraseñas, nunca texto plano</li>
                  <li>Limita acceso a resultados solo a admins autorizados</li>
                  <li>Establece política de retención (ej: eliminar datos después de 90 días)</li>
                  <li>Documenta consentimiento de empleados para simulaciones</li>
                </ul>
              </Warning>
            </div>
          ),
        },
      },
      {
        id: 'crear-campana',
        title: 'Crear y Lanzar una Campaña',
        searchKeywords: ['crear campaña', 'lanzar', 'nueva campaña', 'ejecutar'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                Crear una campaña es el momento donde todo se junta. Asegúrate de tener 
                listos: plantilla, grupo, landing page y perfil SMTP antes de comenzar.
              </p>

              <StepByStep 
                title="Pasos para Crear una Campaña"
                steps={[
                  {
                    title: 'Ir a "Campañas"',
                    content: <p>En el menú lateral, selecciona "Campañas".</p>
                  },
                  {
                    title: 'Clic en "Nueva Campaña"',
                    content: <p>Botón verde en la parte superior derecha.</p>
                  },
                  {
                    title: 'Nombre de la Campaña',
                    content: (
                      <div>
                        <p>Usa un nombre descriptivo que incluya:</p>
                        <ul className="list-disc list-inside mt-2 ml-4 text-sm">
                          <li>Período: "Q1 2024"</li>
                          <li>Departamento: "IT", "Ventas"</li>
                          <li>Tipo: "Training", "Assessment"</li>
                        </ul>
                        <p className="mt-2 text-sm">
                          <strong>Ejemplo:</strong> "Q1 2024 - IT Security Training"
                        </p>
                      </div>
                    )
                  },
                  {
                    title: 'Seleccionar Plantilla de Email',
                    content: (
                      <div>
                        <p>Elige de tus plantillas guardadas o crea una nueva.</p>
                        <Tip title="Vista Previa">
                          Haz clic en el ícono de ojo para ver cómo se verá el email.
                        </Tip>
                      </div>
                    )
                  },
                  {
                    title: 'Seleccionar Landing Page',
                    content: <p>Elige la página donde los usuarios "caerán" al hacer clic.</p>
                  },
                  {
                    title: 'Seleccionar Grupo de Objetivos',
                    content: (
                      <div>
                        <p>Elige el grupo de usuarios. Verás cuántos usuarios incluye.</p>
                        <InfoBox title="Múltiples Grupos">
                          Puedes seleccionar varios grupos para incluir más usuarios.
                        </InfoBox>
                      </div>
                    )
                  },
                  {
                    title: 'Seleccionar Perfil SMTP',
                    content: <p>Elige el servidor de correo para enviar.</p>
                  },
                  {
                    title: 'Programar Lanzamiento (Opcional)',
                    content: (
                      <div>
                        <p>Opciones:</p>
                        <ul className="list-disc list-inside mt-2 ml-4 text-sm">
                          <li><strong>Enviar Ahora:</strong> Inicia inmediatamente</li>
                          <li><strong>Programar:</strong> Elige fecha y hora futura</li>
                        </ul>
                      </div>
                    )
                  },
                  {
                    title: 'Revisar y Confirmar',
                    content: (
                      <div>
                        <p>Verás un resumen de la campaña. Verifica:</p>
                        <ul className="list-disc list-inside mt-2 ml-4 text-sm">
                          <li>✅ Plantilla correcta</li>
                          <li>✅ Grupo correcto</li>
                          <li>✅ Landing page correcta</li>
                          <li>✅ SMTP funcional</li>
                        </ul>
                      </div>
                    )
                  },
                  {
                    title: 'Lanzar Campaña',
                    content: (
                      <div>
                        <p>Haz clic en "Lanzar Campaña".</p>
                        <Warning title="No Se Puede Deshacer">
                          Una vez lanzada, no puedes detener emails ya enviados. 
                          Revisa bien antes de confirmar.
                        </Warning>
                      </div>
                    )
                  },
                ]} 
              />

              <SuccessBox title="Campaña en Marcha">
                <p className="text-sm">
                  Una vez lanzada, verás la campaña en estado "En Progreso". 
                  Los emails se enviarán gradualmente según la programación.
                </p>
              </SuccessBox>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <h4 className="font-semibold">Opciones Avanzadas al Crear Campaña</h4>
              
              <Card className="p-4">
                <h5 className="font-semibold text-sm mb-2">📅 Send By Date</h5>
                <p className="text-sm">
                  Si tienes 100 usuarios y programas <strong>Launch Date</strong> a las 9:00 AM 
                  y <strong>Send By Date</strong> a las 11:00 AM, GoPhish distribuirá los envíos 
                  uniformemente en esas 2 horas (aprox. 1 email por minuto).
                </p>
                <CodeBlock language="text">
{`Launch Date: 2024-02-01 09:00
Send By Date: 2024-02-01 11:00
Total Targets: 100

Resultado: ~1 email cada 1.2 minutos`}
                </CodeBlock>
              </Card>

              <Card className="p-4 mt-4">
                <h5 className="font-semibold text-sm mb-2">🔗 URL Personalizada</h5>
                <p className="text-sm">
                  Puedes configurar una URL personalizada para tracking en lugar de la por defecto:
                </p>
                <div className="text-xs mt-2 space-y-1">
                  <div><strong>Por Defecto:</strong> https://gophish.com/?rid=abc123</div>
                  <div><strong>Personalizada:</strong> https://secure-login.empresa.com/?id=abc123</div>
                </div>
                <InfoBox title="Requiere DNS">
                  Para usar URLs personalizadas, configura un subdominio que apunte a tu servidor GoPhish.
                </InfoBox>
              </Card>

              <h4 className="font-semibold mt-6">Validación Pre-Lanzamiento</h4>
              <p>La plataforma valida antes de permitir el lanzamiento:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                <li>Template debe incluir <code>{'{{.URL}}'}</code></li>
                <li>Landing page debe tener formulario HTML</li>
                <li>SMTP debe estar probado y funcional</li>
                <li>Grupo debe tener al menos 1 usuario</li>
                <li>Fechas de programación válidas (futuras)</li>
              </ul>
            </div>
          ),
        },
      },
      {
        id: 'monitorear-resultados',
        title: 'Monitorear Resultados en Tiempo Real',
        searchKeywords: ['resultados', 'monitoreo', 'estadisticas', 'tracking', 'eventos'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                Durante la campaña, puedes ver en tiempo real qué usuarios están 
                interactuando con el email de phishing.
              </p>

              <h4 className="font-semibold">Vista de Resultados</h4>
              <p>Desde la lista de campañas, haz clic en una campaña para ver sus resultados:</p>

              <div className="space-y-3 mt-4">
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">📊 Estadísticas Generales</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Total Enviados: <strong>100</strong></div>
                    <div>Abiertos: <strong>65 (65%)</strong></div>
                    <div>Clics: <strong>23 (23%)</strong></div>
                    <div>Datos Enviados: <strong>8 (8%)</strong></div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">📋 Tabla de Usuarios</h5>
                  <p className="text-sm">
                    Lista de todos los usuarios con su estado actual:
                  </p>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Enviado</Badge>
                      <span>juan.perez@empresa.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-600">Abierto</Badge>
                      <span>maria.garcia@empresa.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-600">Clic</Badge>
                      <span>carlos.lopez@empresa.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-600">Datos Enviados</Badge>
                      <span>ana.martinez@empresa.com</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">🕐 Timeline de Eventos</h5>
                  <p className="text-sm">
                    Haz clic en cualquier usuario para ver su timeline completo:
                  </p>
                  <div className="mt-2 space-y-1 text-xs font-mono">
                    <div>09:05:23 - Email Enviado</div>
                    <div>09:12:45 - Email Abierto</div>
                    <div>09:13:02 - Clic en Link</div>
                    <div>09:13:45 - Datos Enviados</div>
                  </div>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">¿Qué Hacer con los Resultados?</h4>
              <StepByStep steps={[
                {
                  title: 'Identifica usuarios vulnerables',
                  content: (
                    <p>
                      Usuarios que enviaron datos son los más vulnerables. 
                      Prioriza capacitarlos.
                    </p>
                  )
                },
                {
                  title: 'Agrupa por departamento',
                  content: (
                    <p>
                      Si ves que un departamento tiene alta tasa de clics, 
                      enfoca capacitación en ese equipo.
                    </p>
                  )
                },
                {
                  title: 'Exporta reportes',
                  content: (
                    <p>
                      Descarga CSV o PDF para compartir con gerencia o RRHH.
                    </p>
                  )
                },
                {
                  title: 'Programa seguimiento',
                  content: (
                    <p>
                      Ejecuta una segunda campaña en 3-6 meses para medir mejora.
                    </p>
                  )
                },
              ]} />

              <Tip title="Actualización Automática">
                La vista de resultados se actualiza automáticamente cada 30 segundos. 
                No necesitas recargar la página.
              </Tip>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <h4 className="font-semibold">Estructura de Resultados</h4>
              <CodeBlock language="json">
{`{
  "id": 456,
  "campaign_id": 123,
  "email": "user@empresa.com",
  "first_name": "Juan",
  "last_name": "Pérez",
  "position": "Developer",
  "status": "Submitted Data",
  "ip": "192.168.1.100",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "send_date": "2024-01-20T09:05:00Z",
  "reported": false,
  "modified_date": "2024-01-20T09:13:45Z"
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Estados Posibles de un Result</h4>
              <div className="space-y-2 text-sm">
                <Card className="p-3">
                  <strong>Sending:</strong> Email en cola, aún no enviado
                </Card>
                <Card className="p-3">
                  <strong>Sent:</strong> Email entregado, esperando apertura
                </Card>
                <Card className="p-3">
                  <strong>Opened:</strong> Usuario abrió el email (tracking pixel cargado)
                </Card>
                <Card className="p-3">
                  <strong>Clicked Link:</strong> Usuario hizo clic en el link/botón
                </Card>
                <Card className="p-3">
                  <strong>Submitted Data:</strong> Usuario envió el formulario con credenciales
                </Card>
                <Card className="p-3">
                  <strong>Email Reported:</strong> Usuario reportó el email como phishing (🎉)
                </Card>
                <Card className="p-3">
                  <strong>Error:</strong> Falló el envío (email inválido, SMTP error, etc.)
                </Card>
              </div>

              <h4 className="font-semibold mt-6">Geolocalización de Clics</h4>
              <p>
                GoPhish puede detectar la ubicación aproximada del usuario basándose en su IP:
              </p>
              <CodeBlock language="json">
{`{
  "ip": "192.168.1.100",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "city": "New York",
  "country": "United States"
}`}
              </CodeBlock>
              <InfoBox title="Requiere GeoIP Database">
                Debes configurar una base de datos GeoIP (MaxMind GeoLite2) en GoPhish 
                para que funcione la geolocalización.
              </InfoBox>

              <h4 className="font-semibold mt-6">Datos Capturados</h4>
              <p>
                Cuando un usuario envía el formulario, GoPhish captura todos los campos:
              </p>
              <CodeBlock language="json">
{`// Event details para "Submitted Data"
{
  "payload": {
    "email": "user@empresa.com",
    "password": "hunter2",
    "remember_me": "true"
  },
  "browser": {
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "address": "192.168.1.100"
  }
}`}
              </CodeBlock>

              <Warning title="Manejo de Contraseñas">
                Aunque las contraseñas capturadas son de prueba, trátalas como sensibles:
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>Almacena solo hash (bcrypt/argon2)</li>
                  <li>Limita acceso a resultados detallados</li>
                  <li>Nunca las muestres en reportes compartidos</li>
                </ul>
              </Warning>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">Query de Resultados con Filtros</h4>
              <CodeBlock language="typescript">
{`// Frontend: obtener resultados filtrados
const getCampaignResults = async (
  campaignId: number,
  filters?: {
    status?: string[],
    department?: string,
    dateFrom?: string,
    dateTo?: string,
  }
): Promise<CampaignResult[]> => {
  const params = new URLSearchParams();
  if (filters?.status) {
    params.append('status', filters.status.join(','));
  }
  if (filters?.department) {
    params.append('department', filters.department);
  }
  if (filters?.dateFrom) {
    params.append('date_from', filters.dateFrom);
  }
  if (filters?.dateTo) {
    params.append('date_to', filters.dateTo);
  }
  
  const response = await fetch(
    \`/api/v1/campaigns/\${campaignId}/results?\${params}\`,
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  
  return await response.json();
};

// Uso:
const vulnerableUsers = await getCampaignResults(123, {
  status: ['Submitted Data'],
  dateFrom: '2024-01-01',
});`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Agregación de Estadísticas</h4>
              <CodeBlock language="go">
{`func GetCampaignStats(campaignID int) (*CampaignStats, error) {
    var stats CampaignStats
    
    // Query SQL optimizada
    query := \`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'Sent' OR status = 'Opened' 
                     OR status = 'Clicked Link' 
                     OR status = 'Submitted Data' THEN 1 ELSE 0 END) as sent,
            SUM(CASE WHEN status = 'Opened' 
                     OR status = 'Clicked Link' 
                     OR status = 'Submitted Data' THEN 1 ELSE 0 END) as opened,
            SUM(CASE WHEN status = 'Clicked Link' 
                     OR status = 'Submitted Data' THEN 1 ELSE 0 END) as clicked,
            SUM(CASE WHEN status = 'Submitted Data' THEN 1 ELSE 0 END) as submitted,
            SUM(CASE WHEN reported = true THEN 1 ELSE 0 END) as reported,
            SUM(CASE WHEN status = 'Error' THEN 1 ELSE 0 END) as errors
        FROM results
        WHERE campaign_id = ?
    \`
    
    err := db.Raw(query, campaignID).Scan(&stats).Error
    if err != nil {
        return nil, err
    }
    
    // Calcular porcentajes
    if stats.Sent > 0 {
        stats.OpenRate = float64(stats.Opened) / float64(stats.Sent) * 100
        stats.ClickRate = float64(stats.Clicked) / float64(stats.Sent) * 100
        stats.SubmitRate = float64(stats.Submitted) / float64(stats.Sent) * 100
    }
    
    return &stats, nil
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Exportación de Reportes</h4>
              <CodeBlock language="go">
{`// Generar CSV con resultados
func ExportCampaignResultsCSV(campaignID int) ([]byte, error) {
    results := repository.GetCampaignResults(campaignID)
    
    var buf bytes.Buffer
    writer := csv.NewWriter(&buf)
    
    // Header
    writer.Write([]string{
        "Email", "Nombre", "Apellido", "Cargo", 
        "Estado", "Enviado", "Modificado", "IP", "Reportado",
    })
    
    // Rows
    for _, r := range results {
        writer.Write([]string{
            r.Email,
            r.FirstName,
            r.LastName,
            r.Position,
            r.Status,
            r.SendDate.Format(time.RFC3339),
            r.ModifiedDate.Format(time.RFC3339),
            r.IP,
            strconv.FormatBool(r.Reported),
        })
    }
    
    writer.Flush()
    return buf.Bytes(), nil
}

// Endpoint
func ExportCampaignHandler(c *gin.Context) {
    campaignID, _ := strconv.Atoi(c.Param("id"))
    
    csvData, err := ExportCampaignResultsCSV(campaignID)
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }
    
    c.Header("Content-Type", "text/csv")
    c.Header("Content-Disposition", 
             "attachment; filename=campaign_results.csv")
    c.Data(200, "text/csv", csvData)
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">WebSockets para Updates en Tiempo Real</h4>
              <CodeBlock language="typescript">
{`// Frontend: WebSocket para resultados en vivo
const ws = new WebSocket(\`ws://backend/campaigns/\${campaignId}/live\`);

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  
  switch (update.type) {
    case 'email_sent':
      updateResultStatus(update.email, 'Sent');
      incrementCounter('sent');
      break;
    case 'email_opened':
      updateResultStatus(update.email, 'Opened');
      incrementCounter('opened');
      break;
    case 'link_clicked':
      updateResultStatus(update.email, 'Clicked Link');
      incrementCounter('clicked');
      showAlert(\`\${update.email} hizo clic!\`, 'warning');
      break;
    case 'data_submitted':
      updateResultStatus(update.email, 'Submitted Data');
      incrementCounter('submitted');
      showAlert(\`⚠️ \${update.email} envió credenciales!\`, 'danger');
      break;
  }
};`}
              </CodeBlock>

              <InfoBox title="Optimización de Performance">
                Para campañas con miles de usuarios, considera:
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>Paginación en tabla de resultados (50-100 por página)</li>
                  <li>Virtualización de listas (react-window)</li>
                  <li>Caché de estadísticas agregadas (Redis)</li>
                  <li>Índices en columnas campaign_id y status</li>
                </ul>
              </InfoBox>
            </div>
          ),
        },
      },
      {
        id: 'completar-archivar',
        title: 'Completar y Archivar Campañas',
        searchKeywords: ['completar', 'archivar', 'finalizar', 'cerrar campaña'],
        content: {
          basico: (
            <div className="space-y-4">
              <h4 className="font-semibold">¿Cuándo Completar una Campaña?</h4>
              <p>
                Aunque GoPhish marca automáticamente campañas como "Completadas" cuando 
                todos los emails se envían, puedes completarla manualmente en cualquier momento.
              </p>

              <h4 className="font-semibold mt-4">Razones para Completar Manualmente</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ya obtuviste suficientes datos para el análisis</li>
                <li>Quieres evitar que más usuarios caigan en el phishing</li>
                <li>Detectaste un error en la configuración</li>
                <li>La gerencia solicitó detener la simulación</li>
              </ul>

              <StepByStep 
                title="Completar una Campaña"
                steps={[
                  {
                    title: 'Ir a la campaña',
                    content: <p>Desde la lista de campañas, haz clic en la que quieres completar.</p>
                  },
                  {
                    title: 'Clic en "Completar Campaña"',
                    content: <p>Botón en la parte superior de la vista de resultados.</p>
                  },
                  {
                    title: 'Confirmar',
                    content: (
                      <div>
                        <p>Aparecerá una confirmación. Al aceptar:</p>
                        <ul className="list-disc list-inside mt-2 ml-4 text-sm">
                          <li>La campaña cambia a estado "Completada"</li>
                          <li>No se enviarán más emails pendientes</li>
                          <li>El tracking sigue funcionando para emails ya enviados</li>
                        </ul>
                      </div>
                    )
                  },
                ]} 
              />

              <InfoBox title="El Tracking Continúa">
                Aunque completes la campaña, los usuarios que ya recibieron el email 
                aún pueden hacer clic y sus acciones se registrarán.
              </InfoBox>

              <h4 className="font-semibold mt-6">Eliminar vs Archivar</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">📦 Archivar (Recomendado)</h5>
                  <p className="text-sm">
                    Oculta la campaña de la vista principal pero mantiene todos los datos. 
                    Útil para campañas antiguas.
                  </p>
                </Card>
                <Card className="p-4 border-red-200">
                  <h5 className="font-semibold text-sm mb-2 text-red-600">🗑️ Eliminar</h5>
                  <p className="text-sm">
                    Borra permanentemente la campaña y TODOS sus resultados. 
                    Solo usa si estás seguro.
                  </p>
                </Card>
              </div>

              <Warning title="No Puedes Recuperar Campañas Eliminadas">
                La eliminación es permanente. Si necesitas los datos históricos, 
                usa "Archivar" en lugar de eliminar.
              </Warning>
            </div>
          ),
        },
      },
    ],
  },
];
