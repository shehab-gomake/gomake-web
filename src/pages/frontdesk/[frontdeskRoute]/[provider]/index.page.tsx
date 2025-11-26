import { useRouter } from "next/router";
import { useEffect } from "react";

// All routes with providers are deprecated and should redirect to Chatwoot
export default function FrontdeskProviderPage() {
  const router = useRouter();
  const { frontdeskRoute, provider } = router.query;

  useEffect(() => {
    if (!frontdeskRoute || !provider) return;

    let redirectUrl = "/frontdesk/chatwoot?view=dashboard";

    // Special handling for ticket routes with IDs
    // Example: /frontdesk/tickets/123 should redirect with conversation ID
    if (frontdeskRoute === "tickets" && typeof provider === "string") {
      // If provider looks like a ticket ID (numeric or UUID), include it as conversation
      if (/^[0-9]+$/.test(provider) || /^[a-f0-9-]{36}$/i.test(provider)) {
        redirectUrl = `/frontdesk/chatwoot?view=my-inbox&conversation=${provider}`;
        console.log(`[FrontDesk] Redirecting deprecated ticket route: /frontdesk/tickets/${provider} → ${redirectUrl}`);
      } else {
        // Otherwise treat it as a ticket view name (my-tickets, all-tickets, etc.)
        const ticketViewMapping: Record<string, string> = {
          "my-tickets": "my-inbox",
          "all-tickets": "all-conversations",
          "unassigned": "unattended",
          "done": "my-inbox",
          "archived": "my-inbox",
        };
        const chatwootView = ticketViewMapping[provider] || "my-inbox";
        redirectUrl = `/frontdesk/chatwoot?view=${chatwootView}`;
        console.log(`[FrontDesk] Redirecting deprecated ticket view: /frontdesk/tickets/${provider} → ${redirectUrl}`);
      }
    } else {
      // All other deprecated provider routes redirect to Chatwoot dashboard
      // Examples: /frontdesk/inbox/email, /frontdesk/inbox/whatsapp, /frontdesk/inbox/internal
      console.log(`[FrontDesk] Redirecting deprecated route: /frontdesk/${frontdeskRoute}/${provider} → ${redirectUrl}`);
    }

    router.replace(redirectUrl);
  }, [frontdeskRoute, provider, router]);

  // Return null during redirect
  return null;
}

