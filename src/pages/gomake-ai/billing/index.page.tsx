import { CustomerAuthLayout } from "@/layouts";
import { GoMakeAIBillingPage } from "@/pages-components/gomake-ai/billing";

export default function BillingPage() {
  return (
    <CustomerAuthLayout
      allowAnonymous={true}
      disableHeaderSideMenu={true}
      staticPageTitle={"Gomake AI Billing"}
    >
      <GoMakeAIBillingPage />
    </CustomerAuthLayout>
  );
}
