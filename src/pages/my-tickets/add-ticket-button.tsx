import { AddButton } from "@/components/button/add-button";
import { useTranslation } from "react-i18next";

export const AddTicketButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  return (
    <AddButton onClick={onClick} label={t("tickets.createTicket")} />
  );
};

