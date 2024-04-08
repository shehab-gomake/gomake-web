import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { Permissions } from "../../components/CheckPermission/enum";

export default function deliveryNotesRefund() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_DELIVERY_NOTES_REFUND}>
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.deliveryNoteRefund} />
    </CustomerAuthLayout>
  );
}
