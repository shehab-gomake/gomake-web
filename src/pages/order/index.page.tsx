import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/enums";
import { QuoteNewPageWidget } from "@/pages-components/quote-new/quote";
//import { QuoteNewPageWidget } from "@/pages-components/quote-new";

export default function Order() {
  return (
    <CustomerAuthLayout>
      <QuoteNewPageWidget documentType={DOCUMENT_TYPE.ORDER} />
    </CustomerAuthLayout>
  );
}
