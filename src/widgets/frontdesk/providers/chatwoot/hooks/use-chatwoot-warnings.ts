/**
 * Chatwoot Warnings Hook
 *
 * Detects system warnings and configuration issues that need attention.
 * Examples: Inboxes without agents, inboxes not configured, etc.
 */

import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { chatwootInboxesAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import { chatwootInboxAgentsAtom } from '@/store/frontdesk/atoms/chatwoot-shared.atoms';

export enum WarningType {
  NO_AGENTS_ASSIGNED = 'no_agents_assigned',
  INBOX_NOT_CONFIGURED = 'inbox_not_configured',
  AGENT_UNVERIFIED = 'agent_unverified',
}

export enum WarningSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface Warning {
  id: string;
  type: WarningType;
  severity: WarningSeverity;
  title: string;
  message: string;
  inboxId?: number;
  inboxName?: string;
  actionLabel?: string;
  actionRoute?: string;
}

/**
 * Hook to detect and return system warnings
 *
 * Checks for configuration issues like:
 * - Inboxes without assigned agents
 * - Inboxes not properly configured
 * - Other operational warnings
 *
 * @returns Array of warnings that need attention
 */
export const useChatwootWarnings = (): Warning[] => {
  const inboxes = useRecoilValue(chatwootInboxesAtom);
  const inboxAgentsMap = useRecoilValue(chatwootInboxAgentsAtom);

  return useMemo(() => {
    const warnings: Warning[] = [];

    // Check each inbox for issues
    inboxes.forEach((inbox) => {
      // Check if inbox has any agents assigned
      const inboxAgents = inboxAgentsMap[inbox.id];
      const agentCount = inboxAgents?.data?.length || 0;
      const verifiedAgentCount = inboxAgents?.data?.filter(agent => agent.confirmed)?.length || 0;

      // Warning: No agents assigned to inbox
      if (agentCount === 0 || !inboxAgents) {
        warnings.push({
          id: `no-agents-${inbox.id}`,
          type: WarningType.NO_AGENTS_ASSIGNED,
          severity: WarningSeverity.ERROR,
          title: 'No agents assigned',
          message: `Inbox "${inbox.name}" has no agents assigned. Conversations cannot be handled.`,
          inboxId: inbox.id,
          inboxName: inbox.name,
          actionLabel: 'Assign Agents',
          actionRoute: `/frontdesk?channel=chatwoot&view=channels&channelId=${inbox.id}&tab=settings`,
        });
      } 
      // Warning: No verified agents (all agents are unconfirmed)
      else if (verifiedAgentCount === 0 && agentCount > 0) {
        warnings.push({
          id: `unverified-agents-${inbox.id}`,
          type: WarningType.AGENT_UNVERIFIED,
          severity: WarningSeverity.WARNING,
          title: 'No verified agents',
          message: `Inbox "${inbox.name}" has ${agentCount} unverified agent(s). They need to confirm their account.`,
          inboxId: inbox.id,
          inboxName: inbox.name,
          actionLabel: 'View Agents',
          actionRoute: `/frontdesk?channel=chatwoot&view=channels&channelId=${inbox.id}&tab=settings`,
        });
      }

      // Check inbox configuration based on channel type
      // Email inboxes need proper email configuration
      if (inbox.channel_type === 'Channel::Email') {
        const emailConfig = inbox.email;
        if (!emailConfig?.email || !emailConfig?.imap_enabled) {
          warnings.push({
            id: `email-config-${inbox.id}`,
            type: WarningType.INBOX_NOT_CONFIGURED,
            severity: WarningSeverity.WARNING,
            title: 'Email inbox not fully configured',
            message: `Inbox "${inbox.name}" needs email configuration to receive messages.`,
            inboxId: inbox.id,
            inboxName: inbox.name,
            actionLabel: 'Configure',
            actionRoute: `/frontdesk?channel=chatwoot&view=channels&channelId=${inbox.id}&tab=settings`,
          });
        }
      }

      // WhatsApp inboxes need provider configuration
      if (inbox.channel_type === 'Channel::Whatsapp') {
        const whatsappConfig = inbox.provider_config;
        if (!whatsappConfig?.phone_number) {
          warnings.push({
            id: `whatsapp-config-${inbox.id}`,
            type: WarningType.INBOX_NOT_CONFIGURED,
            severity: WarningSeverity.WARNING,
            title: 'WhatsApp inbox not configured',
            message: `Inbox "${inbox.name}" needs WhatsApp phone number configuration.`,
            inboxId: inbox.id,
            inboxName: inbox.name,
            actionLabel: 'Configure',
            actionRoute: `/frontdesk?channel=chatwoot&view=channels&channelId=${inbox.id}&tab=settings`,
          });
        }
      }
    });

    // Sort warnings by severity (ERROR > WARNING > INFO)
    const severityOrder = {
      [WarningSeverity.ERROR]: 0,
      [WarningSeverity.WARNING]: 1,
      [WarningSeverity.INFO]: 2,
    };

    return warnings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }, [inboxes, inboxAgentsMap]);
};

