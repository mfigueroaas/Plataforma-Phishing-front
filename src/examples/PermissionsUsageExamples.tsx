/**
 * EJEMPLO: Cómo actualizar componentes existentes para usar el hook de permisos
 * 
 * Este archivo muestra cómo reemplazar useAuth con usePermissions
 * en los componentes que necesiten verificar permisos específicos.
 */

import { useAuth } from '../components/auth/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

// ==========================================
// ANTES (usando useAuth)
// ==========================================
/*
import { useAuth } from '../auth/AuthContext';

function CampaignList() {
  const { canCreate, canDelete } = useAuth();
  
  return (
    <div>
      {canCreate && <Button>Nueva Campaña</Button>}
      {canDelete && <Button>Eliminar</Button>}
    </div>
  );
}
*/

// ==========================================
// DESPUÉS (usando usePermissions)
// ==========================================

function CampaignListExample() {
  const { 
    canCreateCampaigns, 
    canDeleteCampaigns,
    canViewCampaignResults,
    role 
  } = usePermissions();
  
  return (
    <div>
      <h1>Campañas</h1>
      
      {/* Solo mostrar botón si tiene permisos */}
      {canCreateCampaigns && (
        <button>Nueva Campaña</button>
      )}
      
      {/* Tabla de campañas (todos pueden ver) */}
      <table>
        {/* ... */}
      </table>
      
      {/* Acciones según permisos */}
      <div>
        {canViewCampaignResults && <button>Ver Resultados</button>}
        {canDeleteCampaigns && <button>Eliminar</button>}
      </div>
      
      {/* Mostrar rol actual para debug */}
      <p>Tu rol: {role}</p>
    </div>
  );
}

// ==========================================
// EJEMPLO: Templates
// ==========================================
function TemplateEditorExample() {
  const {
    canViewTemplates,
    canCreateTemplates,
    canEditTemplates,
    canDeleteTemplates,
    canImportTemplates
  } = usePermissions();

  if (!canViewTemplates) {
    return <div>No tienes permisos para ver templates</div>;
  }

  return (
    <div>
      <h1>Plantillas de Email</h1>
      
      {canCreateTemplates && (
        <button>Nueva Plantilla</button>
      )}
      
      {canImportTemplates && (
        <button>Importar Email</button>
      )}
      
      {/* Lista de templates */}
      <div>
        {/* Para cada template */}
        {canEditTemplates && <button>Editar</button>}
        {canDeleteTemplates && <button>Eliminar</button>}
      </div>
    </div>
  );
}

// ==========================================
// EJEMPLO: Grupos
// ==========================================
function GroupsExample() {
  const {
    canViewGroups,
    canCreateGroups,
    canEditGroups,
    canDeleteGroups,
    canImportGroups
  } = usePermissions();

  return (
    <div>
      <h1>Grupos de Usuarios</h1>
      
      <div className="actions">
        {canCreateGroups && (
          <button>Nuevo Grupo</button>
        )}
        {canImportGroups && (
          <button>Importar CSV</button>
        )}
      </div>
      
      {/* Tabla de grupos */}
      <table>
        <tbody>
          <tr>
            <td>Grupo de Marketing</td>
            <td>
              {canEditGroups && <button>Editar</button>}
              {canDeleteGroups && <button>Eliminar</button>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// EJEMPLO: Landing Pages
// ==========================================
function LandingPagesExample() {
  const {
    canCreateLandingPages,
    canEditLandingPages,
    canDeleteLandingPages,
    canImportLandingPages,
    isPlatformAdmin,
    isOperator
  } = usePermissions();

  return (
    <div>
      <h1>Páginas de Destino</h1>
      
      {/* Mostrar diferentes UI según rol */}
      {isPlatformAdmin() && (
        <div className="admin-tools">
          <p>⚠️ Herramientas de administrador</p>
        </div>
      )}
      
      {isOperator() && (
        <div className="operator-tools">
          <p>🛠️ Herramientas de operador</p>
        </div>
      )}
      
      <div className="actions">
        {canCreateLandingPages && (
          <button>Nueva Landing Page</button>
        )}
        {canImportLandingPages && (
          <button>Importar Sitio</button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// EJEMPLO: Configuraciones GoPhish
// ==========================================
function SettingsExample() {
  const {
    canViewConfigs,
    canCreateConfigs,
    canEditConfigs,
    canDeleteConfigs,
    canTestConfigs
  } = usePermissions();

  if (!canViewConfigs) {
    return <div>Acceso denegado</div>;
  }

  return (
    <div>
      <h1>Configuraciones GoPhish</h1>
      
      {canCreateConfigs && (
        <button>Nueva Configuración</button>
      )}
      
      {/* Lista de configs */}
      <div className="config-list">
        <div className="config-item">
          <h3>Servidor Principal</h3>
          {canTestConfigs && (
            <button>Probar Conexión</button>
          )}
          {canEditConfigs && (
            <button>Editar</button>
          )}
          {canDeleteConfigs && (
            <button>Eliminar</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// EJEMPLO: Combinando con useAuth
// ==========================================
function CompleteExample() {
  // useAuth para datos del usuario
  const { user, logout } = useAuth();
  
  // usePermissions para verificaciones específicas
  const {
    canCreateCampaigns,
    canManageUsers,
    role
  } = usePermissions();

  return (
    <div>
      <header>
        <h1>Bienvenido, {user?.name}</h1>
        <p>Rol: {role}</p>
        <button onClick={logout}>Cerrar Sesión</button>
      </header>
      
      <nav>
        {canCreateCampaigns && (
          <a href="/campaigns/new">Nueva Campaña</a>
        )}
        {canManageUsers && (
          <a href="/admin/users">Gestionar Usuarios</a>
        )}
      </nav>
    </div>
  );
}

export {
  CampaignListExample,
  TemplateEditorExample,
  GroupsExample,
  LandingPagesExample,
  SettingsExample,
  CompleteExample
};
