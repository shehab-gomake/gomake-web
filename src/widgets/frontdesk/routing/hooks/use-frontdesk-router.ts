/**
 * FrontDesk Router Hook
 *
 * Main routing hook that provides type-safe navigation and route state.
 * Integrates with Next.js router and provides a clean API for FrontDesk routing.
 */

import { useRouter } from 'next/router';
import { useCallback, useMemo, useEffect, useState } from 'react';
import {
  FrontDeskRoute,
  NavigationOptions,
  FrontDeskChannel,
  FrontDeskSection,
  TicketView,
  Channel,
  Section,
} from '../types';
import { parseRoute, getSectionFromRoute, getChannelFromRoute, getTicketViewFromRoute, isTicketRoute } from '../route-parser';
import { buildRoute, buildRoutePath, RouteBuilder, getRouteMetadata, routesEqual } from '../route-builder';

/**
 * FrontDesk Router Hook
 */
export const useFrontDeskRouter = () => {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // Parse current route from URL
  const parsed = useMemo(() => {
    if (!router.isReady) {
      return {
        route: RouteBuilder.inbox(),
        queryParams: {},
      };
    }
    return parseRoute(router.query);
  }, [router.query, router.isReady]);

  const currentRoute = parsed.route;
  const queryParams = parsed.queryParams;

  // Mark as initialized after first route parse
  useEffect(() => {
    if (router.isReady && !isInitialized) {
      setIsInitialized(true);
    }
  }, [router.isReady, isInitialized]);

  /**
   * Navigate to a new route
   */
  const navigate = useCallback(
    (route: FrontDeskRoute, options: NavigationOptions = {}) => {
      const built = buildRoute(route, options);

      if (options.newTab) {
        window.open(built.path, '_blank');
        return;
      }

      if (options.replace) {
        router.replace(built.path, undefined, { scroll: options.scroll });
      } else {
        router.push(built.path, undefined, { scroll: options.scroll });
      }
    },
    [router]
  );

  /**
   * Navigate using window.history (for smoother transitions without full re-render)
   * Use this for internal navigation that doesn't need data fetching
   */
  const navigateSmooth = useCallback((route: FrontDeskRoute) => {
    const path = buildRoutePath(route);
    window.history.pushState({}, '', path);
  }, []);

  /**
   * Navigate to inbox (unified dashboard)
   */
  const goToInbox = useCallback(() => {
    navigate(RouteBuilder.inbox());
  }, [navigate]);

  /**
   * Navigate to a specific channel
   */
  const goToChannel = useCallback(
    (channel: FrontDeskChannel, conversationId?: string) => {
      navigate(RouteBuilder.channel(channel, conversationId));
    },
    [navigate]
  );

  /**
   * Navigate to a ticket list view
   */
  const goToTicketList = useCallback(
    (view: TicketView) => {
      navigate(RouteBuilder.ticketList(view));
    },
    [navigate]
  );

  /**
   * Navigate to a ticket detail
   */
  const goToTicket = useCallback(
    (ticketId: string, view?: TicketView, options?: NavigationOptions) => {
      navigate(RouteBuilder.ticketDetail(ticketId, view), options);
    },
    [navigate]
  );

  /**
   * Navigate to a section
   */
  const goToSection = useCallback(
    (section: FrontDeskSection.ASSIGNED | FrontDeskSection.ADMIN | FrontDeskSection.SETTINGS) => {
      navigate(RouteBuilder.section(section));
    },
    [navigate]
  );

  /**
   * Get route metadata for display
   */
  const metadata = useMemo(() => getRouteMetadata(currentRoute), [currentRoute]);

  /**
   * Backward compatibility helpers
   */
  const currentSection = useMemo(() => getSectionFromRoute(currentRoute), [currentRoute]);
  const currentChannel = useMemo(() => getChannelFromRoute(currentRoute), [currentRoute]);
  const currentTicketView = useMemo(() => getTicketViewFromRoute(currentRoute), [currentRoute]);
  const isInTicketMode = useMemo(() => isTicketRoute(currentRoute), [currentRoute]);

  /**
   * Legacy navigation handlers (for backward compatibility)
   */
  const handleSectionChange = useCallback(
    (section: Section) => {
      if (section === 'inbox') {
        goToInbox();
      } else {
        goToSection(section as any);
      }
    },
    [goToInbox, goToSection]
  );

  const handleChannelChange = useCallback(
    (channel: Channel) => {
      const channelMap: Record<Channel, FrontDeskChannel> = {
        all: FrontDeskChannel.ALL,
        email: FrontDeskChannel.EMAIL,
        whatsapp: FrontDeskChannel.WHATSAPP,
        internal: FrontDeskChannel.INTERNAL,
      };
      goToChannel(channelMap[channel]);
    },
    [goToChannel]
  );

  const handleTicketViewChange = useCallback(
    (view: TicketView) => {
      goToTicketList(view);
    },
    [goToTicketList]
  );

  return {
    // Current state
    currentRoute,
    currentSection,
    currentChannel,
    currentTicketView,
    isInTicketMode,
    isInitialized,
    metadata,
    queryParams,

    // Navigation methods
    navigate,
    navigateSmooth,
    goToInbox,
    goToChannel,
    goToTicketList,
    goToTicket,
    goToSection,

    // Legacy handlers (for backward compatibility)
    handleSectionChange,
    handleChannelChange,
    handleTicketViewChange,

    // Utilities
    RouteBuilder,
    routesEqual,
  };
};

/**
 * Type-safe navigation hook for specific route types
 */
export const useChannelNavigation = () => {
  const { goToChannel } = useFrontDeskRouter();

  return {
    goToEmail: useCallback((conversationId?: string) => {
      goToChannel(FrontDeskChannel.EMAIL, conversationId);
    }, [goToChannel]),
    goToWhatsApp: useCallback((conversationId?: string) => {
      goToChannel(FrontDeskChannel.WHATSAPP, conversationId);
    }, [goToChannel]),
    goToInternal: useCallback((conversationId?: string) => {
      goToChannel(FrontDeskChannel.INTERNAL, conversationId);
    }, [goToChannel]),
  };
};

/**
 * Ticket-specific navigation hook
 */
export const useTicketNavigation = () => {
  const { goToTicketList, goToTicket } = useFrontDeskRouter();

  return {
    goToMyTickets: useCallback(() => {
      goToTicketList(TicketView.MY_TICKETS);
    }, [goToTicketList]),
    goToUnassigned: useCallback(() => {
      goToTicketList(TicketView.UNASSIGNED);
    }, [goToTicketList]),
    goToAllTickets: useCallback(() => {
      goToTicketList(TicketView.ALL_TICKETS);
    }, [goToTicketList]),
    goToDoneTickets: useCallback(() => {
      goToTicketList(TicketView.DONE);
    }, [goToTicketList]),
    goToTicket: useCallback((ticketId: string, options?: NavigationOptions) => {
      goToTicket(ticketId, undefined, options);
    }, [goToTicket]),
  };
};

export default useFrontDeskRouter;
