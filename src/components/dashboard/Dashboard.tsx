import { useEffect, useState } from 'react';
import { useGoPhishConfig } from '../gophish/ConfigContext';
import { usePermissions } from '../../hooks/usePermissions';
import { apiCampaigns, Campaign, CampaignSummary } from '../../lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Mail, 
  MousePointer, 
  AlertTriangle,
  Clock,
  Target,
  Plus,
  BarChart3
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface DashboardProps {
  onCreateClick?: () => void;
  onViewDetails?: (campaign: Campaign) => void;
}

export function Dashboard({ onCreateClick, onViewDetails }: DashboardProps) {
  const { activeConfig } = useGoPhishConfig();
  const { canCreateCampaigns } = usePermissions();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [summaryMap, setSummaryMap] = useState<Record<number, CampaignSummary>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRate = (numerator: number, denominator: number) => {
    if (denominator === 0) return 0;
    return Math.round((numerator / denominator) * 100);
  };

  const loadCampaigns = async () => {
    if (!activeConfig?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiCampaigns.list(activeConfig.id);
      setCampaigns(data);
      
      // Cargar summaries para todas las campañas
      const summaries: Record<number, CampaignSummary> = {};
      try {
        const summaryResponses = await Promise.all(
          data.map(c => apiCampaigns.summary(activeConfig.id, c.local_id))
        );
        summaryResponses.forEach((summary, idx) => {
          summaries[data[idx].local_id] = summary;
        });
        setSummaryMap(summaries);
      } catch (e) {
        console.error('Error fetching summaries:', e);
      }
    } catch (e: any) {
      setError(e?.message || 'Error al cargar campañas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeConfig?.id) {
      loadCampaigns();
    }
  }, [activeConfig?.id]);

  // Calcular KPIs desde datos reales
  const kpiData = (() => {
    let totalSent = 0;
    let totalOpened = 0;
    let totalClicked = 0;
    let totalReported = 0;

    campaigns.forEach(campaign => {
      const summary = summaryMap[campaign.local_id];
      if (summary?.stats) {
        totalSent += summary.stats.sent || 0;
        totalOpened += summary.stats.opened || 0;
        totalClicked += summary.stats.clicked || 0;
        totalReported += summary.stats.email_reported || 0;
      }
    });

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status?.toLowerCase().includes('progress') || c.status?.toLowerCase().includes('sending')).length,
      emailsSent: totalSent,
      opened: totalOpened,
      clicked: totalClicked,
      reported: totalReported,
      avgTimeToReport: "—"
    };
  })();

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl">Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Resumen de actividad y métricas de campañas de phishing educativo
          </p>
        </div>
        {canCreateCampaigns && (
          <Button className="gap-2 w-full sm:w-auto" onClick={onCreateClick}>
            <Plus className="w-4 h-4" />
            Nueva Campaña
          </Button>
        )}
      </div>

      {/* Config Alert */}
      {!activeConfig?.id && (
        <Alert>
          <Target className="h-4 w-4" />
          <AlertTitle>Configuración requerida</AlertTitle>
          <AlertDescription>
            Selecciona una configuración de GoPhish para ver el dashboard.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* No Campaigns Alert */}
      {!loading && kpiData.totalCampaigns === 0 && activeConfig?.id && (
        <Alert>
          <Target className="h-4 w-4" />
          <AlertDescription>
            No hay campañas creadas aún. ¡Creemos una!
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Emails Enviados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Emails Enviados</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.emailsSent.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% desde el mes pasado
            </div>
          </CardContent>
        </Card>

        {/* Tasa de Apertura */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tasa de Apertura</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateRate(kpiData.opened, kpiData.emailsSent)}%</div>
            <Progress value={calculateRate(kpiData.opened, kpiData.emailsSent)} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {kpiData.opened} de {kpiData.emailsSent} emails
            </div>
          </CardContent>
        </Card>

        {/* Tasa de Clics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tasa de Clics</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateRate(kpiData.clicked, kpiData.emailsSent)}%</div>
            <Progress value={calculateRate(kpiData.clicked, kpiData.emailsSent)} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {kpiData.clicked} de {kpiData.emailsSent} emails
            </div>
          </CardContent>
        </Card>

        {/* Tasa de Reporte */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tasa de Reporte</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateRate(kpiData.reported, kpiData.emailsSent)}%</div>
            <Progress value={calculateRate(kpiData.reported, kpiData.emailsSent)} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Clock className="w-3 h-3 mr-1" />
              Promedio: {kpiData.avgTimeToReport}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Campañas Recientes</CardTitle>
          <CardDescription>
            Estado y rendimiento de las últimas campañas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-sm text-muted-foreground">Cargando campañas…</div>}
          {!loading && campaigns.length === 0 && (
            <div className="text-sm text-muted-foreground">No hay campañas disponibles.</div>
          )}
          {!loading && campaigns.length > 0 && (
            <div className="space-y-4">
              {campaigns.slice(0, 5).map((campaign) => {
                const summary = summaryMap[campaign.local_id];
                const stats = summary?.stats || { sent: 0, opened: 0, clicked: 0, email_reported: 0 };
                const statusLower = campaign.status?.toLowerCase() || '';
                const statusDisplay = statusLower.includes('progress') || statusLower.includes('sending') ? 'activa' :
                                     statusLower.includes('complet') ? 'completada' : 'programada';

                return (
                  <div key={campaign.local_id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <h4 className="font-medium text-sm sm:text-base">{campaign.name}</h4>
                        <Badge variant={
                          statusDisplay === 'activa' ? 'default' :
                          statusDisplay === 'completada' ? 'secondary' :
                          'outline'
                        }>
                          {statusDisplay}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Creada el {(() => {
                          try {
                            const createdDate = (summaryMap[campaign.local_id]?.created_date) || campaign.created_date;
                            const date = new Date(createdDate);
                            if (isNaN(date.getTime())) return '—';
                            return date.toLocaleDateString('es-CL');
                          } catch {
                            return '—';
                          }
                        })()}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between sm:gap-6 text-sm">
                      <div className="flex gap-4 sm:gap-6">
                        <div className="text-center">
                          <div className="font-medium">{stats.opened}</div>
                          <div className="text-muted-foreground text-xs">Aperturas</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{stats.clicked}</div>
                          <div className="text-muted-foreground text-xs">Clics</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{stats.email_reported}</div>
                          <div className="text-muted-foreground text-xs">Reportes</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-2 sm:ml-0" onClick={() => onViewDetails?.(campaign)}>
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  );
}