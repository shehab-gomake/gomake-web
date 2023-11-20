import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { QuoteNewPageWidget } from "@/pages-components/quote-new/quote";
import { QuotePageWidget } from "@/pages-components/quote/quote";

export default function Quote() {
  return (
    <CustomerAuthLayout>
      <QuotePageWidget />
    </CustomerAuthLayout>
    // <CustomerAuthLayout>
    //   <QuoteNewPageWidget />
    // </CustomerAuthLayout>
  );
}
