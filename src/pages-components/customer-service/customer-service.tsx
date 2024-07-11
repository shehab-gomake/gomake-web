import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useCustomerService } from "./hook/use-customer-service";
import { useStyle } from "./style";
import { CreateIssueModal } from "./components/create-issue-modal";
import { IssuesHeaderSection } from "./components/header-section";
import { use, useEffect } from "react";
import { HeaderTitle } from "@/widgets";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { Stack } from "@mui/material";
import { useRecoilValue } from "recoil";
import { currentPathState } from "./store/currentPathState";
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
    createIssue,
    onChangePrintHouse,
    printHouses,
    selectedPrintHouseName,
    statuses,
    onChangeStatus,
    statusFilter,
    filteredIssues,
    statusKey,
    columnWidths,
    ticketState,
    setTicketState,
    setFileBase64,
  } = useCustomerService(isAdmin);

  const router = useRouter();
  const { from } = router.query;

  useEffect(() => {
    if (typeof from === "string") {
      const x = decodeURIComponent(from);
      setTicketState({ ...ticketState, gomakeRouteUri: decodeURIComponent(from) });
    }
  }, [from]);

  return (
    <Stack direction="column" justifyContent="space-between" display="flex" spacing={2} height="100%">
      <div style={classes.mainContainer}>
        <div style={classes.sameRow}>
          <HeaderTitle marginTop={1} marginBottom={1} title={t("customerService.printHouses")} />
          <GomakePrimaryButton style={classes.btnContainer} onClick={onClickOpenModal}>
            {t("customerService.addNewTicket")}
          </GomakePrimaryButton>
        </div>

        {isAdmin && (
          <IssuesHeaderSection
            isAdmin={isAdmin}
            printHouses={printHouses}
            onChangePrintHouse={onChangePrintHouse}
            selectedPrintHouseName={selectedPrintHouseName}
            handleClean={handleClean}
            statuses={statuses}
            onChangeStatus={onChangeStatus}
            selectedStatus={statusFilter}
            statusKey={statusKey}
          />
        )}
        <Stack>
          <PrimaryTable
            stickyFirstCol={true}
            stickyHeader={true}
            columnWidths={columnWidths}
            rows={filteredIssues}
            headers={tableHeaders}
          />
        </Stack>
        <CreateIssueModal
          setTicketState={setTicketState}
          openModal={openModal}
          ticketTypeList={ticketTypeList}
          onClickClosModal={onClickClosModal}
          createIssue={createIssue}
          ticketState={ticketState}
          setFileBase64={setFileBase64}
        />
      </div>
    </Stack>
  );
};

export { CustomerServicePageWidget };
