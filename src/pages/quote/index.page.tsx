import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuoteNewPageWidget } from "@/pages-components/quote-new/quote";

export default function Quote() {
  return (
    <CustomerAuthLayout staticPageTitle="quote">
      <QuoteNewPageWidget documentType={DOCUMENT_TYPE.quote} />
    </CustomerAuthLayout>
  );
}