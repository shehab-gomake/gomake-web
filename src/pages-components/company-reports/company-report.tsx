import { PrimaryTable } from "@/components/tables/primary-table";
import { useCompanyReport } from "./use-comany-report";

import { GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";

const CompanyReportWidget = () => {
    const { AllReport, tableHeaders, t } = useCompanyReport();
    const { clasess } = useStyle();

    return (
        <>
            <div style={{ margin: 20 }} >
                <GomakePrimaryButton style={clasess.btnContainer}>{t("companyReports.testCalculation")}</GomakePrimaryButton>
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
