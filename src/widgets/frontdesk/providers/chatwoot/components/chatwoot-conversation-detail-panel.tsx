/**
 * Chatwoot Conversation Detail Panel
 *
 * Right sidebar showing conversation metadata and actions.
 * Redesigned with:
 * - Consistent 8px rhythm spacing
 * - Modern card styling (14px radius, soft shadows)
 * - Improved visual hierarchy
 * - Better component grouping
 */

import React, { useState, useCallback, Suspense } from "react";
import {
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import {
  colorTokens,
  radiusTokens,
  shadowTokens,
  semanticSpacing,
  layoutTokens,
} from "@/widgets/frontdesk/design-system";
import { QuickActionButton } from "@/widgets/frontdesk/design-system/primitives/Button/QuickActionButton";
import {
  QuickActionMenu,
  QuickActionItem,
} from "@/widgets/frontdesk/design-system/compounds/QuickActionMenu/QuickActionMenu";
import { chatwootService } from "@/services/frontdesk";
import { ConversationProfileSection } from "./conversation-profile-section";
import { ContactHistorySection } from "./contact-history-section";
import { ConversationAssigneeSection } from "./conversation-assignee-section";
import { ConversationLabelsManagement } from "./conversation-labels-management";
import { LinkedDocumentsSection } from "./linked-documents-section";
import {
  extractConversation,
  mergeConversationUpdate,
  extractErrorMessage,
} from "../utils/api-response-extractors";
import { useChatwootQuickActions } from "../hooks/use-chatwoot-quick-actions";
import { useChatwootProvider } from "../hooks/use-chatwoot-provider";
import { useChatwootConversationUpdater } from "../hooks/use-chatwoot-conversation-updater";
import {
  getActionsExcludingTickets,
  getTranslatedGroupLabels,
} from "@/widgets/frontdesk/providers/tickets/utils/quick-actions-config";
import { AssignDocumentModal } from "./assign-document-modal";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

interface ChatwootConversationDetailPanelProps {
  conversation: ChatwootConversation;
  accountId?: number;
  inboxes?: ChatwootInbox[];
  onConversationUpdate?: (updatedConversation: ChatwootConversation) => void;
}

export const ChatwootConversationDetailPanel: React.FC<
  ChatwootConversationDetailPanelProps
> = ({ conversation, accountId, inboxes = [], onConversationUpdate }) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const { router } = useChatwootProvider();
  const [quickActionsAnchor, setQuickActionsAnchor] =
    useState<null | HTMLElement>(null);

  // Get inbox info
  const inbox = inboxes.find((i) => i.id === conversation.inbox_id);

  // Use cache-aware updater
  const { updateConversation: updateConversationCache } =
    useChatwootConversationUpdater();

  // Handle conversation updates from child components (cache-aware)
  const handleConversationChange = useCallback(
    (conversationId: number, updates: Partial<ChatwootConversation>) => {
      // Update cache across all views
      updateConversationCache(conversationId, updates);

      // Also notify parent for local state update
      const updatedConversation = mergeConversationUpdate(
        conversation,
        updates
      );
      onConversationUpdate?.(updatedConversation);
    },
    [conversation, onConversationUpdate, updateConversationCache]
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
    onActionComplete: (actionType, updatedConversation) => {
      console.log(
        "[ChatwootConversationDetailPanel] Quick action completed:",
        actionType,
        updatedConversation
      );
      // Update conversation cache across all views with refreshed conversation
      if (updatedConversation) {
        updateConversationCache(updatedConversation.id!, updatedConversation);
        // Also notify parent for local state update
        onConversationUpdate?.(updatedConversation);
      }
    },
    onActionError: (actionType, error) => {
      console.error(
        "[ChatwootConversationDetailPanel] Quick action error:",
        actionType,
        error
      );
    },
  });

  // Extract customer info for modal
  // Check both conversation-level and contact-level custom attributes
  // Priority: contact-level (where it's actually stored when linking) > conversation-level
  const customerId =
    (conversation?.meta?.sender?.custom_attributes?.gomake_customer_id as
      | string
      | undefined) ||
    (conversation?.custom_attributes?.gomake_customer_id as string | undefined);
  const customerName = conversation?.meta?.sender?.name;

  // Translation map for action labels
  const actionLabelMap: Record<string, string> = {
    create_quote: t("frontdesk.detailPanel.assignToQuote"),
    create_quote_with_ai: t("frontdesk.detailPanel.createQuoteWithAI"),
    create_invoice: t("frontdesk.detailPanel.assignToInvoice"),
    create_order: t("frontdesk.detailPanel.assignToOrder"),
    create_receipt: t("frontdesk.detailPanel.assignToReceipt"),
    create_delivery_note: t("frontdesk.detailPanel.assignToDeliveryNote"),
    create_purchase_order: t("frontdesk.detailPanel.assignToPurchaseOrder"),
    create_purchase_invoice: t("frontdesk.detailPanel.assignToPurchaseInvoice"),
  };

  // Translation map for action tooltips
  const actionTooltipMap: Record<string, string> = {
    create_quote: t("frontdesk.detailPanel.assignToQuoteTooltip"),
    create_quote_with_ai: t("frontdesk.detailPanel.createQuoteWithAITooltip"),
    create_invoice: t("frontdesk.detailPanel.assignToInvoiceTooltip"),
    create_order: t("frontdesk.detailPanel.assignToOrderTooltip"),
    create_receipt: t("frontdesk.detailPanel.assignToReceiptTooltip"),
    create_delivery_note: t(
      "frontdesk.detailPanel.assignToDeliveryNoteTooltip"
    ),
    create_purchase_order: t(
      "frontdesk.detailPanel.assignToPurchaseOrderTooltip"
    ),
    create_purchase_invoice: t(
      "frontdesk.detailPanel.assignToPurchaseInvoiceTooltip"
    ),
  };

  // Convert action configs to QuickActionItem format for the menu
  const quickActionMenuItems: QuickActionItem[] = availableActions.map(
    (action) => ({
      id: action.type,
      label: actionLabelMap[action.type] || action.label,
      icon: action.icon,
      tooltip: actionTooltipMap[action.type] || action.tooltip,
      disabled: !!getActionBlockReason(action.type),
      disabledReason: getActionBlockReason(action.type) || undefined,
      group: action.group,
    })
  );

  const handleQuickActionClick = (action: QuickActionItem) => {
    executeAction(action.id as any);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: colorTokens.semantic.background.primary,
        overflow: "auto",
        p: `${semanticSpacing.container.lg}px`, // Use design system container padding (24px)
        direction: dir, // RTL support
      }}
      className="custom-scrollbar"
    >
      {/* Actions Button - Sales/Purchase Documents */}
      <Box sx={{ mb: `${semanticSpacing.component.lg}px` }}>
        <QuickActionButton
          size="sm"
          isOpen={Boolean(quickActionsAnchor)}
          onClick={(e) => setQuickActionsAnchor(e.currentTarget)}
          sx={{
            width: "100%",
            borderRadius: `${radiusTokens.lg}px`, // Use design system radius
            direction: dir,
          }}
        >
          {t("frontdesk.detailPanel.actions")}
        </QuickActionButton>
      </Box>

      <Divider sx={{ my: 2, borderColor: colorTokens.neutral[100] }} />

      {/* Contact Profile Section */}
      <ConversationProfileSection
        contactName={conversation.meta?.sender?.name}
        contactEmail={conversation.meta?.sender?.email}
        contactAvatarUrl={conversation.meta?.sender?.avatar_url}
        contactPhoneNumber={conversation.meta?.sender?.phone_number}
        contactId={conversation.meta?.sender?.id}
        contactIdentifier={conversation.meta?.sender?.identifier}
        contactAvailabilityStatus={
          conversation.meta?.sender?.availability_status
        }
        contactBlocked={conversation.meta?.sender?.blocked}
        contactAdditionalAttributes={
          conversation.meta?.sender?.additional_attributes
        }
        contactCustomAttributes={conversation.meta?.sender?.custom_attributes}
        contactLastActivityAt={conversation.meta?.sender?.last_activity_at}
        contactCreatedAt={conversation.meta?.sender?.created_at}
        customerId={
          conversation.meta?.sender?.custom_attributes?.gomake_customer_id
        }
        accountId={accountId}
        onCustomerLinked={async (customerId, customerData) => {
          if (!accountId) return;

          const contactId = conversation.meta?.sender?.id;
          if (!contactId) {
            console.error("Cannot link customer: Contact ID not available");
            // TODO: Show error toast to user
            return;
          }

          try {
            // Build custom attributes from customer data
            const customAttributes: Record<string, any> = {
              gomake_customer_id: customerId,
            };

            // Add customer code if available
            if (customerData?.code) {
              customAttributes.gomake_client_code = customerData.code;
            }

            // Add agent ID if available
            if (customerData?.agentId) {
              customAttributes.gomake_agent_id = customerData.agentId;
            }

            // ✅ CORRECT: Update contact custom_attributes (not conversation)
            await chatwootService.contacts.updateContact(accountId, contactId, {
              custom_attributes: customAttributes,
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
                    ...customAttributes,
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

      {/* Linked Documents Section - Wrapped in Suspense to handle async Recoil state */}
      <Suspense fallback={null}>
        <LinkedDocumentsSection
          conversation={conversation}
          accountId={accountId}
          onConversationUpdate={(updatedConversation) => {
            handleConversationChange(conversation.id, {
              custom_attributes: updatedConversation.custom_attributes,
            });
          }}
        />
      </Suspense>

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
          handleConversationChange(conversation.id, { labels: newLabels });
        }}
      />

      {/* Inbox Info */}
      {inbox && (
        <Box sx={{ mb: `${semanticSpacing.component.lg}px`, direction: dir }}>
          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.secondary,
              mb: 1,
              display: "block",
              fontWeight: 600,
              textTransform: "uppercase",
              fontSize: 10,
              letterSpacing: "0.05em",
            }}
          >
            {t("frontdesk.detailPanel.inbox")}
          </Typography>
          <Box
            sx={{
              p: `${semanticSpacing.component.md}px`, // Use design system padding
              backgroundColor: colorTokens.neutral[50],
              borderRadius: `${radiusTokens.lg}px`, // Use design system radius
              border: `1px solid ${colorTokens.semantic.border.light}`,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
              {inbox.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: colorTokens.semantic.text.secondary, fontSize: 11 }}
            >
              {conversation.meta?.channel || "Unknown channel"}
            </Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 2.5, borderColor: colorTokens.neutral[100] }} />

      {/* Expandable Sections */}
      {/* Custom Attributes */}
      {conversation.custom_attributes &&
        Object.keys(conversation.custom_attributes).length > 0 && (
          <Accordion
            elevation={0}
            defaultExpanded={false}
            sx={{ "&:before": { display: "none" } }}
          >
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
                {Object.entries(conversation.custom_attributes).map(
                  ([key, value]) => (
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
                      <Typography
                        variant="body2"
                        sx={{ fontSize: 13, mt: 0.5 }}
                      >
                        {String(value)}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

      {/* SLA Information */}
      {conversation.applied_sla && (
        <Accordion
          elevation={0}
          defaultExpanded={false}
          sx={{ "&:before": { display: "none" } }}
        >
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
        groupLabels={getTranslatedGroupLabels(t)}
        isRTL={isRTL}
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
