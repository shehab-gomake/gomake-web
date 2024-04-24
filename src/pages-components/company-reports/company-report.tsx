import { PrimaryTable } from "@/components/tables/primary-table";
import { useCompanyReport } from "./use-comany-report";

import { Stack } from "react-bootstrap";

const CompanyReportWidget = () => {
    const { AllReport, tableHeaders, t } = useCompanyReport();
    return (
        <>
            <div style={{ margin: 20 }} >
                <PrimaryTable
                    stickyFirstCol={false}
                    stickyHeader={true}
                    rows={AllReport}
                    headers={tableHeaders}
                />
            </div>
        </>
    )

};


export { CompanyReportWidget };
