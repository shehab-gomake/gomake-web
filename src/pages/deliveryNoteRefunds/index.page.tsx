import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

export default function deliveryNotesRefund() {
  return (
    <CustomerAuthLayout>
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.deliveryNoteRefund} />
    </CustomerAuthLayout>
  );
}
