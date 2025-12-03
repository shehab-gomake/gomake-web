import { CustomerAuthLayout } from "@/layouts";
import { MachineComparisonReport } from "@/pages-components/machines-comparison";

export default function MachineComparisonReportPage() {
  return (
    <CustomerAuthLayout
      className={`custom-scrollbar`}
      staticPageTitle={"Machines Comparison"}
    >
      <MachineComparisonReport />
    </CustomerAuthLayout>
  );
}


