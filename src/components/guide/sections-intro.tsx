import { GuideSection } from './types';
import { 
  BookOpen, 
  Settings, 
  LogIn,
  Shield,
  Users,
  Eye,
} from 'lucide-react';
import { InfoBox, Tip, Warning, StepByStep, CodeBlock } from './GuideSection';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export const introductionSections: GuideSection[] = [
  {
    id: 'introduccion',
    title: '1. Introducción y Bienvenida',
    icon: BookOpen,
    subsections: [
      {
        id: 'que-es',
        title: '¿Qué es esta plataforma?',
        searchKeywords: ['plataforma', 'introducción', 'bienvenida', 'que es', 'proposito'],
        content: {
          basico: (
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">
                Bienvenido a la <strong>Plataforma de Gestión de Campañas de Phishing Educativo UTEM</strong>.
              </p>
              <p>
                Esta herramienta está diseñada para ayudar a organizaciones y equipos de seguridad a 
                <strong> educar y entrenar a sus usuarios</strong> sobre los peligros del phishing mediante 
                simulaciones controladas y seguras.
              </p>
              
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Objetivo Principal
                </h4>
                <p className="text-sm">
                  Mejorar la concienciación sobre ciberseguridad mediante campañas de phishing simuladas 
                  que permiten identificar vulnerabilidades humanas y proporcionar capacitación dirigida.
                </p>
              </Card>

              <h4 className="font-semibold mt-6">¿Para quién es esta plataforma?</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Administradores de IT:</strong> Gestionar campañas de concienciación</li>
                <li><strong>Responsables de Seguridad:</strong> Medir y mejorar la postura de seguridad</li>
                <li><strong>Equipos de RRHH:</strong> Capacitar empleados en buenas prácticas</li>
                <li><strong>Auditores:</strong> Evaluar el nivel de riesgo humano</li>
              </ul>

              <Tip title="Consejo">
                Esta guía está diseñada para usuarios de todos los niveles técnicos. 
                Usa el selector de nivel (arriba) para ver contenido adaptado a tu experiencia.
              </Tip>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">
                La plataforma integra <strong>GoPhish</strong> (framework open-source líder en simulación de phishing) 
                con una interfaz moderna y funcionalidades avanzadas de análisis con IA.
              </p>

              <h4 className="font-semibold">Arquitectura del Sistema</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">Frontend</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• React 18 + TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Radix UI componentes</li>
                    <li>• Recharts para gráficas</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">Backend</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Go (Golang)</li>
                    <li>• Gin framework</li>
                    <li>• PostgreSQL / MySQL</li>
                    <li>• API REST</li>
                  </ul>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">Características Principales</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded">
                  <Badge className="mt-0.5">Multi-tenant</Badge>
                  <p className="text-sm">Gestiona múltiples configuraciones de GoPhish desde una sola interfaz</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded">
                  <Badge className="mt-0.5">Roles</Badge>
                  <p className="text-sm">Sistema granular de permisos: Viewer, Operator, Platform Admin</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded">
                  <Badge className="mt-0.5">IA</Badge>
                  <p className="text-sm">Análisis inteligente de phishing con Groq AI</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded">
                  <Badge className="mt-0.5">Responsive</Badge>
                  <p className="text-sm">Optimizado para desktop, tablet y móvil</p>
                </div>
              </div>

              <InfoBox title="Autenticación">
                El sistema usa <strong>Firebase Authentication</strong> para gestionar usuarios y sesiones.
                Los roles se asignan mediante custom claims en Firebase.
              </InfoBox>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">Arquitectura Técnica Completa</h4>
              <CodeBlock language="plaintext">
{`┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  React   │──│Tailwind  │──│  Radix   │──│ Recharts │   │
│  │   +TS    │  │   CSS    │  │    UI    │  │  Charts  │   │
│  └────┬─────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │ API Calls (Fetch)                                   │
└───────┼─────────────────────────────────────────────────────┘
        │
┌───────▼─────────────────────────────────────────────────────┐
│                     BACKEND (Go)                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Gin    │──│  GORM    │──│Firebase  │──│  Groq    │   │
│  │Framework │  │   ORM    │  │  Admin   │  │   API    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────────┘   │
│       │             │              │                         │
└───────┼─────────────┼──────────────┼─────────────────────────┘
        │             │              │
┌───────▼─────┐ ┌─────▼─────┐ ┌─────▼────────┐
│  GoPhish    │ │PostgreSQL │ │  Firebase    │
│   Server    │ │  Database │ │  Auth Users  │
└─────────────┘ └───────────┘ └──────────────┘`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Stack Tecnológico Detallado</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-3 border-b pb-2">Frontend</h5>
                  <ul className="text-xs space-y-1.5">
                    <li><strong>Build:</strong> Vite 6.x</li>
                    <li><strong>Framework:</strong> React 18</li>
                    <li><strong>Language:</strong> TypeScript 5</li>
                    <li><strong>Styling:</strong> Tailwind CSS 4</li>
                    <li><strong>Components:</strong> Radix UI</li>
                    <li><strong>Icons:</strong> Lucide React</li>
                    <li><strong>Charts:</strong> Recharts</li>
                    <li><strong>Editor:</strong> CKEditor 5</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-3 border-b pb-2">Backend</h5>
                  <ul className="text-xs space-y-1.5">
                    <li><strong>Language:</strong> Go 1.24+</li>
                    <li><strong>Framework:</strong> Gin</li>
                    <li><strong>ORM:</strong> GORM</li>
                    <li><strong>DB:</strong> PostgreSQL/MySQL</li>
                    <li><strong>Migrations:</strong> golang-migrate</li>
                    <li><strong>Auth:</strong> Firebase Admin SDK</li>
                    <li><strong>AI:</strong> Groq Cloud API</li>
                    <li><strong>Docs:</strong> Swagger/OpenAPI</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-3 border-b pb-2">Infraestructura</h5>
                  <ul className="text-xs space-y-1.5">
                    <li><strong>Auth:</strong> Firebase Auth</li>
                    <li><strong>Storage:</strong> Firestore (opcional)</li>
                    <li><strong>Phishing:</strong> GoPhish OSS</li>
                    <li><strong>SMTP:</strong> Configurable</li>
                    <li><strong>API:</strong> RESTful</li>
                    <li><strong>CORS:</strong> Configurado</li>
                    <li><strong>SSL:</strong> Recomendado</li>
                  </ul>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">Endpoints API Principales</h4>
              <CodeBlock language="bash">
{`# Autenticación
POST /api/v1/auth/login
POST /api/v1/auth/refresh

# Configuraciones GoPhish
GET    /api/v1/gophish
POST   /api/v1/gophish
PUT    /api/v1/gophish/:id
DELETE /api/v1/gophish/:id
POST   /api/v1/gophish/:id/test

# Campañas
GET    /api/v1/gophish/:config_id/campaigns
POST   /api/v1/gophish/:config_id/campaigns
GET    /api/v1/gophish/:config_id/campaigns/:id
DELETE /api/v1/gophish/:config_id/campaigns/:id

# Grupos
GET    /api/v1/gophish/:config_id/groups
POST   /api/v1/gophish/:config_id/groups
PUT    /api/v1/gophish/:config_id/groups/:id

# Plantillas
GET    /api/v1/gophish/:config_id/templates
POST   /api/v1/gophish/:config_id/templates
POST   /api/v1/gophish/:config_id/templates/import-email/preview

# Landing Pages
GET    /api/v1/gophish/:config_id/landing-pages
POST   /api/v1/gophish/:config_id/landing-pages
POST   /api/v1/gophish/:config_id/landing-pages/import-site/preview

# Seguridad
POST   /api/v1/security/analyze-url
POST   /api/v1/security/ai-detect

# Usuarios (Admin)
GET    /api/v1/users
POST   /api/v1/users
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id`}
              </CodeBlock>

              <Warning title="Seguridad">
                Todos los endpoints (excepto auth) requieren un token JWT válido en el header 
                <code className="mx-1 px-1 bg-muted rounded">Authorization: Bearer [token]</code>. 
                Los tokens se obtienen mediante Firebase Authentication.
              </Warning>
            </div>
          ),
        },
      },
      {
        id: 'conceptos-phishing',
        title: 'Conceptos Básicos de Phishing',
        searchKeywords: ['phishing', 'spear phishing', 'whaling', 'conceptos', 'definicion'],
        content: {
          basico: (
            <div className="space-y-4">
              <h4 className="font-semibold">¿Qué es el Phishing?</h4>
              <p>
                El <strong>phishing</strong> es un tipo de ataque cibernético donde los delincuentes intentan 
                engañar a las personas para que revelen información confidencial (contraseñas, datos bancarios, etc.) 
                haciéndose pasar por entidades legítimas.
              </p>

              <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200">
                <h5 className="font-semibold text-sm mb-2">Características Comunes del Phishing</h5>
                <ul className="text-sm space-y-1">
                  <li>✉️ Correos electrónicos que parecen oficiales</li>
                  <li>⚠️ Sentido de urgencia ("¡Actúa ahora!")</li>
                  <li>🔗 Enlaces a sitios web falsos</li>
                  <li>📎 Archivos adjuntos maliciosos</li>
                  <li>🎭 Suplantación de identidad (bancos, empresas)</li>
                </ul>
              </Card>

              <h4 className="font-semibold mt-6">Tipos de Phishing</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-semibold text-sm">📧 Phishing Genérico</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ataques masivos enviados a miles de personas sin personalización.
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-semibold text-sm">🎯 Spear Phishing</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ataques dirigidos a personas o empresas específicas con información personalizada.
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-semibold text-sm">🐋 Whaling</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ataques dirigidos a ejecutivos de alto nivel (CEOs, directores).
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-semibold text-sm">💬 Smishing / Vishing</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Phishing mediante SMS (smishing) o llamadas telefónicas (vishing).
                  </p>
                </div>
              </div>

              <InfoBox title="¿Por qué simular phishing?">
                Las simulaciones de phishing educativo permiten:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Identificar usuarios vulnerables</li>
                  <li>Medir el nivel de concienciación</li>
                  <li>Proporcionar capacitación dirigida</li>
                  <li>Mejorar las políticas de seguridad</li>
                </ul>
              </InfoBox>
            </div>
          ),
        },
      },
      {
        id: 'estructura-guia',
        title: 'Estructura de esta Guía',
        searchKeywords: ['estructura', 'navegacion', 'como usar', 'indice'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                Esta guía está organizada en <strong>11 secciones principales</strong> más <strong>5 anexos</strong> 
                con recursos adicionales. Cada sección cubre un aspecto específico de la plataforma.
              </p>

              <h4 className="font-semibold">Cómo Navegar</h4>
              <StepByStep steps={[
                {
                  title: 'Usa el menú lateral',
                  content: <p>Haz clic en cualquier sección o subsección para navegar directamente.</p>
                },
                {
                  title: 'Busca contenido',
                  content: <p>Usa el buscador en la parte superior para encontrar temas específicos.</p>
                },
                {
                  title: 'Selecciona tu nivel',
                  content: <p>Cambia entre <Badge>Básico</Badge>, <Badge>Intermedio</Badge> y <Badge>Avanzado</Badge> según tu experiencia.</p>
                },
                {
                  title: 'Navega secuencialmente',
                  content: <p>Usa los botones "Anterior" y "Siguiente" al final de cada sección.</p>
                },
              ]} />

              <h4 className="font-semibold mt-6">Secciones de la Guía</h4>
              <div className="grid gap-2">
                {[
                  { num: '1', title: 'Introducción y Bienvenida', desc: 'Conceptos básicos y visión general' },
                  { num: '2', title: 'Primeros Pasos', desc: 'Acceso, roles y navegación' },
                  { num: '3', title: 'Configuración de Cuenta', desc: 'Conectar con GoPhish' },
                  { num: '4', title: 'Dashboard', desc: 'Métricas y estadísticas' },
                  { num: '5', title: 'Usuarios y Grupos', desc: 'Gestionar objetivos de campaña' },
                  { num: '6', title: 'Plantillas de Email', desc: 'Crear correos de phishing' },
                  { num: '7', title: 'Páginas de Destino', desc: 'Landing pages personalizadas' },
                  { num: '8', title: 'Perfiles de Envío', desc: 'Configuración SMTP' },
                  { num: '9', title: 'Crear Campañas', desc: 'Flujo completo de campaña' },
                  { num: '10', title: 'Herramientas de Seguridad', desc: 'Detección de URL y IA' },
                  { num: '11', title: 'Gestión de Usuarios', desc: 'Administración (solo Admin)' },
                ].map((section) => (
                  <div key={section.num} className="flex gap-3 p-2 hover:bg-muted/50 rounded">
                    <Badge variant="outline" className="h-fit">{section.num}</Badge>
                    <div>
                      <div className="font-medium text-sm">{section.title}</div>
                      <div className="text-xs text-muted-foreground">{section.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Tip title="Recomendación">
                Si eres nuevo en la plataforma, te sugerimos leer las secciones 1-3 primero para 
                familiarizarte con los conceptos básicos antes de crear tu primera campaña.
              </Tip>
            </div>
          ),
        },
      },
    ],
  },
];
