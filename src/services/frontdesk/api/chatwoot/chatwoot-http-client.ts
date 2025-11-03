import { getUserToken } from "@/services/storage-data";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("ChatwootHttpClient");

/**
 * Base HTTP client for Chatwoot API integration.
 *
 * Base URL: http://localhost:8080
 * Authentication: GoMake bearer token (same as other FrontDesk services)
 *
 * This client handles authentication, error handling, and response parsing
 * for all Chatwoot API endpoints.
 */
export class ChatwootHttpClient {
  protected baseUrl: string;

  constructor(baseUrl: string = "http://localhost:8080") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
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

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
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

      throw new Error(errorMessage);
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
   */
  protected async post<T>(
    endpoint: string,
    body?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request helper
   */
  protected async put<T>(
    endpoint: string,
    body?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request helper
   */
  protected async patch<T>(
    endpoint: string,
    body?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request helper
   */
  protected async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

