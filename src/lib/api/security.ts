// API client for URL security analysis
import { apiFetch } from './client';

export interface AnalyzeURLResponse {
  url: string;
  google_safe_browsing_malicious: boolean;
  google_safe_browsing_error?: string;
  urlscan_uuid?: string;
  urlscan_report_url?: string;
  urlscan_message?: string;
  urlscan_error?: string;
  is_safe: boolean;
}

export interface UrlScanVerdict {
  malicious: boolean;
  score: number;
  categories?: string[];
  brands?: Array<{
    name: string;
    country: string[];
  }>;
  tags?: string[];
}

export interface UrlScanResult {
  uuid: string;
  status: string;
  waited_ms: number;
  result?: {
    task: {
      uuid: string;
      time: string;
      url: string;
      visibility: string;
      method: string;
      reportURL: string;
      screenshotURL: string;
      domURL: string;
    };
    page: {
      url: string;
      domain: string;
      country: string;
      ip: string;
      server: string;
      city: string;
      asn: string;
      asnname: string;
    };
    verdicts: {
      overall: UrlScanVerdict;
      urlscan: UrlScanVerdict;
      engines: UrlScanVerdict;
      community: UrlScanVerdict;
    };
    stats: {
      malicious: number;
      adBlocked: number;
      totalLinks: number;
      uniqCountries: number;
      secureRequests: number;
      securePercentage: number;
    };
    lists: {
      ips: string[];
      countries: string[];
      domains: string[];
      servers: string[];
      urls: string[];
      linkDomains: string[];
    };
  };
}

export interface PollUrlScanRequest {
  uuid: string;
  initial_wait_seconds?: number;
  interval_seconds?: number;
  max_attempts?: number;
}

/**
 * Analyze a URL for security threats using Google Safe Browsing and urlscan.io
 */
export async function analyzeUrl(url: string): Promise<AnalyzeURLResponse> {
  return apiFetch('/security/analyze-url', {
    method: 'POST',
    body: JSON.stringify({ url })
  });
}

/**
 * Check only Google Safe Browsing (faster, no urlscan)
 */
export async function checkSafeBrowsing(url: string): Promise<AnalyzeURLResponse> {
  return apiFetch('/security/check-safe-browsing', {
    method: 'POST',
    body: JSON.stringify({ url })
  });
}

/**
 * Submit URL to urlscan.io for scanning
 */
export async function scanWithUrlScan(url: string): Promise<AnalyzeURLResponse> {
  return apiFetch('/security/scan-urlscan', {
    method: 'POST',
    body: JSON.stringify({ url })
  });
}

/**
 * Poll urlscan.io for scan results
 */
export async function pollUrlScanResult(request: PollUrlScanRequest): Promise<UrlScanResult> {
  return apiFetch('/security/urlscan-result', {
    method: 'POST',
    body: JSON.stringify(request)
  });
}

/**
 * Validate URLs in a campaign before creation
 */
export async function validateCampaignUrl(campaignId: number): Promise<any> {
  return apiFetch(`/security/campaigns/${campaignId}/validate-url`, {
    method: 'POST'
  });
}

/**
 * Get security analysis for campaign URLs
 */
export async function getCampaignUrlSecurity(campaignId: number): Promise<any> {
  return apiFetch(`/security/campaigns/${campaignId}/url-analysis`, {
    method: 'GET'
  });
}

/**
 * Bulk validate multiple URLs
 */
export async function bulkValidateUrls(urls: string[]): Promise<any> {
  return apiFetch('/security/bulk-validate-urls', {
    method: 'POST',
    body: JSON.stringify({ urls })
  });
}
