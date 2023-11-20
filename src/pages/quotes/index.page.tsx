import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";

export default function Quotes() {
  return (
    <CustomerAuthLayout>
      <QuotesListPageWidget />
    </CustomerAuthLayout>
  );
}
