import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { QuotePageWidget } from "@/pages-components/quote/quote";

export default function Quote() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_QUOTES}>
      <QuotePageWidget/>
    </CustomerAuthLayout>
  );
}
