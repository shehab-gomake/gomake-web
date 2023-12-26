import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuoteNewPageWidget } from "@/pages-components/quote-new/quote";

export default function Invoice() {
  return (
    <CustomerAuthLayout>
      <QuoteNewPageWidget documentType={DOCUMENT_TYPE.invoice} />
    </CustomerAuthLayout>
  );
}
