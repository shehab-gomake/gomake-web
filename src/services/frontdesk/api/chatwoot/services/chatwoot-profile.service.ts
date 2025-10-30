/**
 * Chatwoot Profile Service
 * 
 * Handles user profile endpoints that don't require account_id
 * 
 * @see ProfileApi.md
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";
import { ChatwootUser } from "../types/profile.types";

export class ChatwootProfileService extends BaseChatwootService {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  /**
   * Get User Profile
   * GET /api/v1/profile
   * 
   * Retrieves the current user's profile information from Chatwoot.
   * Returns complete user details including accounts, role, and custom attributes.
   * 
   * @returns Promise<ChatwootUser> - User profile data
   * 
   * @example
   * ```typescript
   * const profileService = new ChatwootProfileService();
   * const user = await profileService.getProfile();
   * console.log(user.name, user.email, user.accounts);
   * ```
   * 
   * @see ProfileApi.md - fetchProfile endpoint
   */
  async getProfile(): Promise<ChatwootUser> {
    return await this.get<ChatwootUser>(this.globalUrl("profile"));
  }
}

