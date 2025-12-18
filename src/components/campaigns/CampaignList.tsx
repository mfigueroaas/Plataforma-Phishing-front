import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useGoPhishConfig } from '../gophish/ConfigContext';
import { apiCampaigns, Campaign, CampaignResult, CampaignSummary } from '../../lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Eye,
  Download,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';

interface CampaignListProps {
  onCreateClick: () => void;
}

export function CampaignList({ onCreateClick }: CampaignListProps) {
  const { user, canCreate, canDelete } = useAuth();
  const { activeConfig } = useGoPhishConfig();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [summaryMap, setSummaryMap] = useState<Record<number, CampaignSummary>>({});

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [summary, setSummary] = useState<CampaignSummary | null>(null);
  const [results, setResults] = useState<CampaignResult[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [detailMode, setDetailMode] = useState(false);

  const loadCampaigns = async () => {
    if (!activeConfig?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiCampaigns.list(activeConfig.id);
      setCampaigns(data);
      fetchSummaries(data);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar campañas');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaries = async (items: Campaign[]) => {
    if (!activeConfig?.id) return;
    const toFetch = items.filter(c => !summaryMap[c.local_id]);
    if (toFetch.length === 0) return;
    try {
      const responses = await Promise.all(toFetch.map(c => apiCampaigns.summary(activeConfig.id!, c.local_id)));
      setSummaryMap(prev => {
        const next = { ...prev } as Record<number, CampaignSummary>;
        responses.forEach((res, idx) => {
          const campId = toFetch[idx].local_id;
          next[campId] = res;
        });
        return next;
      });
    } catch (e) {
      console.error('Error fetching campaign summaries', e);
    }
  };

  useEffect(() => {
    if (activeConfig?.id) {
      loadCampaigns();
    }
  }, [activeConfig?.id]);

  const handleDelete = async (campaignId: number) => {
    if (!activeConfig?.id || !confirm('¿Estás seguro de que deseas eliminar esta campaña?')) return;
    
    setLoading(true);
    setError(null);
    try {
      await apiCampaigns.delete(activeConfig.id, campaignId);
      await loadCampaigns();
    } catch (e: any) {
      setError(e?.message || 'Error al eliminar campaña');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('complet')) {
      return <Badge variant="secondary">Completada</Badge>;
    } else if (statusLower.includes('progress') || statusLower.includes('sending')) {
      return <Badge variant="default">Activa</Badge>;
    } else if (statusLower.includes('queued') || statusLower.includes('scheduled')) {
      return <Badge variant="outline">Programada</Badge>;
    } else if (statusLower.includes('error')) {
      return <Badge variant="destructive">Error</Badge>;
    }
    
    return <Badge variant="outline">{status}</Badge>;
  };

  const calculateRate = (numerator: number, denominator: number) => {
    if (denominator === 0) return 0;
    return Math.round((numerator / denominator) * 100);
  };

  const openDetails = async (campaign: Campaign) => {
    if (!activeConfig?.id) return;
    setSelectedCampaign(campaign);
    setSummary(null);
    setResults([]);
    setTimeline([]);
    setDetailsError(null);
    setDetailsLoading(true);
    setDetailMode(true);
    try {
      const [summaryResp, resultsResp] = await Promise.all([
        apiCampaigns.summary(activeConfig.id, campaign.local_id),
        apiCampaigns.results(activeConfig.id, campaign.local_id)
      ]);
      setSummary(summaryResp);
      setResults(resultsResp.results || []);
      setTimeline(resultsResp.timeline || []);
    } catch (e: any) {
      setDetailsError(e?.message || 'Error al cargar detalles');
    } finally {
      setDetailsLoading(false);
    }
  };

  const buildCsv = (rows: CampaignResult[]) => {
    const headers = ['email','first_name','last_name','position','status','send_date','reported','ip'];
    const escape = (value: any) => {
      const str = value === undefined || value === null ? '' : String(value);
      if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };
    const lines = [headers.join(',')];
    rows.forEach(r => {
      lines.push([
        escape(r.email),
        escape(r.first_name),
        escape(r.last_name),
        escape(r.position),
        escape(r.status),
        escape(r.send_date),
        escape(r.reported),
        escape(r.ip)
      ].join(','));
    });
    return lines.join('\n');
  };

  const exportResults = async (campaign: Campaign) => {
    if (!activeConfig?.id) return;
    setDetailsError(null);
    let data = results;
    if (campaign.local_id !== selectedCampaign?.local_id || results.length === 0) {
      try {
        const resp = await apiCampaigns.results(activeConfig.id, campaign.local_id);
        data = resp.results || [];
      } catch (e: any) {
        setDetailsError(e?.message || 'Error al exportar resultados');
        return;
      }
    }
    const csv = buildCsv(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${campaign.name.replace(/\s+/g, '_')}_resultados.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.template_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exitDetails = () => {
    setDetailMode(false);
    setSelectedCampaign(null);
    setSummary(null);
    setResults([]);
    setTimeline([]);
    setDetailsError(null);
  };

  if (!activeConfig?.id) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTitle>Configuración requerida</AlertTitle>
          <AlertDescription>
            Selecciona una configuración de GoPhish para ver las campañas.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (detailMode && selectedCampaign) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2" onClick={exitDetails}>
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{selectedCampaign.name}</h1>
              <p className="text-muted-foreground text-sm">
                Plantilla: {selectedCampaign.template_name} · Landing: {selectedCampaign.page_name}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportResults(selectedCampaign)}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {detailsError && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{detailsError}</AlertDescription>
          </Alert>
        )}

        {detailsLoading ? (
          <Card>
            <CardContent className="py-10 text-sm text-muted-foreground">Cargando detalles…</CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Tabs defaultValue="summary">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="summary">Resumen</TabsTrigger>
                  <TabsTrigger value="results">Resultados</TabsTrigger>
                  <TabsTrigger value="timeline">Línea de tiempo</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4">
                  {summary ? (
                    <div className="space-y-3">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="border rounded-md p-3">
                          <p className="text-muted-foreground">Estado</p>
                          <p className="font-semibold">{summary.status}</p>
                        </div>
                        <div className="border rounded-md p-3">
                          <p className="text-muted-foreground">Creada</p>
                          <p className="font-semibold">{new Date(summary.created_date).toLocaleString()}</p>
                        </div>
                        <div className="border rounded-md p-3">
                          <p className="text-muted-foreground">Lanzamiento</p>
                          <p className="font-semibold">{summary.launch_date ? new Date(summary.launch_date).toLocaleString() : '—'}</p>
                        </div>
                        <div className="border rounded-md p-3">
                          <p className="text-muted-foreground">Send by</p>
                          <p className="font-semibold">{summary.send_by_date && summary.send_by_date !== '0001-01-01T00:00:00Z' ? new Date(summary.send_by_date).toLocaleString() : '—'}</p>
                        </div>
                        <div className="border rounded-md p-3">
                          <p className="text-muted-foreground">Completada</p>
                          <p className="font-semibold">{summary.completed_date && summary.completed_date !== '0001-01-01T00:00:00Z' ? new Date(summary.completed_date).toLocaleString() : '—'}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid sm:grid-cols-3 lg:grid-cols-7 gap-3 text-sm">
                        <div className="border rounded-md p-3 text-center">
                          <p className="text-muted-foreground">Total</p>
                          <p className="text-xl font-semibold">{summary.stats.total}</p>
                        </div>
                        <div className="border rounded-md p-3 text-center">
                          <p className="text-muted-foreground">Enviados</p>
                          <p className="text-xl font-semibold">{summary.stats.sent}</p>
                        </div>
                        <div className="border rounded-md p-3 text-center">
                          <p className="text-muted-foreground">Abiertos</p>
                          <p className="text-xl font-semibold">{summary.stats.opened}</p>
                        </div>
                        <div className="border rounded-md p-3 text-center">
                          <p className="text-muted-foreground">Clicks</p>
                          <p className="text-xl font-semibold">{summary.stats.clicked}</p>
                        </div>
                        <div className="border rounded-md p-3 text-center">
                          <p className="text-muted-foreground">Form. enviados</p>
                          <p className="text-xl font-semibold">{summary.stats.submitted_data}</p>
                        </div>
                        <div className="border rounded-md p-3 text-center">
                          <p className="text-muted-foreground">Reportados</p>
                          <p className="text-xl font-semibold">{summary.stats.email_reported}</p>
                        </div>
                        <div className="border rounded-md p-3 text-center">
                          <p className="text-muted-foreground">Errores</p>
                          <p className="text-xl font-semibold">{summary.stats.error}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Sin resumen.</div>
                  )}
                </TabsContent>

                <TabsContent value="results">
                  {results.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Aún no hay resultados.</div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Apellido</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Enviado</TableHead>
                            <TableHead>IP</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.map((r, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="text-sm">{r.email}</TableCell>
                              <TableCell className="text-sm">{r.first_name || '—'}</TableCell>
                              <TableCell className="text-sm">{r.last_name || '—'}</TableCell>
                              <TableCell className="text-sm">{r.position || '—'}</TableCell>
                              <TableCell className="text-sm">{r.status}</TableCell>
                              <TableCell className="text-sm">{r.send_date ? new Date(r.send_date).toLocaleString() : '—'}</TableCell>
                              <TableCell className="text-sm">{r.ip || '—'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="timeline">
                  {timeline.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Sin eventos.</div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-auto pr-2">
                      {timeline.map((item, idx) => (
                        <div key={idx} className="border rounded-md p-3 text-sm">
                          <div className="flex justify-between gap-3">
                            <p className="font-medium">{item.message}</p>
                            <span className="text-muted-foreground text-xs">{item.time ? new Date(item.time).toLocaleString() : ''}</span>
                          </div>
                          {item.email && <p className="text-muted-foreground text-xs">{item.email}</p>}
                          {item.details && <p className="text-xs break-words mt-1 text-muted-foreground">{item.details}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Campañas</h1>
          <p className="text-muted-foreground">
            Gestiona y monitorea tus campañas de phishing educativo
          </p>
        </div>
        <Button className="gap-2" disabled={!canCreate} onClick={onCreateClick}>
          <Plus className="w-4 h-4" />
          Nueva Campaña
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar campañas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Campañas</CardTitle>
          <CardDescription>
            {loading ? 'Cargando...' : `${filteredCampaigns.length} campaña(s) encontrada(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-sm">Cargando campañas…</div>}
          {!loading && filteredCampaigns.length === 0 && (
            <div className="text-sm text-muted-foreground">No hay campañas todavía.</div>
          )}
          {!loading && filteredCampaigns.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Objetivos</TableHead>
                  <TableHead>Enviados</TableHead>
                  <TableHead>Tasa Apertura</TableHead>
                  <TableHead>Tasa Clics</TableHead>
                  <TableHead>Reportados</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => {
                  const stats = (summaryMap[campaign.local_id]?.stats) || campaign.stats || { total: 0, sent: 0, opened: 0, clicked: 0, email_reported: 0, submitted_data: 0, error: 0 };
                  
                  return (
                    <TableRow key={campaign.local_id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.template_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(campaign.status)}
                      </TableCell>
                      <TableCell>{stats.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{stats.sent}</span>
                          {stats.total > 0 && (
                            <div className="w-20">
                              <Progress value={calculateRate(stats.sent, stats.total)} />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{calculateRate(stats.opened, stats.sent)}%</span>
                          <span className="text-muted-foreground text-sm">
                            ({stats.opened})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{calculateRate(stats.clicked, stats.sent)}%</span>
                          <span className="text-muted-foreground text-sm">
                            ({stats.clicked})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{stats.email_reported}</span>
                          <span className="text-muted-foreground text-sm">
                            ({calculateRate(stats.email_reported, stats.sent)}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date((summaryMap[campaign.local_id]?.created_date) || campaign.created_date).toLocaleDateString('es-CL')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetails(campaign)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportResults(campaign)}>
                              <Download className="w-4 h-4 mr-2" />
                              Exportar Resultados
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(campaign.local_id)}
                              disabled={!canDelete}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

