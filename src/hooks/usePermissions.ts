import { useAuth } from '../components/auth/AuthContext';

/**
 * Hook para verificar permisos según la matriz de ROLES_PERMISSION.md
 * 
 * Jerarquía de roles:
 * platform_admin (nivel más alto) > operator > viewer (nivel más bajo)
 */
export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role;

  // Helper: platform_admin siempre tiene acceso
  const isPlatformAdmin = () => role === 'platform_admin';
  const isOperator = () => role === 'operator';
  const isViewer = () => role === 'viewer';

  return {
    // Gestión de Usuarios (solo platform_admin)
    canManageUsers: isPlatformAdmin(),
    canCreateUsers: isPlatformAdmin(),
    canDeleteUsers: isPlatformAdmin(),
    canChangeUserRoles: isPlatformAdmin(),

    // GoPhish Configs
    canViewConfigs: true, // todos los roles
    canCreateConfigs: isOperator() || isPlatformAdmin(),
    canEditConfigs: isOperator() || isPlatformAdmin(),
    canDeleteConfigs: isOperator() || isPlatformAdmin(),
    canTestConfigs: isOperator() || isPlatformAdmin(),

    // Campañas
    canViewCampaigns: true, // todos los roles
    canCreateCampaigns: isOperator() || isPlatformAdmin(),
    canDeleteCampaigns: isOperator() || isPlatformAdmin(),
    canCompleteCampaigns: isOperator() || isPlatformAdmin(),
    canViewCampaignResults: true, // todos los roles
    canSyncCampaigns: true, // todos los roles
    canValidateUrls: isOperator() || isPlatformAdmin(),

    // Templates
    canViewTemplates: true, // todos los roles
    canCreateTemplates: isOperator() || isPlatformAdmin(),
    canEditTemplates: isOperator() || isPlatformAdmin(),
    canDeleteTemplates: isOperator() || isPlatformAdmin(),
    canImportTemplates: isOperator() || isPlatformAdmin(),

    // Landing Pages
    canViewLandingPages: true, // todos los roles
    canCreateLandingPages: isOperator() || isPlatformAdmin(),
    canEditLandingPages: isOperator() || isPlatformAdmin(),
    canDeleteLandingPages: isOperator() || isPlatformAdmin(),
    canImportLandingPages: isOperator() || isPlatformAdmin(),

    // Groups
    canViewGroups: true, // todos los roles
    canCreateGroups: isOperator() || isPlatformAdmin(),
    canEditGroups: isOperator() || isPlatformAdmin(),
    canDeleteGroups: isOperator() || isPlatformAdmin(),
    canImportGroups: isOperator() || isPlatformAdmin(),

    // Sending Profiles
    canViewSendingProfiles: true, // todos los roles
    canCreateSendingProfiles: isOperator() || isPlatformAdmin(),
    canEditSendingProfiles: isOperator() || isPlatformAdmin(),
    canDeleteSendingProfiles: isOperator() || isPlatformAdmin(),

    // Security & URL Analysis
    canAnalyzeUrls: true, // todos los roles
    canUseSafeBrowsing: true, // todos los roles
    canUseUrlScan: true, // todos los roles

    // Helpers genéricos
    role,
    isPlatformAdmin,
    isOperator,
    isViewer,
    canCreate: isOperator() || isPlatformAdmin(),
    canEdit: isOperator() || isPlatformAdmin(),
    canDelete: isOperator() || isPlatformAdmin(),
  };
}
