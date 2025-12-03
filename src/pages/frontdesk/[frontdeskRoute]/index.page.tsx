import { CustomerAuthLayout } from "@/layouts";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";

const FrontdeskWidget = dynamic(
  () => import("@/widgets/frontdesk/frontdesk-widget"),
  {
    ssr: false,
    loading: () => null,
  }
);

// Map deprecated routes to Chatwoot views
const DEPRECATED_ROUTE_MAPPING: Record<string, string> = {
  // Old inbox routes
  inbox: "/frontdesk/chatwoot?view=dashboard",
  // Old ticket routes
  tickets: "/frontdesk/chatwoot?view=my-inbox",
  // Old section routes
  assigned: "/frontdesk/chatwoot?view=my-inbox",
  admin: "/frontdesk/chatwoot?view=settings&subpage=general",
  settings: "/frontdesk/chatwoot?view=settings",
};

export default function FrontdeskRoutedPage() {
  const router = useRouter();
  const { frontdeskRoute } = router.query;

  useEffect(() => {
    // Only redirect for deprecated routes
    if (typeof frontdeskRoute === "string" && frontdeskRoute in DEPRECATED_ROUTE_MAPPING) {
      const redirectUrl = DEPRECATED_ROUTE_MAPPING[frontdeskRoute];
      router.replace(redirectUrl);
    }
  }, [frontdeskRoute, router]);

  // If it's a valid route (chatwoot), render the widget
  // Otherwise, return null during redirect
  if (frontdeskRoute === "chatwoot") {
    return (
      <CustomerAuthLayout staticPageTitle={"frontdesk"}>
        <FrontdeskWidget />
      </CustomerAuthLayout>
    );
  }

  return null;
}

