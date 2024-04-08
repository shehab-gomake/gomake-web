import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { Permissions } from "../../components/CheckPermission/enum";

export default function Quotes() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_QUOTES}>
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.quote}/>
    </CustomerAuthLayout>
  );
}
