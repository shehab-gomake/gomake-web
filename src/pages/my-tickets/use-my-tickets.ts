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
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  // Check if user has permission to view all tickets - make it reactive to permission changes
  const canViewAllTickets = useMemo(() => {
    if (!permissions || !Array.isArray(permissions)) {
      console.log("[MyTickets] Permissions not loaded or invalid:", permissions);
      return false;
    }
    const hasPermission = permissions.includes(Permissions.SHOW_ALL_SUPPORT_TICKETS);
    console.log("[MyTickets] Permission check:", {
      permission: Permissions.SHOW_ALL_SUPPORT_TICKETS,
      permissions: permissions,
      hasPermission: hasPermission,
    });
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
              const isValid = userID && 
                             userID !== "00000000-0000-0000-0000-000000000000" &&
                             String(userID).trim() !== "";
              return isValid;
            })
            .map((employee: any) => {
              const userID = employee.userID || employee.userId;
              const fullName = `${employee.firstname || ""} ${employee.lastname || ""}`.trim() || employee.email || "Unknown";
              return {
                label: fullName,
                id: userID,
                value: userID,
              };
            });
          
          console.log("[MyTickets] User options:", userOptions);
          setUsers(userOptions);
        } else {
          console.warn("[MyTickets] No employees found in response. Response:", res);
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

  // Fetch tickets based on filters and selected user
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const ticketFilters: any = { ...filters };
      
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
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [callApi, filters, selectedUserId, canViewAllTickets, userProfile?.userId]);

  // Fetch users on mount if user has permission
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
        ticket.title,
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
    canViewAllTickets,
  };
};
