import { useEffect, useState } from 'react';
import { analyzePhishingWithAI, PhishingAnalysisResponse } from '../../lib/api/security';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Brain, 
  Loader2, 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  Link as LinkIcon,
  Mail,
  FileText,
  AlertCircle,
  Info,
  Clock,
  Trash2
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export function AIPhishingDetector() {
  const [rawEmail, setRawEmail] = useState('');
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhishingAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(true);
  const [lastRequestAt, setLastRequestAt] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!lastRequestAt) {
      setCooldown(0);
      return;
    }

    const tick = () => {
      const diff = Date.now() - lastRequestAt;
      const remaining = Math.max(0, 30 - Math.floor(diff / 1000));
      setCooldown(remaining);
    };

    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [lastRequestAt]);

    // Helper para truncar texto largo
    const truncateText = (text: string, maxLength: number = 500): string => {
      if (!text) return 'No disponible';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '... [truncado]';
    };

    // Helper para obtener valor seguro de análisis
    const getSafeAnalysisValue = (value: string | undefined, defaultText: string = 'No disponible'): string => {
      if (!value || value.trim() === '') return defaultText;
      return truncateText(value, 300);
    };

  const handleAnalyze = async () => {
    if (!rawEmail.trim()) {
      setError('Por favor ingresa el contenido del correo');
      return;
    }

    if (cooldown > 0) {
      setError(`Debes esperar ${cooldown}s antes de enviar otro análisis.`);
      return;
    }

    setShowRaw(false);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      setLastRequestAt(Date.now());
      const response = await analyzePhishingWithAI(rawEmail, language);
      setResult(response);
    } catch (e: any) {
      setError(e?.message || 'Error al analizar el correo');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setRawEmail('');
    setResult(null);
    setError(null);
    setShowRaw(true);
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" />Crítico</Badge>;
      case 'HIGH':
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" />Alto</Badge>;
      case 'MEDIUM':
        return <Badge className="gap-1 bg-orange-500 hover:bg-orange-600"><Info className="w-3 h-3" />Medio</Badge>;
      case 'LOW':
        return <Badge variant="secondary" className="gap-1"><CheckCircle className="w-3 h-3" />Bajo</Badge>;
      default:
        return <Badge variant="outline">{riskLevel}</Badge>;
    }
  };

  const getPhishingBadge = (isPhishing: boolean) => {
    return isPhishing ? (
      <Badge variant="destructive" className="gap-1 text-sm">
        <AlertTriangle className="w-4 h-4" />
        Phishing Detectado
      </Badge>
    ) : (
      <Badge className="gap-1 text-sm bg-green-100 hover:bg-green-200 text-green-800 border-green-300">
        <Shield className="w-4 h-4" />
        Correo Legítimo
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold">Detector de Phishing con IA</h1>
        </div>
        <p className="text-muted-foreground">
          Analiza correos electrónicos usando inteligencia artificial para detectar intentos de phishing
        </p>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Ingresa el Correo a Analizar
          </CardTitle>
          <CardDescription>
            Pega el contenido completo del correo electrónico en formato raw (incluyendo headers)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma de Análisis</Label>
              <Select value={language} onValueChange={(val: 'es' | 'en') => setLanguage(val)}>
                <SelectTrigger id="language" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowRaw((prev) => !prev)}
              disabled={loading}
              className="sm:ml-4"
            >
              {showRaw ? 'Ocultar contenido raw' : 'Mostrar contenido raw'}
            </Button>
          </div>

          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              maxHeight: showRaw ? '70vh' : 0,
              opacity: showRaw ? 1 : 0,
              pointerEvents: showRaw ? 'auto' : 'none'
            }}
          >
            <div className="space-y-2 pt-2">
              <Label htmlFor="rawEmail">Contenido del Correo (Raw)</Label>
              <Textarea
                id="rawEmail"
                placeholder="Pega aquí el contenido completo del correo en formato raw..."
                value={rawEmail}
                onChange={(e) => setRawEmail(e.target.value)}
                className="min-h-[240px] font-mono text-xs"
                style={{ maxHeight: '60vh', overflow: 'auto' }}
              />
              <p className="text-xs text-muted-foreground">
                Incluye todos los headers (From, To, Subject, Authentication-Results, etc.)
              </p>
            </div>
          </div>

          {!showRaw && (
            <Alert variant="default" className="border-primary/30 bg-primary/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Contenido raw oculto</AlertTitle>
              <AlertDescription>
                El contenido del correo se minimizó para enfocar el resultado del análisis. Puedes mostrarlo de nuevo con el botón superior.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleAnalyze} 
              disabled={loading || !rawEmail.trim() || cooldown > 0}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analizando...
                </>
              ) : cooldown > 0 ? (
                <>
                  <Clock className="w-4 h-4" />
                  Espera {cooldown}s
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Analizar con IA
                </>
              )}
            </Button>
            
            {rawEmail.trim() && (
              <Button 
                onClick={handleClear}
                variant="outline"
                disabled={loading}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary Card */}
          <Card className={result.summary.is_phishing ? 'border-destructive' : 'border-green-600'}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 mb-2">
                    <Shield className="w-6 h-6" />
                    Resultado del Análisis
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {getPhishingBadge(result.summary.is_phishing)}
                    {getRiskBadge(result.summary.risk_level)}
                    <Badge variant="outline" className="gap-1">
                      <Brain className="w-3 h-3" />
                      Confianza: {result.summary.confidence_score}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Veredicto de la IA:</p>
                  <p className="text-sm text-muted-foreground">
                    {truncateText(result.ai_analysis.verdict_reason || 'No disponible', 500)}
                  </p>
              </div>

                {result.ai_analysis.flags && result.ai_analysis.flags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">🚩 Indicadores Detectados:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.ai_analysis.flags.map((flag, idx) => (
                        <Badge 
                          key={idx} 
                          variant={flag.includes('ERROR') ? 'outline' : 'destructive'} 
                          className="text-xs"
                        >
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

                {result.ai_analysis.flags?.some(f => f.includes('ERROR')) && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error en el Análisis</AlertTitle>
                    <AlertDescription>
                      La IA tuvo problemas al parsear la respuesta. Los resultados pueden estar incompletos.
                      Revisa la "Respuesta Raw de la IA" para más detalles.
                    </AlertDescription>
                  </Alert>
                )}
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Análisis Detallado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full gap-2">
                <AccordionItem value="ai-analysis">
                  <AccordionTrigger className="py-3 px-3 rounded-md bg-muted/40 hover:bg-muted/60 text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Análisis de IA
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 px-1">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="p-4 rounded-lg border bg-card shadow-sm">
                        <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                          <span className="text-lg">🔐</span> Autenticación
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getSafeAnalysisValue(result.ai_analysis.analysis?.auth_check)}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border bg-card shadow-sm">
                        <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                          <span className="text-lg">📧</span> Consistencia del Remitente
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getSafeAnalysisValue(result.ai_analysis.analysis?.sender_consistency)}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border bg-card shadow-sm md:col-span-2">
                        <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                          <span className="text-lg">🎭</span> Ingeniería Social
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getSafeAnalysisValue(result.ai_analysis.analysis?.social_engineering)}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="links">
                  <AccordionTrigger className="py-3 px-3 rounded-md bg-muted/40 hover:bg-muted/60 text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Enlaces Detectados ({result.email_report.links.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 px-1">
                    {result.email_report.links.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No se detectaron enlaces</p>
                    ) : (
                      <div className="space-y-2">
                        {result.email_report.links.map((link, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-md border ${
                              link.is_suspicious 
                                ? 'bg-destructive/10 border-destructive/30' 
                                : 'bg-muted border-border'
                            }`}
                          >
                            <div className="flex items-start gap-2 mb-1">
                              {link.is_suspicious && <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium break-words">
                                  Texto: &quot;{link.visible_text}&quot;
                                </p>
                                <p className="text-xs text-muted-foreground break-all mt-1">
                                  Destino: {link.actual_url}
                                </p>
                              </div>
                            </div>
                            {link.is_suspicious && (
                              <Badge variant="destructive" className="text-xs mt-2">
                                ⚠️ Sospechoso
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="headers">
                  <AccordionTrigger className="py-3 px-3 rounded-md bg-muted/40 hover:bg-muted/60 text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Headers del Correo
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 px-1">
                    <div className="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto">
                      {Object.entries(result.email_report.headers).map(([key, value]) => (
                        <div key={key} className="mb-2">
                          <span className="text-primary font-semibold">{key}:</span>{' '}
                          <span className="text-muted-foreground break-all">{value}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="content">
                  <AccordionTrigger className="py-3 px-3 rounded-md bg-muted/40 hover:bg-muted/60 text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Contenido del Correo
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 px-1">
                    <div className="bg-muted p-4 rounded-md max-h-96 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap break-words text-muted-foreground">
                        {result.email_report.text_content}
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="raw-response">
                  <AccordionTrigger className="py-3 px-3 rounded-md bg-muted/40 hover:bg-muted/60 text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Respuesta Raw de la IA
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 px-1">
                    <div className="bg-muted p-4 rounded-md max-h-96 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap break-words text-muted-foreground font-mono">
                          {truncateText(result.ai_analysis.raw_ai_response || 'No disponible', 2000)}
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
