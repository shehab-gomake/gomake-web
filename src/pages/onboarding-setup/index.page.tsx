import { CustomerAuthLayout } from "@/layouts";
import QuickSetupFlow from "@/widgets/quick-setup/on-boarding-setup/quick-setup-flow";

export default function QuickSetupPage() {
  return (
    <CustomerAuthLayout>
      <QuickSetupFlow />
    </CustomerAuthLayout>
  );
}
