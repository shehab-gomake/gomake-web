import { PrimaryTable } from "@/components/tables/primary-table";
import { useCompanyReport } from "./use-comany-report";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { PaymentDetailsModal } from "./payment-details/payment-details";
import { useEffect, useMemo } from "react";
import { GoMakeAutoComplate } from "@/components";
import { PrintHousePayStatus } from "./interfaces";

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
    payStatus,
    payStatuses,
    handlePayStatusChange,
  } = useCompanyReport();

  useEffect(() => {
    getReport();
  }, []);

  const filteredReports = useMemo(() => {
    if (!payStatus) return AllReport;
    //item[7] is equal to the text of item?.PrintHousePayStatus
    return AllReport?.filter(
      (item) =>
        item[7] === t(`companyReports.${PrintHousePayStatus[payStatus.value]}`)
    );
  }, [AllReport, payStatus]);

  return (
    <>
      <div style={classes.mainContainer}>
        <HeaderTitle
          title={t("companyReports.printhouseReport")}
          marginTop={"0px"}
          marginBottom={"0px"}
        />
        <div style={classes.statusFilterContainer}>
          <h3 style={classes.filterLabelStyle}>{t("Pay status")}</h3>
          <GoMakeAutoComplate
            options={payStatuses}
            style={classes.textInputStyle}
            placeholder={"pay status"}
            onChange={handlePayStatusChange}
            value={payStatus}
            withArrow={true}
          />
        </div>
        {/* <GomakePrimaryButton style={classes.btnContainer} onClick={generateCalculateProductsExcelForPrintHouses}>{t("companyReports.testCalculation")} </GomakePrimaryButton> */}
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={true}
          rows={filteredReports}
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
