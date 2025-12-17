import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useGoPhishConfig } from '../gophish/ConfigContext';
import { apiCampaigns, Campaign } from '../../lib/api/client';
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
  Trash2
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

  const loadCampaigns = async () => {
    if (!activeConfig?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiCampaigns.list(activeConfig.id);
      setCampaigns(data);
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

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.template_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  const stats = campaign.stats || { total: 0, sent: 0, opened: 0, clicked: 0, email_reported: 0, submitted_data: 0, error: 0 };
                  
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
                          {new Date(campaign.created_date).toLocaleDateString('es-CL')}
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
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
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

