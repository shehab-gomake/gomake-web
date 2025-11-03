import { CustomerAuthLayout } from "@/layouts";
import dynamic from "next/dynamic";

const FrontdeskV2Widget = dynamic(
  () => import("@/widgets/frontdesk-v2/frontdesk-v2-widget"),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function FrontdeskV2Page() {
  return (
    <CustomerAuthLayout staticPageTitle={"frontdesk-v2"}>
      <FrontdeskV2Widget />
    </CustomerAuthLayout>
  );
}

