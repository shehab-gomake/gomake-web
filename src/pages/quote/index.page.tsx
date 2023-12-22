import { CustomerAuthLayout } from "@/layouts";
import { QuoteNewPageWidget } from "@/pages-components/quote-new/quote";

export default function Quote() {
  return (
    <CustomerAuthLayout>
      <QuoteNewPageWidget />
    </CustomerAuthLayout>
  );
}
