import config from "@/config";
import { getUserToken } from "@/services/storage-data";

/**
 * Base HTTP client for all messaging hub REST API calls.
 * Handles authentication, response unwrapping, and error handling in one place.
 *
 * The messaging hub backend returns responses in the format:
 * {
 *   success: boolean,
 *   data: T,
 *   meta: { correlationId, timestamp, path }
 * }
 *
 * This client automatically unwraps the response to return just the `data` field.
 */
export class MessagingHubHttpClient {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = config.messaging_server.replace(/\/$/, "");
  }

  /**
   * Make an HTTP request to the messaging hub
   * @param endpoint - API endpoint (e.g., "/dms", "/email/accounts")
   * @param options - Fetch options (method, body, headers, etc.)
   * @returns Unwrapped data from the response
   */
  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getUserToken();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        errorData.error ||
        (typeof errorData === 'string' ? errorData : null) ||
        `HTTP error! status: ${response.status}`;

      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorData,
        errorMessage
      });

      throw new Error(errorMessage);
    }

    // Handle binary responses (like file downloads)
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/octet-stream") ||
        contentType.includes("application/pdf") ||
        contentType.includes("image/") ||
        !contentType.includes("application/json")) {
      return response.blob() as Promise<T>;
    }

    const json = await response.json();

    // Auto-unwrap messaging hub response format: {success, data, meta}
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return json.data as T;
    }

    // Return as-is if not wrapped (for backwards compatibility)
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
  protected async post<T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request helper
   */
  protected async put<T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request helper
   */
  protected async patch<T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
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