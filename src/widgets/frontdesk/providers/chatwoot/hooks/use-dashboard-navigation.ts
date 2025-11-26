import { useCallback } from "react";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";
import { RouteBuilder } from "@/widgets/frontdesk/routing/route-builder";
import { useChatwootProvider } from "./use-chatwoot-provider";

/**
 * Hook for managing navigation from dashboard cards to appropriate views
 *
 * Provides handlers for navigating to different views based on dashboard card clicks
 * and conversation selections. Maps card types to their corresponding routes with
 * appropriate filters.
 *
 * @returns Object containing navigation handlers
 * @property {Function} handleCardClick - Navigate based on dashboard card type
 * @property {Function} handleConversationSelect - Navigate to a specific conversation
 *
 * @example
 * ```typescript
 * const { handleCardClick, handleConversationSelect } = useDashboardNavigation();
 *
 * // Navigate to My Inbox with open filter
 * handleCardClick('my-open-tickets');
 *
 * // Navigate to a specific conversation
 * handleConversationSelect(123, 456);
 * ```
 */
export const useDashboardNavigation = () => {
  const { router: chatwootRouter } = useChatwootProvider();

  /**
   * Navigate to the appropriate view based on dashboard card type
   *
   * @param cardType - The type of dashboard card clicked
   * Supported types:
   * - Agent: 'my-open-tickets', 'my-resolved-today', 'my-response-time'
   * - Admin: 'total-open-tickets', 'unassigned-tickets', 'team-response-time', 'active-today'
   * - Common: 'unread-conversations', 'open-conversations', 'mentions', 'unattended'
   */
  const handleCardClick = useCallback(
    (cardType: string) => {
      switch (cardType) {
        // Agent-specific navigation
        case "my-open-tickets":
          chatwootRouter.navigate(
            RouteBuilder.chatwoot(ChatwootView.MY_INBOX, undefined, undefined, {
              status: "open",
              assigneeType: "me",
            })
          );
          break;
        case "my-resolved-today":
          chatwootRouter.navigate(
            RouteBuilder.chatwoot(ChatwootView.MY_INBOX, undefined, undefined, {
              status: "resolved",
            })
          );
          break;
        case "my-response-time":
          chatwootRouter.navigateToMyInbox();
          break;

        // Admin-specific navigation
        case "total-open-tickets":
          chatwootRouter.navigate(
            RouteBuilder.chatwoot(ChatwootView.ALL_CONVERSATIONS, undefined, undefined, {
              status: "open",
            })
          );
          break;
        case "unassigned-tickets":
          chatwootRouter.navigateToUnattended();
          break;
        case "team-response-time":
        case "active-today":
          chatwootRouter.navigateToAllConversations();
          break;

        // Common navigation
        case "unread-conversations":
          chatwootRouter.navigateToMyInbox();
          break;
        case "open-conversations":
          chatwootRouter.navigateToAllConversations();
          break;
        case "mentions":
          chatwootRouter.navigateToMentions();
          break;
        case "unattended":
          chatwootRouter.navigateToUnattended();
          break;
        default:
          console.warn("[DashboardView] Unknown card type:", cardType);
          break;
      }
    },
    [chatwootRouter]
  );

  /**
   * Navigate to a specific conversation
   *
   * @param conversationId - The ID of the conversation to navigate to
   * @param inboxId - Optional inbox ID for channel-specific navigation
   */
  const handleConversationSelect = useCallback(
    (conversationId: number, inboxId?: number) => {
      const channelId = inboxId?.toString();
      chatwootRouter.navigateToConversation(conversationId.toString(), channelId);
    },
    [chatwootRouter]
  );

  return {
    handleCardClick,
    handleConversationSelect,
  };
};
