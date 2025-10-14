import { useState, useCallback, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useGomakeAxios } from "@/hooks";
import { ticketsService } from "@/services/frontdesk";
import { TicketPriority, CreateFromConversationDto, TicketWithDetails } from "../types/api.types";

interface Client {
  id: string;
  name: string;
  code: string;
}

interface Employee {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface UseCreateTicketModalOptions {
  providerId?: string;
  externalConversationId?: string;
  onSuccess?: (ticket: TicketWithDetails) => void;
  onError?: (error: Error) => void;
}

export function useCreateTicketModal(options: UseCreateTicketModalOptions = {}) {
  const { callApi } = useGomakeAxios();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client search state
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState("");

  // Assignee search state
  const [assignees, setAssignees] = useState<Employee[]>([]);
  const [assigneesLoading, setAssigneesLoading] = useState(false);
  const [assigneeSearchQuery, setAssigneeSearchQuery] = useState("");

  // ============================================
  // Client Search
  // ============================================

  const fetchClients = useCallback(
    async (searchTerm?: string) => {
      setClientsLoading(true);
      try {
        const params = new URLSearchParams({
          clientType: "C",
          pageNumber: "1",
          pageSize: "20",
          name: searchTerm || "",
          isActive: "true",
        });

        const res = await callApi(
          "GET",
          `/v1/customers/get-customers-pagination?${params.toString()}`,
          {},
          false
        );

        const dataContainer = res?.data?.data?.data || {};
        const list = dataContainer.data || dataContainer || [];

        setClients(Array.isArray(list) ? list : []);
      } catch (err: any) {
        console.error("[CreateTicketModal] Failed to fetch clients:", err);
        setClients([]);
      } finally {
        setClientsLoading(false);
      }
    },
    [callApi]
  );

  const debouncedFetchClients = useDebouncedCallback((searchTerm: string) => {
    fetchClients(searchTerm);
  }, 700);

  const handleClientSearch = useCallback(
    (query: string) => {
      setClientSearchQuery(query);
      debouncedFetchClients(query);
    },
    [debouncedFetchClients]
  );

  // ============================================
  // Assignee Search
  // ============================================

  const fetchAssignees = useCallback(async () => {
    setAssigneesLoading(true);
    try {
      const res = await callApi(
        "GET",
        "/v1/crm-service/employee/get-employees",
        {},
        false
      );

      const list = res?.data?.data?.data || [];
      setAssignees(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.error("[CreateTicketModal] Failed to fetch assignees:", err);
      setAssignees([]);
    } finally {
      setAssigneesLoading(false);
    }
  }, [callApi]);

  const handleAssigneeSearch = useCallback((query: string) => {
    setAssigneeSearchQuery(query);
    // Filtering is done client-side in the component
  }, []);

  // ============================================
  // Modal Actions
  // ============================================

  const openModal = useCallback(() => {
    setIsOpen(true);
    setError(null);
    // Fetch initial data
    fetchClients();
    fetchAssignees();
  }, [fetchClients, fetchAssignees]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setError(null);
    setClientSearchQuery("");
    setAssigneeSearchQuery("");
  }, []);

  const handleSubmit = useCallback(
    async (data: { customerId: string; assigneeId?: string; priority: TicketPriority }) => {
      if (!options.providerId || !options.externalConversationId) {
        setError("Missing provider or conversation information");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const payload: CreateFromConversationDto = {
          providerId: options.providerId,
          externalConversationId: options.externalConversationId,
          priority: data.priority,
          assigneeId: data.assigneeId,
          customerId: data.customerId,
        };

        console.log("[CreateTicketModal] Creating ticket with payload:", payload);

        const ticket = await ticketsService.createTicketFromConversation(payload);

        console.log("[CreateTicketModal] ✅ Ticket created successfully:", ticket.ticketNumber);

        // Call success callback with full ticket object
        options.onSuccess?.(ticket);

        // Close modal
        closeModal();
      } catch (err: any) {
        console.error("[CreateTicketModal] ❌ Failed to create ticket:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to create ticket";
        setError(errorMessage);
        options.onError?.(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [options, closeModal]
  );

  // ============================================
  // Formatted Data for Component
  // ============================================

  const formattedClients = clients.map((client) => ({
    id: client.id,
    label: `${client.name} - ${client.code}`,
  }));

  const filteredAssignees = assignees
    .filter((employee) => {
      if (!assigneeSearchQuery) return true;
      const searchLower = assigneeSearchQuery.toLowerCase();
      const fullName = `${employee.firstname} ${employee.lastname}`.toLowerCase();
      const email = employee.email?.toLowerCase() || "";
      return fullName.includes(searchLower) || email.includes(searchLower);
    })
    .map((employee) => ({
      id: employee.id,
      label: `${employee.firstname} ${employee.lastname}${employee.email ? ` - ${employee.email}` : ""}`,
    }));

  return {
    // Modal state
    isOpen,
    openModal,
    closeModal,

    // Submission state
    isSubmitting,
    error,
    handleSubmit,

    // Client search
    clients: formattedClients,
    clientsLoading,
    handleClientSearch,

    // Assignee search
    assignees: filteredAssignees,
    assigneesLoading,
    handleAssigneeSearch,
  };
}
