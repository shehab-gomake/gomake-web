import { useTranslation } from "react-i18next";
import { CustomerAuthLayout } from "@/layouts";
import { useStyle } from "./style";
import { useMyTickets } from "./use-my-tickets";
import { AddTicketButton } from "./add-ticket-button";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useTicketChatbot } from "@/components/ticket-chatbot";
import { useMemo } from "react";

function MyTicketsContent() {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { navigateToTicket, openNewTicket } = useTicketChatbot();
  const {
    tickets,
    loading,
    tableHeaders,
    getTicketsRows,
    fetchTickets,
  } = useMyTickets();

  const rows = useMemo(() => {
    return getTicketsRows(navigateToTicket);
  }, [getTicketsRows, navigateToTicket]);

  return (
    <div style={classes.mainContainer}>
      <div style={classes.headerStyle}>
        <h1 style={classes.title}>{t("tabs.myTickets")}</h1>
        <AddTicketButton onClick={() => openNewTicket()} />
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

