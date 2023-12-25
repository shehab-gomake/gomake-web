import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { DOCUMENT_TYPE } from "@/pages-components/enums";

export default function DeliveryNotes() {
  return (
    <CustomerAuthLayout>
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.DELIVERY_NOTE}/>
    </CustomerAuthLayout>
  );
}
