/**
 * FrontDesk V2 - Agent/User Types
 * Based on Chatwoot Swagger DTOs
 */

import { AgentAvailabilityStatus, AgentRole } from './enums';

export interface Agent {
  id: number;
  account_id: number;
  email: string;
  name: string;
  available_name: string;
  
  // Status
  availability_status: AgentAvailabilityStatus;
  auto_offline: boolean;
  confirmed: boolean;
  
  // Role
  role: AgentRole;
  custom_role_id: number | null;
  
  // Profile
  thumbnail: string | null;
  avatar_url?: string;
}

export interface User extends Agent {
  // Additional user-specific fields
  accounts?: Account[];
  display_name?: string;
  pubsub_token?: string;
}

export interface AgentListItem {
  id: number;
  name: string;
  email: string;
  availability_status: AgentAvailabilityStatus;
  thumbnail: string | null;
  role: AgentRole;
}

export interface AgentPayload {
  name: string;
  email: string;
  role: AgentRole;
  availability_status?: AgentAvailabilityStatus;
}

export interface AgentUpdatePayload {
  name?: string;
  availability_status?: AgentAvailabilityStatus;
  auto_offline?: boolean;
}

// Account type (minimal)
interface Account {
  id: number;
  name: string;
}

