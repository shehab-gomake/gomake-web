import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { Ticket } from "@/services/api-service/tickets/tickets-api";
import {
  getTickets,
  createTicket,
  getTicketById,
  getTicketMessages,
  addTicketMessage,
  CreateTicketRequest,
} from "@/services/api-service/tickets/tickets-api";
import { useRecoilValue } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import { userProfileState } from "@/store/user-profile";
import React from "react";

export const useMyTickets = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const printHouse = useRecoilValue(printHouseProfile);
  const userProfile = useRecoilValue(userProfileState);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
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

  const getTicketsRows = useCallback(() => {
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
            setSelectedTicket(ticket);
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
  }, [tickets, t, setSelectedTicket]);

  const handleCreateTicket = async (ticketData: CreateTicketRequest) => {
    try {
      // Get username from userProfile (firstName + lastName) or fallback to email
      const username = userProfile?.firstName && userProfile?.lastName
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : userProfile?.email || "Unknown";

      const data = {
        ...ticketData,
        printHouseId: ticketData.printHouseId || printHouse?.id || "",
        printHouseName: ticketData.printHouseName || printHouse?.name || "",
        createdByUserId: ticketData.createdByUserId || userProfile?.userId || userProfile?.id || "",
        username: ticketData.username || username,
      };
      await createTicket(callApi, data);
      await fetchTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  };

  return {
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
    filters,
    setFilters,
  };
};

