import { useState, useCallback, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useGomakeAxios } from "@/hooks";
import { ticketsService } from "@/services/frontdesk";
import {
  TicketPriority,
  TicketStatus,
  CreateFromConversationDto,
  UpdateTicketDto,
  TicketWithDetails,
  Tag,
} from "../types/api.types";
import { TicketFormData } from "../components/ticket-form-modal";

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

interface UseTicketFormModalOptions {
  mode: "create" | "edit";
  // Create mode options
  providerId?: string;
  externalConversationId?: string;
  // Edit mode options
  ticketId?: string;
  ticket?: TicketWithDetails;
  // Callbacks
  onSuccess?: (ticket: TicketWithDetails) => void;
  onError?: (error: Error) => void;
}

export function useTicketFormModal(options: UseTicketFormModalOptions) {
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

  // Tags state
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);

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
        console.error("[TicketFormModal] Failed to fetch clients:", err);
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
      console.error("[TicketFormModal] Failed to fetch assignees:", err);
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
  // Tags Management
  // ============================================

  const fetchPopularTags = useCallback(async () => {
    setTagsLoading(true);
    try {
      const response = await ticketsService.getPopularTags({ limit: 10 });
      setPopularTags(response || []);
    } catch (err: any) {
      console.error("[TicketFormModal] Failed to fetch popular tags:", err);
      setPopularTags([]);
    } finally {
      setTagsLoading(false);
    }
  }, []);

  const handleSuggestTags = useCallback(async (query: string): Promise<Tag[]> => {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const suggestions = await ticketsService.suggestTags(query, 10);
      setTagSuggestions(suggestions || []);
      return suggestions;
    } catch (err: any) {
      console.error("[TicketFormModal] Failed to suggest tags:", err);
      return [];
    }
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
    fetchPopularTags();
  }, [fetchClients, fetchAssignees, fetchPopularTags]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setError(null);
    setClientSearchQuery("");
    setAssigneeSearchQuery("");
  }, []);

  const handleSubmit = useCallback(
    async (data: TicketFormData) => {
      setIsSubmitting(true);
      setError(null);

      try {
        let ticket: TicketWithDetails;

        if (options.mode === "create") {
          // Create mode - validate required fields
          if (!options.providerId || !options.externalConversationId) {
            setError("Missing provider or conversation information");
            return;
          }

          if (!data.customerId) {
            setError("Customer is required");
            return;
          }

          const payload: CreateFromConversationDto = {
            providerId: options.providerId,
            externalConversationId: options.externalConversationId,
            priority: data.priority,
            assigneeId: data.assigneeId,
            customerId: data.customerId,
          };

          console.log("[TicketFormModal] Creating ticket with payload:", payload);
          ticket = await ticketsService.createTicketFromConversation(payload);
          console.log("[TicketFormModal] ✅ Ticket created successfully:", ticket.ticketNumber);

          // Add tags after creation (API limitation: tags cannot be added on creation)
          if (data.tags && data.tags.length > 0) {
            try {
              await ticketsService.addTagsToTicket(ticket.id, data.tags);
              console.log("[TicketFormModal] ✅ Tags added successfully");

              // Refresh ticket to get updated tags
              const updatedTicket = await ticketsService.getTicketById(ticket.id);
              ticket = updatedTicket;
            } catch (tagError: any) {
              console.error("[TicketFormModal] Failed to add tags:", tagError);
              // Don't fail the entire operation if tags fail
            }
          }
        } else {
          // Edit mode
          if (!options.ticketId) {
            setError("Ticket ID is required for edit mode");
            return;
          }

          // Only send fields that have actually changed to avoid permission errors
          const updatePayload: UpdateTicketDto = {};

          if (data.status !== options.ticket?.status) {
            updatePayload.status = data.status;
          }
          if (data.priority !== options.ticket?.priority) {
            updatePayload.priority = data.priority;
          }
          if (data.assigneeId !== options.ticket?.assigneeId) {
            updatePayload.assigneeId = data.assigneeId;
          }
          if (data.customerId !== options.ticket?.customerId) {
            updatePayload.customerId = data.customerId;
          }
          if (data.customerName !== options.ticket?.customerName) {
            updatePayload.customerName = data.customerName;
          }
          if (data.customerEmail !== options.ticket?.customerEmail) {
            updatePayload.customerEmail = data.customerEmail;
          }
          if (data.customerPhone !== options.ticket?.customerPhone) {
            updatePayload.customerPhone = data.customerPhone;
          }

          // If no fields changed, skip the update
          if (Object.keys(updatePayload).length === 0) {
            console.log("[TicketFormModal] No fields changed, skipping update");
            ticket = options.ticket;
          } else {
            console.log("[TicketFormModal] Updating ticket with payload:", updatePayload);
            const response = await ticketsService.updateTicket(options.ticketId, updatePayload);
            ticket = response.ticket;
            console.log("[TicketFormModal] ✅ Ticket updated successfully:", ticket.ticketNumber);
          }

          // Handle tags separately (add/remove)
          if (data.tags && options.ticket) {
            const existingTags = options.ticket.tags?.map((t) => t.name) || [];
            const newTags = data.tags.filter((tag) => !existingTags.includes(tag));
            const removedTags = existingTags.filter((tag) => !data.tags!.includes(tag));

            // Add new tags
            if (newTags.length > 0) {
              try {
                await ticketsService.addTagsToTicket(ticket.id, newTags);
                console.log("[TicketFormModal] ✅ New tags added:", newTags);
              } catch (err: any) {
                console.error("[TicketFormModal] Failed to add new tags:", err);
              }
            }

            // Remove tags
            for (const tagName of removedTags) {
              const tagToRemove = options.ticket.tags?.find((t) => t.name === tagName);
              if (tagToRemove) {
                try {
                  await ticketsService.removeTagFromTicket(ticket.id, tagToRemove.id);
                  console.log("[TicketFormModal] ✅ Tag removed:", tagName);
                } catch (err: any) {
                  console.error("[TicketFormModal] Failed to remove tag:", err);
                }
              }
            }

            // Refresh ticket to get updated tags
            try {
              const updatedTicket = await ticketsService.getTicketById(ticket.id);
              ticket = updatedTicket;
            } catch (err: any) {
              console.error("[TicketFormModal] Failed to refresh ticket:", err);
            }
          }
        }

        // Call success callback with full ticket object
        options.onSuccess?.(ticket);

        // Close modal
        closeModal();
      } catch (err: any) {
        console.error("[TicketFormModal] ❌ Failed to submit:", err);

        // Extract error message from various possible formats
        let errorMessage = "Failed to submit ticket";

        if (err.response?.data?.error?.message) {
          // Backend format: { success: false, error: { message: "...", code: "..." } }
          errorMessage = err.response.data.error.message;
        } else if (err.response?.data?.message) {
          // Simple format: { message: "..." }
          errorMessage = err.response.data.message;
        } else if (err.message) {
          // Fallback to error message
          errorMessage = err.message;
        }

        // Add friendly context for permission errors
        if (err.response?.status === 403) {
          errorMessage = `${errorMessage}\n\nYou don't have permission to perform this action. Please contact your manager or admin.`;
        }

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
      label: `${employee.firstname} ${employee.lastname}${
        employee.email ? ` - ${employee.email}` : ""
      }`,
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

    // Tags
    popularTags,
    tagSuggestions,
    tagsLoading,
    handleSuggestTags,
  };
}
