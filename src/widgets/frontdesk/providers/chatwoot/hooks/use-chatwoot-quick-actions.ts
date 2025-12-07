import { useCallback, useMemo, useState } from "react";
import { useGomakeRouter } from "@/hooks/use-gomake-router";
import { useSetRecoilState } from "recoil";
import { selectedClientState } from "@/pages-components/quotes/states";
import {
  QuickActionType,
  QuickActionConfig,
  UseQuickActionsResult,
} from "@/widgets/frontdesk/providers/tickets/types/quick-actions.types";
import { getActionConfig, getActionsExcludingTickets } from "@/widgets/frontdesk/providers/tickets/utils/quick-actions-config";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { chatwootService } from "@/services/frontdesk";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { CHATWOOT_CUSTOM_ATTRIBUTES, getDocumentAttributeKeys } from "@/widgets/frontdesk/constants/chatwoot-attributes";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { assignToTicketApi } from "@/services/api-service/generic-doc/documents-api";

export interface UseChatwootQuickActionsOptions {
  /** Chatwoot conversation */
  conversation?: ChatwootConversation | null;

  /** Chatwoot account ID */
  accountId?: number | null;

  /** Callback when action is about to execute */
  onBeforeAction?: (actionType: QuickActionType) => void;

  /** Callback when action completes */
  onActionComplete?: (actionType: QuickActionType, updatedConversation?: ChatwootConversation) => void;

  /** Callback when action fails */
  onActionError?: (actionType: QuickActionType, error: string) => void;
}

export interface UseChatwootQuickActionsResult extends UseQuickActionsResult {
  /** Currently selected action for modal */
  selectedAction: QuickActionConfig | null;

  /** Open modal for action */
  openActionModal: (actionType: QuickActionType) => void;

  /** Close modal */
  closeActionModal: () => void;

  /** Connect to existing document */
  connectToExistingDocument: (documentId: string) => void;

  /** Create new document */
  createNewDocument: () => void;
}

/**
 * useChatwootQuickActions Hook
 *
 * Handles quick action execution, navigation, and customer context management
 * for Chatwoot conversation-related operations
 */
