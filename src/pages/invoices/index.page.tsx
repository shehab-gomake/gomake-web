import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import {EDocumentTypeEnum} from "@/enums";

export default function Invoices() {
  return (
    <CustomerAuthLayout>
      <QuotesListPageWidget documentType={EDocumentTypeEnum.Invoice} />
    </CustomerAuthLayout>
  );
}
