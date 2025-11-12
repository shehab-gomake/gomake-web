/**
 * Chatwoot Conversation Detail Panel
 *
 * Right sidebar showing conversation metadata and actions.
 * Mirrors the design and structure of ticket-detail-view's right column.
 */

import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { colorTokens } from "@/widgets/frontdesk/design-system";
import { QuickActionButton } from "@/widgets/frontdesk/design-system/primitives/Button/QuickActionButton";
import { QuickActionMenu, QuickActionItem } from "@/widgets/frontdesk/design-system/compounds/QuickActionMenu/QuickActionMenu";
import { chatwootService } from "@/services/frontdesk";
import { ConversationProfileSection } from "./conversation-profile-section";
import { ContactHistorySection } from "./contact-history-section";
import { ConversationAssigneeSection } from "./conversation-assignee-section";
import { ConversationLabelsManagement } from "./conversation-labels-management";
import { extractConversation, mergeConversationUpdate, extractErrorMessage } from "../utils/api-response-extractors";
import { useChatwootQuickActions } from "../hooks/use-chatwoot-quick-actions";
import { useChatwootProvider } from "../hooks/use-chatwoot-provider";
import { getActionsExcludingTickets, GROUP_LABELS } from "@/widgets/frontdesk/providers/tickets/utils/quick-actions-config";
import { AssignDocumentModal } from "./assign-document-modal";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

interface ChatwootConversationDetailPanelProps {
  conversation: ChatwootConversation;
  accountId?: number;
  inboxes?: ChatwootInbox[];
  onConversationUpdate?: (updatedConversation: ChatwootConversation) => void;
}

