import { CustomerAuthLayout } from "@/layouts";
import { TransactionJournalReportWidget } from "@/pages-components/transaction-journal-report/transaction-journal-report";
import { Permissions } from "../../components/CheckPermission/enum";
import { EReportType } from "@/enums";
import { CLIENT_TYPE } from "../customers/enums";

export default function TransactionJournalReportPage() {
  return (
    <CustomerAuthLayout
      staticPageTitle={"payments report"}
      permissionEnumValue={Permissions.SHOW_SUPPLIER_PAYMENT_REPORT}
      className={`custom-scrollbar`}
    >
      <TransactionJournalReportWidget
        reportType={EReportType.DailyPayments}
        clientType={CLIENT_TYPE.SUPPLIER}
      />
    </CustomerAuthLayout>
  );
}
