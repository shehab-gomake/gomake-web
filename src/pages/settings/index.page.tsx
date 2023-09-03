import { CustomerAuthLayout } from "@/layouts";

import { SettingsWidget } from "@/widgets/settings/settings";

export default function SettingsPage() {
  return (
    <CustomerAuthLayout>
      <SettingsWidget />
    </CustomerAuthLayout>
  );
}
