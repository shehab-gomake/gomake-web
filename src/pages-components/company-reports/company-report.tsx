import { PrimaryTable } from "@/components/tables/primary-table";
import { useCompanyReport } from "./use-comany-report";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";

const CompanyReportWidget = () => {
    const { AllReport, tableHeaders, t, generateCalculateProductsExcelForPrintHouses } = useCompanyReport();
    const { classes } = useStyle();

    return (
        <>
            <div style={classes.mainContainer}>
                <HeaderTitle title={t("companyReports.printhouseReport")} marginTop={"0px"} marginBottom={"0px"} />
                {/* <GomakePrimaryButton style={classes.btnContainer} onClick={generateCalculateProductsExcelForPrintHouses}>{t("companyReports.testCalculation")} </GomakePrimaryButton> */}
                <PrimaryTable
                    stickyFirstCol={false}
                    stickyHeader={true}
                    rows={AllReport}
                    headers={tableHeaders}
                    maxHeight={800}
                />
            </div>
        </>
    )

};


export { CompanyReportWidget };