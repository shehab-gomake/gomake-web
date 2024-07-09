import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useCustomerService } from "./hook/use-customer-service";
import { useStyle } from "./style";
import { CreateIssueModal } from "./components/create-issue-modal";
import { IssuesHeaderSection } from "./components/header-section";
import { useEffect } from "react";
import { HeaderTitle } from "@/widgets";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { Stack } from "@mui/material";

const CustomerServicePageWidget = ({ isAdmin }: { isAdmin: boolean }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    tableHeaders,
    openModal,
    ticketType,
    ticketTypeList,
    title,
    description,
    setDescription,
    setTitle,
    setTicketType,
    onClickClosModal,
    onClickOpenModal,
    handleClean,
    createIssue,
    onChangePrintHouse,
    printHouses,
    selectedPrintHouseName,
    getIssues,
    onChangeInputs,
    statuses,
    onChangeStatus,
    statusFilter,
    filteredIssues,
    statusKey,
    columnWidths,
    ticketState,
    setTicketState,
  } = useCustomerService(isAdmin);

  return (
    <Stack direction="column" justifyContent="space-between" display="flex" spacing={2} height="100%">
      <div style={classes.mainContainer}>
        <div style={classes.sameRow}>
          <HeaderTitle marginTop={1} marginBottom={1} title={t("customerService.printHouses")} />
          {/* <PermissionCheck userPermission={Permissions.SHOW_ADMIN_CUSTOMER_SERVICE}> */}
          <GomakePrimaryButton style={classes.btnContainer} onClick={onClickOpenModal}>
            {t("customerService.addNewTicket")}
          </GomakePrimaryButton>
          {/* </PermissionCheck> */}
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
          isAdmin={isAdmin}
          openModal={openModal}
          ticketType={ticketType}
          ticketTypeList={ticketTypeList}
          title={title}
          description={description}
          setDescription={setDescription}
          setTitle={setTitle}
          setTicketType={setTicketType}
          onClickClosModal={onClickClosModal}
          createIssue={createIssue}
          onChangeInputs={onChangeInputs}
          ticketState={ticketState}
        />
      </div>
    </Stack>
  );
};

export { CustomerServicePageWidget };
