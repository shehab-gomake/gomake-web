import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuoteNewPageWidget } from "@/pages-components/quote-new/quote";

export default function Order() {
  return (
    <CustomerAuthLayout>
      <QuoteNewPageWidget documentType={DOCUMENT_TYPE.order} />
    </CustomerAuthLayout>
  );
}
