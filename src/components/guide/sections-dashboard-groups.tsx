import { GuideSection } from './types';
import { LayoutDashboard, Users, TrendingUp, Target, BarChart3, FileSpreadsheet } from 'lucide-react';
import { InfoBox, Tip, Warning, StepByStep, CodeBlock } from './GuideSection';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export const dashboardGroupsSections: GuideSection[] = [
  {
    id: 'dashboard',
    title: '4. Dashboard - Panel de Control',
    icon: LayoutDashboard,
    subsections: [
      {
        id: 'metricas-principales',
        title: 'Métricas Principales',
        searchKeywords: ['dashboard', 'metricas', 'kpi', 'estadisticas', 'panel'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                El <strong>Dashboard</strong> es la primera pantalla que ves al ingresar a la plataforma. 
                Muestra un resumen visual de tus campañas y su efectividad.
              </p>

              <h4 className="font-semibold">Métricas Clave (KPIs)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-primary" />
                    <h5 className="font-semibold text-sm">Campañas Activas</h5>
                  </div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Campañas en ejecución en este momento
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h5 className="font-semibold text-sm">Usuarios Objetivo</h5>
                  </div>
                  <p className="text-2xl font-bold">1,234</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total de usuarios incluidos en campañas
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                    <h5 className="font-semibold text-sm">Tasa de Clics</h5>
                  </div>
                  <p className="text-2xl font-bold">23%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Porcentaje de usuarios que hicieron clic
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <h5 className="font-semibold text-sm">Tasa de Envío de Datos</h5>
                  </div>
                  <p className="text-2xl font-bold">8%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Usuarios que enviaron credenciales
                  </p>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">¿Qué Significan Estas Métricas?</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Tasa de Clics Alta (&gt;15%):</strong> Indica que muchos usuarios caen en el phishing. 
                  Se necesita más capacitación.
                </li>
                <li>
                  <strong>Tasa de Envío de Datos (&gt;5%):</strong> Crítico. Usuarios están compartiendo credenciales. 
                  Requiere acción inmediata.
                </li>
                <li>
                  <strong>Campañas Activas:</strong> Mantén un balance. No sobrecargues a los usuarios con muchas campañas simultáneas.
                </li>
              </ul>

              <Tip title="Mejora Continua">
                Una buena estrategia es ejecutar campañas trimestrales y medir la mejora. 
                La tasa de clics debería disminuir con cada campaña.
              </Tip>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <p>
                El Dashboard consume datos en tiempo real desde el backend mediante polling cada 30 segundos. 
                Usa <strong>Recharts</strong> para visualizaciones y caché con SessionStorage para performance.
              </p>

              <h4 className="font-semibold">KPIs Calculados</h4>
              <div className="space-y-3">
                <Card className="p-4 bg-muted/50">
                  <h5 className="font-semibold text-sm mb-2">Fórmulas de Cálculo</h5>
                  <div className="space-y-2 text-sm font-mono">
                    <div>
                      <strong>Click Rate:</strong> (Usuarios que hicieron clic / Emails enviados) × 100
                    </div>
                    <div>
                      <strong>Open Rate:</strong> (Emails abiertos / Emails enviados) × 100
                    </div>
                    <div>
                      <strong>Submit Rate:</strong> (Datos enviados / Emails enviados) × 100
                    </div>
                    <div>
                      <strong>Success Rate:</strong> 100 - Click Rate (menor es mejor)
                    </div>
                  </div>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">Componentes del Dashboard</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>KPI Cards:</strong> 4 tarjetas con métricas principales</li>
                <li><strong>Gráfica de Tendencia:</strong> Line chart de campañas en el tiempo</li>
                <li><strong>Distribución por Estado:</strong> Pie chart de eventos (Enviado, Abierto, Clic, Datos)</li>
                <li><strong>Top Campañas:</strong> Tabla con las 5 campañas más recientes</li>
                <li><strong>Alertas:</strong> Notificaciones de campañas con alta tasa de compromiso</li>
              </ul>

              <h4 className="font-semibold mt-6">Optimización de Performance</h4>
              <CodeBlock language="typescript">
{`// Dashboard.tsx
const [stats, setStats] = useState<DashboardStats | null>(() => {
  // Cargar desde caché al montar
  const cached = sessionStorage.getItem('dashboard_stats');
  return cached ? JSON.parse(cached) : null;
});

useEffect(() => {
  const fetchStats = async () => {
    const data = await apiDashboard.getStats();
    setStats(data);
    sessionStorage.setItem('dashboard_stats', JSON.stringify(data));
  };
  
  fetchStats();
  
  // Polling cada 30 segundos
  const interval = setInterval(fetchStats, 30000);
  return () => clearInterval(interval);
}, []);`}
              </CodeBlock>

              <InfoBox title="Caché Inteligente">
                El dashboard usa una estrategia <strong>stale-while-revalidate</strong>: 
                muestra datos cacheados inmediatamente mientras carga datos frescos en segundo plano.
              </InfoBox>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">Arquitectura de Agregación de Datos</h4>
              <CodeBlock language="go">
{`// Backend: api/dashboard.go
type DashboardStats struct {
    ActiveCampaigns    int             \`json:"active_campaigns"\`
    TotalTargets       int             \`json:"total_targets"\`
    OverallClickRate   float64         \`json:"overall_click_rate"\`
    OverallSubmitRate  float64         \`json:"overall_submit_rate"\`
    RecentCampaigns    []CampaignSummary \`json:"recent_campaigns"\`
    TrendData          []TrendPoint    \`json:"trend_data"\`
    EventDistribution  EventStats      \`json:"event_distribution"\`
}

func GetDashboardStats(configID int) (*DashboardStats, error) {
    // 1. Obtener campañas activas
    activeCampaigns := repository.CountActiveCampaigns(configID)
    
    // 2. Agregar eventos de todas las campañas
    events := repository.GetAllCampaignEvents(configID)
    
    // 3. Calcular métricas
    totalSent := countEventsByType(events, "Email Sent")
    totalClicked := countEventsByType(events, "Clicked Link")
    totalSubmitted := countEventsByType(events, "Submitted Data")
    
    clickRate := float64(totalClicked) / float64(totalSent) * 100
    submitRate := float64(totalSubmitted) / float64(totalSent) * 100
    
    // 4. Generar datos de tendencia (últimos 30 días)
    trendData := generateTrendData(events, 30)
    
    return &DashboardStats{
        ActiveCampaigns:   activeCampaigns,
        TotalTargets:      countUniqueTargets(events),
        OverallClickRate:  clickRate,
        OverallSubmitRate: submitRate,
        RecentCampaigns:   getRecentCampaigns(configID, 5),
        TrendData:         trendData,
        EventDistribution: calculateEventDistribution(events),
    }, nil
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Query SQL Optimizado</h4>
              <CodeBlock language="sql">
{`-- Obtener estadísticas agregadas en una sola query
WITH campaign_stats AS (
    SELECT 
        c.id,
        c.name,
        c.status,
        COUNT(DISTINCT ce.email) as total_targets,
        SUM(CASE WHEN ce.message = 'Email Sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN ce.message = 'Email Opened' THEN 1 ELSE 0 END) as opened,
        SUM(CASE WHEN ce.message = 'Clicked Link' THEN 1 ELSE 0 END) as clicked,
        SUM(CASE WHEN ce.message = 'Submitted Data' THEN 1 ELSE 0 END) as submitted
    FROM campaigns c
    LEFT JOIN campaign_events ce ON c.id = ce.campaign_id
    WHERE c.config_id = $1
    GROUP BY c.id, c.name, c.status
)
SELECT 
    COUNT(CASE WHEN status = 'In progress' THEN 1 END) as active_campaigns,
    SUM(total_targets) as total_targets,
    (SUM(clicked)::float / NULLIF(SUM(sent), 0) * 100) as click_rate,
    (SUM(submitted)::float / NULLIF(SUM(sent), 0) * 100) as submit_rate
FROM campaign_stats;`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Caché en Redis (Opcional)</h4>
              <CodeBlock language="go">
{`// Para instalaciones de alta carga
func GetDashboardStatsWithCache(configID int) (*DashboardStats, error) {
    cacheKey := fmt.Sprintf("dashboard:stats:%d", configID)
    
    // Intentar obtener de Redis
    cached, err := redisClient.Get(ctx, cacheKey).Result()
    if err == nil {
        var stats DashboardStats
        json.Unmarshal([]byte(cached), &stats)
        return &stats, nil
    }
    
    // Si no hay caché, calcular
    stats := calculateDashboardStats(configID)
    
    // Guardar en caché por 30 segundos
    data, _ := json.Marshal(stats)
    redisClient.Set(ctx, cacheKey, data, 30*time.Second)
    
    return stats, nil
}`}
              </CodeBlock>

              <Warning title="Performance en Producción">
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>Usa índices en columnas de fecha y config_id</li>
                  <li>Considera materializar vistas para estadísticas históricas</li>
                  <li>Implementa paginación en tablas de campañas recientes</li>
                  <li>Usa WebSockets para actualizaciones en tiempo real</li>
                </ul>
              </Warning>
            </div>
          ),
        },
      },
      {
        id: 'graficas-interpretacion',
        title: 'Gráficas e Interpretación',
        searchKeywords: ['graficas', 'charts', 'interpretacion', 'analisis', 'visualizacion'],
        content: {
          basico: (
            <div className="space-y-4">
              <h4 className="font-semibold">Tipos de Gráficas en el Dashboard</h4>
              
              <div className="space-y-4">
                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">📈 Gráfica de Tendencia</h5>
                  <p className="text-sm">
                    Muestra cómo ha evolucionado la tasa de clics a lo largo del tiempo. 
                    <strong> Ideal para ver si tus usuarios están mejorando.</strong>
                  </p>
                  <div className="mt-3 p-3 bg-muted rounded text-xs">
                    <strong>Cómo Interpretarla:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Línea descendente = ✅ Mejora (menos usuarios caen)</li>
                      <li>Línea ascendente = ⚠️ Empeoramiento (más usuarios vulnerables)</li>
                      <li>Línea plana = 🔄 Sin cambios (necesita nueva estrategia)</li>
                    </ul>
                  </div>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">🥧 Gráfica de Distribución</h5>
                  <p className="text-sm">
                    Muestra la proporción de eventos: cuántos emails se enviaron, abrieron, 
                    cuántos hicieron clic y cuántos enviaron datos.
                  </p>
                  <div className="mt-3 p-3 bg-muted rounded text-xs">
                    <strong>Ejemplo de Lectura:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Enviados: 100 (100%)</li>
                      <li>Abiertos: 60 (60%)</li>
                      <li>Clics: 23 (23%)</li>
                      <li>Datos enviados: 8 (8%)</li>
                    </ul>
                  </div>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold text-sm mb-2">📊 Tabla de Campañas Recientes</h5>
                  <p className="text-sm">
                    Lista las últimas 5 campañas con sus estadísticas principales. 
                    Permite comparar rápidamente el rendimiento.
                  </p>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">¿Cómo Usar Esta Información?</h4>
              <StepByStep steps={[
                {
                  title: 'Revisa el Dashboard semanalmente',
                  content: <p>Establece un día fijo para revisar métricas y tendencias.</p>
                },
                {
                  title: 'Identifica departamentos vulnerables',
                  content: <p>Si un área tiene alta tasa de clics, enfoca la capacitación ahí.</p>
                },
                {
                  title: 'Documenta mejoras',
                  content: <p>Toma capturas de pantalla mensualmente para reportes.</p>
                },
                {
                  title: 'Ajusta estrategia',
                  content: <p>Si las métricas no mejoran, cambia el tipo de simulaciones.</p>
                },
              ]} />
            </div>
          ),
        },
      },
    ],
  },

  {
    id: 'grupos',
    title: '5. Usuarios y Grupos',
    icon: Users,
    subsections: [
      {
        id: 'que-es-grupo',
        title: '¿Qué es un Grupo de Objetivos?',
        searchKeywords: ['grupos', 'targets', 'usuarios', 'objetivos', 'destinatarios'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                Un <strong>grupo</strong> es una lista de usuarios (objetivos) a quienes 
                enviarás correos de phishing simulado. Cada grupo tiene:
              </p>

              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Nombre:</strong> Ej: "Departamento de Ventas"</li>
                <li><strong>Lista de usuarios:</strong> Cada uno con email, nombre, apellido, cargo</li>
              </ul>

              <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <h5 className="font-semibold text-sm mb-2">Ejemplo de Grupo</h5>
                <div className="text-sm">
                  <strong>Nombre:</strong> Marketing - Q1 2024<br/>
                  <strong>Usuarios:</strong>
                  <ul className="list-none mt-2 space-y-1 ml-4">
                    <li>• Juan Pérez (juan.perez@empresa.com) - Marketing Manager</li>
                    <li>• María García (maria.garcia@empresa.com) - Content Writer</li>
                    <li>• Carlos López (carlos.lopez@empresa.com) - SEO Specialist</li>
                  </ul>
                </div>
              </Card>

              <h4 className="font-semibold mt-6">¿Por Qué Usar Grupos?</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Organizar usuarios por departamento, ubicación o rol</li>
                <li>Ejecutar campañas dirigidas a equipos específicos</li>
                <li>Medir qué áreas de la empresa son más vulnerables</li>
                <li>Reutilizar listas en múltiples campañas</li>
              </ul>

              <Tip title="Buena Práctica">
                Crea grupos pequeños (10-50 usuarios) para campañas piloto antes de 
                ejecutar campañas masivas en toda la organización.
              </Tip>

              <Warning title="Privacidad">
                Los datos de los usuarios solo se usan para simulaciones educativas. 
                Nunca compartas credenciales capturadas con terceros.
              </Warning>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <p>
                Los grupos se almacenan en GoPhish y se sincronizan con el backend de la plataforma. 
                Cada usuario en un grupo tiene los siguientes campos:
              </p>

              <h4 className="font-semibold">Estructura de un Target (Usuario)</h4>
              <CodeBlock language="json">
{`{
  "email": "usuario@empresa.com",
  "first_name": "Juan",
  "last_name": "Pérez",
  "position": "Marketing Manager"
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Variables Dinámicas en Emails</h4>
              <p className="text-sm">
                Los campos de cada usuario se pueden usar como variables en las plantillas de email:
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Card className="p-3">
                  <strong>Variable:</strong> <code>{'{{.FirstName}}'}</code><br/>
                  <strong>Resultado:</strong> Juan
                </Card>
                <Card className="p-3">
                  <strong>Variable:</strong> <code>{'{{.LastName}}'}</code><br/>
                  <strong>Resultado:</strong> Pérez
                </Card>
                <Card className="p-3">
                  <strong>Variable:</strong> <code>{'{{.Email}}'}</code><br/>
                  <strong>Resultado:</strong> usuario@empresa.com
                </Card>
                <Card className="p-3">
                  <strong>Variable:</strong> <code>{'{{.Position}}'}</code><br/>
                  <strong>Resultado:</strong> Marketing Manager
                </Card>
              </div>

              <InfoBox title="Tracking Individual">
                GoPhish genera una URL única por usuario que permite rastrear individualmente 
                quién abre el email, hace clic y envía datos.
              </InfoBox>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">Modelo de Datos: Group</h4>
              <CodeBlock language="typescript">
{`interface UserGroup {
  id: number;
  local_id: number;          // ID en la plataforma
  gophish_id: number;        // ID en GoPhish
  config_id: number;         // Config de GoPhish asociada
  name: string;
  modified_date: string;
  targets: Target[];
}

interface Target {
  email: string;
  first_name: string;
  last_name: string;
  position: string;
}`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">API de Grupos</h4>
              <CodeBlock language="bash">
{`# Listar grupos
GET /api/v1/gophish/:config_id/groups

# Crear grupo
POST /api/v1/gophish/:config_id/groups
{
  "name": "IT Department",
  "targets": [
    {
      "email": "admin@empresa.com",
      "first_name": "Admin",
      "last_name": "User",
      "position": "System Administrator"
    }
  ]
}

# Actualizar grupo
PUT /api/v1/gophish/:config_id/groups/:id

# Eliminar grupo
DELETE /api/v1/gophish/:config_id/groups/:id`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Validaciones en Backend</h4>
              <CodeBlock language="go">
{`func ValidateGroup(group *models.UserGroupCreate) error {
    if group.Name == "" {
        return errors.New("name is required")
    }
    
    if len(group.Targets) == 0 {
        return errors.New("at least one target is required")
    }
    
    // Validar emails únicos
    emailMap := make(map[string]bool)
    for _, target := range group.Targets {
        if emailMap[target.Email] {
            return fmt.Errorf("duplicate email: %s", target.Email)
        }
        emailMap[target.Email] = true
        
        // Validar formato de email
        if !isValidEmail(target.Email) {
            return fmt.Errorf("invalid email: %s", target.Email)
        }
    }
    
    return nil
}`}
              </CodeBlock>
            </div>
          ),
        },
      },
      {
        id: 'crear-grupo',
        title: 'Crear un Grupo',
        searchKeywords: ['crear grupo', 'nuevo grupo', 'agregar usuarios', 'targets'],
        content: {
          basico: (
            <div className="space-y-4">
              <p>
                Crear un grupo es sencillo. Puedes agregar usuarios manualmente uno por uno, 
                o importar una lista completa desde un archivo CSV.
              </p>

              <StepByStep 
                title="Crear Grupo Manualmente"
                steps={[
                  {
                    title: 'Ir a "Usuarios y Grupos"',
                    content: <p>En el menú lateral, haz clic en "Usuarios y Grupos".</p>
                  },
                  {
                    title: 'Hacer clic en "Nuevo Grupo"',
                    content: <p>Verás un botón verde en la parte superior derecha.</p>
                  },
                  {
                    title: 'Ingresar nombre del grupo',
                    content: (
                      <div>
                        <p>Elige un nombre descriptivo, por ejemplo:</p>
                        <ul className="list-disc list-inside mt-2 ml-4">
                          <li>"Ventas - Enero 2024"</li>
                          <li>"IT - Oficina Central"</li>
                          <li>"Gerentes - Todos"</li>
                        </ul>
                      </div>
                    )
                  },
                  {
                    title: 'Agregar usuarios',
                    content: (
                      <div>
                        <p>Para cada usuario, completa:</p>
                        <ul className="list-disc list-inside mt-2 ml-4">
                          <li><strong>Email:</strong> dirección de correo</li>
                          <li><strong>Nombre:</strong> primer nombre</li>
                          <li><strong>Apellido:</strong> apellido</li>
                          <li><strong>Cargo:</strong> posición en la empresa (opcional)</li>
                        </ul>
                      </div>
                    )
                  },
                  {
                    title: 'Guardar el grupo',
                    content: <p>Haz clic en "Guardar". El grupo estará listo para usarse en campañas.</p>
                  },
                ]} 
              />

              <InfoBox title="Editar Grupos">
                Puedes editar grupos existentes haciendo clic en el icono de lápiz. 
                Los cambios se aplicarán a campañas futuras, no a campañas ya enviadas.
              </InfoBox>
            </div>
          ),
          intermedio: (
            <div className="space-y-4">
              <h4 className="font-semibold">Importar Grupos desde CSV</h4>
              <p>
                Para agregar muchos usuarios rápidamente, usa la función de importación CSV. 
                El archivo debe tener el siguiente formato:
              </p>

              <CodeBlock language="csv">
{`email,first_name,last_name,position
juan.perez@empresa.com,Juan,Pérez,Marketing Manager
maria.garcia@empresa.com,María,García,Content Writer
carlos.lopez@empresa.com,Carlos,López,SEO Specialist
ana.martinez@empresa.com,Ana,Martínez,Social Media Manager`}
              </CodeBlock>

              <StepByStep 
                title="Pasos para Importar CSV"
                steps={[
                  {
                    title: 'Preparar el archivo CSV',
                    content: (
                      <div>
                        <p>Usa Excel, Google Sheets o un editor de texto. Asegúrate de:</p>
                        <ul className="list-disc list-inside mt-2 ml-4">
                          <li>La primera fila tiene los encabezados exactos</li>
                          <li>No hay filas vacías</li>
                          <li>Los emails están en formato correcto</li>
                        </ul>
                      </div>
                    )
                  },
                  {
                    title: 'Hacer clic en "Importar CSV"',
                    content: <p>Botón junto a "Nuevo Grupo".</p>
                  },
                  {
                    title: 'Seleccionar el archivo',
                    content: <p>Arrastra o selecciona tu archivo .csv</p>
                  },
                  {
                    title: 'Revisar vista previa',
                    content: <p>La plataforma mostrará los primeros usuarios detectados.</p>
                  },
                  {
                    title: 'Confirmar importación',
                    content: <p>Si todo se ve correcto, haz clic en "Importar".</p>
                  },
                ]} 
              />

              <Warning title="Errores Comunes">
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>Emails duplicados en el CSV</li>
                  <li>Formato de columnas incorrecto</li>
                  <li>Caracteres especiales mal codificados (usa UTF-8)</li>
                  <li>Filas con emails vacíos</li>
                </ul>
              </Warning>

              <Tip title="Plantilla CSV">
                Descarga una plantilla de ejemplo desde la plataforma para asegurar 
                el formato correcto.
              </Tip>
            </div>
          ),
          avanzado: (
            <div className="space-y-4">
              <h4 className="font-semibold">Procesamiento de CSV en Frontend</h4>
              <CodeBlock language="typescript">
{`import Papa from 'papaparse';

const handleCSVImport = (file: File) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const targets: Target[] = results.data.map((row: any) => ({
        email: row.email?.trim(),
        first_name: row.first_name?.trim() || '',
        last_name: row.last_name?.trim() || '',
        position: row.position?.trim() || '',
      }));
      
      // Validar emails
      const validTargets = targets.filter(t => 
        t.email && isValidEmail(t.email)
      );
      
      // Remover duplicados
      const uniqueTargets = Array.from(
        new Map(validTargets.map(t => [t.email, t])).values()
      );
      
      setImportedTargets(uniqueTargets);
    },
    error: (error) => {
      console.error('CSV parse error:', error);
      alert('Error al procesar el archivo CSV');
    }
  });
};`}
              </CodeBlock>

              <h4 className="font-semibold mt-6">Sincronización con GoPhish</h4>
              <CodeBlock language="go">
{`func CreateGroup(c *gin.Context) {
    var req models.UserGroupCreate
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    configID := c.Param("config_id")
    
    // 1. Crear en GoPhish
    gophishGroup := convertToGophishFormat(&req)
    gophishResp, err := gophishClient.CreateGroup(configID, gophishGroup)
    if err != nil {
        c.JSON(500, gin.H{"error": "GoPhish error"})
        return
    }
    
    // 2. Guardar en nuestra BD
    localGroup := &models.UserGroup{
        ConfigID:    configID,
        Name:        req.Name,
        GophishID:   gophishResp.ID,
        Targets:     req.Targets,
    }
    
    if err := repository.SaveGroup(localGroup); err != nil {
        // Rollback: eliminar de GoPhish
        gophishClient.DeleteGroup(configID, gophishResp.ID)
        c.JSON(500, gin.H{"error": "Database error"})
        return
    }
    
    c.JSON(201, localGroup)
}`}
              </CodeBlock>

              <Warning title="Consistencia de Datos">
                Implementa transacciones distribuidas o compensación para mantener 
                sincronizados GoPhish y la BD local. Si falla uno, haz rollback del otro.
              </Warning>
            </div>
          ),
        },
      },
      {
        id: 'mejores-practicas-grupos',
        title: 'Mejores Prácticas de Organización',
        searchKeywords: ['mejores practicas', 'organizacion', 'segmentacion', 'naming'],
        content: {
          basico: (
            <div className="space-y-4">
              <h4 className="font-semibold">Convenciones de Nombres</h4>
              <p>Usa nombres claros y descriptivos que incluyan:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Departamento:</strong> "Ventas", "IT", "RRHH"</li>
                <li><strong>Ubicación:</strong> "Oficina Central", "Sucursal Norte"</li>
                <li><strong>Fecha/Período:</strong> "Q1 2024", "Enero 2024"</li>
                <li><strong>Tipo:</strong> "Gerentes", "Nuevos Empleados"</li>
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <Card className="p-3 border-green-200 bg-green-50 dark:bg-green-950/20">
                  <strong className="text-green-800 dark:text-green-200">✅ Buenos Nombres</strong>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• IT - Q1 2024 Training</li>
                    <li>• Ventas - Oficina Central</li>
                    <li>• Nuevos Empleados - Enero</li>
                    <li>• Gerentes - Todos</li>
                  </ul>
                </Card>
                <Card className="p-3 border-red-200 bg-red-50 dark:bg-red-950/20">
                  <strong className="text-red-800 dark:text-red-200">❌ Malos Nombres</strong>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Grupo 1</li>
                    <li>• Test</li>
                    <li>• Lista nueva</li>
                    <li>• AAA</li>
                  </ul>
                </Card>
              </div>

              <h4 className="font-semibold mt-6">Segmentación Efectiva</h4>
              <StepByStep steps={[
                {
                  title: 'Por Nivel de Riesgo',
                  content: (
                    <div>
                      <p>Separa usuarios por nivel de exposición:</p>
                      <ul className="list-disc list-inside mt-2 ml-4 text-sm">
                        <li><strong>Alto riesgo:</strong> Ejecutivos, finanzas, IT admins</li>
                        <li><strong>Medio riesgo:</strong> Managers, ventas</li>
                        <li><strong>Bajo riesgo:</strong> Personal administrativo</li>
                      </ul>
                    </div>
                  )
                },
                {
                  title: 'Por Departamento',
                  content: <p>Permite medir qué áreas necesitan más capacitación.</p>
                },
                {
                  title: 'Por Ubicación',
                  content: <p>Útil para empresas con múltiples oficinas o países.</p>
                },
                {
                  title: 'Por Antigüedad',
                  content: <p>Nuevos empleados vs. personal con experiencia.</p>
                },
              ]} />

              <Tip title="Mantén Grupos Actualizados">
                Revisa y actualiza los grupos trimestralmente. Elimina usuarios que ya 
                no están en la empresa y agrega nuevos empleados.
              </Tip>
            </div>
          ),
        },
      },
    ],
  },
];