export const ChatwootConversationDetailPanel: React.FC<ChatwootConversationDetailPanelProps> = ({
  conversation,
  accountId,
  inboxes = [],
  onConversationUpdate,
}) => {
  const theme = useTheme();
  const { primaryColor, neutralColor } = useGomakeTheme();
  const { router } = useChatwootProvider();
  const [quickActionsAnchor, setQuickActionsAnchor] = useState<null | HTMLElement>(null);

  // Get inbox info
  const inbox = inboxes.find((i) => i.id === conversation.inbox_id);

  // Handle conversation updates from child components
  const handleConversationChange = useCallback(
    (updates: Partial<ChatwootConversation>) => {
      const updatedConversation = mergeConversationUpdate(conversation, updates);
      onConversationUpdate?.(updatedConversation);
    },
    [conversation, onConversationUpdate]
  );

  // Quick Actions integration
  const {
    availableActions,
    executeAction,
    getActionBlockReason,
    selectedAction,
    closeActionModal,
    connectToExistingDocument,
    createNewDocument,
  } = useChatwootQuickActions({
    conversation,
    accountId,
    onActionComplete: (actionType) => {
      console.log("[ChatwootConversationDetailPanel] Quick action completed:", actionType);
      // Refresh conversation data after linking document
      if (onConversationUpdate && conversation) {
        // Optionally refetch conversation to get updated custom_attributes
        // For now, we'll rely on the hook to update correctly
      }
    },
    onActionError: (actionType, error) => {
      console.error("[ChatwootConversationDetailPanel] Quick action error:", actionType, error);
    },
  });

  // Extract customer info for modal
  const customerId = conversation?.custom_attributes?.gomake_customer_id as string | undefined;
  const customerName = conversation?.meta?.sender?.name;

  // Convert action configs to QuickActionItem format for the menu
  const quickActionMenuItems: QuickActionItem[] = availableActions.map((action) => ({
    id: action.type,
    label: action.label,
    icon: action.icon,
    tooltip: action.tooltip,
    disabled: !!getActionBlockReason(action.type),
    disabledReason: getActionBlockReason(action.type) || undefined,
    group: action.group,
  }));

  const handleQuickActionClick = (action: QuickActionItem) => {
    executeAction(action.id as any);
  };

  return (
    <Box
      sx={{
        width: 280,
        minWidth: 280,
        backgroundColor: theme.palette.background.paper,
        overflow: "auto",
        p: 2,
      }}
      className="custom-scrollbar"
    >
      {/* Actions Button - Sales/Purchase Documents */}
      <Box sx={{ mb: 2.5 }}>
        <QuickActionButton
          size="sm"
          isOpen={Boolean(quickActionsAnchor)}
          onClick={(e) => setQuickActionsAnchor(e.currentTarget)}
          sx={{ width: "100%" }}
        >
          Actions
        </QuickActionButton>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Contact Profile Section */}
      <ConversationProfileSection
        contactName={conversation.meta?.sender?.name}
        contactEmail={conversation.meta?.sender?.email}
        contactAvatarUrl={conversation.meta?.sender?.avatar_url}
        contactPhoneNumber={conversation.meta?.sender?.phone_number}
        contactId={conversation.meta?.sender?.id}
        contactIdentifier={conversation.meta?.sender?.identifier}
        contactAvailabilityStatus={conversation.meta?.sender?.availability_status}
        contactBlocked={conversation.meta?.sender?.blocked}
        contactAdditionalAttributes={conversation.meta?.sender?.additional_attributes}
        contactCustomAttributes={conversation.meta?.sender?.custom_attributes}
        contactLastActivityAt={conversation.meta?.sender?.last_activity_at}
        contactCreatedAt={conversation.meta?.sender?.created_at}
        customerId={conversation.meta?.sender?.custom_attributes?.gomake_customer_id}
        onCustomerLinked={async (customerId) => {
          if (!accountId) return;

          const contactId = conversation.meta?.sender?.id;
          if (!contactId) {
            console.error("Cannot link customer: Contact ID not available");
            // TODO: Show error toast to user
            return;
          }

          try {
            // ✅ CORRECT: Update contact custom_attributes (not conversation)
            await chatwootService.contacts.updateContact(accountId, contactId, {
              custom_attributes: {
                gomake_customer_id: customerId,
              },
            });

            // Update local conversation state to reflect the change in sender's custom_attributes
            const updatedConversation = {
              ...conversation,
              meta: {
                ...conversation.meta,
                sender: {
                  ...conversation.meta?.sender,
                  custom_attributes: {
                    ...conversation.meta?.sender?.custom_attributes,
                    gomake_customer_id: customerId,
                  },
                },
              },
            };

            // Propagate update to parent (triggers re-render)
            if (onConversationUpdate) {
              onConversationUpdate(updatedConversation);
            }
          } catch (error) {
            console.error("Failed to link customer to contact:", error);
            // TODO: Show error toast to user
          }
        }}
      />

      {/* Contact History Section */}
      <ContactHistorySection
        contactId={conversation.meta?.sender?.id}
        accountId={accountId}
        router={router}
        currentConversationId={conversation.id}
        inboxes={inboxes}
      />

      {/* Assigned Agent Section */}
      <ConversationAssigneeSection
        type="agent"
        assignee={conversation.meta?.assignee}
        accountId={accountId}
        conversation={conversation}
        inboxId={conversation.inbox_id}
        updateConversation={handleConversationChange}
      />

      {/* Assigned Team Section */}
      <ConversationAssigneeSection
        type="team"
        team={conversation.meta?.team}
        accountId={accountId}
        conversation={conversation}
        updateConversation={handleConversationChange}
      />


      {/* Labels Management */}
      <ConversationLabelsManagement
        labels={conversation.labels}
        accountId={accountId}
        conversationId={conversation.id}
        onLabelsChanged={(newLabels) => {
          handleConversationChange({ labels: newLabels });
        }}
      />

      {/* Inbox Info */}
      {inbox && (
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.secondary,
              mb: 1,
              display: "block",
              fontWeight: 600,
              textTransform: "uppercase",
              fontSize: 10,
            }}
          >
            Inbox
          </Typography>
          <Box
            sx={{
              p: 1.5,
              backgroundColor: colorTokens.neutral[50],
              borderRadius: "6px",
              border: `1px solid ${colorTokens.semantic.border.default}`,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
              {inbox.name}
            </Typography>
            <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 11 }}>
              {conversation.meta?.channel || "Unknown channel"}
            </Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Expandable Sections */}
      {/* Custom Attributes */}
      {conversation.custom_attributes && Object.keys(conversation.custom_attributes).length > 0 && (
        <Accordion elevation={0} defaultExpanded={false} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: 11,
                color: colorTokens.semantic.text.secondary,
              }}
            >
              CUSTOM ATTRIBUTES
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {Object.entries(conversation.custom_attributes).map(([key, value]) => (
                <Box key={key}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colorTokens.semantic.text.secondary,
                      fontSize: 10,
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {key}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 13, mt: 0.5 }}>
                    {String(value)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* SLA Information */}
      {conversation.applied_sla && (
        <Accordion elevation={0} defaultExpanded={false} sx={{ "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: 11,
                color: colorTokens.semantic.text.secondary,
              }}
            >
              SLA TRACKING
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              SLA Policy Active
            </Typography>
            {/* TODO: Add detailed SLA breakdown */}
          </AccordionDetails>
        </Accordion>
      )}

      {/* Quick Actions Menu */}
      <QuickActionMenu
        anchorEl={quickActionsAnchor}
        open={Boolean(quickActionsAnchor)}
        onClose={() => setQuickActionsAnchor(null)}
        actions={quickActionMenuItems}
        groupLabels={GROUP_LABELS}
        onActionClick={handleQuickActionClick}
      />

      {/* Assign Document Modal */}
      <AssignDocumentModal
        open={Boolean(selectedAction)}
        onClose={closeActionModal}
        actionConfig={selectedAction}
        customerId={customerId}
        customerName={customerName}
        onConnectToExisting={connectToExistingDocument}
        onCreateNew={createNewDocument}
      />
    </Box>
  );
};
