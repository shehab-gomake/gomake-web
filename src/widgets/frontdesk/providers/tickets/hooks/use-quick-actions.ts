import { useCallback, useMemo } from 'react';
import { useGomakeRouter } from '@/hooks/use-gomake-router';
import { useSetRecoilState } from 'recoil';
import { selectedClientState } from '@/pages-components/quotes/states';
import { postApiRequest } from '@/services/api-request';
import { message } from 'antd';
import {
  QuickActionType,
  QuickActionConfig,
  UseQuickActionsResult,
} from '../types/quick-actions.types';
import {
  QUICK_ACTIONS_CONFIG,
  getEnabledActions,
  getActionConfig,
} from '../utils/quick-actions-config';

export interface UseQuickActionsOptions {
  /** Ticket ID */
  ticketId: string;

  /** Customer ID (GoMake customer ID) */
  customerId?: string | null;

  /** Customer name */
  customerName?: string | null;

  /** Customer email */
  customerEmail?: string | null;

  /** Customer phone */
  customerPhone?: string | null;

  /** Active conversation (for accessing messages) */
  activeConversation?: {
    id: string;
    messages?: Array<{
      id: string;
      content: string;
      createdAt: string;
      [key: string]: any;
    }>;
  } | null;

  /** Callback when action is about to execute */
  onBeforeAction?: (actionType: QuickActionType) => void;

  /** Callback when action completes */
  onActionComplete?: (actionType: QuickActionType) => void;

  /** Callback when action fails */
  onActionError?: (actionType: QuickActionType, error: string) => void;
}

/**
 * useQuickActions Hook
 *
 * Handles quick action execution, navigation, and customer context management
 * for ticket-related operations
 */
export function useQuickActions(options: UseQuickActionsOptions): UseQuickActionsResult {
  const {
    ticketId,
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    activeConversation,
    onBeforeAction,
    onActionComplete,
    onActionError,
  } = options;

  const { navigate } = useGomakeRouter();
  const setSelectedClient = useSetRecoilState(selectedClientState);

  // Check if customer is linked
  const hasCustomer = useMemo(() => {
    return !!customerId;
  }, [customerId]);

  // Get available actions (all enabled actions)
  const availableActions = useMemo(() => {
    return getEnabledActions();
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
        return 'Action not found';
      }

      if (config.enabled === false) {
        return 'This action is not available';
      }

      if (config.requiresCustomerId && !hasCustomer) {
        return 'Customer must be linked to ticket first';
      }

      return null;
    },
    [hasCustomer]
  );

  /**
   * Execute a quick action
   */
  const executeAction = useCallback(
    (actionType: QuickActionType) => {
      const config = getActionConfig(actionType);
      if (!config) {
        console.error(`[useQuickActions] Action config not found: ${actionType}`);
        onActionError?.(actionType, 'Action not found');
        return;
      }

      // Check if action can be executed
      if (!canExecuteAction(actionType)) {
        const reason = getActionBlockReason(actionType);
        console.warn(`[useQuickActions] Cannot execute action: ${reason}`);
        onActionError?.(actionType, reason || 'Cannot execute action');
        return;
      }

      console.log(`[useQuickActions] Executing action: ${actionType}`);
      onBeforeAction?.(actionType);

      try {
        // Special handling for different action types
        switch (actionType) {
          case 'print_ticket':
            // Print current ticket
            console.log('[useQuickActions] Printing ticket');
            window.print();
            onActionComplete?.(actionType);
            break;

          case 'archive_ticket':
            // TODO: Implement archive ticket with confirmation
            console.log('[useQuickActions] Archive ticket requires confirmation modal');
            const confirmed = window.confirm('Are you sure you want to archive this ticket? You can restore it later from archived tickets.');
            if (confirmed) {
              // TODO: Call archive API
              console.log('[useQuickActions] Archive ticket confirmed');
              onActionError?.(actionType, 'Archive ticket API not yet implemented');
            } else {
              console.log('[useQuickActions] Archive ticket cancelled');
            }
            break;

          case 'export_conversation':
            // TODO: Implement export conversation logic
            console.log('[useQuickActions] Export conversation not yet implemented');
            onActionError?.(actionType, 'Export conversation not yet implemented');
            break;

          case 'create_quote_with_ai':
            // Get the last message from active conversation
            const messages = activeConversation?.messages || [];
            if (messages.length === 0) {
              console.warn('[useQuickActions] No messages available in conversation');
              onActionError?.(actionType, 'No messages available in this conversation');
              return;
            }

            const lastMessage = messages[messages.length - 1];
            const messageContent = lastMessage?.content;

            if (!messageContent) {
              console.warn('[useQuickActions] Last message has no content');
              onActionError?.(actionType, 'Last message has no content');
              return;
            }

            console.log('[useQuickActions] Creating quote with AI using last message:', {
              messageLength: messageContent.length,
              ticketId,
              customerId,
            });

            // Send POST request to AI endpoint
            const sendToAI = async () => {
              try {
                const endpoint = '/v1/gomake-ai-service/start-session-with-message';

                const response = await postApiRequest(endpoint, {
                  message: messageContent,
                });

                if (!response || !response.success) {
                  console.error('[useQuickActions] AI quote request failed:', response);
                  onActionError?.(actionType, response?.message || response?.msg || 'Failed to create AI quote session');
                  return;
                }

                console.log('[useQuickActions] AI quote request successful:', response.data);

                // Set customer in state before navigating
                if (customerId) {
                  setSelectedClient({
                    id: customerId,
                    name: customerName || customerEmail || customerPhone || 'Unknown Customer',
                    email: customerEmail,
                    phone: customerPhone,
                  });
                }
                debugger
                // Navigate to gomake-ai page with sessionId
                navigate(`/gomake-ai?sessionId=${response.data?.data?.data?.sessionId}`);
                onActionComplete?.(actionType);
              } catch (error: any) {
                console.error('[useQuickActions] AI quote request error:', error);
                onActionError?.(actionType, error?.message || 'An error occurred');
              }
            };

            sendToAI();
            break;

          default:
            // Handle document creation actions
            if (config.requiresCustomerId && customerId) {
              // Set customer in Recoil state before navigating
              setSelectedClient({
                id: customerId,
                name: customerName || customerEmail || customerPhone || 'Unknown Customer',
                email: customerEmail,
                phone: customerPhone,
                // Add any other required fields
              });

              console.log('[useQuickActions] Customer set in state:', {
                id: customerId,
                name: customerName || customerEmail || customerPhone,
              });
            }

            // Navigate to the document page
            console.log(`[useQuickActions] Navigating to: ${config.route}`);
            navigate(config.route);

            // Call success callback
            onActionComplete?.(actionType);
            break;
        }
      } catch (error: any) {
        console.error('[useQuickActions] Error executing action:', error);
        onActionError?.(actionType, error.message || 'Failed to execute action');
      }
    },
    [
      canExecuteAction,
      getActionBlockReason,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      activeConversation,
      navigate,
      setSelectedClient,
      onBeforeAction,
      onActionComplete,
      onActionError,
    ]
  );

  return {
    availableActions,
    hasCustomer,
    executeAction,
    canExecuteAction,
    getActionBlockReason,
  };
}
