import { PrimaryTable } from "@/components/tables/primary-table";
import { useCompanyReport } from "./use-comany-report";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { PaymentDetailsModal } from "./payment-details/payment-details";
import { useEffect } from "react";

const CompanyReportWidget = () => {
  const { classes } = useStyle();
  const {
    t,
    AllReport,
    getReport,
    tableHeaders,
    openPaymentDetails,
    handleCloseModal,
    selectedPrintHouse,
    generateCalculateProductsExcelForPrintHouses,
  } = useCompanyReport();

  useEffect(() => {
    getReport();
  }, []);

  return (
    <>
      <div style={classes.mainContainer}>
        <HeaderTitle
          title={t("companyReports.printhouseReport")}
          marginTop={"0px"}
          marginBottom={"0px"}
        />
        {/* <GomakePrimaryButton style={classes.btnContainer} onClick={generateCalculateProductsExcelForPrintHouses}>{t("companyReports.testCalculation")} </GomakePrimaryButton> */}
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={true}
          rows={AllReport}
          headers={tableHeaders}
          maxHeight={800}
        />
        <PaymentDetailsModal
          openModal={openPaymentDetails}
          onClose={handleCloseModal}
          selectedPrintHouse={selectedPrintHouse}
          getReport={getReport}
        />
      </div>
    </>
  );
};

export { CompanyReportWidget };
