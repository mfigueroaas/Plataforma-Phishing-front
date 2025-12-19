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
  ArrowLeft,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    MousePointer,
    AlertTriangle,
    Send,
    Flag,
    Clock
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
import { AuditTimeline } from '../ui/audit-timeline';

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
   const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [reportBaseByCampaign, setReportBaseByCampaign] = useState<Record<number, string>>({});

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

  const handleComplete = async (campaign: Campaign) => {
    if (!activeConfig?.id || !confirm('¿Marcar esta campaña como completada?')) return;
    
    setLoading(true);
    setError(null);
    try {
      await apiCampaigns.complete(activeConfig.id, campaign.local_id);
      await loadCampaigns();
      if (detailMode && selectedCampaign?.local_id === campaign.local_id) {
        exitDetails();
      }
    } catch (e: any) {
      setError(e?.message || 'Error al completar campaña');
    } finally {
      setLoading(false);
    }
  };

   const toggleRowExpansion = (index: number) => {
     setExpandedRows(prev => {
       const next = new Set(prev);
       if (next.has(index)) {
         next.delete(index);
       } else {
         next.add(index);
       }
       return next;
     });
   };

   const parsePayloadDetails = (details?: string) => {
     if (!details) return null;
     try {
       const parsed = JSON.parse(details);
       return parsed;
     } catch {
       return null;
     }
   };

  const getFirstValue = (obj: any, key: string): string | undefined => {
    if (!obj || !(key in obj)) return undefined;
    const v = obj[key];
    if (Array.isArray(v)) return v[0];
    if (typeof v === 'string') return v;
    return undefined;
  };

  const extractSubmittedInfo = (payload: any) => {
    return {
      originalUrl: getFirstValue(payload, '__original_url'),
      username: getFirstValue(payload, 'username') || getFirstValue(payload, 'user[email]'),
      password: getFirstValue(payload, 'password'),
      rid: getFirstValue(payload, 'rid'),
    };
  };

  const parseUserAgentInfo = (ua?: string) => {
    if (!ua) return {} as { browser?: string; browserVersion?: string; os?: string; osVersion?: string };
    const info: { browser?: string; browserVersion?: string; os?: string; osVersion?: string } = {};
    // OS
    const winMatch = ua.match(/Windows NT ([0-9.]+)/i);
    if (winMatch) {
      info.os = 'Windows';
      info.osVersion = winMatch[1];
    } else if (/Mac OS X/i.test(ua)) {
      const m = ua.match(/Mac OS X ([0-9_]+)/i);
      info.os = 'macOS';
      info.osVersion = m ? m[1].replace(/_/g, '.') : undefined;
    } else if (/Android/i.test(ua)) {
      const m = ua.match(/Android ([0-9.]+)/i);
      info.os = 'Android';
      info.osVersion = m ? m[1] : undefined;
    } else if (/Linux/i.test(ua)) {
      info.os = 'Linux';
    }
    // Browser
    const edge = ua.match(/Edg\/([0-9.]+)/);
    const chrome = ua.match(/Chrome\/([0-9.]+)/);
    const firefox = ua.match(/Firefox\/([0-9.]+)/);
    const safari = (!chrome && ua.match(/Safari\/([0-9.]+)/)) || null;
    if (edge) { info.browser = 'Edge'; info.browserVersion = edge[1]; }
    else if (chrome) { info.browser = 'Chrome'; info.browserVersion = chrome[1]; }
    else if (firefox) { info.browser = 'Firefox'; info.browserVersion = firefox[1]; }
    else if (safari) { info.browser = 'Safari'; info.browserVersion = safari[1]; }
    return info;
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'link_clicked':
        return { Icon: MousePointer, className: 'text-red-600 bg-red-100' };
      case 'data_submitted':
        return { Icon: AlertTriangle, className: 'text-orange-600 bg-orange-100' };
      case 'email_opened':
        return { Icon: Eye, className: 'text-yellow-600 bg-yellow-100' };
      case 'email_sent':
        return { Icon: Send, className: 'text-blue-600 bg-blue-100' };
      case 'reported':
        return { Icon: Flag, className: 'text-emerald-600 bg-emerald-100' };
      default:
        return { Icon: Clock, className: 'text-gray-600 bg-gray-100' };
    }
  };

  const mapMessageType = (message: string) => {
    const m = (message || '').toLowerCase();
    if (m.includes('submitted')) return 'data_submitted';
    if (m.includes('click') || m.includes('link')) return 'link_clicked';
    if (m.includes('open')) return 'email_opened';
    if (m.includes('sent') || m.includes('send')) return 'email_sent';
    if (m.includes('report')) return 'reported';
    if (m.includes('campaign') && m.includes('start')) return 'campaign_started';
    if (m.includes('campaign') && m.includes('completed')) return 'campaign_completed';
    return 'email_sent';
  };

  // Funciones para manejar reportes
  const getReportBaseForCampaign = (camp: Campaign): string | null => {
    // Preferir la URL que venga del backend
    if ((camp as any).url && typeof (camp as any).url === 'string') return (camp as any).url as string;
    // Luego, si el usuario ya la ingresó para esta campaña
    const remembered = reportBaseByCampaign[camp.local_id];
    if (remembered) return remembered;
    // Pedir al usuario y guardar
    const input = window.prompt('Ingresa la URL base de la landing page (ej: https://phish.tu-dominio.com):');
    if (!input) return null;
    setReportBaseByCampaign(prev => ({ ...prev, [camp.local_id]: input.trim() }));
    return input.trim();
  };

  const buildReportUrl = (base: string, rid: string) => {
    try {
      const u = new URL(base);
      const cleanPath = u.pathname.replace(/\/+$/, '');
      u.pathname = `${cleanPath}/report`;
      u.search = `rid=${encodeURIComponent(rid)}`;
      return u.toString();
    } catch {
      const b = base.replace(/\/+$/, '');
      return `${b}/report?rid=${encodeURIComponent(rid)}`;
    }
  };

  const sendReportBeacon = (url: string) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = url + (url.includes('?') ? '&_ts=' : '?_ts=') + Date.now();
    });
  };

  const getRidForResult = (r: CampaignResult): string | null => {
    if ((r as any).id) return String((r as any).id);
    // Buscar en timeline del usuario
    const userTimeline = timeline.filter((t) => t.email === r.email);
    for (const item of userTimeline) {
      const parsed = parsePayloadDetails(item.details);
      const rid = getFirstValue(parsed?.payload, 'rid');
      if (rid) return rid;
    }
    // Último intento: del propio details del row
    const rowParsed = parsePayloadDetails(r.details);
    const rid = getFirstValue(rowParsed?.payload, 'rid');
    return rid || null;
  };

  const handleReport = async (r: CampaignResult) => {
    if (!selectedCampaign) {
      alert('Primero abre los detalles de una campaña.');
      return;
    }
    const rid = getRidForResult(r);
    if (!rid) {
      alert('No se pudo determinar el RID de este envío.');
      return;
    }
    const base = getReportBaseForCampaign(selectedCampaign);
    if (!base) return;

    const url = buildReportUrl(base, rid);

    try {
      await fetch(url, { method: 'GET', mode: 'no-cors' });
    } catch {
      // ignorar
    }
    await sendReportBeacon(url);

    // Actualizar UI localmente
    setResults(prev =>
      prev.map(row =>
        row === r ? ({ ...row, reported: true } as any) : row
      )
    );
    alert('Reporte enviado correctamente.');
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
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportResults(selectedCampaign)}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Button variant="default" size="sm" onClick={() => handleComplete(selectedCampaign)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Marcar como completada
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
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((r, idx) => {
                          const rowPayload = parsePayloadDetails(r.details);
                          const isExpanded = expandedRows.has(idx);
                          const userTimeline = timeline.filter((t) => t.email === r.email);
                          const showToggle = userTimeline.length > 0 || !!rowPayload;

                          return (
                            <>
                              <TableRow key={`row-${idx}`}>
                                <TableCell className="text-sm">{r.email}</TableCell>
                                <TableCell className="text-sm">{r.first_name || '—'}</TableCell>
                                <TableCell className="text-sm">{r.last_name || '—'}</TableCell>
                                <TableCell className="text-sm">{r.position || '—'}</TableCell>
                                <TableCell className="text-sm">
                                  <Badge variant={r.status === 'Submitted Data' ? 'destructive' : 'outline'}>
                                    {r.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{r.send_date ? new Date(r.send_date).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</TableCell>
                                <TableCell className="text-sm">{r.ip || '—'}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    {!r.reported && summary?.status && !summary.status.toLowerCase().includes('complet') && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleReport(r)}
                                        className="gap-1"
                                        title="Marcar este envío como reportado (solo disponible cuando la campaña no está completada)"
                                      >
                                        <Flag className="w-4 h-4" />
                                        Reportar
                                      </Button>
                                    )}
                                    {showToggle && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleRowExpansion(idx)}
                                        className="gap-1"
                                      >
                                        <ChevronDown className="w-4 h-4" />
                                        Timeline
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>

                              {isExpanded && (
                                <TableRow key={`expand-${idx}`}>
                                  <TableCell colSpan={8}>
                                    <div className="p-3 border rounded-md bg-muted/30">
                                      <p className="text-xs font-semibold text-muted-foreground mb-2">Actividad del usuario</p>
                                      {userTimeline.length === 0 && !rowPayload ? (
                                        <p className="text-xs text-muted-foreground">Sin eventos para este usuario.</p>
                                      ) : (
                                        <div className="space-y-2 text-sm">
                                          {userTimeline.map((item, i) => {
                                            const itemPayload = parsePayloadDetails(item.details);
                                            const type = mapMessageType(item.message);
                                            const uaInfo = parseUserAgentInfo(itemPayload?.browser?.['user-agent']);
                                            const submitted = itemPayload?.payload ? extractSubmittedInfo(itemPayload.payload) : undefined;
                                            const { Icon, className } = getTimelineIcon(type);
                                            return (
                                              <div key={i} className="border rounded-md p-2 bg-background">
                                                <div className="flex gap-3">
                                                  <div className="flex flex-col items-center pt-1">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${className}`}>
                                                      <Icon className="w-4 h-4" />
                                                    </div>
                                                    {i !== userTimeline.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                                                  </div>

                                                  <div className="flex-1 space-y-1">
                                                    <div className="flex justify-between gap-3">
                                                      <p className="text-sm font-medium">{item.message}</p>
                                                      <span className="text-muted-foreground text-xs">{item.time ? new Date(item.time).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : ''}</span>
                                                    </div>

                                                    {type === 'link_clicked' && (
                                                      <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
                                                        <div className="border rounded-md p-2">
                                                          <p className="font-semibold mb-1">Navegador</p>
                                                          <p>{uaInfo.browser || '—'} {uaInfo.browserVersion || ''}</p>
                                                        </div>
                                                        <div className="border rounded-md p-2">
                                                          <p className="font-semibold mb-1">Sistema</p>
                                                          <p>{uaInfo.os || '—'} {uaInfo.osVersion ? `(NT ${uaInfo.osVersion})` : ''}</p>
                                                        </div>
                                                      </div>
                                                    )}

                                                    {type === 'data_submitted' && submitted && (
                                                      <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
                                                        <div className="border rounded-md p-2">
                                                          <p className="font-semibold mb-1">Usuario</p>
                                                          <p className="break-words">{submitted.username || '—'}</p>
                                                        </div>
                                                        <div className="border rounded-md p-2">
                                                          <p className="font-semibold mb-1">Password</p>
                                                          <p className="break-words">{submitted.password || '—'}</p>
                                                        </div>
                                                        <div className="border rounded-md p-2 sm:col-span-2">
                                                          <p className="font-semibold mb-1">Original URL</p>
                                                          {submitted.originalUrl ? (
                                                            <a href={submitted.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                              {submitted.originalUrl}
                                                            </a>
                                                          ) : (
                                                            <p>—</p>
                                                          )}
                                                        </div>
                                                      </div>
                                                    )}

                                                    {type !== 'link_clicked' && type !== 'data_submitted' && item.details && (
                                                      <p className="text-xs break-words mt-2 text-muted-foreground">{item.details}</p>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}

                                          {userTimeline.length === 0 && rowPayload && (
                                            <div className="border rounded-md p-2 bg-background">
                                              <div className="flex justify-between gap-3">
                                                <p className="text-sm font-medium">{r.status}</p>
                                                <span className="text-muted-foreground text-xs">{r.send_date ? new Date(r.send_date).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : ''}</span>
                                              </div>
                                              {(() => {
                                                const statusLower = (r.status || '').toLowerCase();
                                                if (statusLower.includes('click')) {
                                                  const uaInfo = parseUserAgentInfo(rowPayload.browser?.['user-agent']);
                                                  return (
                                                    <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
                                                      <div className="border rounded-md p-2">
                                                        <p className="font-semibold mb-1">Navegador</p>
                                                        <p>{uaInfo.browser || '—'} {uaInfo.browserVersion || ''}</p>
                                                      </div>
                                                      <div className="border rounded-md p-2">
                                                        <p className="font-semibold mb-1">Sistema</p>
                                                        <p>{uaInfo.os || '—'} {uaInfo.osVersion ? `(NT ${uaInfo.osVersion})` : ''}</p>
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                                if (statusLower.includes('submitted')) {
                                                  const submitted = rowPayload.payload ? extractSubmittedInfo(rowPayload.payload) : undefined;
                                                  return (
                                                    <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
                                                      <div className="border rounded-md p-2">
                                                        <p className="font-semibold mb-1">Usuario</p>
                                                        <p className="break-words">{submitted?.username || '—'}</p>
                                                      </div>
                                                      <div className="border rounded-md p-2">
                                                        <p className="font-semibold mb-1">Password</p>
                                                        <p className="break-words">{submitted?.password || '—'}</p>
                                                      </div>
                                                      <div className="border rounded-md p-2 sm:col-span-2">
                                                        <p className="font-semibold mb-1">Original URL</p>
                                                        {submitted?.originalUrl ? (
                                                          <a href={submitted.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                            {submitted.originalUrl}
                                                          </a>
                                                        ) : (
                                                          <p>—</p>
                                                        )}
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                                return null;
                                              })()}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="timeline">
                  {timeline.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Sin eventos.</div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-auto pr-2">
                      <AuditTimeline
                        events={timeline.map((item: any, idx: number) => {
                          const parsed = parsePayloadDetails(item.details);
                          const metadata: Record<string, any> | undefined = parsed ? {
                            ...(parsed.browser ? {
                              'IP': parsed.browser.address,
                              'User Agent': parsed.browser['user-agent']
                            } : {}),
                            ...(parsed.payload ? {
                              'RID': Array.isArray(parsed.payload.rid) ? parsed.payload.rid[0] : parsed.payload.rid,
                              'Commit': Array.isArray(parsed.payload.commit) ? parsed.payload.commit[0] : parsed.payload.commit,
                            } : {})
                          } : undefined;

                          return {
                            id: String(idx),
                            type: mapMessageType(item.message),
                            timestamp: item.time,
                            user: item.email ? { name: item.email.split('@')[0], email: item.email, initials: (item.email[0] || '?').toUpperCase() } : undefined,
                            details: parsed ? undefined : item.details,
                            metadata,
                          };
                        })}
                        showUserInfo
                      />
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
                            <DropdownMenuItem onClick={() => handleComplete(campaign)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Marcar como completada
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

