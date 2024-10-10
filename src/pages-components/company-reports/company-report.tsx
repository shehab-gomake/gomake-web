import { PrimaryTable } from "@/components/tables/primary-table";
import { useCompanyReport } from "./use-comany-report";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { PaymentDetailsModal } from "./payment-details/payment-details";
import { useEffect, useMemo } from "react";
import { GoMakeAutoComplate } from "@/components";
import { PrintHousePayStatus } from "./interfaces";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { Stack } from "@mui/material";
import { useDebounce } from "use-debounce";

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
    patternSearch,
    setPatternSearch,
  } = useCompanyReport();

  useEffect(() => {
    getReport();
  }, []);

  const [debouncedPatternSearch] = useDebounce(patternSearch, 300);
  const filteredReports = useMemo(() => {
    let reports = AllReport;

    // Filter by pay status
    if (payStatus) {
      reports = reports.filter(
        (item) =>
          item[7] ===
          t(`companyReports.${PrintHousePayStatus[payStatus.value]}`)
      );
    }

    if (debouncedPatternSearch.trim()) {
      const lowercasedSearch = debouncedPatternSearch.toLowerCase();
      reports = reports.filter(
        (item) =>
          item[0]?.toLowerCase().includes(lowercasedSearch) || // Company Name
          item[1]?.toLowerCase().includes(lowercasedSearch) // Domain
      );
    }

    return reports;
  }, [AllReport, payStatus, debouncedPatternSearch]);

  return (
    <>
      <div style={classes.mainContainer}>
        <HeaderTitle
          title={t("companyReports.printhouseReport")}
          marginTop={"0px"}
          marginBottom={"0px"}
        />
        <Stack
          width={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
        >
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
          <SearchInputComponent
            searchInputStyle={{ width: "20vw", alignSelf: "flex-end" }}
            onChange={(e) => {
              setPatternSearch(e);
            }}
            value={patternSearch}
          />
        </Stack>
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
