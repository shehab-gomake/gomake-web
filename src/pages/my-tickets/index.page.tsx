import { useTranslation } from "react-i18next";
import { CustomerAuthLayout } from "@/layouts";
import { useStyle } from "./style";
import { useMyTickets } from "./use-my-tickets";
import { AddTicketButton } from "./add-ticket-button";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useTicketChatbot } from "@/components/ticket-chatbot";
import { useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { GoMakeAutoComplate, GoMakeMultiSelect } from "@/components";

function MyTicketsContent() {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { navigateToTicket, openNewTicket } = useTicketChatbot();
  const {
    tickets,
    loading,
    tableHeaders,
    getTicketsRows,
    users,
    loadingUsers,
    selectedUserId,
    setSelectedUserId,
    selectedStatuses,
    setSelectedStatuses,
    statusOptions,
    canViewAllTickets,
  } = useMyTickets();

  const rows = useMemo(() => {
    return getTicketsRows(navigateToTicket);
  }, [getTicketsRows, navigateToTicket]);

  // Create stable "All Users" option
  const allUsersOption = useMemo(
    () => ({ id: "", value: "", label: t("tickets.allUsers") || "All Users" }),
    [t]
  );

  // Prepare options with "All Users" first
  const userOptions = useMemo(
    () => [allUsersOption, ...users.map((u) => ({ ...u, id: u.value }))],
    [allUsersOption, users]
  );

  // Find selected option
  const selectedOption = useMemo(() => {
    if (!selectedUserId) {
      return allUsersOption;
    }
    return (
      userOptions.find((u) => u.value === selectedUserId) || allUsersOption
    );
  }, [selectedUserId, userOptions, allUsersOption]);

  return (
    <div style={classes.mainContainer}>
      <div style={classes.headerStyle}>
        <h1 style={classes.title}>{t("tabs.myTickets")}</h1>
        <AddTicketButton onClick={() => openNewTicket()} />
      </div>

      <div style={classes.filterContainer}>
        {canViewAllTickets && (
          <GoMakeAutoComplate
            options={userOptions}
            value={selectedOption}
            onChange={(event: any, newValue: any) => {
              setSelectedUserId(newValue ? newValue.value : "");
            }}
            getOptionLabel={(option: any) => option.label}
            placeholder={t("tickets.chooseUser") || "Choose User"}
            style={classes.userSelect}
            disabled={loadingUsers}
            loading={loadingUsers}
            isOptionEqualToValue={(option: any, value: any) =>
              option?.value === value?.value
            }
          />
        )}
        <GoMakeMultiSelect
          options={statusOptions}
          value={selectedStatuses}
          onChange={setSelectedStatuses}
          placeholder={t("customerService.selectStatus") || "Choose Status"}
          isClearable={true}
          isSearchable={true}
          closeMenuOnSelect={false}
          minWidth={250}
        />
      </div>

      <div style={classes.tableContainer}>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={true}
          rows={rows}
          headers={tableHeaders}
          maxHeight={"calc(100vh - 300px)"}
        />
      </div>
    </div>
  );
}

export default function MyTickets() {
  const { t } = useTranslation();

  return (
    <CustomerAuthLayout
      staticPageTitle={t("tabs.myTickets")}
      className={`custom-scrollbar`}
    >
      <MyTicketsContent />
    </CustomerAuthLayout>
  );
}
