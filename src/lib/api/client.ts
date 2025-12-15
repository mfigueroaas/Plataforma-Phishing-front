// Minimal API client with automatic Firebase Bearer token injection
// Configure base URL via VITE_API_BASE_URL (e.g. http://localhost:8080/api/v1)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const headers = new Headers(options.headers as HeadersInit);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error || errorJson.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
}

// ============ USUARIOS ============
export interface BackendUser {
  id: number;
  firebase_uid: string;
  name: string;
  email: string;
  role: 'viewer' | 'operator' | 'platform_admin';
}

export const apiUsers = {
  me: (): Promise<BackendUser> => apiFetch('/users/me'),
  
  // Admin endpoints
  listAll: (): Promise<BackendUser[]> => apiFetch('/admin/users'),
  updateRole: (userId: number, role: string): Promise<void> =>
    apiFetch(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    })
};

// ============ CONFIGURACIONES GOPHISH ============
export interface GoPhishConfig {
  id: number;
  name: string;
  base_url: string;
  owner_userid: number;
  created_at: string;
}

export interface GoPhishConfigCreate {
  name: string;
  base_url: string;
  api_key: string;
}

export interface GoPhishTestResponse {
  ok: boolean;
  status: number;
  snippet?: string;
  error?: string;
}

export const apiGoPhishConfigs = {
  list: (): Promise<GoPhishConfig[]> => apiFetch('/gophish/configs'),
  
  get: (id: number): Promise<GoPhishConfig> => apiFetch(`/gophish/configs/${id}`),
  
  create: (data: GoPhishConfigCreate): Promise<GoPhishConfig> =>
    apiFetch('/gophish/configs', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  update: (id: number, data: Partial<GoPhishConfigCreate>): Promise<GoPhishConfig> =>
    apiFetch(`/gophish/configs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  delete: (id: number): Promise<void> =>
    apiFetch(`/gophish/configs/${id}`, { method: 'DELETE' }),
  
  test: (id: number): Promise<GoPhishTestResponse> =>
    apiFetch(`/gophish/configs/${id}/test`)
};

// ============ PLANTILLAS (placeholder) ============
export const apiTemplates = {
  validate: (content: string): Promise<{ valid: boolean; errors?: string[] }> =>
    apiFetch('/templates/validate', {
      method: 'POST',
      body: JSON.stringify({ content })
    })
};

// ============ SMTP (placeholder) ============
export const apiSMTP = {
  test: (config: any): Promise<{ ok: boolean; error?: string }> =>
    apiFetch('/smtp/test', {
      method: 'POST',
      body: JSON.stringify(config)
    })
};

// ============ TEMPLATES (GoPhish) ============
export interface EmailTemplateAttachment {
  content: string;
  name: string;
  type: string;
}

export interface EmailTemplate {
  local_id: number;
  gophish_id: number;
  name: string;
  subject: string;
  envelope_sender?: string;
  html: string;
  text: string;
  attachments?: EmailTemplateAttachment[];
  created_at: string;
  modified_date: string;
}

export interface EmailTemplateCreate {
  attachments?: EmailTemplateAttachment[];
  envelope_sender?: string;
  html: string;
  name: string;
  subject: string;
  text: string;
}

export interface EmailTemplateUpdate {
  attachments?: EmailTemplateAttachment[];
  envelope_sender?: string;
  html?: string;
  name?: string;
  subject?: string;
  text?: string;
}

export interface EmailTemplateImportRequest {
  content: string; // raw RFC 2045 email
  convert_links: boolean;
  raw?: string;
}

export interface EmailTemplateImportResponse {
  action?: string;
  preview?: {
    html?: string;
    text?: string;
    subject?: string;
  };
  template?: {
    html?: string;
    text?: string;
    subject?: string;
    envelope_sender?: string;
    attachments?: EmailTemplateAttachment[];
  };
  html?: string;
  text?: string;
  subject?: string;
}

export const apiGophishTemplates = {
  list: (configId: number): Promise<EmailTemplate[]> =>
    apiFetch(`/gophish/${configId}/templates`),

  get: (configId: number, id: number): Promise<EmailTemplate> =>
    apiFetch(`/gophish/${configId}/templates/${id}`),

  create: (configId: number, data: EmailTemplateCreate): Promise<EmailTemplate> =>
    apiFetch(`/gophish/${configId}/templates`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (configId: number, id: number, data: EmailTemplateUpdate): Promise<EmailTemplate> =>
    apiFetch(`/gophish/${configId}/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (configId: number, id: number): Promise<void> =>
    apiFetch(`/gophish/${configId}/templates/${id}/remote`, { method: 'DELETE' }),

  importPreview: (configId: number, data: EmailTemplateImportRequest): Promise<EmailTemplateImportResponse> =>
    apiFetch(`/gophish/${configId}/templates/import-email/preview`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
};

// ============ PERFILES DE ENVÍO (SENDING PROFILES) ============
export interface SendingProfileHeader {
  key: string;
  value: string;
}

export interface SendingProfile {
  local_id: number;
  gophish_id: number;
  name: string;
  interface_type: string;
  from_address: string;
  host: string;
  username: string;
  ignore_cert_errors: boolean;
  headers: SendingProfileHeader[];
  created_at: string;
  modified_date: string;
}

export interface SendingProfileCreate {
  name: string;
  interface_type: string;
  from_address: string;
  host: string;
  username: string;
  password: string;
  ignore_cert_errors: boolean;
  headers?: SendingProfileHeader[];
}

export interface SendingProfileUpdate {
  name?: string;
  interface_type?: string;
  from_address?: string;
  host?: string;
  username?: string;
  password?: string;
  ignore_cert_errors?: boolean;
  headers?: SendingProfileHeader[];
}

export const apiSendingProfiles = {
  list: (configId: number): Promise<SendingProfile[]> => 
    apiFetch(`/gophish/${configId}/sending-profiles`),
  
  get: (configId: number, profileId: number): Promise<SendingProfile> => 
    apiFetch(`/gophish/${configId}/sending-profiles/${profileId}`),
  
  create: (configId: number, data: SendingProfileCreate): Promise<SendingProfile> =>
    apiFetch(`/gophish/${configId}/sending-profiles`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  update: (configId: number, profileId: number, data: SendingProfileUpdate): Promise<SendingProfile> =>
    apiFetch(`/gophish/${configId}/sending-profiles/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  delete: (configId: number, profileId: number): Promise<void> =>
    apiFetch(`/gophish/${configId}/sending-profiles/${profileId}/remote`, {
      method: 'DELETE'
    })
};

// ============ PÁGINAS DE DESTINO (LANDING PAGES) ============
export interface LandingPage {
  local_id: number;
  gophish_id: number;
  name: string;
  html: string;
  redirect_url: string;
  capture_credentials: boolean;
  capture_passwords: boolean;
  created_at: string;
  updated_at: string;
  modified_date: string;
}

export interface LandingPageCreate {
  name: string;
  html: string;
  redirect_url: string;
  capture_credentials: boolean;
  capture_passwords: boolean;
}

export interface LandingPageUpdate {
  name?: string;
  html?: string;
  redirect_url?: string;
  capture_credentials?: boolean;
  capture_passwords?: boolean;
}

export interface LandingPageImportPreview {
  include_resources: boolean;
  url: string;
}

// ⬇️ ACTUALIZAR tipo de retorno
export interface LandingPageImportResponse {
  html: string;
  action: string;
  preview: {
    html: string;
  };
}

export const apiLandingPages = {
  list: (configId: number): Promise<LandingPage[]> => 
    apiFetch(`/gophish/${configId}/landing-pages`),
  
  get: (configId: number, pageId: number): Promise<LandingPage> => 
    apiFetch(`/gophish/${configId}/landing-pages/${pageId}`),
  
  create: (configId: number, data: LandingPageCreate): Promise<LandingPage> => {
    const payload = {
      name: data.name,
      html: data.html,
      redirect_url: data.redirect_url,
      capture_credentials: data.capture_credentials,
      capture_passwords: data.capture_passwords
    };
    console.log('🔵 API Client - Landing Page Create:', payload);
    return apiFetch(`/gophish/${configId}/landing-pages`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  
  update: (configId: number, pageId: number, data: LandingPageUpdate): Promise<LandingPage> => {
    const payload: any = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.html !== undefined) payload.html = data.html;
    if (data.redirect_url !== undefined) payload.redirect_url = data.redirect_url;
    if (data.capture_credentials !== undefined) payload.capture_credentials = data.capture_credentials;
    if (data.capture_passwords !== undefined) payload.capture_passwords = data.capture_passwords;
    
    console.log('🔵 API Client - Landing Page Update:', payload);
    return apiFetch(`/gophish/${configId}/landing-pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },
  
  delete: (configId: number, pageId: number): Promise<void> =>
    apiFetch(`/gophish/${configId}/landing-pages/${pageId}/remote`, {
      method: 'DELETE'
    }),
  
  importPreview: (configId: number, data: LandingPageImportPreview): Promise<LandingPageImportResponse> => {
    console.log('🔵 API Client - Landing Page Import Preview:', data);
    return apiFetch(`/gophish/${configId}/landing-pages/import-site/preview`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    .then(response => {
      console.log('🔵 API Client - Import Response:', response);
      return response;
    });
  }
};
