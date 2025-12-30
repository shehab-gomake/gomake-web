import { useCallback, useEffect, useState, useMemo } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { Ticket } from "@/services/api-service/tickets/tickets-api";
import { getTickets } from "@/services/api-service/tickets/tickets-api";
import React from "react";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import { permissionsState } from "@/store/permissions";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

export interface UserOption {
  label: string;
  id: string;
  value: string;
}

export const useMyTickets = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const userProfile = useRecoilValue(userProfileState);
  const permissions = useRecoilValue<any>(permissionsState);
  const { CheckPermission } = useUserPermission();
  const [allTickets, setAllTickets] = useState<Ticket[]>([]); // Store all tickets fetched from API (before status filtering)
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  // Filter tickets locally by status (client-side filtering)
  const tickets = useMemo(() => {
    if (selectedStatuses.length === 0) {
      return allTickets; // No status filter, return all tickets
    }
    return allTickets.filter((ticket) =>
      selectedStatuses.includes(ticket.status)
    );
  }, [allTickets, selectedStatuses]);

  // Check if user has permission to view all tickets - make it reactive to permission changes
  const canViewAllTickets = useMemo(() => {
    if (!permissions || !Array.isArray(permissions)) {
      return false;
    }
    const hasPermission = permissions.includes(
      Permissions.SHOW_ALL_SUPPORT_TICKETS
    );

    return hasPermission;
  }, [permissions]);

  // Fetch users/employees list
  const fetchUsers = useCallback(async () => {
    if (!canViewAllTickets) {
      return; // Don't fetch users if user doesn't have permission
    }

    try {
      setLoadingUsers(true);
      // Use getSetApiData to handle response structure correctly (extracts from data.data.data)
      const callBack = (res: any) => {
        console.log("[MyTickets] Fetch users callback response:", res);

        if (res.success && res.data && Array.isArray(res.data)) {
          const employees = res.data;
          console.log("[MyTickets] Parsed employees:", employees);

          const userOptions: UserOption[] = employees
            .filter((employee: any) => {
              // Filter out invalid userIDs and ensure userID exists
              const userID = employee.userID || employee.userId;
              const isValid =
                userID &&
                userID !== "00000000-0000-0000-0000-000000000000" &&
                String(userID).trim() !== "";
              return isValid;
            })
            .map((employee: any) => {
              const userID = employee.userID || employee.userId;
              const fullName =
                `${employee.firstname || ""} ${
                  employee.lastname || ""
                }`.trim() ||
                employee.email ||
                "Unknown";
              return {
                label: fullName,
                id: userID,
                value: userID,
              };
            });

          console.log("[MyTickets] User options:", userOptions);
          setUsers(userOptions);
        } else {
          console.warn(
            "[MyTickets] No employees found in response. Response:",
            res
          );
        }
      };

      await getSetApiData(
        callApi,
        EHttpMethod.GET,
        "/v1/crm-service/employee/get-employees",
        callBack
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  }, [callApi, canViewAllTickets]);

  // Fetch tickets based on userId only (status filtering is done client-side)
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const ticketFilters: any = { ...filters };

      // Explicitly remove status filter - we'll filter locally by status
      delete ticketFilters.status;

      // Only filter by userId (which requires API call)
      // If user doesn't have permission, only show their own tickets
      if (!canViewAllTickets) {
        ticketFilters.userId = userProfile?.userId || "";
      } else if (selectedUserId) {
        // If user has permission and selected a user, filter by that user
        ticketFilters.userId = selectedUserId;
      }
      // If user has permission and no user selected (All Users), don't set userId filter
      // This will result in no userId in query params, which backend interprets as "show all tickets"

      const data = await getTickets(callApi, ticketFilters);
      setAllTickets(data); // Store all tickets (status filtering will be done in useMemo)
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [
    callApi,
    filters, // Keep filters for priority (if needed)
    selectedUserId, // Only fetch when userId changes
    canViewAllTickets,
    userProfile?.userId,
    // Removed selectedStatuses from dependencies - status filtering is now client-side
  ]);

  // Fetch users on mount if user has permission
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const tableHeaders = [
    t("tickets.ticketId"),
    t("tickets.summary") || "Summary",
    t("tickets.status"),
    t("tickets.priority"),
    t("tickets.assignedTo"),
    t("tickets.createdAt"),
    t("tickets.expectation") || "Expectation",
  ];

  const getTicketsRows = useCallback(
    (navigateToTicket: (ticketId: number) => void) => {
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
        ticket.summary || "-",
        ticket.status,
        ticket.priority,
        ticket.assignedEmployeeName || t("tickets.unassigned"),
        new Date(ticket.createdAt).toLocaleDateString(),
        ticket.expectedDeliveryDate
          ? new Date(ticket.expectedDeliveryDate).toLocaleDateString()
          : "-",
      ]);
    },
    [tickets, t]
  );

  // Status options for multi-select filter
  const statusOptions = useMemo(
    () => [
      {
        label: t("tickets.statuses.aiProcessing") || "AI Processing",
        value: "ai_processing",
      },
      { label: t("tickets.statuses.open") || "Open", value: "open" },
      {
        label: t("tickets.statuses.inProgress") || "In Progress",
        value: "in_progress",
      },
      {
        label: t("tickets.statuses.resolved") || "Resolved",
        value: "resolved",
      },
      { label: t("tickets.statuses.closed") || "Closed", value: "closed" },
    ],
    [t]
  );

  return {
    tickets,
    loading,
    tableHeaders,
    getTicketsRows,
    fetchTickets,
    filters,
    setFilters,
    users,
    loadingUsers,
    selectedUserId,
    setSelectedUserId,
    selectedStatuses,
    setSelectedStatuses,
    statusOptions,
    canViewAllTickets,
  };
};
