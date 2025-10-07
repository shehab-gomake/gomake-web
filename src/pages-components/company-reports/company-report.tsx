import { PrimaryTable } from "@/components/tables/primary-table";
import { useCompanyReport } from "./use-comany-report";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useEffect, useMemo } from "react";
import { GoMakeAutoComplate } from "@/components";
import { PrintHousePayStatus } from "./components/utils/interfaces";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { Stack } from "@mui/material";
import { useDebounce } from "use-debounce";
import { SendPaymentModal } from "./components/send-payment/send-payment";
import { PaymentDetailsModal } from "./components/payment-details/payment-details";
import { GomakePrimaryButton } from "@/components/button";
import { PrimaryButton } from "@/components/button/primary-button";

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
    openSendPaymentModal,
    handleCloseSendPaymentModal,
    selectedPrintHouseId,
    countries,
    selectedCountry,
    setSelectedCountry,
    handleCreatePrintHouseInAccounting,
  } = useCompanyReport();

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
    // Filter by country
    if (selectedCountry) {
      reports = reports.filter(
        (item) => item[2]?.toLowerCase() === selectedCountry?.toLowerCase()
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
  }, [AllReport, payStatus, selectedCountry, debouncedPatternSearch]);

  useEffect(() => {
    getReport();
  }, []);

  return (
    <>
      <div style={classes.mainContainer}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ width: "100%" }}
        >
          <HeaderTitle
            title={t("companyReports.printhouseReport")}
            marginTop={"0px"}
            marginBottom={"0px"}
          />
          <PrimaryButton
            onClick={handleCreatePrintHouseInAccounting}
            variant="contained"
            style={classes.addPrintHouseBtn}
          >
            {t("companyReports.addPrintHouseToAccounting")}
          </PrimaryButton>
        </Stack>
        <Stack
          width={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Stack width={"100%"} direction={"row"} spacing={1}>
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
            <div style={classes.statusFilterContainer}>
              <h3 style={classes.filterLabelStyle}>
                {t("profileSettings.country")}
              </h3>
              <GoMakeAutoComplate
                options={countries}
                style={classes.textInputStyle}
                placeholder={t("Select country")}
                onChange={(e: any, value: any) => {
                  setSelectedCountry(value?.value);
                }}
                value={selectedCountry}
                withArrow={true}
              />
            </div>
          </Stack>
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
          maxHeight={"100vh"}
          variant="OddEvenTable"
        />
        <PaymentDetailsModal
          openModal={openPaymentDetails}
          onClose={handleCloseModal}
          selectedPrintHouse={selectedPrintHouse}
          getReport={getReport}
        />
        <SendPaymentModal
          openModal={openSendPaymentModal}
          onClose={handleCloseSendPaymentModal}
          selectedPrintHouseId={selectedPrintHouseId}
        />
      </div>
    </>
  );
};

export { CompanyReportWidget };
