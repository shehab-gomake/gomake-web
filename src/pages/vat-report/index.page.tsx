import { CustomerAuthLayout } from "@/layouts";
import { CLIENT_TYPE } from "../customers/enums";
import { VatReportWidget } from "@/pages-components/vat-report/vat-report";

export default function VatReportPage() {
    return (
        <CustomerAuthLayout staticPageTitle="vat report"
            className={`custom-scrollbar`}
        >
            <VatReportWidget />
        </CustomerAuthLayout>
    );
} 