export function useChatwootQuickActions(options: UseChatwootQuickActionsOptions): UseChatwootQuickActionsResult {
  const { conversation, accountId, onBeforeAction, onActionComplete, onActionError } = options;

  const { navigate } = useGomakeRouter();
  const { callApi } = useGomakeAxios();
  const setSelectedClient = useSetRecoilState(selectedClientState);
  const [selectedAction, setSelectedAction] = useState<QuickActionConfig | null>(null);
  const { alertSuccess, alertFault } = useSnackBar();

  // Extract customer ID from conversation custom attributes
  // Check both conversation-level and contact-level custom attributes
  // Priority: contact-level (where it's actually stored when linking) > conversation-level
  const customerId = useMemo(() => {
    return (
      (conversation?.meta?.sender?.custom_attributes?.[CHATWOOT_CUSTOM_ATTRIBUTES.CUSTOMER_ID] as string | undefined) ||
      (conversation?.custom_attributes?.[CHATWOOT_CUSTOM_ATTRIBUTES.CUSTOMER_ID] as string | undefined)
    );
  }, [conversation]);

  // Extract customer info from conversation meta
  const customerName = useMemo(() => {
    return conversation?.meta?.sender?.name;
  }, [conversation]);

  const customerEmail = useMemo(() => {
    return conversation?.meta?.sender?.email;
  }, [conversation]);

  // Check if customer is linked
  const hasCustomer = useMemo(() => {
    return !!customerId;
  }, [customerId]);

  // Get available actions (only Sales and Purchase documents, excluding ticket actions)
  const availableActions = useMemo(() => {
    return getActionsExcludingTickets();
  }, []);

  /**
   * Check if an action can be executed
   */
  const canExecuteAction = useCallback(
    (actionType: QuickActionType): boolean => {
      const config = getActionConfig(actionType);
      if (!config || config.enabled === false) {
        return false;
      }

      // Check if customer is required but missing
      if (config.requiresCustomerId && !hasCustomer) {
        return false;
      }

      return true;
    },
    [hasCustomer]
  );

  /**
   * Get reason why action cannot be executed
   */
  const getActionBlockReason = useCallback(
    (actionType: QuickActionType): string | null => {
      const config = getActionConfig(actionType);
      if (!config) {
        return "Action not found";
      }

      if (config.enabled === false) {
        return "This action is not available";
      }

      if (config.requiresCustomerId && !hasCustomer) {
        return "Customer must be linked to conversation first";
      }

      return null;
    },
    [hasCustomer]
  );

  /**
   * Open modal for action
   */
  const openActionModal = useCallback(
    (actionType: QuickActionType) => {
      const config = getActionConfig(actionType);
      if (!config) {
        console.error(`[useChatwootQuickActions] Action config not found: ${actionType}`);
        onActionError?.(actionType, "Action not found");
        return;
      }

      // Check if action can be executed
      if (!canExecuteAction(actionType)) {
        const reason = getActionBlockReason(actionType);
        console.warn(`[useChatwootQuickActions] Cannot execute action: ${reason}`);
        onActionError?.(actionType, reason || "Cannot execute action");
        return;
      }

      console.log(`[useChatwootQuickActions] Opening modal for action: ${actionType}`);
      onBeforeAction?.(actionType);
      setSelectedAction(config);
    },
    [canExecuteAction, getActionBlockReason, onBeforeAction, onActionError]
  );

  /**
   * Close modal
   */
  const closeActionModal = useCallback(() => {
    setSelectedAction(null);
  }, []);

  /**
   * Connect to existing document
   */
  const connectToExistingDocument = useCallback(
    async (documentId: string) => {
      if (!selectedAction) {
        console.error("[useChatwootQuickActions] No action selected");
        return;
      }

      if (!conversation?.id || !accountId) {
        console.error("[useChatwootQuickActions] Missing conversation ID or account ID");
        alertFault("frontdesk.documentLinkFailed");
        onActionError?.(selectedAction.type, "Missing conversation or account information");
        return;
      }

      console.log(`[useChatwootQuickActions] Linking document ${documentId} to conversation ${conversation.id}`);

      try {
        // Get the appropriate custom attribute keys for this document type
        const attributeKeys = getDocumentAttributeKeys(selectedAction.type);

        if (!attributeKeys) {
          throw new Error(`Unknown document type for action: ${selectedAction.type}`);
        }

        // Get document type from action config
        const documentType = selectedAction.documentType;

        // 1. Assign document to ticket in ERP service
        if (documentType !== undefined) {
          const assignRes = await assignToTicketApi(callApi, () => {}, {
            documentId,
            ticketId: conversation.id.toString(),
            documentType,
          });

          if (!assignRes.success) {
            throw new Error("Failed to assign document to ticket in ERP service");
          }
        }

        // Update conversation custom attributes with document ID, type, and timestamp
        const updatedAttributes = {
          ...conversation.custom_attributes,
          [attributeKeys.idKey]: documentId,
          [attributeKeys.typeKey]: documentType,
          [attributeKeys.timestampKey]: new Date().toISOString(),
        };

        // Update conversation custom attributes
        await chatwootService.conversations.updateConversationCustomAttributes(accountId, conversation.id, updatedAttributes);

        // Refetch the conversation to get the latest data including updated custom attributes
        const refreshedConversation = await chatwootService.conversations.getConversationDetails(accountId, conversation.id);

        // Show success notification
        alertSuccess("frontdesk.documentLinkedSuccess");

        console.log(`[useChatwootQuickActions] Successfully linked document ${documentId}`, {
          documentId,
          attributeKeys,
          updatedAttributes,
          refreshedConversation,
        });

        // Notify parent component with refreshed conversation
        onActionComplete?.(selectedAction.type, refreshedConversation as ChatwootConversation);
        setSelectedAction(null);
      } catch (error: any) {
        console.error("[useChatwootQuickActions] Error linking document:", error);
        alertFault("frontdesk.documentLinkFailed");
        onActionError?.(selectedAction.type, error.message || "Failed to link document to conversation");
      }
    },
    [selectedAction, conversation, accountId, onActionComplete, onActionError, alertSuccess, alertFault, callApi]
  );

  /**
   * Create new document
   */
  const createNewDocument = useCallback(() => {
    if (!selectedAction) {
      console.error("[useChatwootQuickActions] No action selected");
      return;
    }

    console.log(`[useChatwootQuickActions] Creating new document: ${selectedAction.type}`);

    try {
      // Set customer in Recoil state before navigating
      if (selectedAction.requiresCustomerId && customerId) {
        // Extract phone from custom attributes if available
        const phoneNumber = conversation?.custom_attributes?.phone_number as string | undefined;

        setSelectedClient({
          id: customerId,
          name: customerName || customerEmail || "Unknown Customer",
          email: customerEmail,
          phone: phoneNumber || undefined,
        });

        console.log("[useChatwootQuickActions] Customer set in state:", {
          id: customerId,
          name: customerName || customerEmail,
          phone: phoneNumber,
        });
      }

      // Navigate to the document page
      console.log(`[useChatwootQuickActions] Navigating to: ${selectedAction.route}`);
      if (selectedAction.type === "create_invoice") {
        const queryParams = new URLSearchParams({
          isNewCreation: "true",
          ...(customerId && { clientId: customerId }),
          ...(conversation?.id && { ticketId: conversation.id.toString() }),
          ...(accountId && { accountId: accountId.toString() }),
        });

        const routeWithParams = `${selectedAction.route}?${queryParams.toString()}`;
        console.log(`[useChatwootQuickActions] Navigating to invoice with params: ${routeWithParams}`);
        navigate(routeWithParams);
      } else {
        // Navigate to the document page (default behavior)
        console.log(`[useChatwootQuickActions] Navigating to: ${selectedAction.route}`);
        navigate(selectedAction.route);
      }

      // Show info notification
      alertSuccess("frontdesk.navigatingToDocument");

      // Call success callback
      onActionComplete?.(selectedAction.type);
      setSelectedAction(null);
    } catch (error: any) {
      console.error("[useChatwootQuickActions] Error creating document:", error);
      alertFault("frontdesk.navigationFailed");
      onActionError?.(selectedAction.type, error.message || "Failed to create document");
    }
  }, [
    selectedAction,
    customerId,
    customerName,
    customerEmail,
    conversation,
    navigate,
    setSelectedClient,
    onActionComplete,
    onActionError,
    alertSuccess,
    alertFault,
  ]);

  return {
    availableActions,
    hasCustomer,
    executeAction: openActionModal, // Map executeAction to openActionModal for compatibility
    canExecuteAction,
    getActionBlockReason,
    selectedAction,
    openActionModal,
    closeActionModal,
    connectToExistingDocument,
    createNewDocument,
  };
}
