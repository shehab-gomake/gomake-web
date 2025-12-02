import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { Ticket } from "@/services/api-service/tickets/tickets-api";
import {
  getTickets,
} from "@/services/api-service/tickets/tickets-api";
import React from "react";

export const useMyTickets = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTickets(callApi, filters);
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [callApi, filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const tableHeaders = [
    t("tickets.ticketId"),
    t("tickets.title"),
    t("tickets.status"),
    t("tickets.priority"),
    t("tickets.assignedTo"),
    t("tickets.createdAt"),
  ];

  const getTicketsRows = useCallback((navigateToTicket: (ticketId: number) => void) => {
    return tickets.map((ticket) => [
      // Ticket ID as clickable link
      React.createElement(
        "span",
        {
          key: ticket.id,
          style: {
            color: "#1976d2",
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: 500,
          },
          title: t("tickets.clickToViewConversation"),
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            if (ticket.id) {
              navigateToTicket(ticket.id);
            }
          },
        },
        ticket.ticketId
      ),
      ticket.title,
      ticket.status,
      ticket.priority,
      ticket.assignedEmployeeName || t("tickets.unassigned"),
      new Date(ticket.createdAt).toLocaleDateString(),
    ]);
  }, [tickets, t]);

  return {
    tickets,
    loading,
    tableHeaders,
    getTicketsRows,
    fetchTickets,
    filters,
    setFilters,
  };
};

