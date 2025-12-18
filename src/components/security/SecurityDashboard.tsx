import { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Globe,
  Server,
  MapPin,
  Image as ImageIcon,
  Link2,
  TrendingUp,
  Info
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { analyzeUrl, pollUrlScanResult, type AnalyzeURLResponse, type UrlScanResult } from '../../lib/api/security';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

export function SecurityDashboard() {
  // Persisted keys
  const LS_URL_KEY = 'security_url';
  const LS_HISTORY_KEY = 'security_history';
  const LS_RESULT_KEY = 'security_last_result';
  const LS_URLSCAN_KEY = 'security_last_urlscan';
  // Normalize URLs: add https:// if missing a scheme
  const normalizeUrl = (val: string) => {
    const v = val.trim();
    if (!v) return v;
    const hasScheme = /^([a-z][a-z0-9+\-.]*):\/\//i.test(v);
    if (hasScheme) return v;
    if (v.startsWith('//')) return `https:${v}`;
    return `https://${v}`;
  };

  // Lazy init from localStorage to persist across navigation
  const [url, setUrl] = useState<string>(() => {
    try {
      return localStorage.getItem(LS_URL_KEY) || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzeURLResponse | null>(() => {
    try {
      const raw = localStorage.getItem(LS_RESULT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [urlscanData, setUrlscanData] = useState<UrlScanResult | null>(() => {
    try {
      const raw = localStorage.getItem(LS_URLSCAN_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalyzeURLResponse[]>(() => {
    try {
      const raw = localStorage.getItem(LS_HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(LS_URL_KEY, url);
    } catch {}
  }, [url]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history));
    } catch {}
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_RESULT_KEY, JSON.stringify(result));
    } catch {}
  }, [result]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_URLSCAN_KEY, JSON.stringify(urlscanData));
    } catch {}
  }, [urlscanData]);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Por favor ingresa una URL válida');
      return;
    }

    // Ensure URL has a scheme before analyzing
    const normalized = normalizeUrl(url);
    setUrl(normalized);

    setLoading(true);
    setAnalyzing(true);
    setError(null);
    setResult(null);
    setUrlscanData(null);

    try {
      // Step 1: Initial analysis with Google Safe Browsing
      console.log('🔍 Iniciando análisis de URL:', normalized);
      const analysisResult = await analyzeUrl(normalized);
      console.log('✅ Análisis inicial completo:', analysisResult);
      
      setResult(analysisResult);
      setHistory(prev => [analysisResult, ...prev.slice(0, 9)]); // Keep last 10
      setLoading(false); // Google already finished, show results

      // Step 2: Poll urlscan.io if we got a UUID (this is slow)
      if (analysisResult.urlscan_uuid) {
        console.log('⏳ Iniciando polling de urlscan.io con UUID:', analysisResult.urlscan_uuid);
        setAnalyzing(true);
        
        try {
          // Create a timeout promise (2 minutes max)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout: urlscan.io tardó más de 2 minutos')), 120000)
          );

          const pollPromise = pollUrlScanResult({
            uuid: analysisResult.urlscan_uuid,
            initial_wait_seconds: 30,
            interval_seconds: 5,
            max_attempts: 12
          });

          // Race between poll and timeout
          const urlscanResult = await Promise.race([pollPromise, timeoutPromise]) as UrlScanResult;
          console.log('✅ Resultados de urlscan.io obtenidos:', urlscanResult);
          setUrlscanData(urlscanResult);
        } catch (pollError: any) {
          console.error('❌ Error en polling de urlscan:', pollError);
          // Don't crash the page - just show error but keep Google results
          setError(prevError => prevError ? prevError : `urlscan.io: ${pollError.message || 'No se pudo obtener análisis detallado'}`);
        } finally {
          setAnalyzing(false);
        }
      } else {
        // No UUID from urlscan, just finish
        setAnalyzing(false);
        if (analysisResult.urlscan_error) {
          console.warn('⚠️ urlscan.io no disponible:', analysisResult.urlscan_error);
        }
      }
    } catch (err: any) {
      console.error('❌ Error crítico en análisis:', err);
      setError(err.message || 'Error al analizar la URL. Por favor intenta de nuevo.');
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const getThreatLevel = (isSafe: boolean, googleMalicious: boolean) => {
    if (googleMalicious) return { color: 'destructive', label: '🚨 Alta Amenaza', icon: AlertTriangle };
    if (!isSafe) return { color: 'destructive', label: '⚠️ Sospechosa', icon: AlertTriangle };
    return { color: 'success', label: '✅ Segura', icon: CheckCircle2 };
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary rounded-lg">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Security Dashboard</h1>
            <p className="text-muted-foreground">Analiza URLs para detectar amenazas de seguridad</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analizar URL</CardTitle>
          <CardDescription>
            Ingresa una URL para analizarla con Google Safe Browsing y urlscan.io
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://ejemplo.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                onBlur={() => setUrl((prev) => normalizeUrl(prev))}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analizar
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Quick Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Resultados del Análisis</span>
                {(() => {
                  const threat = getThreatLevel(result.is_safe, result.google_safe_browsing_malicious);
                  const Icon = threat.icon;
                  return (
                    <Badge variant={threat.color as any} className="text-sm">
                      <Icon className="w-4 h-4 mr-1" />
                      {threat.label}
                    </Badge>
                  );
                })()}
              </CardTitle>
              <CardDescription className="break-all">{result.url}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Google Safe Browsing */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Google Safe Browsing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.google_safe_browsing_malicious ? (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                        <div>
                          <p className="font-medium text-destructive">Amenaza Detectada</p>
                          <p className="text-sm text-muted-foreground">
                            Esta URL está en la base de datos de sitios maliciosos de Google
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-600">URL Segura</p>
                          <p className="text-sm text-muted-foreground">
                            No se encontraron amenazas conocidas
                          </p>
                        </div>
                      </div>
                    )}
                    {result.google_safe_browsing_error && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Error: {result.google_safe_browsing_error}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* urlscan.io */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      urlscan.io
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.urlscan_uuid ? (
                      <>
                        {analyzing ? (
                          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-600 mt-0.5 animate-spin flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium text-blue-600">Analizando...</p>
                              <p className="text-sm text-muted-foreground">
                                Esperando resultados del escaneo (~30-60 segundos)
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <div className="h-1 flex-1 bg-blue-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : urlscanData?.result ? (
                          <div className="space-y-3">
                            {/* Layout Horizontal: Screenshot + Veredicto */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Screenshot Thumbnail */}
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Vista Previa</p>
                                {urlscanData.result?.task?.screenshotURL ? (
                                  <div 
                                    className="relative rounded-lg border overflow-hidden bg-muted cursor-pointer group hover:ring-2 hover:ring-primary transition-all"
                                    onClick={() => window.open(urlscanData.result?.task?.screenshotURL || '', '_blank')}
                                  >
                                    <img 
                                      src={urlscanData.result.task.screenshotURL} 
                                      alt="Screenshot preview"
                                      className="w-full h-auto"
                                      onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23999"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                                      <div className="bg-white/90 dark:bg-black/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="w-4 h-4" />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="aspect-video rounded-lg border bg-muted flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                      <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                      <p className="text-xs">No disponible</p>
                                    </div>
                                  </div>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="w-full text-xs"
                                  onClick={() => window.open(urlscanData.result?.task?.screenshotURL || '', '_blank')}
                                  disabled={!urlscanData.result?.task?.screenshotURL}
                                >
                                  <ImageIcon className="w-3 h-3 mr-1" />
                                  Ver en Tamaño Completo
                                </Button>
                              </div>

                              {/* Veredicto y Detalles */}
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Veredicto</p>
                                  <div className="flex items-center gap-2 mb-2">
                                    {urlscanData.result?.verdicts?.overall?.malicious ? (
                                      <>
                                        <AlertTriangle className="w-5 h-5 text-destructive" />
                                        <Badge variant="destructive" className="text-sm">
                                          🚨 Malicioso
                                        </Badge>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        <Badge variant="outline" className="text-sm border-green-600 text-green-600">
                                          ✅ Seguro
                                        </Badge>
                                      </>
                                    )}
                                    <span className="text-sm font-medium ml-auto">
                                      Score: <span className={urlscanData.result?.verdicts?.overall?.score > 50 ? 'text-destructive' : 'text-green-600'}>
                                        {urlscanData.result?.verdicts?.overall?.score ?? 0}
                                      </span>
                                    </span>
                                  </div>
                                  
                                  {/* Categorías */}
                                  {urlscanData.result?.verdicts?.overall?.categories && 
                                   urlscanData.result.verdicts.overall.categories.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs text-muted-foreground mb-1">Categorías:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {urlscanData.result.verdicts.overall.categories.map((cat) => (
                                          <Badge key={cat} variant="secondary" className="text-xs">
                                            {cat}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Marcas Impersonadas */}
                                  {urlscanData.result?.verdicts?.overall?.brands && 
                                   urlscanData.result.verdicts.overall.brands.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs text-muted-foreground mb-1">Marcas detectadas:</p>
                                      <div className="space-y-1">
                                        {urlscanData.result.verdicts.overall.brands.slice(0, 2).map((brand, idx) => (
                                          <div key={idx} className="text-xs flex items-center gap-1">
                                            <Badge variant="outline" className="text-xs">{brand.name || 'Unknown'}</Badge>
                                            {brand.country && brand.country.length > 0 && (
                                              <span className="text-muted-foreground text-xs">
                                                ({brand.country.join(', ')})
                                              </span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Stats Rápidas */}
                                <div className="pt-2 border-t">
                                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Estadísticas</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="text-center p-2 bg-muted rounded">
                                      <p className="text-xs text-muted-foreground">IPs</p>
                                      <p className="text-lg font-bold">{urlscanData.result?.lists?.ips?.length ?? 0}</p>
                                    </div>
                                    <div className="text-center p-2 bg-muted rounded">
                                      <p className="text-xs text-muted-foreground">Dominios</p>
                                      <p className="text-lg font-bold">{urlscanData.result?.lists?.domains?.length ?? 0}</p>
                                    </div>
                                    <div className="text-center p-2 bg-muted rounded">
                                      <p className="text-xs text-muted-foreground">Enlaces</p>
                                      <p className="text-lg font-bold">{urlscanData.result?.stats?.totalLinks ?? 0}</p>
                                    </div>
                                    <div className="text-center p-2 bg-muted rounded">
                                      <p className="text-xs text-muted-foreground">Malicioso</p>
                                      <p className="text-lg font-bold text-destructive">{urlscanData.result?.stats?.malicious ?? 0}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex gap-2 pt-2 border-t">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => window.open(result.urlscan_report_url, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Ver Reporte Completo
                              </Button>
                              {urlscanData.result?.task?.domURL && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(urlscanData.result?.task?.domURL || '', '_blank')}
                                >
                                  <Globe className="w-4 h-4 mr-2" />
                                  Ver DOM
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-green-600">Enviado a urlscan.io</p>
                              <p className="text-sm text-muted-foreground">UUID: {result.urlscan_uuid}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Los resultados detallados aparecerán aquí automáticamente
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium text-muted-foreground">No Disponible</p>
                          <p className="text-sm text-muted-foreground">
                            {result.urlscan_error || 'No se pudo escanear con urlscan.io'}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis from urlscan.io */}
          {urlscanData?.result && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="screenshot">Captura</TabsTrigger>
                <TabsTrigger value="threats">Amenazas</TabsTrigger>
                <TabsTrigger value="technical">Técnico</TabsTrigger>
                <TabsTrigger value="network">Red</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Dominio</p>
                        <p className="font-medium">{urlscanData.result?.page?.domain || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">País</p>
                        <p className="font-medium">{urlscanData.result?.page?.country || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">IP</p>
                        <p className="font-medium font-mono text-sm">{urlscanData.result?.page?.ip || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Servidor</p>
                        <p className="font-medium">{urlscanData.result?.page?.server || 'N/A'}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Enlaces Totales</p>
                        <p className="font-medium text-2xl">{urlscanData.result?.stats?.totalLinks ?? 0}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Contenido Malicioso</p>
                        <p className="font-medium text-2xl">{urlscanData.result?.stats?.malicious ?? 0}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Ads Bloqueados</p>
                        <p className="font-medium text-2xl">{urlscanData.result?.stats?.adBlocked ?? 0}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Seguridad</p>
                        <p className="font-medium text-2xl">{urlscanData.result?.stats?.securePercentage ?? 0}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Screenshot Tab */}
              <TabsContent value="screenshot">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Captura de Pantalla
                    </CardTitle>
                    <CardDescription>
                      Visualización del sitio al momento del escaneo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {urlscanData.result?.task?.screenshotURL ? (
                      <>
                        <div className="rounded-lg border overflow-hidden bg-muted">
                          <img 
                            src={urlscanData.result.task.screenshotURL} 
                            alt="Screenshot del sitio"
                            className="w-full h-auto"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23f0f0f0" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23999"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(urlscanData.result?.task?.screenshotURL || '', '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ver en Tamaño Completo
                          </Button>
                          {urlscanData.result?.task?.domURL && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(urlscanData.result?.task?.domURL || '', '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Ver DOM
                            </Button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Captura de pantalla no disponible</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Threats Tab */}
              <TabsContent value="threats" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Veredictos de Seguridad</CardTitle>
                    <CardDescription>Análisis de amenazas detectadas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Overall Verdict */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Veredicto General
                      </h3>
                      <div className="p-4 rounded-lg border bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Score de Amenaza</span>
                          <Badge 
                            variant={urlscanData.result?.verdicts?.overall?.malicious ? 'destructive' : 'success'}
                          >
                            {urlscanData.result?.verdicts?.overall?.score ?? 0}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {urlscanData.result?.verdicts?.overall?.malicious ? (
                              <AlertTriangle className="w-4 h-4 text-destructive" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                            <span className="text-sm">
                              {urlscanData.result?.verdicts?.overall?.malicious ? 'Malicioso' : 'Seguro'}
                            </span>
                          </div>
                          {urlscanData.result?.verdicts?.overall?.categories && 
                           urlscanData.result.verdicts.overall.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {urlscanData.result.verdicts.overall.categories.map((cat) => (
                                <Badge key={cat} variant="outline">{cat}</Badge>
                              ))}
                            </div>
                          )}
                          {urlscanData.result?.verdicts?.overall?.brands && 
                           urlscanData.result.verdicts.overall.brands.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm text-muted-foreground mb-2">Marcas detectadas:</p>
                              <div className="space-y-1">
                                {urlscanData.result.verdicts.overall.brands.map((brand, idx) => (
                                  <div key={idx} className="text-sm flex items-center gap-2">
                                    <Badge variant="secondary">{brand.name || 'Unknown'}</Badge>
                                    {brand.country && brand.country.length > 0 && (
                                      <span className="text-muted-foreground">
                                        ({brand.country.join(', ')})
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* urlscan.io Verdict */}
                    <div>
                      <h3 className="font-semibold mb-3">urlscan.io Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-1">Score</p>
                          <p className="text-2xl font-bold">{urlscanData.result?.verdicts?.urlscan?.score ?? 0}</p>
                        </div>
                        <div className="p-4 rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-1">Estado</p>
                          <Badge variant={urlscanData.result?.verdicts?.urlscan?.malicious ? 'destructive' : 'success'}>
                            {urlscanData.result?.verdicts?.urlscan?.malicious ? 'Malicioso' : 'Limpio'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Community Verdict */}
                    <div>
                      <h3 className="font-semibold mb-3">Veredicto de la Comunidad</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg border text-center">
                          <p className="text-sm text-muted-foreground mb-1">Votos Totales</p>
                          <p className="text-2xl font-bold">{urlscanData.result?.verdicts?.community?.votesTotal ?? 0}</p>
                        </div>
                        <div className="p-4 rounded-lg border text-center">
                          <p className="text-sm text-muted-foreground mb-1">Maliciosos</p>
                          <p className="text-2xl font-bold text-destructive">
                            {urlscanData.result?.verdicts?.community?.votesMalicious ?? 0}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg border text-center">
                          <p className="text-sm text-muted-foreground mb-1">Benignos</p>
                          <p className="text-2xl font-bold text-green-600">
                            {urlscanData.result?.verdicts?.community?.votesBenign ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Technical Tab */}
              <TabsContent value="technical" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detalles Técnicos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Server className="w-4 h-4" />
                          Información del Servidor
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ASN:</span>
                            <span className="font-mono">{urlscanData.result?.page?.asn || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ASN Name:</span>
                            <span className="font-mono text-xs">{urlscanData.result?.page?.asnname || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ciudad:</span>
                            <span>{urlscanData.result?.page?.city || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Link2 className="w-4 h-4" />
                          Dominios Relacionados
                        </h4>
                        <div className="max-h-40 overflow-y-auto">
                          <div className="space-y-1">
                            {urlscanData.result?.lists?.domains && urlscanData.result.lists.domains.length > 0 ? (
                              urlscanData.result.lists.domains.map((domain, idx) => (
                                <div key={idx} className="text-sm font-mono p-2 bg-muted rounded">
                                  {domain}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No hay dominios disponibles</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Servidores Detectados</h4>
                      <div className="flex flex-wrap gap-2">
                        {urlscanData.result?.lists?.servers && urlscanData.result.lists.servers.length > 0 ? (
                          urlscanData.result.lists.servers.map((server, idx) => (
                            <Badge key={idx} variant="outline">{server}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No hay servidores detectados</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Network Tab */}
              <TabsContent value="network" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Análisis de Red</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg border text-center">
                        <MapPin className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">Países</p>
                        <p className="text-2xl font-bold">{urlscanData.result?.stats?.uniqCountries ?? 0}</p>
                      </div>
                      <div className="p-4 rounded-lg border text-center">
                        <Server className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">IPs</p>
                        <p className="text-2xl font-bold">{urlscanData.result?.lists?.ips?.length ?? 0}</p>
                      </div>
                      <div className="p-4 rounded-lg border text-center">
                        <Globe className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">Dominios</p>
                        <p className="text-2xl font-bold">{urlscanData.result?.lists?.domains?.length ?? 0}</p>
                      </div>
                      <div className="p-4 rounded-lg border text-center">
                        <Shield className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">Req. Seguros</p>
                        <p className="text-2xl font-bold">{urlscanData.result?.stats?.secureRequests ?? 0}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Direcciones IP</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {urlscanData.result?.lists?.ips && urlscanData.result.lists.ips.length > 0 ? (
                          urlscanData.result.lists.ips.map((ip, idx) => (
                            <div key={idx} className="p-3 bg-muted rounded-lg font-mono text-sm">
                              {ip}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No hay direcciones IP disponibles</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Países Detectados</h4>
                      <div className="flex flex-wrap gap-2">
                        {urlscanData.result?.lists?.countries && urlscanData.result.lists.countries.length > 0 ? (
                          urlscanData.result.lists.countries.map((country, idx) => (
                            <Badge key={idx} variant="secondary">{country}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No hay países detectados</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historial Reciente</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setHistory([]);
                  setResult(null);
                  setUrlscanData(null);
                  setError(null);
                  try {
                    localStorage.removeItem(LS_HISTORY_KEY);
                    localStorage.removeItem(LS_RESULT_KEY);
                    localStorage.removeItem(LS_URLSCAN_KEY);
                  } catch {}
                }}
              >
                Limpiar
              </Button>
            </div>
            <CardDescription>Últimas URLs analizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setUrl(item.url);
                    setResult(item);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.url}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.google_safe_browsing_malicious ? 'Amenaza detectada' : 'Segura'}
                    </p>
                  </div>
                  <Badge variant={item.is_safe ? 'success' : 'destructive'}>
                    {item.is_safe ? '✅' : '🚨'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
