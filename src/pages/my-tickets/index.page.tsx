import { useTranslation } from "react-i18next";
import { CustomerAuthLayout } from "@/layouts";
import { useStyle } from "./style";
import { useMyTickets } from "./use-my-tickets";
import { AddTicketButton } from "./add-ticket-button";
import Stack from "@mui/material/Stack";
import { PrimaryTable } from "@/components/tables/primary-table";
import { CreateTicketModal } from "./create-ticket-modal";
import { TicketDetailModal } from "./ticket-detail-modal";

export default function MyTickets() {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const {
    tickets,
    loading,
    tableHeaders,
    getTicketsRows,
    fetchTickets,
    isModalOpen,
    setIsModalOpen,
    selectedTicket,
    setSelectedTicket,
    handleCreateTicket,
  } = useMyTickets();

  return (
    <CustomerAuthLayout>
      <Stack direction="column" sx={classes.mainContainer}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h1 style={classes.title}>{t("tabs.myTickets")}</h1>
          <AddTicketButton onClick={() => setIsModalOpen(true)} />
        </Stack>

        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={true}
          rows={getTicketsRows()}
          headers={tableHeaders}
          maxHeight={600}
        />

        <CreateTicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (data) => {
            await handleCreateTicket(data);
            setIsModalOpen(false);
          }}
        />

        <TicketDetailModal
          ticket={selectedTicket}
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={fetchTickets}
        />
      </Stack>
    </CustomerAuthLayout>
  );
}

