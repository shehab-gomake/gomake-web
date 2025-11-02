/**
 * Chatwoot Router Hook
 *
 * Provides type-safe navigation for Chatwoot provider using the FrontDesk routing system.
 * Handles all Chatwoot-specific route building and parsing.
 */

import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useChatwootRouter");
import {
  ChatwootView,
  ChatwootRoute,
  RouteType,
  isChatwootRoute,
  NavigationOptions,
  FrontDeskRoute,
} from "@/widgets/frontdesk/routing/types";
import { RouteBuilder, buildRoute } from "@/widgets/frontdesk/routing/route-builder";
import { parseRoute } from "@/widgets/frontdesk/routing/route-parser";
import {
  chatwootSelectedInboxIdAtom,
  chatwootSelectedConversationAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

/**
 * Hook for Chatwoot-specific routing
 */
export const useChatwootRouter = () => {
  const router = useRouter();
  const [selectedInboxId, setSelectedInboxId] = useRecoilState(chatwootSelectedInboxIdAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(chatwootSelectedConversationAtom);

  // Parse current route
  const currentRoute = useMemo(() => {
    const parsed = parseRoute(router.query);
    return isChatwootRoute(parsed.route) ? parsed.route : null;
  }, [router.query]);

  // Current view
  const currentView = currentRoute?.view || ChatwootView.MY_INBOX;

  /**
   * Navigate to a Chatwoot route
   */
  const navigate = useCallback(
    (route: FrontDeskRoute, options?: NavigationOptions) => {
      // Type guard to ensure it's a Chatwoot route
      if (!isChatwootRoute(route)) {
        logger.error("Invalid route type", route);
        return;
      }

      const { path, options: routeOptions } = buildRoute(route, options);

      logger.debug(`Navigating to: ${path}`, route);

      // Sync state atoms with route before navigation
      if (route.channelId) {
        // Convert string to number for the atom
        const inboxId = parseInt(route.channelId, 10);
        if (!isNaN(inboxId)) {
          setSelectedInboxId(inboxId);
        }
      } else if (route.view === ChatwootView.ALL_CONVERSATIONS) {
        setSelectedInboxId(null);
      }

      if (route.conversationId) {
        // Will be set by conversation loader
      } else {
        setSelectedConversation(null);
      }

      if (routeOptions.replace) {
        router.replace(path, undefined, { shallow: routeOptions.scroll === false });
      } else {
        router.push(path, undefined, { shallow: routeOptions.scroll === false });
      }
    },
    [router, setSelectedInboxId, setSelectedConversation]
  );

  /**
   * Navigate to Dashboard view
   */
  const navigateToDashboard = useCallback(
    (options?: NavigationOptions) => {
      const route = RouteBuilder.chatwoot(ChatwootView.DASHBOARD);
      navigate(route, options);
    },
    [navigate]
  );

  /**
   * Navigate to My Inbox view
   */
  const navigateToMyInbox = useCallback(
    (options?: NavigationOptions) => {
      const route = RouteBuilder.chatwootMyInbox();
      navigate(route, options);
    },
    [navigate]
  );

  /**
   * Navigate to All Conversations view
   */
  const navigateToAllConversations = useCallback(
    (options?: NavigationOptions) => {
      const route = RouteBuilder.chatwootAllConversations();
      navigate(route, options);
    },
    [navigate]
  );

  /**
   * Navigate to Mentions view
   */
  const navigateToMentions = useCallback(
    (options?: NavigationOptions) => {
      const route = RouteBuilder.chatwootMentions();
      navigate(route, options);
    },
    [navigate]
  );

  /**
   * Navigate to Unattended view
   */
  const navigateToUnattended = useCallback(
    (options?: NavigationOptions) => {
      const route = RouteBuilder.chatwootUnattended();
      navigate(route, options);
    },
    [navigate]
  );

  /**
   * Navigate to Channels view
   */
  const navigateToChannels = useCallback(
    (options?: NavigationOptions) => {
      const route = RouteBuilder.chatwootChannels();
      navigate(route, options);
    },
    [navigate]
  );

  /**
   * Navigate to a specific channel (inbox)
   */
  const navigateToChannel = useCallback(
    (channelId: string, conversationId?: string, options?: NavigationOptions) => {
      const route = RouteBuilder.chatwoot(ChatwootView.CHANNELS, conversationId, channelId);
      navigate(route, options);
    },
    [navigate]
  );

  /**
   * Navigate to a specific conversation
   */
  const navigateToConversation = useCallback(
    (conversationId: string, channelId?: string, options?: NavigationOptions) => {
      const view = channelId ? ChatwootView.CHANNELS : ChatwootView.ALL_CONVERSATIONS;
      const route = RouteBuilder.chatwoot(view, conversationId, channelId);
      navigate(route, options);
    },
    [navigate]
  );

  /**
   * Sync route changes with Recoil state atoms
   */
  useEffect(() => {
    if (!currentRoute) return;

    // Sync channelId with selectedInboxId
    if (currentRoute.channelId !== undefined) {
      const inboxId = parseInt(currentRoute.channelId, 10);
      if (!isNaN(inboxId) && inboxId !== selectedInboxId) {
        setSelectedInboxId(inboxId);
      }
    } else if (currentRoute.view === ChatwootView.ALL_CONVERSATIONS) {
      if (selectedInboxId !== null) {
        setSelectedInboxId(null);
      }
    }

    // Don't sync conversationId here - let the conversation loader handle it
  }, [currentRoute, selectedInboxId, setSelectedInboxId]);

  return {
    // Current state
    currentRoute,
    currentView,
    isDashboardView: currentView === ChatwootView.DASHBOARD,
    isMyInboxView: currentView === ChatwootView.MY_INBOX,
    isAllConversationsView: currentView === ChatwootView.ALL_CONVERSATIONS,
    isMentionsView: currentView === ChatwootView.MENTIONS,
    isUnattendedView: currentView === ChatwootView.UNATTENDED,
    isChannelsView: currentView === ChatwootView.CHANNELS,

    // Navigation methods
    navigate,
    navigateToDashboard,
    navigateToMyInbox,
    navigateToAllConversations,
    navigateToMentions,
    navigateToUnattended,
    navigateToChannels,
    navigateToChannel,
    navigateToConversation,
  };
};
