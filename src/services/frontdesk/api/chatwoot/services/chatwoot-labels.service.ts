/**
 * Chatwoot Labels Service
 *
 * Handles all label-related endpoints for managing labels in an account.
 * Labels are used to categorize and organize conversations and contacts.
 *
 * @see Chatwoot API Guide - LabelsApi
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";
import type { Label, LabelListResponse, LabelDetailResponse } from "../types/labels.types";

/**
 * Create Label Payload
 */
export interface CreateLabelPayload {
  title: string;
  description?: string;
  color?: string;
  show_on_sidebar?: boolean;
}

/**
 * Update Label Payload
 */
export interface UpdateLabelPayload {
  title?: string;
  description?: string;
  color?: string;
  show_on_sidebar?: boolean;
}

/**
 * ChatwootLabelsService
 * Handles label-related API operations
 *
 * @example
 * ```typescript
 * const labelsService = new ChatwootLabelsService();
 *
 * // List all labels in account
 * const labels = await labelsService.listLabels(accountId);
 *
 * // Create a new label
 * const newLabel = await labelsService.createLabel(accountId, {
 *   title: "Urgent",
 *   color: "#FF0000",
 *   show_on_sidebar: true
 * });
 * ```
 */
export class ChatwootLabelsService extends BaseChatwootService {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  /**
   * List All Labels in Account
   * GET /api/accounts/labels
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * Fetches all labels in the account.
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @returns Promise with array of labels
   *
   * @example
   * ```typescript
   * const labels = await labelsService.listLabels(123);
   * console.log(labels); // [{ id: 1, title: 'Urgent', color: '#FF0000', ... }]
   * ```
   */
  async listLabels(accountId: number): Promise<Label[]> {
    const response = await this.get<LabelListResponse>(`/api/accounts/labels`);
    // Handle different response formats
    if (response?.data?.payload) {
      return response.data.payload;
    }
    if (Array.isArray(response?.payload)) {
      return response.payload;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  }

  /**
   * Get Label Details
   * GET /api/accounts/labels/{id}
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * Fetches details for a specific label.
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param labelId - The numeric ID of the label
   * @returns Promise with label details
   *
   * @example
   * ```typescript
   * const label = await labelsService.getLabel(123, 1);
   * console.log(label); // { id: 1, title: 'Urgent', color: '#FF0000', ... }
   * ```
   */
  async getLabel(accountId: number, labelId: number): Promise<Label> {
    const response = await this.get<LabelDetailResponse>(`/api/accounts/labels/${labelId}`);
    // Handle different response formats
    if (response?.data?.payload) {
      return response.data.payload;
    }
    if (response?.payload) {
      return response.payload;
    }
    return response as Label;
  }

  /**
   * Create New Label
   * POST /api/accounts/labels
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * Creates a new label in the account.
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param payload - Label creation payload
   * @returns Promise with created label
   *
   * @example
   * ```typescript
   * const label = await labelsService.createLabel(123, {
   *   title: "Urgent",
   *   color: "#FF0000",
   *   show_on_sidebar: true
   * });
   * ```
   */
  async createLabel(accountId: number, payload: CreateLabelPayload): Promise<Label> {
    // Chatwoot API expects the payload wrapped in a "label" key
    const requestBody = { label: payload };
    const response = await this.post<LabelDetailResponse>(`/api/accounts/labels`, requestBody);
    // Handle different response formats
    if (response?.data?.payload) {
      return response.data.payload;
    }
    if (response?.payload) {
      return response.payload;
    }
    return response as Label;
  }

  /**
   * Update Label
   * PUT /api/accounts/labels/{id}
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * Updates an existing label.
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param labelId - The numeric ID of the label
   * @param payload - Label update payload
   * @returns Promise with updated label
   *
   * @example
   * ```typescript
   * const updatedLabel = await labelsService.updateLabel(123, 1, {
   *   color: "#00FF00",
   *   show_on_sidebar: false
   * });
   * ```
   */
  async updateLabel(accountId: number, labelId: number, payload: UpdateLabelPayload): Promise<Label> {
    // Chatwoot API expects the payload wrapped in a "label" key
    const requestBody = { label: payload };
    const response = await this.put<LabelDetailResponse>(`/api/accounts/labels/${labelId}`, requestBody);
    // Handle different response formats
    if (response?.data?.payload) {
      return response.data.payload;
    }
    if (response?.payload) {
      return response.payload;
    }
    return response as Label;
  }

  /**
   * Delete Label
   * DELETE /api/accounts/labels/{id}
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * Deletes a label from the account.
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param labelId - The numeric ID of the label
   * @returns Promise that resolves when deletion is complete
   *
   * @example
   * ```typescript
   * await labelsService.deleteLabel(123, 1);
   * ```
   */
  async deleteLabel(accountId: number, labelId: number): Promise<void> {
    await this.delete(`/api/accounts/labels/${labelId}`);
  }
}

