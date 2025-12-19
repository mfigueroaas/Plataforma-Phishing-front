import { useEffect, useState } from 'react';
import { useGoPhishConfig } from '../gophish/ConfigContext';
import { useAuth } from '../auth/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { 
  apiGophishTemplates, 
  EmailTemplate, 
  EmailTemplateCreate, 
  EmailTemplateAttachment,
  EmailTemplateImportRequest
} from '../../lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Eye, Plus, Edit, Trash2, Loader2, Download, Copy, AlertCircle, ChevronDown } from 'lucide-react';

export function TemplateEditor() {
  const { activeConfig } = useGoPhishConfig();
  const { canCreateTemplates, canEditTemplates, canDeleteTemplates } = usePermissions();

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [formData, setFormData] = useState<EmailTemplateCreate>({
    name: '',
    subject: '',
    envelope_sender: '',
    html: '',
    text: '',
    attachments: []
  });

  const [importData, setImportData] = useState<EmailTemplateImportRequest>({
    content: '',
    convert_links: true,
    raw: ''
  });

  useEffect(() => {
    if (activeConfig) {
      loadTemplates();
    } else {
      setLoading(false);
      setError('No hay configuración activa. Por favor selecciona una en Configuración.');
    }
  }, [activeConfig]);

  const loadTemplates = async () => {
    if (!activeConfig) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGophishTemplates.list(activeConfig.id);
      setTemplates(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar plantillas de email');
      console.error('Error cargando templates:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!activeConfig) return;
    if (!formData.name || !formData.subject) {
      alert('Por favor completa al menos Nombre y Asunto');
      return;
    }
    setIsSaving(true);
    try {
      await apiGophishTemplates.create(activeConfig.id, formData);
      await loadTemplates();
      resetForm();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!activeConfig || !editingTemplate) return;
    setIsSaving(true);
    try {
      await apiGophishTemplates.update(activeConfig.id, editingTemplate.local_id, formData);
      await loadTemplates();
      setEditingTemplate(null);
      resetForm();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!activeConfig) return;
    if (!confirm('¿Eliminar esta plantilla?')) return;
    try {
      await apiGophishTemplates.delete(activeConfig.id, id);
      await loadTemplates();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  const openEditForm = (tpl: EmailTemplate) => {
    setEditingTemplate(tpl);
    setFormData({
      name: tpl.name,
      subject: tpl.subject,
      envelope_sender: tpl.envelope_sender || '',
      html: tpl.html || '',
      text: tpl.text || '',
      attachments: tpl.attachments || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setFormData({ name: '', subject: '', envelope_sender: '', html: '', text: '', attachments: [] });
    setImportData({ content: '', convert_links: true, raw: '' });
  };

  const openPreviewInNewWindow = (html: string) => {
    if (!html) {
      alert('No hay contenido HTML para previsualizar');
      return;
    }
    const previewWindow = window.open('', '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
    if (previewWindow) {
      previewWindow.document.open();
      previewWindow.document.write(html);
      previewWindow.document.close();
    } else {
      alert('No se pudo abrir la ventana de preview.');
    }
  };

  const handleImportPreview = async () => {
    if (!activeConfig) return;
    if (!importData.content) {
      alert('Pega el email RAW (RFC 2045)');
      return;
    }
    setIsImporting(true);
    try {
      const resp = await apiGophishTemplates.importPreview(activeConfig.id, importData);
      const html = resp?.preview?.html || resp?.html || '';
      const text = resp?.preview?.text || resp?.text || '';
      const subject = resp?.preview?.subject || resp?.subject || formData.subject;
      setFormData(prev => ({ ...prev, html, text, subject }));
      setIsImportDialogOpen(false);
      setImportData({ content: '', convert_links: true, raw: '' });
      alert('✅ Contenido importado. Revisa la vista previa.');
    } catch (e: any) {
      console.error('Error import preview:', e);
      alert(`Error al importar: ${e.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-rar-compressed'
  ];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleAttachmentFileChange = (idx: number, file: File) => {
    // ⬇️ VALIDACIÓN 1: Tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert(`❌ Tipo de archivo no permitido: ${file.type}\n\nFormatos permitidos:\n- PDF\n- Imágenes (PNG, JPG, GIF, WebP)\n- Documentos (Word, Excel)\n- Texto\n- ZIP, RAR`);
      return;
    }

    // ⬇️ VALIDACIÓN 2: Tamaño máximo
    if (file.size > MAX_FILE_SIZE) {
      alert(`❌ Archivo demasiado grande. Máximo 10MB. Tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const base64Content = content.split(',')[1] || content;
      
      const list = [...(formData.attachments || [])] as EmailTemplateAttachment[];
      list[idx] = {
        ...list[idx],
        name: file.name,
        type: file.type || 'application/octet-stream',
        content: base64Content
      };
      setFormData(prev => ({ ...prev, attachments: list }));
    };
    reader.onerror = () => {
      alert('❌ Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  };

  if (!activeConfig) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No hay configuración GoPhish activa. Por favor configura una en la sección de Configuración.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* FORMULARIO EDITOR - INLINE */}
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{editingTemplate ? `Editar: ${editingTemplate.name}` : 'Nueva Plantilla de Email'}</span>
            {editingTemplate && (
              <Button variant="ghost" size="sm" onClick={resetForm}>Cancelar edición</Button>
            )}
          </CardTitle>
          <CardDescription>
            {editingTemplate ? 'Modifica la plantilla existente' : 'Crea una nueva plantilla desde cero o importando un email RAW'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* NOMBRE / ASUNTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tpl-name" className="text-base font-semibold">Nombre *</Label>
              <Input id="tpl-name" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Mi plantilla" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tpl-subject" className="text-base font-semibold">Asunto *</Label>
              <Input id="tpl-subject" value={formData.subject} onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))} placeholder="Asunto del email" />
            </div>
          </div>

          {/* ENVELOPE SENDER + IMPORT */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex-1 space-y-2 w-full">
              <Label htmlFor="envelope" className="font-semibold">Envelope Sender</Label>
              <Input id="envelope" placeholder="bounce@domain.example" value={formData.envelope_sender || ''} onChange={e => setFormData(prev => ({ ...prev, envelope_sender: e.target.value }))} />
            </div>
            {!editingTemplate && (
              <Button variant="secondary" onClick={() => setIsImportDialogOpen(true)} className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Importar Email (RAW)
              </Button>
            )}
          </div>

          {/* EDITOR HTML/TEXT */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Contenido</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openPreviewInNewWindow(formData.html || '')} disabled={!formData.html}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Pantalla Completa
                </Button>
                <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(formData.html || ''); alert('✅ HTML copiado'); }} disabled={!formData.html}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar HTML
                </Button>
              </div>
            </div>

            <Tabs defaultValue="html">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="text">Texto Plano</TabsTrigger>
              </TabsList>
              <TabsContent value="html" className="mt-3">
                <textarea
                  value={formData.html}
                  onChange={e => setFormData(prev => ({ ...prev, html: e.target.value }))}
                  placeholder="<!DOCTYPE html>\n<html>..."
                  className="w-full h-[350px] p-3 border border-input rounded-lg bg-background text-sm font-mono resize-vertical focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </TabsContent>
              <TabsContent value="text" className="mt-3">
                <textarea
                  value={formData.text}
                  onChange={e => setFormData(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Contenido de texto plano..."
                  className="w-full h-[250px] p-3 border border-input rounded-lg bg-background text-sm font-mono resize-vertical focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* ADJUNTOS - COLLAPSIBLE */}
          <Collapsible className="border rounded-lg p-4">
            <CollapsibleTrigger className="flex items-center gap-2 font-semibold hover:text-primary">
              <ChevronDown className="w-4 h-4" />
              Adjuntos ({(formData.attachments || []).length})
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-3 pt-4 border-t">
              {(formData.attachments || []).map((att, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end p-3 border rounded-lg bg-muted/30">
                  {/* Nombre */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Nombre</Label>
                    <Input 
                      placeholder="documento.pdf" 
                      value={att.name} 
                      onChange={e => {
                        const list = [...(formData.attachments || [])] as EmailTemplateAttachment[];
                        list[idx] = { ...list[idx], name: e.target.value };
                        setFormData(prev => ({ ...prev, attachments: list }));
                      }}
                      readOnly={true}
                    />
                  </div>

                  {/* Tipo MIME */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Tipo MIME</Label>
                    <Input 
                      placeholder="application/pdf" 
                      value={att.type} 
                      onChange={e => {
                        const list = [...(formData.attachments || [])] as EmailTemplateAttachment[];
                        list[idx] = { ...list[idx], type: e.target.value };
                        setFormData(prev => ({ ...prev, attachments: list }));
                      }}
                    />
                  </div>

                  {/* Archivo */}
                  <div className="space-y-1">
                    <Label htmlFor={`file-${idx}`} className="text-xs font-semibold">Seleccionar Archivo</Label>
                    <input 
                      id={`file-${idx}`}
                      type="file" 
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleAttachmentFileChange(idx, file);
                        }
                      }}
                      className="block w-full text-xs border border-input rounded-md px-2 py-2 cursor-pointer"
                      accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip,.rar"
                    />
                  </div>

                  {/* Eliminar */}
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => {
                      const list = (formData.attachments || []).filter((_, i) => i !== idx);
                      setFormData(prev => ({ ...prev, attachments: list }));
                    }}
                    className="h-10"
                  >
                    ✕ Eliminar
                  </Button>
                </div>
              ))}
              
              {(formData.attachments || []).length === 0 && (
                <p className="text-sm text-muted-foreground italic">No hay adjuntos aún. Haz clic en "Agregar adjunto" para añadir uno.</p>
              )}

              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setFormData(prev => ({ ...prev, attachments: [ ...(prev.attachments || []), { name: '', type: 'application/octet-stream', content: '' } ] }))}
              >
                + Agregar adjunto
              </Button>
            </CollapsibleContent>
          </Collapsible>

          {/* VARIABLES DISPONIBLES - COLLAPSIBLE */}
          <Collapsible className="border rounded-lg p-4">
            <CollapsibleTrigger className="flex items-center gap-2 font-semibold hover:text-primary">
              <ChevronDown className="w-4 h-4" />
              Variables Disponibles
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 pt-4 border-t">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {[
                  { v: '{{.FirstName}}', d: 'Nombre del objetivo' },
                  { v: '{{.LastName}}', d: 'Apellido del objetivo' },
                  { v: '{{.Email}}', d: 'Email del objetivo' },
                  { v: '{{.Position}}', d: 'Cargo del objetivo' },
                  { v: '{{.URL}}', d: 'URL de la landing page' },
                  { v: '{{.TrackingURL}}', d: 'URL con tracking' },
                  { v: '{{.LastFour}}', d: 'Últimos 4 dígitos (simulado)' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-md border cursor-pointer hover:bg-muted transition-colors" onClick={() => setFormData(prev => ({ ...prev, html: (prev.html || '') + item.v }))}>
                    <div className="flex-1 min-w-0">
                      <code className="text-xs bg-muted px-1 rounded block truncate">{item.v}</code>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{item.d}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-1 flex-shrink-0" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(item.v); }}>
                      📋
                    </Button>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* ACCIONES */}
          {(editingTemplate ? canEditTemplates : canCreateTemplates) && (
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={editingTemplate ? handleUpdate : handleCreate} disabled={isSaving} size="lg">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (editingTemplate ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />)}
                {editingTemplate ? 'Guardar cambios' : 'Crear plantilla'}
              </Button>
              {editingTemplate && (
                <Button variant="outline" onClick={resetForm} size="lg">Cancelar</Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* LISTA DE PLANTILLAS */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Plantillas Creadas</h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : templates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No hay plantillas aún. Crea la primera arriba.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {templates.map(tpl => (
              <Card key={tpl.local_id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{tpl.name}</CardTitle>
                      <CardDescription className="mt-2 space-y-1">
                        <p className="text-sm">ID Local: {tpl.local_id} | GoPhish ID: {tpl.gophish_id}</p>
                        <p className="text-sm">Asunto: {tpl.subject}</p>
                        {tpl.envelope_sender && <p className="text-sm">Envelope Sender: {tpl.envelope_sender}</p>}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {tpl.attachments && tpl.attachments.length > 0 && (
                        <Badge variant="secondary">Adjuntos: {tpl.attachments.length}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Modificado: {new Date(tpl.modified_date || tpl.created_at).toLocaleString()}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openPreviewInNewWindow(tpl.html)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Vista Previa
                      </Button>
                      {canEditTemplates && (
                        <Button variant="outline" size="sm" onClick={() => openEditForm(tpl)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      )}
                      {canDeleteTemplates && (
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(tpl.local_id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* IMPORT DIALOG */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-3xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>Importar Email RAW</DialogTitle>
            <DialogDescription>
              Pega un email completo (RFC 2045). Opcionalmente convierte enlaces a {'{{.URL}}'}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="raw-content">Contenido RAW *</Label>
              <textarea
                id="raw-content"
                value={importData.content}
                onChange={e => setImportData(prev => ({ ...prev, content: e.target.value }))}
                placeholder={'From: Test <sender@example.com>\r\nTo: User <user@example.com>\r\nSubject: Import Test\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n<html><body>...</body></html>'}
                className="w-full h-[320px] p-3 border border-input rounded-lg bg-background text-sm font-mono resize-vertical focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="convert-links" checked={importData.convert_links} onCheckedChange={(checked) => setImportData(prev => ({ ...prev, convert_links: !!checked }))} />
              <Label htmlFor="convert-links" className="cursor-pointer">Convertir enlaces a {'{{.URL}}'}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleImportPreview} disabled={isImporting}>
              {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Importar y Previsualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}