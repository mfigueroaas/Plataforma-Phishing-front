import { GuideSection } from './types';
import { Shield, Settings, Users as UsersIcon, Key, Lock, Database, Server } from 'lucide-react';
import { InfoBox, Tip, Warning, StepByStep, CodeBlock, SuccessBox } from './GuideSection';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export const toolsAdminSections: GuideSection[] = [
  {
    id: 'herramientas-seguridad',
    title: '10. Herramientas de Seguridad',
    icon: Shield,
    subsections: [
      {
        id: 'verificador-urls',
        title: 'Verificador de URLs Sospechosas',
        searchKeywords: ['verificador', 'urls', 'links', 'maliciosos', 'virus total'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                La plataforma incluye un <strong>verificador de URLs</strong> que analiza 
                enlaces sospechosos usando múltiples bases de datos de amenazas (VirusTotal, 
                URLhaus, PhishTank).
              </p>

              <h4 className="font-semibold">¿Para Qué Sirve?</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Verificar si un link reportado por empleados es malicioso</li>
                <li>Analizar URLs antes de incluirlas en capacitaciones</li>
                <li>Generar reportes de amenazas detectadas</li>
                <li>Mantener registro de URLs analizadas</li>
              </ul>

              <StepByStep 
                title="Cómo Usar el Verificador"
                steps={[
                  {
                    title: 'Ir a "Herramientas de Seguridad"',
                    content: <p>En el menú lateral, selecciona "Herramientas de Seguridad".</p>
                  },
                  {
                    title: 'Pegar la URL sospechosa',
                    content: (
                      <div>
                        <p>En el campo de texto, pega el link completo.</p>
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                          Ejemplo: https://secure-login-microsoft.phishing.com/login
                        </div>
                      </div>
                    )
                  },
                  {
                    title: 'Hacer clic en "Analizar"',
                    content: <p>La plataforma consultará múltiples APIs de seguridad.</p>
                  },
                  {
                    title: 'Revisar resultados',
                    content: (
                      <div>
                        <p>Verás un reporte con:</p>
                        <ul className="list-disc list-inside mt-2 ml-4 text-sm">
                          <li><strong>Puntaje de amenaza:</strong> 0-100 (mayor = más peligroso)</li>
                          <li><strong>Categoría:</strong> Phishing, Malware, Spam, Seguro</li>
                          <li><strong>Detecciones:</strong> Cuántas bases de datos lo marcaron</li>
                          <li><strong>Detalles:</strong> Información adicional de cada servicio</li>
                        </ul>
                      </div>
                    )
                  },
                ]} 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <Card className="p-4 border-green-200 bg-green-50 dark:bg-green-950/20">
                  <h5 className="font-semibold text-sm mb-2 text-green-800 dark:text-green-200">
                    ✅ URL Segura
                  </h5>
                  <p className="text-sm">
                    Puntaje: <strong>5/100</strong><br/>
                    Categoría: Legítima<br/>
                    Detecciones: 0/89
                  </p>
                </Card>
                <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950/20">
                  <h5 className="font-semibold text-sm mb-2 text-red-800 dark:text-red-200">
                    ⚠️ URL Maliciosa
                  </h5>
                  <p className="text-sm">
                    Puntaje: <strong>87/100</strong><br/>
                    Categoría: Phishing<br/>
                    Detecciones: 45/89
                  </p>
                </Card>
              </div>

              <Tip title="Comparte con Usuarios">
                Puedes copiar el reporte y enviarlo por email a usuarios que reportaron 
                la URL para confirmar que fue correcta su detección.
              </Tip>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <h4 className="font-semibold">APIs de Seguridad Integradas</h4>
              <div className="space-y-3">
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">🦠 VirusTotal</h5>
                  <p className="text-sm">
                    Analiza URLs con 80+ antivirus y bases de datos. Requiere API key gratuita.
                  </p>
                  <CodeBlock language="bash">
{`# Ejemplo de respuesta VirusTotal
{
  "data": {
    "attributes": {
      "last_analysis_stats": {
        "malicious": 12,
        "suspicious": 3,
        "undetected": 74,
        "harmless": 0
      },
      "categories": {
        "Fortinet": "phishing"
      }
    }
  }
}`}
                  </CodeBlock>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">🎣 PhishTank</h5>
                  <p className="text-sm">
                    Base de datos colaborativa de URLs de phishing verificadas. API gratuita.
                  </p>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">🕸️ URLhaus</h5>
                  <p className="text-sm">
                    Recopila URLs que distribuyen malware. Mantenido por Abuse.ch.
                  </p>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">Configuración de API Keys</h4>
              <p>Para usar el verificador, configura las API keys en Settings:</p>
              <CodeBlock language="json">
{`{
  "security_apis": {
    "virustotal": {
      "enabled": true,
      "api_key": "tu_api_key_aqui"
    },
    "phishtank": {
      "enabled": true,
      "api_key": "opcional"
    },
    "urlhaus": {
      "enabled": true,
      "api_key": null  // No requiere key
    }
  }
}`}
              </CodeBlock>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">Implementación del Verificador</h4>
              <CodeBlock language="go">
{`// Backend: servicio de verificación de URLs
type URLAnalysisResult struct {
    URL           string
    ThreatScore   int
    Category      string
    IsMalicious   bool
    Detections    int
    TotalScans    int
    Sources       []SourceResult
    AnalyzedAt    time.Time
}

type SourceResult struct {
    Name     string
    Verdict  string  // "clean", "malicious", "suspicious"
    Details  string
}

func AnalyzeURL(url string) (*URLAnalysisResult, error) {
    var wg sync.WaitGroup
    results := make(chan SourceResult, 3)
    
    // Consultar APIs en paralelo
    wg.Add(3)
    
    // VirusTotal
    go func() {
        defer wg.Done()
        vt := queryVirusTotal(url)
        results <- vt
    }()
    
    // PhishTank
    go func() {
        defer wg.Done()
        pt := queryPhishTank(url)
        results <- pt
    }()
    
    // URLhaus
    go func() {
        defer wg.Done()
        uh := queryURLhaus(url)
        results <- uh
    }()
    
    // Esperar resultados
    go func() {
        wg.Wait()
        close(results)
    }()
    
    // Agregar resultados
    var sources []SourceResult
    detections := 0
    totalScans := 0
    
    for result := range results {
        sources = append(sources, result)
        if result.Verdict == "malicious" {
            detections++
        }
        totalScans++
    }
    
    // Calcular puntaje de amenaza
    threatScore := calculateThreatScore(sources)
    
    return &URLAnalysisResult{
        URL:         url,
        ThreatScore: threatScore,
        Category:    categorize(sources),
        IsMalicious: detections > 0,
        Detections:  detections,
        TotalScans:  totalScans,
        Sources:     sources,
        AnalyzedAt:  time.Now(),
    }, nil
}

func queryVirusTotal(url string) SourceResult {
    apiKey := os.Getenv("VIRUSTOTAL_API_KEY")
    
    // Codificar URL en base64
    urlID := base64.RawURLEncoding.EncodeToString([]byte(url))
    
    req, _ := http.NewRequest("GET", 
        fmt.Sprintf("https://www.virustotal.com/api/v3/urls/%s", urlID),
        nil)
    req.Header.Set("x-apikey", apiKey)
    
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return SourceResult{Name: "VirusTotal", Verdict: "error"}
    }
    defer resp.Body.Close()
    
    var vtResp struct {
        Data struct {
            Attributes struct {
                LastAnalysisStats struct {
                    Malicious  int \`json:"malicious"\`
                    Suspicious int \`json:"suspicious"\`
                    Undetected int \`json:"undetected"\`
                } \`json:"last_analysis_stats"\`
            } \`json:"attributes"\`
        } \`json:"data"\`
    }
    
    json.NewDecoder(resp.Body).Decode(&vtResp)
    
    stats := vtResp.Data.Attributes.LastAnalysisStats
    
    verdict := "clean"
    if stats.Malicious > 5 {
        verdict = "malicious"
    } else if stats.Suspicious > 0 {
        verdict = "suspicious"
    }
    
    return SourceResult{
        Name:    "VirusTotal",
        Verdict: verdict,
        Details: fmt.Sprintf("%d/%d engines detected", 
                  stats.Malicious, 
                  stats.Malicious + stats.Suspicious + stats.Undetected),
    }
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Caché de Resultados</h4>
              <CodeBlock language="go">
{`// Evitar consultas repetidas a APIs (rate limiting)
func AnalyzeURLWithCache(url string) (*URLAnalysisResult, error) {
    cacheKey := fmt.Sprintf("url_analysis:%s", hashURL(url))
    
    // Intentar obtener de caché (válido por 24h)
    cached, err := redisClient.Get(ctx, cacheKey).Result()
    if err == nil {
        var result URLAnalysisResult
        json.Unmarshal([]byte(cached), &result)
        return &result, nil
    }
    
    // Si no hay caché, analizar
    result, err := AnalyzeURL(url)
    if err != nil {
        return nil, err
    }
    
    // Guardar en caché
    data, _ := json.Marshal(result)
    redisClient.Set(ctx, cacheKey, data, 24*time.Hour)
    
    return result, nil
}`}
              </CodeBlock>
            </div>
          ),
        },
      },
      {
        id: 'reportes-phishing',
        title: 'Sistema de Reportes de Phishing',
        searchKeywords: ['reportar', 'denunciar', 'phishing real', 'report button'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                Los usuarios pueden <strong>reportar emails sospechosos</strong> que reciben 
                (reales, no simulaciones) a través de un botón o addon de email.
              </p>

              <h4 className="font-semibold">Beneficios del Sistema de Reportes</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Detectar ataques de phishing reales antes de que causen daño</li>
                <li>Fomentar cultura de seguridad (usuarios se vuelven "sensores")</li>
                <li>Analizar automáticamente URLs reportadas</li>
                <li>Responder rápidamente a amenazas emergentes</li>
              </ul>

              <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 mt-4">
                <h5 className="font-semibold text-sm mb-2">Flujo de Reporte</h5>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Usuario recibe email sospechoso</li>
                  <li>Hace clic en botón "Reportar Phishing"</li>
                  <li>El email se reenvía automáticamente a security@empresa.com</li>
                  <li>La plataforma extrae URLs del email</li>
                  <li>Analiza las URLs con VirusTotal/PhishTank</li>
                  <li>Si es malicioso, genera alerta para IT</li>
                  <li>IT puede bloquear el remitente/dominio</li>
                </ol>
              </Card>

              <SuccessBox title="Incentiva Reportes">
                <p className="text-sm">
                  Reconoce públicamente a usuarios que reportan phishing (gamificación). 
                  Por ejemplo: "Top 5 Reportadores del Mes".
                </p>
              </SuccessBox>
            </div>
          ),
        },
      },
    ],
  },

  {
    id: 'administracion',
    title: '11. Administración y Configuración',
    icon: Settings,
    subsections: [
      {
        id: 'gestion-usuarios',
        title: 'Gestión de Usuarios de la Plataforma',
        searchKeywords: ['usuarios', 'admin', 'roles', 'permisos', 'accesos'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                Como <strong>Platform Admin</strong>, puedes gestionar quién tiene acceso 
                a la plataforma y qué permisos tiene cada usuario.
              </p>

              <h4 className="font-semibold">Roles Disponibles</h4>
              <div className="space-y-3">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-purple-600">Platform Admin</Badge>
                  </div>
                  <p className="text-sm">
                    <strong>Acceso Total:</strong> Puede gestionar usuarios, crear campañas, 
                    configurar GoPhish, ver todos los datos.
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-600">Operator</Badge>
                  </div>
                  <p className="text-sm">
                    <strong>Operador:</strong> Puede crear/editar campañas, grupos, plantillas. 
                    No puede gestionar usuarios ni configuración de GoPhish.
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Viewer</Badge>
                  </div>
                  <p className="text-sm">
                    <strong>Solo Lectura:</strong> Puede ver campañas y resultados, pero no 
                    crear ni editar nada.
                  </p>
                </Card>
              </div>

              <StepByStep 
                title="Agregar un Nuevo Usuario"
                steps={[
                  {
                    title: 'Ir a "Administración de Usuarios"',
                    content: <p>Menú lateral → Administración → Usuarios</p>
                  },
                  {
                    title: 'Clic en "Nuevo Usuario"',
                    content: <p>Botón en la parte superior.</p>
                  },
                  {
                    title: 'Completar información',
                    content: (
                      <div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li><strong>Email:</strong> Correo del usuario (debe existir en Firebase)</li>
                          <li><strong>Nombre:</strong> Nombre completo</li>
                          <li><strong>Rol:</strong> Platform Admin, Operator o Viewer</li>
                        </ul>
                      </div>
                    )
                  },
                  {
                    title: 'Guardar',
                    content: <p>El usuario recibirá un email de invitación.</p>
                  },
                ]} 
              />

              <Warning title="Limita Admins">
                No otorgues rol de Platform Admin a todos. Mantén el principio de mínimo privilegio: 
                solo usuarios que realmente necesiten acceso total.
              </Warning>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <h4 className="font-semibold">Matriz de Permisos</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Acción</th>
                      <th className="border p-2 text-center">Viewer</th>
                      <th className="border p-2 text-center">Operator</th>
                      <th className="border p-2 text-center">Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Ver Dashboard</td>
                      <td className="border p-2 text-center">✅</td>
                      <td className="border p-2 text-center">✅</td>
                      <td className="border p-2 text-center">✅</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Ver Campañas y Resultados</td>
                      <td className="border p-2 text-center">✅</td>
                      <td className="border p-2 text-center">✅</td>
                      <td className="border p-2 text-center">✅</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Crear/Editar Campañas</td>
                      <td className="border p-2 text-center">❌</td>
                      <td className="border p-2 text-center">✅</td>
                      <td className="border p-2 text-center">✅</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Crear/Editar Grupos</td>
                      <td className="border p-2 text-center">❌</td>
                      <td className="border p-2 text-center">✅</td>
                      <td className="border p-2 text-center">✅</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Crear/Editar Plantillas</td>
                      <td className="border p-2 text-center">❌</td>
                      <td className="border p-2 text-center">✅</td>
                      <td className="border p-2 text-center">✅</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Gestionar Usuarios</td>
                      <td className="border p-2 text-center">❌</td>
                      <td className="border p-2 text-center">❌</td>
                      <td className="border p-2 text-center">✅</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Configurar GoPhish</td>
                      <td className="border p-2 text-center">❌</td>
                      <td className="border p-2 text-center">❌</td>
                      <td className="border p-2 text-center">✅</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Ver Logs de Auditoría</td>
                      <td className="border p-2 text-center">❌</td>
                      <td className="border p-2 text-center">❌</td>
                      <td className="border p-2 text-center">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">Implementación de Roles con Firebase Custom Claims</h4>
              <CodeBlock language="typescript">
{`// Backend: asignar rol a usuario
import { getAuth } from 'firebase-admin/auth';

async function setUserRole(uid: string, role: 'viewer' | 'operator' | 'platform_admin') {
  await getAuth().setCustomUserClaims(uid, { role });
  
  // También guardar en BD local
  await db.users.update({
    where: { firebase_uid: uid },
    data: { role }
  });
}

// Middleware de autorización
function requireRole(requiredRole: string) {
  return async (req, res, next) => {
    const decodedToken = await getAuth().verifyIdToken(req.headers.authorization);
    const userRole = decodedToken.role;
    
    const roleHierarchy = {
      'viewer': 1,
      'operator': 2,
      'platform_admin': 3
    };
    
    if (roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
      req.user = decodedToken;
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
}

// Uso en rutas
router.post('/campaigns', 
  requireRole('operator'), 
  createCampaignHandler
);

router.post('/users', 
  requireRole('platform_admin'), 
  createUserHandler
);`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Auditoría de Acciones</h4>
              <CodeBlock language="go">
{`// Registrar todas las acciones importantes
type AuditLog struct {
    ID        uint      \`gorm:"primaryKey"\`
    UserID    string    \`gorm:"index"\`
    Email     string
    Action    string    \`gorm:"index"\`
    Resource  string
    Details   string
    IPAddress string
    CreatedAt time.Time \`gorm:"index"\`
}

func LogAction(userId, email, action, resource, details, ip string) {
    log := &AuditLog{
        UserID:    userId,
        Email:     email,
        Action:    action,
        Resource:  resource,
        Details:   details,
        IPAddress: ip,
        CreatedAt: time.Now(),
    }
    db.Create(log)
}

// Middleware de auditoría
func AuditMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        user := c.GetString("user_id")
        email := c.GetString("user_email")
        
        c.Next()
        
        // Después de ejecutar el handler
        if c.Request.Method != "GET" {
            LogAction(
                user,
                email,
                c.Request.Method,
                c.Request.URL.Path,
                fmt.Sprintf("Status: %d", c.Writer.Status()),
                c.ClientIP(),
            )
        }
    }
}`}
              </CodeBlock>
            </div>
          ),
        },
      },
      {
        id: 'configuracion-gophish',
        title: 'Configuración Avanzada de GoPhish',
        searchKeywords: ['configuracion', 'gophish', 'servidor', 'settings', 'admin'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                La configuración de GoPhish te permite personalizar cómo funciona el servidor, 
                las URLs de tracking, certificados SSL, etc.
              </p>

              <h4 className="font-semibold">Configuraciones Clave</h4>
              <div className="space-y-3">
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">🌐 Public URL</h5>
                  <p className="text-sm">
                    La URL pública donde está alojado GoPhish. Se usa en emails y landing pages.
                  </p>
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    Ejemplo: https://phishing.empresa.com
                  </div>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">🔒 SSL/TLS</h5>
                  <p className="text-sm">
                    Certificados para HTTPS. Requerido para que emails no sean marcados como spam.
                  </p>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">📧 Default From Address</h5>
                  <p className="text-sm">
                    Email por defecto que aparece como remitente si no se especifica en campaña.
                  </p>
                </Card>
              </div>

              <Warning title="Solo Administradores">
                Cambios en la configuración de GoPhish pueden afectar todas las campañas. 
                Solo Platform Admins deberían tener acceso.
              </Warning>
            </div>
          ),
        },
      },
    ],
  },
];
