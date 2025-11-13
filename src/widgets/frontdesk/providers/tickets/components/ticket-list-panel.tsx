import React, { useState, useCallback } from "react";
import { Box, Typography, IconButton, Menu, MenuItem, Divider, Chip, Badge, CircularProgress } from "@mui/material";
import {
  Panel,
  PanelHeader,
  PanelContent,
  SearchInput,
  EmptyState,
  colorTokens,
  TagFilterChips,
} from "@/widgets/frontdesk/design-system";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { TicketWithDetails, TicketFilters, Tag } from "../types/api.types";
import { TicketListItem } from "./ticket-list-item";
import { TicketFiltersMenu } from "./ticket-filters-menu";
import { TicketSortMenu } from "./ticket-sort-menu";
import { useTicketsProvider } from "../hooks/use-tickets-provider";
import { useInfiniteScroll } from "@/widgets/frontdesk/hooks/use-infinite-scroll";
import { InfiniteScrollLoader } from "@/widgets/frontdesk/components/shared";

interface TicketListPanelProps {
  viewTitle: string;
  tickets: TicketWithDetails[];
  selectedTicketId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTicketSelect: (ticketId: string) => void;
  onViewChange?: (view: string) => void;
  isLoading?: boolean;
  error?: string | null;
  filters: TicketFilters;
  activeFilterCount: number;
  onApplyFilters: (filters: TicketFilters) => void;
  onClearFilters: () => void;
  onTagClick?: (tag: Tag) => void;
  popularTags?: Tag[];
  onFetchPopularTags?: () => void;
}

