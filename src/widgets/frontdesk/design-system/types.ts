/**
 * FrontDesk Design System - Shared Types
 *
 * Common type definitions used across the design system
 */

/**
 * Priority levels for tickets and conversations
 * Supports both capitalized and uppercase formats for API compatibility
 */
export type PriorityLevel = 'Urgent' | 'High' | 'Medium' | 'Low' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'urgent' | 'high' | 'medium' | 'low';

/**
 * Presence status for users
 */
export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline' | null;
