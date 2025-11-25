import { getUserToken } from "@/services/storage-data";
import { createLogger } from "@/services/frontdesk/utils/logger";
import config from "@/config";

const logger = createLogger("ChatwootHttpClient");

/**
 * Base HTTP client for Chatwoot API integration.
 *
 * Base URL: Uses CHATWOOT_SERVER from config (defaults to http://localhost:8080 for development)
 * Production URL: https://messaging-hub-1052023886201.europe-west3.run.app
 * Authentication: GoMake bearer token (same as other FrontDesk services)
 *
 * This client handles authentication, error handling, and response parsing
 * for all Chatwoot API endpoints.
 */
export class ChatwootHttpClient {
  protected baseUrl: string;

  constructor(baseUrl?: string) {
    // Use provided baseUrl, or config.chatwoot_server, or fallback to localhost
    const defaultUrl = config.chatwoot_server || "http://localhost:8080";
    this.baseUrl = (baseUrl || defaultUrl).replace(/\/$/, "");
  }

  /**
   * Make an HTTP request to the Chatwoot API
   * @param endpoint - API endpoint (e.g., "/api/profile")
   * @param options - Fetch options (method, body, headers, etc.)
   * @returns Response data
   */
  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getUserToken();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    const url = `${this.baseUrl}${normalizedEndpoint}`;

    // Check if body is FormData - if so, don't set Content-Type (browser will set it with boundary)
    const isFormData = options.body instanceof FormData;
    
    // Build headers
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };
    
    // Only set Content-Type for non-FormData requests
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    
    // Merge with any custom headers (but filter out empty Content-Type for FormData)
    if (options.headers) {
      const customHeaders = options.headers as Record<string, string>;
      Object.entries(customHeaders).forEach(([key, value]) => {
        // Skip empty Content-Type (used by FormData requests to signal "don't set it")
        if (key.toLowerCase() === 'content-type' && (!value || value === '')) {
          return;
        }
        headers[key] = value;
      });
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (error) {
      // Network error (CORS, connection refused, DNS failure, etc.)
      const networkError = new Error(
        `Network error: Unable to connect to Chatwoot API at ${this.baseUrl}. ` +
        `Please ensure the Chatwoot service is running and accessible.`
      );
      logger.error("Network request failed", { url, error });
      throw networkError;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        errorData.error ||
        (typeof errorData === "string" ? errorData : null) ||
        `HTTP error! status: ${response.status}`;

      logger.error(`API request failed: ${errorMessage}`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorData,
      });

      // Create error with additional properties for error handling
      const error = new Error(errorMessage) as Error & {
        status?: number;
        errorData?: any;
        attributes?: string[];
      };
      error.status = response.status;
      error.errorData = errorData;
      error.attributes = errorData.attributes || [];
      throw error;
    }

    // Handle binary responses (like file downloads)
    const contentType = response.headers.get("content-type") || "";
    if (
      contentType.includes("application/octet-stream") ||
      contentType.includes("application/pdf") ||
      contentType.includes("image/") ||
      !contentType.includes("application/json")
    ) {
      return response.blob() as Promise<T>;
    }

    const json = await response.json();

    // Return the JSON response (Chatwoot may have different response format)
    return json as T;
  }

  /**
   * GET request helper
   */
  protected async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request helper
   * Handles both JSON and FormData payloads automatically
   */
  protected async post<T>(
    endpoint: string,
    body?: any,
    options: RequestInit = {}
  ): Promise<T> {
    // Check if body is FormData - if so, pass it directly without stringifying
    const isFormData = body instanceof FormData;
    
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  }

  /**
   * PUT request helper
   * Handles both JSON and FormData payloads automatically
   */
  protected async put<T>(
    endpoint: string,
    body?: any,
    options: RequestInit = {}
  ): Promise<T> {
    // Check if body is FormData - if so, pass it directly without stringifying
    const isFormData = body instanceof FormData;
    
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  }

  /**
   * PATCH request helper
   * Handles both JSON and FormData payloads automatically
   */
  protected async patch<T>(
    endpoint: string,
    body?: any,
    options: RequestInit = {}
  ): Promise<T> {
    // Check if body is FormData - if so, pass it directly without stringifying
    const isFormData = body instanceof FormData;
    
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  }

  /**
   * DELETE request helper
   */
  protected async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

