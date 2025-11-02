/**
 * Chatwoot Profile Types
 *
 * Type definitions for profile-related API responses
 * @see ProfileApi.md
 */

/**
 * User Account (nested within User accounts array)
 * @see UserAccountsInner.md
 */
export interface ChatwootUserAccount {
  id?: number;
  name?: string;
  status?: string;
  active_at?: string;
  role?: string;
  permissions?: string[];
  availability?: string;
  availability_status?: string;
  auto_offline?: boolean;
  custom_role_id?: number;
  custom_role?: Record<string, any>;
}

/**
 * Chatwoot User Profile
 * GET /api/accounts/profile
 * @see User.md
 */
export interface ChatwootUser {
  id?: number;
  access_token?: string;
  account_id?: number;
  available_name?: string;
  avatar_url?: string;
  confirmed?: boolean;
  display_name?: string;
  message_signature?: string;
  email?: string;
  hmac_identifier?: string;
  inviter_id?: number;
  name?: string;
  provider?: string;
  pubsub_token?: string;
  role?: string;
  ui_settings?: Record<string, any>;
  uid?: string;
  type?: string;
  custom_attributes?: Record<string, any>;
  accounts?: ChatwootUserAccount[];
}
