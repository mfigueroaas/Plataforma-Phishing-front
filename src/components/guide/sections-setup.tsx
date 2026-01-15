import { GuideSection } from './types';
import { LogIn, Settings, Shield, Users as UsersIcon, Eye, Key } from 'lucide-react';
import { InfoBox, Tip, Warning, StepByStep, CodeBlock } from './GuideSection';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export const setupSections: GuideSection[] = [
  {
    id: 'primeros-pasos',
    title: '2. Primeros Pasos',
    icon: LogIn,
    subsections: [
      {
        id: 'acceso-login',
        title: 'Acceso y Login',
        searchKeywords: ['login', 'acceso', 'iniciar sesion', 'autenticacion', 'firebase'],
        content: {
          basico: (
            <div className="space-y-4">
              <h4 className="font-semibold">Acceder a la Plataforma</h4>
              <p>
                Para usar la plataforma necesitas una cuenta creada por un administrador. 
                El sistema usa <strong>autenticación segura mediante Firebase</strong>.
              </p>

              <StepByStep 
                title="Pasos para Iniciar Sesión"
                steps={[
                  {
                    title: 'Abre la aplicación',
                    content: <p>Navega a la URL de la plataforma proporcionada por tu organización.</p>
                  },
                  {
                    title: 'Ingresa tus credenciales',
                    content: (
                      <div>
                        <p>Introduce:</p>
                        <ul className="list-disc list-inside mt-2">
                          <li>Tu correo electrónico</li>
                          <li>Tu contraseña</li>
                        </ul>
                      </div>
                    )
                  },
                  {
                    title: 'Haz clic en "Iniciar Sesión"',
                    content: <p>Si las credenciales son correctas, serás redirigido al Dashboard.</p>
                  },
                ]} 
              />

              <Warning title="¿Olvidaste tu contraseña?">
                Usa la opción "¿Olvidaste tu contraseña?" en la pantalla de login. 
                Recibirás un correo para restablecerla. Si no recibes el correo, contacta a tu administrador.
              </Warning>

              <InfoBox title="Primera vez">
                Si es tu primer acceso, se te pedirá que cambies tu contraseña temporal 
                y completes tu perfil.
              </InfoBox>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <p>
                El sistema usa <strong>Firebase Authentication</strong> con autenticación de email/contraseña. 
                Las sesiones se mantienen mediante tokens JWT que expiran después de 1 hora.
              </p>

              <h4 className="font-semibold">Proceso de Autenticación</h4>
              <Card className="p-4 bg-muted/50">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Usuario ingresa email y contraseña</li>
                  <li>Frontend envía credenciales a Firebase Auth</li>
                  <li>Firebase valida y retorna un ID Token (JWT)</li>
                  <li>Frontend envía el token al backend en cada petición</li>
                  <li>Backend verifica el token y obtiene el UID del usuario</li>
                  <li>Backend consulta la BD para obtener rol y permisos</li>
                  <li>Se autoriza o rechaza la operación según el rol</li>
                </ol>
              </Card>

              <h4 className="font-semibold mt-6">Gestión de Sesiones</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Duración del token:</strong> 1 hora</li>
                <li><strong>Refresh automático:</strong> Sí, si la ventana está activa</li>
                <li><strong>Sesión persistente:</strong> Opcional (checkbox "Recuérdame")</li>
                <li><strong>Cierre de sesión:</strong> Invalida el token inmediatamente</li>
              </ul>

              <Tip title="Seguridad">
                Los tokens se almacenan en memoria (sessionStorage) y se limpian al cerrar la pestaña. 
                Nunca compartas tu token con nadie.
              </Tip>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">Arquitectura de Autenticación</h4>
              <CodeBlock language="typescript">
{`// Frontend: AuthContext.tsx
const { user } = useAuth();

// Flujo de login
const login = async (email: string, password: string) => {
  // 1. Autenticar con Firebase
  const userCredential = await signInWithEmailAndPassword(
    auth, 
    email, 
    password
  );
  
  // 2. Obtener ID Token
  const token = await userCredential.user.getIdToken();
  
  // 3. Enviar token al backend para obtener datos completos
  const response = await fetch('/api/v1/users/me', {
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });
  
  const userData = await response.json();
  setUser(userData);
};`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Backend: Verificación de Token</h4>
              <CodeBlock language="go">
{`// middleware/firebase.go
func (fb *FirebaseAuth) VerifyToken(c *gin.Context) {
    // 1. Extraer token del header Authorization
    authHeader := c.GetHeader("Authorization")
    token := strings.TrimPrefix(authHeader, "Bearer ")
    
    // 2. Verificar con Firebase Admin SDK
    decodedToken, err := fb.client.VerifyIDToken(
        c.Request.Context(), 
        token
    )
    if err != nil {
        c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token"})
        return
    }
    
    // 3. Obtener UID del usuario
    uid := decodedToken.UID
    
    // 4. Consultar datos del usuario en BD
    user := repository.GetUserByUID(uid)
    
    // 5. Guardar en contexto para usar en handlers
    c.Set("user", user)
    c.Next()
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Custom Claims (Roles)</h4>
              <p className="text-sm">
                Los roles se asignan mediante Firebase Custom Claims, que se incluyen en el JWT:
              </p>
              <CodeBlock language="json">
{`{
  "iss": "https://securetoken.google.com/proyecto-id",
  "aud": "proyecto-id",
  "auth_time": 1704841200,
  "user_id": "abc123def456",
  "sub": "abc123def456",
  "iat": 1704841200,
  "exp": 1704844800,
  "email": "admin@empresa.com",
  "email_verified": true,
  "role": "platform_admin",  // ← Custom Claim
  "department": "IT"
}`}
              </CodeBlock>

              <Warning title="Seguridad Crítica">
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Nunca almacenes tokens en localStorage (vulnerable a XSS)</li>
                  <li>Usa HTTPS obligatorio en producción</li>
                  <li>Implementa rate limiting en endpoints de login</li>
                  <li>Habilita MFA (Multi-Factor Authentication) para admins</li>
                  <li>Registra todos los intentos de login fallidos</li>
                </ul>
              </Warning>
            </div>
          ),
        },
      },
      {
        id: 'roles-permisos',
        title: 'Roles y Permisos',
        searchKeywords: ['roles', 'permisos', 'viewer', 'operator', 'admin', 'privilegios'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                La plataforma tiene <strong>3 niveles de acceso</strong> que determinan qué 
                acciones puedes realizar:
              </p>

              <div className="space-y-3">
                <Card className="p-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-blue-100">Viewer</Badge>
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <h5 className="font-semibold text-sm mb-2">Visor (Solo Lectura)</h5>
                  <p className="text-sm">
                    Puede ver campañas, resultados y configuraciones, pero <strong>no puede crear ni modificar</strong> nada.
                  </p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>✅ Ver dashboard y estadísticas</li>
                    <li>✅ Ver campañas activas</li>
                    <li>✅ Ver resultados de campañas</li>
                    <li>❌ Crear campañas</li>
                    <li>❌ Modificar configuraciones</li>
                  </ul>
                </Card>

                <Card className="p-4 border-green-200 bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-green-100">Operator</Badge>
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <h5 className="font-semibold text-sm mb-2">Operador</h5>
                  <p className="text-sm">
                    Puede <strong>crear y gestionar campañas</strong>, plantillas, grupos y perfiles de envío.
                  </p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>✅ Todo lo que puede Viewer</li>
                    <li>✅ Crear campañas</li>
                    <li>✅ Crear/editar plantillas y landing pages</li>
                    <li>✅ Gestionar grupos de usuarios</li>
                    <li>✅ Configurar perfiles SMTP</li>
                    <li>❌ Gestionar usuarios de la plataforma</li>
                  </ul>
                </Card>

                <Card className="p-4 border-purple-200 bg-purple-50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-purple-100">Platform Admin</Badge>
                    <Key className="w-4 h-4 text-purple-600" />
                  </div>
                  <h5 className="font-semibold text-sm mb-2">Administrador de Plataforma</h5>
                  <p className="text-sm">
                    <strong>Acceso total</strong> a todas las funcionalidades, incluyendo gestión de usuarios.
                  </p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>✅ Todo lo que puede Operator</li>
                    <li>✅ Crear/editar/eliminar usuarios</li>
                    <li>✅ Asignar roles</li>
                    <li>✅ Ver logs de auditoría</li>
                    <li>✅ Gestionar configuraciones de GoPhish</li>
                  </ul>
                </Card>
              </div>

              <InfoBox title="¿Qué rol tengo?">
                Puedes ver tu rol en la esquina superior derecha, al hacer clic en tu avatar. 
                Si necesitas más permisos, contacta a tu administrador.
              </InfoBox>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <h4 className="font-semibold">Matriz de Permisos Detallada</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left border">Acción</th>
                      <th className="p-2 text-center border">Viewer</th>
                      <th className="p-2 text-center border">Operator</th>
                      <th className="p-2 text-center border">Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Ver Dashboard', '✅', '✅', '✅'],
                      ['Ver Campañas', '✅', '✅', '✅'],
                      ['Crear Campañas', '❌', '✅', '✅'],
                      ['Eliminar Campañas', '❌', '✅', '✅'],
                      ['Ver Grupos', '✅', '✅', '✅'],
                      ['Crear/Editar Grupos', '❌', '✅', '✅'],
                      ['Ver Plantillas', '✅', '✅', '✅'],
                      ['Crear/Editar Plantillas', '❌', '✅', '✅'],
                      ['Ver Landing Pages', '✅', '✅', '✅'],
                      ['Crear/Editar Landing Pages', '❌', '✅', '✅'],
                      ['Ver Perfiles SMTP', '✅', '✅', '✅'],
                      ['Crear/Editar SMTP', '❌', '✅', '✅'],
                      ['Ver Configs GoPhish', '✅', '✅', '✅'],
                      ['Crear/Editar Configs GoPhish', '❌', '❌', '✅'],
                      ['Gestionar Usuarios', '❌', '❌', '✅'],
                      ['Asignar Roles', '❌', '❌', '✅'],
                      ['Ver Logs de Auditoría', '❌', '❌', '✅'],
                    ].map((row, idx) => (
                      <tr key={idx} className="border-t hover:bg-muted/30">
                        <td className="p-2 border">{row[0]}</td>
                        <td className="p-2 text-center border">{row[1]}</td>
                        <td className="p-2 text-center border">{row[2]}</td>
                        <td className="p-2 text-center border">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="font-semibold mt-6">Implementación en el Frontend</h4>
              <p className="text-sm">
                El hook <code>usePermissions()</code> proporciona funciones para verificar permisos:
              </p>
              <CodeBlock language="typescript">
{`import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { 
    canCreateCampaigns, 
    canEditTemplates, 
    isAdmin 
  } = usePermissions();
  
  return (
    <div>
      {canCreateCampaigns && (
        <Button onClick={handleCreate}>Crear Campaña</Button>
      )}
      {isAdmin && (
        <Button onClick={handleManageUsers}>Usuarios</Button>
      )}
    </div>
  );
}`}
              </CodeBlock>

              <Tip title="Buena Práctica">
                Aunque el frontend oculta botones según permisos, <strong>el backend SIEMPRE valida</strong> 
                los permisos en cada request. Nunca confíes solo en validaciones del frontend.
              </Tip>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">Implementación de Middleware de Roles</h4>
              <CodeBlock language="go">
{`// middleware/roles.go
func RequireRole(minRole string) gin.HandlerFunc {
    return func(c *gin.Context) {
        user, exists := c.Get("user")
        if !exists {
            c.AbortWithStatusJSON(401, gin.H{
                "error": "Unauthorized"
            })
            return
        }
        
        currentUser := user.(*models.User)
        
        // Jerarquía de roles
        roleHierarchy := map[string]int{
            "viewer":         1,
            "operator":       2,
            "platform_admin": 3,
        }
        
        minRoleLevel := roleHierarchy[minRole]
        currentRoleLevel := roleHierarchy[currentUser.Role]
        
        if currentRoleLevel < minRoleLevel {
            c.AbortWithStatusJSON(403, gin.H{
                "error": "Insufficient permissions",
                "required_role": minRole,
                "current_role": currentUser.Role,
            })
            return
        }
        
        c.Next()
    }
}

// Uso en rutas
protected.POST(
    "/campaigns", 
    middleware.RequireRole("operator"), 
    api.CreateCampaign
)`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Modelo de Usuario en BD</h4>
              <CodeBlock language="sql">
{`CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(128) UNIQUE NOT NULL,  -- Firebase UID
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (
        role IN ('viewer', 'operator', 'platform_admin')
    ),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_uid ON users(uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Custom Claims en Firebase</h4>
              <CodeBlock language="go">
{`// Asignar custom claims cuando se crea un usuario
func SetUserRole(uid string, role string) error {
    ctx := context.Background()
    client, _ := app.Auth(ctx)
    
    claims := map[string]interface{}{
        "role": role,
        "department": "IT",
    }
    
    err := client.SetCustomUserClaims(ctx, uid, claims)
    return err
}`}
              </CodeBlock>

              <Warning title="Seguridad">
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>Los custom claims se cachean en el token por hasta 1 hora</li>
                  <li>Si cambias un rol, el usuario debe cerrar sesión y volver a iniciar</li>
                  <li>Valida SIEMPRE en el backend, nunca confíes solo en el frontend</li>
                  <li>Registra todos los cambios de roles en logs de auditoría</li>
                </ul>
              </Warning>
            </div>
          ),
        },
      },
    ],
  },
  
  // Sección 3: Configuración de Cuenta
  {
    id: 'configuracion',
    title: '3. Configuración de Cuenta',
    icon: Settings,
    subsections: [
      {
        id: 'que-es-gophish',
        title: '¿Qué es GoPhish?',
        searchKeywords: ['gophish', 'que es gophish', 'open source', 'phishing framework'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                <strong>GoPhish</strong> es un framework de código abierto diseñado específicamente 
                para realizar campañas de phishing educativo de forma profesional y controlada.
              </p>

              <Card className="p-4 bg-primary/5 border-primary/20">
                <h5 className="font-semibold mb-2">¿Por qué usamos GoPhish?</h5>
                <ul className="text-sm space-y-1">
                  <li>✅ Software gratuito y de código abierto</li>
                  <li>✅ Ampliamente usado por profesionales de seguridad</li>
                  <li>✅ Fácil de configurar y mantener</li>
                  <li>✅ Potente API para integraciones</li>
                  <li>✅ Tracking detallado de eventos</li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">¿Qué hace GoPhish?</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Envía correos de phishing simulados a usuarios objetivo</li>
                <li>Rastrea quién abre los correos</li>
                <li>Registra quién hace clic en los enlaces</li>
                <li>Captura credenciales enviadas (para medición, no uso real)</li>
                <li>Genera reportes detallados de resultados</li>
              </ul>

              <InfoBox title="Relación con esta plataforma">
                Nuestra plataforma actúa como una <strong>interfaz mejorada</strong> para GoPhish, 
                agregando funcionalidades como análisis con IA, múltiples configuraciones, 
                y una interfaz más amigable.
              </InfoBox>

              <Tip>
                No necesitas conocer GoPhish en profundidad. La plataforma se encarga de 
                toda la comunicación con el servidor GoPhish por ti.
              </Tip>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <p>
                GoPhish es un servidor independiente que se ejecuta en un servidor separado y 
                expone una <strong>API REST</strong> para gestionar campañas programáticamente.
              </p>

              <h4 className="font-semibold">Arquitectura GoPhish</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">Componentes Principales</h5>
                  <ul className="text-sm space-y-1">
                    <li><strong>Admin Server:</strong> Puerto 3333 (API + UI)</li>
                    <li><strong>Phish Server:</strong> Puerto 80/443 (landing pages)</li>
                    <li><strong>Base de datos:</strong> SQLite/MySQL/PostgreSQL</li>
                    <li><strong>SMTP:</strong> Envío de emails</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">Datos que Maneja</h5>
                  <ul className="text-sm space-y-1">
                    <li>Campaigns (campañas)</li>
                    <li>Email templates (plantillas)</li>
                    <li>Landing pages (páginas destino)</li>
                    <li>Groups (grupos de objetivos)</li>
                    <li>Sending profiles (configs SMTP)</li>
                    <li>Events (eventos de campaña)</li>
                  </ul>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">Flujo de Comunicación</h4>
              <CodeBlock>
{`Usuario → Frontend → Backend (Go) → GoPhish Server
                                      ↓
                                  Base de Datos
                                      ↓
                                  SMTP Server → Emails`}
              </CodeBlock>

              <Warning title="Importante">
                Cada organización puede tener <strong>múltiples servidores GoPhish</strong>. 
                Por eso necesitas crear una "Configuración" que apunte a cada servidor.
              </Warning>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">API de GoPhish</h4>
              <p className="text-sm">
                GoPhish expone una API RESTful completa. Nuestra plataforma actúa como proxy 
                y wrapper de esta API:
              </p>
              <CodeBlock language="bash">
{`# Endpoints principales de GoPhish API v0.12+

GET    /api/campaigns/                # Listar campañas
POST   /api/campaigns/                # Crear campaña
GET    /api/campaigns/:id             # Detalle de campaña
DELETE /api/campaigns/:id             # Eliminar campaña

GET    /api/groups/                   # Listar grupos
POST   /api/groups/                   # Crear grupo
GET    /api/groups/:id                # Detalle de grupo
PUT    /api/groups/:id                # Actualizar grupo

GET    /api/templates/                # Listar plantillas
POST   /api/templates/                # Crear plantilla
POST   /api/import/email              # Importar desde email RAW

GET    /api/pages/                    # Listar landing pages
POST   /api/pages/                    # Crear landing page
POST   /api/import/site               # Clonar sitio web

GET    /api/smtp/                     # Listar perfiles SMTP
POST   /api/smtp/                     # Crear perfil SMTP

# Autenticación: API Key en header
# Authorization: Bearer YOUR_API_KEY`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Modelo de Datos: Campaign</h4>
              <CodeBlock language="json">
{`{
  "id": 1,
  "name": "Q1 2024 Security Training",
  "created_date": "2024-01-15T10:00:00Z",
  "launch_date": "2024-01-20T09:00:00Z",
  "send_by_date": "2024-01-20T17:00:00Z",
  "completed_date": null,
  "template": {
    "id": 5,
    "name": "Actualización de Seguridad"
  },
  "page": {
    "id": 3,
    "name": "Microsoft Login Clone"
  },
  "smtp": {
    "id": 2,
    "name": "Gmail SMTP"
  },
  "url": "https://phishing.empresa.com",
  "groups": [
    {
      "id": 10,
      "name": "Departamento de Ventas"
    }
  ],
  "results": [
    {
      "id": "abc123",
      "email": "usuario@empresa.com",
      "status": "Email Sent",
      "ip": "192.168.1.100",
      "latitude": 0,
      "longitude": 0
    }
  ],
  "timeline": [
    {
      "email": "usuario@empresa.com",
      "time": "2024-01-20T09:05:23Z",
      "message": "Email Sent"
    },
    {
      "email": "usuario@empresa.com",
      "time": "2024-01-20T09:15:10Z",
      "message": "Email Opened"
    },
    {
      "email": "usuario@empresa.com",
      "time": "2024-01-20T09:16:45Z",
      "message": "Clicked Link"
    },
    {
      "email": "usuario@empresa.com",
      "time": "2024-01-20T09:17:30Z",
      "message": "Submitted Data",
      "details": {
        "username": "usuario@empresa.com",
        "password": "[CAPTURED]"
      }
    }
  ],
  "status": "In progress"
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Instalación de GoPhish (Referencia)</h4>
              <CodeBlock language="bash">
{`# Descargar GoPhish
wget https://github.com/gophish/gophish/releases/download/v0.12.1/gophish-v0.12.1-linux-64bit.zip

# Descomprimir
unzip gophish-v0.12.1-linux-64bit.zip
cd gophish

# Editar config.json
nano config.json
# Cambiar:
# - admin_server.listen_url a 0.0.0.0:3333
# - phish_server.listen_url a 0.0.0.0:80

# Ejecutar
chmod +x gophish
./gophish

# Primera ejecución genera contraseña temporal en consola
# Cambiar en https://IP:3333`}
              </CodeBlock>

              <Warning title="Seguridad en Producción">
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>Usa HTTPS con certificados válidos</li>
                  <li>Configura un reverse proxy (nginx)</li>
                  <li>Restringe acceso a la API con firewall</li>
                  <li>Cambia la API key por defecto</li>
                  <li>Usa base de datos externa (no SQLite)</li>
                  <li>Implementa backups automáticos</li>
                </ul>
              </Warning>
            </div>
          ),
        },
      },
    ],
  },
];
