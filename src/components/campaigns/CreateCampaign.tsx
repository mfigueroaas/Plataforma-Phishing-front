import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useGoPhishConfig } from '../gophish/ConfigContext';
import { 
  apiCampaigns, 
  apiUserGroups, 
  apiGophishTemplates, 
  apiLandingPages, 
  apiSendingProfiles,
  UserGroup,
  EmailTemplate,
  LandingPage,
  SendingProfile,
  CampaignCreate
} from '../../lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  Mail, 
  Send,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface CreateCampaignProps {
  onBack: () => void;
}

export function CreateCampaign({ onBack }: CreateCampaignProps) {
  const { canCreate } = useAuth();
  const { activeConfig } = useGoPhishConfig();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [sendingProfiles, setSendingProfiles] = useState<SendingProfile[]>([]);

  const [campaignData, setCampaignData] = useState({
    name: '',
    url: '',
    launchDate: '',
    sendByDate: '',
    selectedGroups: [] as string[],
    selectedTemplate: '',
    selectedLandingPage: '',
    selectedSendingProfile: ''
  });

  useEffect(() => {
    if (activeConfig?.id) {
      loadResources();
    }
  }, [activeConfig?.id]);

  const loadResources = async () => {
    if (!activeConfig?.id) return;
    setLoading(true);
    try {
      const [groupsData, templatesData, landingData, sendingData] = await Promise.all([
        apiUserGroups.list(activeConfig.id),
        apiGophishTemplates.list(activeConfig.id),
        apiLandingPages.list(activeConfig.id),
        apiSendingProfiles.list(activeConfig.id)
      ]);
      setGroups(groupsData);
      setTemplates(templatesData);
      setLandingPages(landingData);
      setSendingProfiles(sendingData);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar recursos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!activeConfig?.id || !canCreate) return;
    
    // Construir payload solo con campos requeridos y válidos
    const payload: any = {
      name: campaignData.name.trim(),
      url: campaignData.url.trim(),
      launch_date: campaignData.launchDate ? new Date(campaignData.launchDate).toISOString() : new Date().toISOString(),
      group_names: campaignData.selectedGroups,
      template_name: campaignData.selectedTemplate.trim(),
      page_name: campaignData.selectedLandingPage.trim(),
      smtp_name: campaignData.selectedSendingProfile.trim()
    };

    // Agregar send_by_date solo si está presente
    if (campaignData.sendByDate) {
      payload.send_by_date = new Date(campaignData.sendByDate).toISOString();
    }

    console.log('📤 Payload de campaña:', payload);

    setLoading(true);
    setError(null);
    try {
      await apiCampaigns.create(activeConfig.id, payload);
      alert('Campaña creada exitosamente');
      onBack(); // Navigate back to campaign list
    } catch (e: any) {
      setError(e?.message || 'Error al crear campaña');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'basic', label: 'Información Básica', icon: Clock },
    { id: 'targets', label: 'Objetivos', icon: Users },
    { id: 'template', label: 'Plantilla', icon: Mail },
    { id: 'sending', label: 'Perfil de Envío', icon: Send },
    { id: 'review', label: 'Revisión', icon: CheckCircle }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Campaña *</Label>
              <Input
                id="name"
                placeholder="Ej: Entrenamiento Phishing Q1 2024"
                value={campaignData.name}
                onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL de la campaña *</Label>
              <Input
                id="url"
                placeholder="https://midominio.com"
                value={campaignData.url}
                onChange={(e) => setCampaignData({ ...campaignData, url: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">URL base donde se alojarán las landing pages</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="launchDate">Fecha de lanzamiento</Label>
                <Input
                  id="launchDate"
                  type="datetime-local"
                  value={campaignData.launchDate}
                  onChange={(e) => setCampaignData({ ...campaignData, launchDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sendByDate">Enviar antes de (opcional)</Label>
                <Input
                  id="sendByDate"
                  type="datetime-local"
                  value={campaignData.sendByDate}
                  onChange={(e) => setCampaignData({ ...campaignData, sendByDate: e.target.value })}
                />
              </div>
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Asegúrate de que esta campaña esté aprobada por el equipo de RRHH y cumpla con las políticas de la empresa.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Grupos de Objetivos *</Label>
              {loading && <div className="text-sm text-muted-foreground">Cargando grupos...</div>}
              {!loading && groups.length === 0 && (
                <Alert>
                  <AlertDescription>No hay grupos disponibles. Crea un grupo primero.</AlertDescription>
                </Alert>
              )}
              {!loading && groups.length > 0 && (
                <div className="space-y-2 border rounded-md p-4">
                  {groups.map((group) => (
                    <label key={group.local_id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={campaignData.selectedGroups.includes(group.name)}
                        onChange={(e) => {
                          const newGroups = e.target.checked
                            ? [...campaignData.selectedGroups, group.name]
                            : campaignData.selectedGroups.filter(g => g !== group.name);
                          setCampaignData({ ...campaignData, selectedGroups: newGroups });
                        }}
                        className="rounded"
                      />
                      <span className="font-medium">{group.name}</span>
                      <span className="text-sm text-muted-foreground">({group.targets?.length || 0} usuarios)</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {campaignData.selectedGroups.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resumen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    <strong>{campaignData.selectedGroups.length}</strong> grupo(s) seleccionado(s)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total de usuarios: <strong>
                      {groups
                        .filter(g => campaignData.selectedGroups.includes(g.name))
                        .reduce((sum, g) => sum + (g.targets?.length || 0), 0)}
                    </strong>
                  </p>
                </CardContent>
              </Card>
            )}

            {campaignData.selectedGroups.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Usuarios por grupo seleccionado</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    {groups
                      .filter(g => campaignData.selectedGroups.includes(g.name))
                      .map((group) => (
                        <AccordionItem key={group.local_id} value={`group-${group.local_id}`}>
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{group.name}</span>
                              <span className="text-xs text-muted-foreground">({group.targets?.length || 0} usuarios)</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {group.targets && group.targets.length > 0 ? (
                              <div className="border rounded-md overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Email</TableHead>
                                      <TableHead>Nombre</TableHead>
                                      <TableHead>Apellido</TableHead>
                                      <TableHead>Posición</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {group.targets.map((t, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell className="text-sm">{t.email}</TableCell>
                                        <TableCell className="text-sm">{t.first_name || '—'}</TableCell>
                                        <TableCell className="text-sm">{t.last_name || '—'}</TableCell>
                                        <TableCell className="text-sm">{t.position || '—'}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Este grupo no tiene usuarios.</div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="template">Plantilla de Email *</Label>
              {loading && <div className="text-sm text-muted-foreground">Cargando plantillas...</div>}
              {!loading && (
                <Select 
                  value={campaignData.selectedTemplate} 
                  onValueChange={(value: string) => setCampaignData({ ...campaignData, selectedTemplate: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.local_id} value={template.name}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="landingPage">Página de destino *</Label>
              {loading && <div className="text-sm text-muted-foreground">Cargando páginas...</div>}
              {!loading && (
                <Select 
                  value={campaignData.selectedLandingPage} 
                  onValueChange={(value: string) => setCampaignData({ ...campaignData, selectedLandingPage: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una página" />
                  </SelectTrigger>
                  <SelectContent>
                    {landingPages.map((page) => (
                      <SelectItem key={page.local_id} value={page.name}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {campaignData.selectedTemplate && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Plantilla seleccionada: <strong>{campaignData.selectedTemplate}</strong>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sendingProfile">Perfil de Envío (SMTP) *</Label>
              {loading && <div className="text-sm text-muted-foreground">Cargando perfiles...</div>}
              {!loading && (
                <Select 
                  value={campaignData.selectedSendingProfile} 
                  onValueChange={(value: string) => setCampaignData({ ...campaignData, selectedSendingProfile: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un perfil SMTP" />
                  </SelectTrigger>
                  <SelectContent>
                    {sendingProfiles.map((profile) => (
                      <SelectItem key={profile.local_id} value={profile.name}>
                        {profile.name} ({profile.from_address})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {campaignData.selectedSendingProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Configuración SMTP</CardTitle>
                </CardHeader>
                <CardContent>
                  {sendingProfiles.find(p => p.name === campaignData.selectedSendingProfile) && (
                    <div className="space-y-1 text-sm">
                      <p><strong>Perfil:</strong> {campaignData.selectedSendingProfile}</p>
                      <p><strong>De:</strong> {sendingProfiles.find(p => p.name === campaignData.selectedSendingProfile)?.from_address}</p>
                      <p><strong>Host:</strong> {sendingProfiles.find(p => p.name === campaignData.selectedSendingProfile)?.host}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de la Campaña</CardTitle>
                <CardDescription>
                  Revisa la configuración antes de crear la campaña
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nombre</p>
                    <p className="font-medium">{campaignData.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">URL</p>
                    <p className="font-medium">{campaignData.url || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Grupos</p>
                    <p className="font-medium">{campaignData.selectedGroups.join(', ') || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Plantilla</p>
                    <p className="font-medium">{campaignData.selectedTemplate || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Página de destino</p>
                    <p className="font-medium">{campaignData.selectedLandingPage || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Perfil SMTP</p>
                    <p className="font-medium">{campaignData.selectedSendingProfile || '—'}</p>
                  </div>
                </div>
                
                <Separator />

                {/* Botones de previsualización */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const t = templates.find(x => x.name === campaignData.selectedTemplate);
                      if (!t) {
                        alert('Plantilla no encontrada');
                        return;
                      }
                      const html = (t.html && t.html.trim())
                        ? t.html
                        : `<pre style="white-space:pre-wrap;font-family:ui-monospace,monospace;padding:16px">${(t.text || '')
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, '&quot;')}</pre>`;
                      const previewWindow = window.open('', '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
                      if (!previewWindow) {
                        alert('Bloqueador de ventanas emergentes activo. Permite las ventanas emergentes.');
                        return;
                      }
                      previewWindow.document.open();
                      previewWindow.document.write(html);
                      previewWindow.document.close();
                    }}
                    disabled={!campaignData.selectedTemplate}
                  >
                    Previsualizar plantilla
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const p = landingPages.find(x => x.name === campaignData.selectedLandingPage);
                      if (!p) {
                        alert('Página de destino no encontrada');
                        return;
                      }
                      const html = p.html || '<div style="padding:16px">Sin contenido HTML</div>';
                      const previewWindow = window.open('', '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
                      if (!previewWindow) {
                        alert('Bloqueador de ventanas emergentes activo. Permite las ventanas emergentes.');
                        return;
                      }
                      previewWindow.document.open();
                      previewWindow.document.write(html);
                      previewWindow.document.close();
                    }}
                    disabled={!campaignData.selectedLandingPage}
                  >
                    Previsualizar landing
                  </Button>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Alert>
                  <CheckCircle className="h-4 h-4" />
                  <AlertDescription>
                    La campaña está lista para ser creada. Haz clic en "Crear campaña" para continuar.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (!activeConfig?.id) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTitle>Configuración requerida</AlertTitle>
          <AlertDescription>
            Selecciona una configuración de GoPhish para crear campañas.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Volver a Campañas
        </Button>
        <div>
          <h1>Nueva Campaña</h1>
          <p className="text-muted-foreground">
            Crea una nueva campaña de phishing educativo paso a paso
          </p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Paso {currentStep + 1} de {steps.length}</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% completado
            </span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} />
          
          <div className="flex justify-between mt-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <span className={`text-xs text-center max-w-20 ${
                  index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].label}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 0 || loading}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button 
            onClick={handleCreateCampaign}
            disabled={loading || !canCreate || !campaignData.name || !campaignData.url || campaignData.selectedGroups.length === 0 || !campaignData.selectedTemplate || !campaignData.selectedLandingPage || !campaignData.selectedSendingProfile}
            className="gap-2"
          >
            {loading ? 'Creando...' : 'Crear campaña'}
            <CheckCircle className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            onClick={nextStep}
            disabled={loading}
            className="gap-2"
          >
            Siguiente
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
