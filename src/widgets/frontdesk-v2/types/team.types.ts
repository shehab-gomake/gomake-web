/**
 * FrontDesk V2 - Team Types
 */

export interface Team {
  id: number;
  name: string;
  description: string | null;
  allow_auto_assign: boolean;
  account_id: number;
  is_member: boolean;
  created_at: number;
  updated_at: number;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  thumbnail: string | null;
  availability_status: string;
}

export interface TeamPayload {
  name: string;
  description?: string;
  allow_auto_assign?: boolean;
}

export interface TeamUpdatePayload {
  name?: string;
  description?: string;
  allow_auto_assign?: boolean;
}

