import { useTranslation } from "react-i18next";
import { GomakePrimaryButton } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useCustomerService } from "./hook/use-customer-service";
import { useStyle } from "./style";
import { CreateIssueModal } from "./components/create-issue-modal";
import { IssuesHeaderSection } from "./components/header-section";
import { useEffect } from "react";
import { HeaderTitle } from "@/widgets";
import { Stack } from "@mui/material";
import { useRouter } from "next/router";

const CustomerServicePageWidget = ({ isAdmin }: { isAdmin: boolean }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    tableHeaders,
    openModal,
    ticketTypeList,
    onClickClosModal,
    onClickOpenModal,
    handleClean,
    onChangePrintHouse,
    printHouses,
    selectedPrintHouse,
    statuses,
    onChangeStatus,
    statusFilter,
    filteredIssues,
    columnWidths,
    ticketState,
    setTicketState,
    setFile,
    handleSectionChange,
    createAnother,
    handleCheckboxChange,
    selectedSubSection,
    setSelectedSubSection,
    selectedSection,
    setSelectedSection,
    jiraImageUploadRef,
    patternSearch,
    setPatternSearch,
    onChangeModalPrintHouse,
    selectedModalPrintHouse,
    onChangeInputs,
    sendToMonday,
  } = useCustomerService(isAdmin);

  const router = useRouter();
  const { from } = router.query;

  useEffect(() => {
    if (typeof from === "string") {
      const x = decodeURIComponent(from);
      setTicketState({
        ...ticketState,
        gomakeRouteUri: decodeURIComponent(from),
      });
    }
  }, [from]);

  const processedRows = isAdmin
    ? filteredIssues
    : filteredIssues.map((row) => [null, ...row.slice(1)]); // Replace the first element with null

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      display="flex"
      spacing={2}
      height="100%"
    >
      <div style={classes.mainContainer}>
        <div style={classes.sameRow}>
          <HeaderTitle
            marginTop={1}
            marginBottom={1}
            title={t("customerService.printHouses")}
          />
          <GomakePrimaryButton
            style={classes.btnContainer}
            onClick={onClickOpenModal}
          >
            {t("customerService.addNewTicket")}
          </GomakePrimaryButton>
        </div>
        {
          <IssuesHeaderSection
            isAdmin={isAdmin}
            printHouses={printHouses}
            onChangePrintHouse={onChangePrintHouse}
            selectedPrintHouse={selectedPrintHouse}
            handleClean={handleClean}
            statuses={statuses}
            onChangeStatus={onChangeStatus}
            selectedStatus={statusFilter}
            setPatternSearch={setPatternSearch}
            patternSearch={patternSearch}
          />
        }
        <PrimaryTable
          stickyHeader={true}
          columnWidths={columnWidths}
          rows={processedRows}
          headers={tableHeaders}
          maxHeight={"calc(100vh - 280px)"}
          withSort={true}
        />
        <CreateIssueModal
          isAdmin={isAdmin}
          setTicketState={setTicketState}
          openModal={openModal}
          ticketTypeList={ticketTypeList}
          onClickClosModal={onClickClosModal}
          createIssue={sendToMonday}
          ticketState={ticketState}
          setFile={setFile}
          handleSectionChange={handleSectionChange}
          createAnother={createAnother}
          handleCheckboxChange={handleCheckboxChange}
          selectedSubSection={selectedSubSection}
          setSelectedSubSection={setSelectedSubSection}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          jiraImageUploadRef={jiraImageUploadRef}
          printHouses={printHouses}
          onChangePrintHouse={onChangeModalPrintHouse}
          selectedPrintHouse={selectedModalPrintHouse}
          onChangeInputs={onChangeInputs}
        />
      </div>
    </Stack>
  );
};

export { CustomerServicePageWidget };
