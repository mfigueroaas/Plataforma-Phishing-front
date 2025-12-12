import { useState, useEffect } from 'react';
import { useGoPhishConfig } from '../gophish/ConfigContext';
import { useAuth } from '../auth/AuthContext';
import { apiLandingPages, LandingPage, LandingPageCreate } from '../../lib/api/client';
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
import { Globe, Plus, Trash2, Edit, Loader2, AlertCircle, Eye, Download, Code, Copy, Check } from 'lucide-react';

export function LandingPages() {
  const { activeConfig } = useGoPhishConfig();
  const { canCreate, canEdit, canDelete } = useAuth();
  
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const [editingPage, setEditingPage] = useState<LandingPage | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const [formData, setFormData] = useState<LandingPageCreate>({
    name: '',
    html: '',
    redirect_url: '',
    capture_credentials: false,
    capture_passwords: false
  });

  const [importData, setImportData] = useState({
    url: '',
    include_resources: false
  });

  useEffect(() => {
    if (activeConfig) {
      loadPages();
    } else {
      setLoading(false);
      setError('No hay configuración activa. Por favor selecciona una en Configuración.');
    }
  }, [activeConfig]);

  const loadPages = async () => {
    if (!activeConfig) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await apiLandingPages.list(activeConfig.id);
      setPages(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar páginas de destino');
      console.error('Error cargando landing pages:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!activeConfig) return;
    if (!formData.name || !formData.html || !formData.redirect_url) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    if (formData.capture_passwords && !formData.capture_credentials) {
      alert('Para capturar contraseñas, primero debe estar habilitada la captura de datos');
      return;
    }

    setIsSaving(true);
    try {
      await apiLandingPages.create(activeConfig.id, formData);
      await loadPages();
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!activeConfig || !editingPage) return;

    setIsSaving(true);
    try {
      await apiLandingPages.update(activeConfig.id, editingPage.local_id, formData);
      await loadPages();
      setIsEditDialogOpen(false);
      setEditingPage(null);
      resetForm();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (pageId: number) => {
    if (!activeConfig) return;
    if (!confirm('¿Estás seguro de eliminar esta página de destino?')) return;

    try {
      await apiLandingPages.delete(activeConfig.id, pageId);
      await loadPages();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  // ⬇️ Extraer HTML del response (como jq -r '.preview.html')
  const extractHtmlFromResponse = (response: any): string => {
    if (typeof response === 'string') {
      return response;
    }
    if (response?.preview?.html) {
      return response.preview.html;
    }
    if (response?.html) {
      return response.html;
    }
    throw new Error('No se pudo extraer HTML de la respuesta');
  };

  const handleImportPreview = async () => {
    if (!activeConfig) return;
    if (!importData.url) {
      alert('Por favor ingresa una URL válida');
      return;
    }

    setIsImporting(true);
    try {
      const result = await apiLandingPages.importPreview(activeConfig.id, {
        url: importData.url,
        include_resources: importData.include_resources
      });
      
      console.log('📥 Resultado de importación:', result);
      
      // ⬇️ Extraer HTML (como jq -r '.preview.html')
      const htmlContent = extractHtmlFromResponse(result);
      
      console.log('✅ HTML importado (primeros 200 caracteres):', htmlContent.substring(0, 200));
      
      setFormData(prev => ({
        ...prev,
        html: htmlContent
      }));
      
      setIsImportDialogOpen(false);
      setImportData({ url: '', include_resources: false });
      
      alert('✅ HTML importado correctamente. Revisa la vista previa en el editor.');
    } catch (e: any) {
      console.error('❌ Error al importar sitio:', e);
      alert(`Error al importar: ${e.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const openEditDialog = (page: LandingPage) => {
    setEditingPage(page);
    setFormData({
      name: page.name,
      html: page.html,
      redirect_url: page.redirect_url,
      capture_credentials: page.capture_credentials,
      capture_passwords: page.capture_passwords
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      html: '',
      redirect_url: '',
      capture_credentials: false,
      capture_passwords: false
    });
    setImportData({ url: '', include_resources: false });
  };

  const openPreviewInNewWindow = () => {
    if (!formData.html) {
      alert('No hay contenido HTML para previsualizar');
      return;
    }

    const previewWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    if (previewWindow) {
      previewWindow.document.open();
      previewWindow.document.write(formData.html);
      previewWindow.document.close();
    } else {
      alert('No se pudo abrir la ventana de preview. Verifica que no esté bloqueada por el navegador.');
    }
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Páginas de Destino</h1>
          <p className="text-muted-foreground mt-2">
            Crea y gestiona páginas de phishing educativo
          </p>
        </div>
        {canCreate() && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Página
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : pages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay páginas de destino configuradas</p>
            {canCreate() && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Página
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pages.map(page => (
            <Card key={page.local_id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      {page.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="space-y-1">
                        <p>ID Local: {page.local_id} | GoPhish ID: {page.gophish_id}</p>
                        <p>Redirigir a: <a href={page.redirect_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{page.redirect_url}</a></p>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {page.capture_credentials && (
                      <Badge variant="secondary" title="Captura datos del formulario">
                        📝 Datos
                      </Badge>
                    )}
                    {page.capture_passwords && (
                      <Badge variant="destructive" title="Captura contraseñas (no encriptadas)">
                        🔑 Contraseñas
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Creada: {new Date(page.created_at).toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      setPreviewHtml(page.html);
                      setIsPreviewDialogOpen(true);
                    }}>
                      <Eye className="w-4 h-4 mr-2" />
                      Vista Previa
                    </Button>
                    {canEdit() && (
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(page)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                    {canDelete() && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(page.local_id)}
                      >
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

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setEditingPage(null);
          resetForm();
        }
      }}>
        {/* ⬇️ CAMBIO 1: Aumentar tamaño máximo del diálogo */}
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? 'Editar Página de Destino' : 'Nueva Página de Destino'}
            </DialogTitle>
            <DialogDescription>
              {editingPage 
                ? 'Modifica la configuración de la página de destino' 
                : 'Diseña una página de phishing educativo con HTML personalizado'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* NOMBRE */}
            <div className="space-y-2">
              <Label htmlFor="page-name" className="text-base font-semibold">
                Nombre de la Página *
              </Label>
              <Input
                id="page-name"
                placeholder="Login Falso - UTEM"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* IMPORTAR SITIO */}
            {!editingPage && (
              <div>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsImportDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Importar Sitio Web
                </Button>
              </div>
            )}

            {/* EDITOR HTML */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Contenido HTML *</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={openPreviewInNewWindow}
                    disabled={!formData.html}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(formData.html);
                      alert('✅ HTML copiado al portapapeles');
                    }}
                    disabled={!formData.html}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
              </div>
              
              {/* ⬇️ CAMBIO 2: Aumentar altura del textarea */}
              <textarea
                value={formData.html}
                onChange={e => setFormData(prev => ({ ...prev, html: e.target.value }))}
                placeholder="<!DOCTYPE html>&#10;<html>&#10;  <head>...&#10;</html>"
                className="w-full h-[500px] p-3 border border-input rounded-lg bg-background text-sm font-mono resize-vertical focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground">
                Edita directamente el HTML. Puedes pegar el contenido del sitio importado o escribir HTML personalizado.
              </p>
            </div>

            {/* CAPTURA Y REDIRECT */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-start space-x-3 p-3 border rounded-lg bg-amber-50 dark:bg-amber-950">
                <Checkbox
                  id="capture-creds"
                  checked={formData.capture_credentials}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      capture_credentials: checked as boolean,
                      capture_passwords: (checked as boolean) ? prev.capture_passwords : false
                    }))
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="capture-creds" className="cursor-pointer font-semibold">
                    📝 Capturar Datos Enviados
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    ⚠️ Si la página contiene un formulario, se capturarán todos los datos ingresados EXCEPTO contraseñas
                  </p>
                </div>
              </div>

              {formData.capture_credentials && (
                <div className="flex items-start space-x-3 p-3 border rounded-lg bg-red-50 dark:bg-red-950">
                  <Checkbox
                    id="capture-passwords"
                    checked={formData.capture_passwords}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, capture_passwords: checked as boolean }))
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="capture-passwords" className="cursor-pointer font-semibold">
                      🔑 Capturar Contraseñas
                    </Label>
                    <p className="text-xs text-destructive mt-1">
                      ⚠️ ADVERTENCIA: Las contraseñas capturadas se almacenan en la base de datos sin encriptar. ¡Usa con cuidado!
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="redirect-url" className="font-semibold">
                  Redirigir a: *
                </Label>
                <Input
                  id="redirect-url"
                  type="url"
                  placeholder="https://utem.cl"
                  value={formData.redirect_url}
                  onChange={e => setFormData(prev => ({ ...prev, redirect_url: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  El usuario será redirigido a esta URL después de enviar el formulario
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false);
              setIsEditDialogOpen(false);
              setEditingPage(null);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={editingPage ? handleUpdate : handleCreate} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (editingPage ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />)}
              {editingPage ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Sitio Web</DialogTitle>
            <DialogDescription>
              Obtén el HTML de un sitio web para usar como plantilla
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-url">URL del Sitio *</Label>
              <Input
                id="import-url"
                type="url"
                placeholder="https://ejemplo.com/login"
                value={importData.url}
                onChange={e => setImportData(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-resources"
                checked={importData.include_resources}
                onCheckedChange={(checked) => 
                  setImportData(prev => ({ ...prev, include_resources: checked as boolean }))
                }
              />
              <Label htmlFor="include-resources" className="cursor-pointer">
                Incluir recursos (CSS, JS, imágenes)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImportPreview} disabled={isImporting}>
              {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog - ⬇️ CAMBIO 3: Abre en nueva ventana */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Vista Previa de Página</DialogTitle>
            <DialogDescription>
              Visualización de cómo se verá la página de destino
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4">
            <div className="border rounded-lg overflow-auto bg-white dark:bg-slate-950" style={{ height: '600px' }}>
              <iframe
                srcDoc={previewHtml}
                title="Landing Page Preview"
                className="w-full h-full border-0"
                sandbox="allow-same-origin"
              />
            </div>
            
            <Button 
              onClick={() => {
                const previewWindow = window.open('', '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
                if (previewWindow) {
                  previewWindow.document.open();
                  previewWindow.document.write(previewHtml);
                  previewWindow.document.close();
                }
              }}
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              Abrir en Nueva Ventana
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}