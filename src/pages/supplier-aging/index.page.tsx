import { CustomerAuthLayout } from "@/layouts";
import { AgingReportWidget } from "@/pages-components/aging-report/aging-report";
import { CLIENT_TYPE } from "../customers/enums";

export default function SupplierAgingPage() {
  return (
    <CustomerAuthLayout className={`custom-scrollbar`}>
      <AgingReportWidget clientType={CLIENT_TYPE.SUPPLIER} />
    </CustomerAuthLayout>
  );
}
