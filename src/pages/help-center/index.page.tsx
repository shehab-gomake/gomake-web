import { CustomerAuthLayout } from "@/layouts";
import { HelpCenterWidget } from "@/widgets/help-center-widget";
import { getUserToken } from "@/services/storage-data";
import { HelpCenterWidgetPublic } from "@/widgets/help-center-widget/help-center-widget-public";

export default function HelpCenter() {
  const isAuthenticated = !!getUserToken();

  // If authenticated, show with full layout (sidebar + header)
  if (isAuthenticated) {
    return (
      <CustomerAuthLayout>
        <HelpCenterWidget />
      </CustomerAuthLayout>
    );
  }

  // If not authenticated, show public version without layout
  return (
    <CustomerAuthLayout allowAnonymous={true} disableHeaderSideMenu={true}>
      <HelpCenterWidgetPublic />
    </CustomerAuthLayout>
  );
}

