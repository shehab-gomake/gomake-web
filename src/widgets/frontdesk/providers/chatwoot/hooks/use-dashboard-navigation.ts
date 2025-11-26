import { useCallback } from "react";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";
import { RouteBuilder } from "@/widgets/frontdesk/routing/route-builder";
import { useChatwootProvider } from "./use-chatwoot-provider";

export const useDashboardNavigation = () => {
  const { router: chatwootRouter } = useChatwootProvider();

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
