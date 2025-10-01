import { MaterialsSetupFlow } from "@/widgets/materials-setup/materials-setup-flow";
import { CustomerAuthLayout } from "@/layouts";

export default function MaterialsSetupPage() {
  return (
    <CustomerAuthLayout>
      <MaterialsSetupFlow />
    </CustomerAuthLayout>
  );
}
