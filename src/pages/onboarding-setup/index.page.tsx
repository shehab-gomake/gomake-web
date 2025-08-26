import { CustomerAuthLayout } from "@/layouts";
import TestPage from "@/widgets/quick-setup/on-boarding-setup/test-page";

export default function QuickSetupPage() {
  return (
    <CustomerAuthLayout>
      <TestPage />
    </CustomerAuthLayout>
  );
}
