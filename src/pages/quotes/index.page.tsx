import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";

export default function Quotes() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_QUOTES}>
      <QuotesListPageWidget />
    </CustomerAuthLayout>
  );
}
