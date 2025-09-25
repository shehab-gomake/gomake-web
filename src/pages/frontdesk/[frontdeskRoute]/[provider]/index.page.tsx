import { CustomerAuthLayout } from "@/layouts";
import dynamic from "next/dynamic";

const FrontdeskWidget = dynamic(
  () => import("@/widgets/frontdesk/frontdesk-widget"),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function FrontdeskProviderPage() {
  return (
    <CustomerAuthLayout staticPageTitle={"frontdesk"}>
      <FrontdeskWidget />
    </CustomerAuthLayout>
  );
}

