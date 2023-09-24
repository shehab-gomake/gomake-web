import { CustomerAuthLayout } from "@/layouts";
import { QuotePageWidget } from "@/pages-components/quote/quote";

export default function Quote() {
  return (
    <CustomerAuthLayout>
      <QuotePageWidget/>
    </CustomerAuthLayout>
  );
}
