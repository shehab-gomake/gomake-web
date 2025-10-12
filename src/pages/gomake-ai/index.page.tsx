import { CustomerAuthLayout } from "@/layouts";
import { GoMakeAIComponent } from "@/widgets/gomake-ai-widget/components/gomake-ai/gomake-ai";

export default function GoMakeAIPage() {
  return (
    <CustomerAuthLayout
      staticPageTitle={"GoMake AI"}
      allowAnonymous={false}
      disableHeaderSideMenu={true}
    >
      <GoMakeAIComponent />
    </CustomerAuthLayout>
  );
}
