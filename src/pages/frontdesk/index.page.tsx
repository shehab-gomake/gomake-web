import { CustomerAuthLayout } from "@/layouts";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/router";

const FrontdeskWidget = dynamic(
  () => import("@/widgets/frontdesk/frontdesk-widget"),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function FrontdeskPage() {
  const { replace } = useRouter();
  useEffect(() => {
    // Ensure canonical route points to Chatwoot dashboard
    replace("/frontdesk/chatwoot?view=dashboard").then();
  }, [replace]);

  // Don't render layout during redirect to prevent duplicate profile fetch
  return null;
}