export const TicketListPanel: React.FC<TicketListPanelProps> = ({
  viewTitle,
  tickets,
  selectedTicketId,
  searchQuery,
  onSearchChange,
  onTicketSelect,
  onViewChange,
  isLoading = false,
  error = null,
  filters,
  activeFilterCount,
  onApplyFilters,
  onClearFilters,
  onTagClick,
  popularTags = [],
  onFetchPopularTags,
}) => {
  const [viewMenuAnchor, setViewMenuAnchor] = useState<null | HTMLElement>(null);

  // Get tickets provider for quick actions (called only once at panel level)
  const ticketsProvider = useTicketsProvider();

  // Infinite scroll setup
  const sentinelRef = useInfiniteScroll({
    onLoadMore: ticketsProvider.loadMore,
    hasMore: ticketsProvider.hasMore,
    loading: isLoading,
    threshold: 200,
    enabled: ticketsProvider.hasMore && !isLoading,
  });

  // Quick Action Handlers
  const handleQuickReply = useCallback(
    (ticketId: string) => {
      console.log("[TicketListPanel] Quick reply for ticket:", ticketId);
      // Select the ticket to open it in detail view
      onTicketSelect(ticketId);
    },
    [onTicketSelect]
  );

  const handleQuickToggleStatus = useCallback(
    async (ticketId: string, currentStatus: string) => {
      const isClosed = currentStatus === "CLOSED";
      const newStatus = isClosed ? "OPEN" : "CLOSED";

      console.log("[TicketListPanel] Quick toggle status:", currentStatus, "->", newStatus);

      try {
        await ticketsProvider.updateTicket(ticketId, { status: newStatus });
        console.log("[TicketListPanel] Status updated successfully");
      } catch (error: any) {
        console.error("[TicketListPanel] Failed to update status:", error);
        alert(`Failed to update ticket status: ${error.message}`);
      }
    },
    [ticketsProvider]
  );

  const handleQuickAddTag = useCallback(
    async (ticketId: string) => {
      console.log("[TicketListPanel] Quick add tag for ticket:", ticketId);

      // Simple implementation: Use prompt for tag name
      const tagName = window.prompt("Enter tag name:");

      if (!tagName || !tagName.trim()) {
        console.log("[TicketListPanel] Tag input cancelled or empty");
        return;
      }

      try {
        await ticketsProvider.addTagsToTicket(ticketId, [tagName.trim()]);
        console.log("[TicketListPanel] Tag added successfully:", tagName);
      } catch (error: any) {
        console.error("[TicketListPanel] Failed to add tag:", error);
        alert(`Failed to add tag: ${error.message}`);
      }
    },
    [ticketsProvider]
  );

  const handleQuickAssign = useCallback(
    async (ticketId: string) => {
      console.log("[TicketListPanel] Quick assign for ticket:", ticketId);

      // Simple implementation: Use prompt for agent ID
      // TODO: Replace with proper agent selector dialog
      const agentId = window.prompt("Enter agent ID to assign:");

      if (!agentId || !agentId.trim()) {
        console.log("[TicketListPanel] Assign input cancelled or empty");
        return;
      }

      try {
        await ticketsProvider.assignTicket(ticketId, agentId.trim());
        console.log("[TicketListPanel] Ticket assigned successfully to:", agentId);
      } catch (error: any) {
        console.error("[TicketListPanel] Failed to assign ticket:", error);
        alert(`Failed to assign ticket: ${error.message}`);
      }
    },
    [ticketsProvider]
  );

  const handleQuickMore = useCallback((ticketId: string) => {
    console.log("[TicketListPanel] Quick more options for ticket:", ticketId);

    // Simple placeholder - show available actions
    const actions = ["Print Ticket", "Archive Ticket", "Export Conversation", "View Customer Details", "Merge Ticket"];

    alert(`More Actions:\n\n${actions.join("\n")}\n\n(Coming soon!)`);
  }, []);

  const handleViewMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setViewMenuAnchor(event.currentTarget);
  };

  const handleViewMenuClose = () => {
    setViewMenuAnchor(null);
  };

  const handleViewSelect = (view: string) => {
    onViewChange?.(view);
    handleViewMenuClose();
  };

  // Count tickets with unread messages (check if lastMessageAt is recent and no response)
  const unreadCount = tickets.filter((t) => t.conversation?.lastMessageAt && !t.firstResponseAt && t.status === "OPEN").length;

  return (
    <Box sx={{ width: 280, minWidth: 280, height: "100%" }}>
      <Panel
        elevation={0}
        border="default"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header with PanelHeader component */}
        <PanelHeader
          title={`${viewTitle}${tickets.length > 0 ? ` (${tickets.length})` : ""}`}
          actions={
            <Box display="flex" gap={0.5}>
              {/* Sort Menu */}
              <TicketSortMenu
                sortBy={filters.sortBy || "createdAt"}
                sortOrder={filters.sortOrder || "desc"}
                onSortChange={(sortBy, sortOrder) => {
                  const newFilters = { ...filters, sortBy: sortBy as TicketFilters["sortBy"], sortOrder };
                  onApplyFilters(newFilters);
                }}
              />

              {/* Filter Menu */}
              <TicketFiltersMenu
                filters={filters}
                onApply={(partialFilters) => {
                  onApplyFilters({ ...filters, ...partialFilters, page: 1 });
                }}
                onClear={onClearFilters}
                activeFilterCount={activeFilterCount}
                popularTags={popularTags}
                onFetchPopularTags={onFetchPopularTags}
              />
            </Box>
          }
        />

        {/* Search Bar */}
        <Box sx={{ px: 2, pb: 1.5, borderBottom: `1px solid ${colorTokens.semantic.border.default}` }}>
          <SearchInput
            placeholder="Search tickets"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            showClear={searchQuery.length > 0}
          />
        </Box>

        {/* Active Tag Filters */}
        {filters.tags && filters.tags.length > 0 && (
          <TagFilterChips
            tags={filters.tags.map((tagName) => ({
              id: tagName,
              name: tagName,
              displayName: tagName,
              color: null,
              category: "GENERAL" as any,
              usageCount: 0,
              isSystem: false,
              printHouseId: "",
              createdAt: "",
            }))}
            onRemoveTag={(tag) => {
              const newTags = filters.tags?.filter((t) => t !== tag.name) || [];
              onApplyFilters({ ...filters, tags: newTags.length > 0 ? newTags : undefined, page: 1 });
            }}
            onClearAll={() => {
              onApplyFilters({ ...filters, tags: undefined, page: 1 });
            }}
          />
        )}

        {/* Ticket List */}
        <PanelContent padding="none" scrollable sx={{ flex: 1 }}>
          {isLoading && tickets.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
              <CircularProgress size={32} />
            </Box>
          ) : error ? (
            <EmptyState title="Error loading tickets" description={error} />
          ) : tickets.length === 0 ? (
            <EmptyState
              title="No tickets found"
              description={searchQuery ? "Try adjusting your search" : "No tickets match your filters"}
            />
          ) : (
            <>
              {tickets.map((ticket) => (
                <TicketListItem
                  key={ticket.id}
                  ticket={ticket}
                  selected={selectedTicketId === ticket.id}
                  onSelect={onTicketSelect}
                  onTagClick={onTagClick}
                  onQuickReply={handleQuickReply}
                  onQuickToggleStatus={handleQuickToggleStatus}
                  onQuickAddTag={handleQuickAddTag}
                  onQuickAssign={handleQuickAssign}
                  onQuickMore={handleQuickMore}
                />
              ))}

              {/* Infinite scroll sentinel element - always render for observer to work */}
              <div ref={sentinelRef} style={{ height: 1, width: "100%" }} />

              {/* Loading indicator at bottom */}
              {isLoading && tickets.length > 0 && <InfiniteScrollLoader />}
            </>
          )}
        </PanelContent>

        {/* View Change Menu */}
        <Menu
          anchorEl={viewMenuAnchor}
          open={Boolean(viewMenuAnchor)}
          onClose={handleViewMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <MenuItem onClick={() => handleViewSelect("my-tickets")}>My Tickets</MenuItem>
          <MenuItem onClick={() => handleViewSelect("unassigned")}>Unassigned</MenuItem>
          <MenuItem onClick={() => handleViewSelect("all-tickets")}>All Tickets</MenuItem>
          <Divider />
          <MenuItem onClick={() => handleViewSelect("resolved")}>Resolved</MenuItem>
        </Menu>
      </Panel>
    </Box>
  );
};
