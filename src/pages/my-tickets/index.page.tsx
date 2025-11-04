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

  const handleRowClick = (row: any[]) => {
    const rowIndex = getTicketsRows().indexOf(row);
    if (rowIndex >= 0 && rowIndex < tickets.length) {
      setSelectedTicket(tickets[rowIndex]);
    }
  };

  return (
    <CustomerAuthLayout>
      <Stack direction="column" className={classes.mainContainer}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h1 className={classes.title}>{t("tabs.myTickets")}</h1>
          <AddTicketButton onClick={() => setIsModalOpen(true)} />
        </Stack>

        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={true}
          rows={getTicketsRows()}
          header={tableHeaders}
          maxHeight={600}
          loading={loading}
          onClickRow={handleRowClick}
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

