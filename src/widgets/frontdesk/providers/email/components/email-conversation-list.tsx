import React from "react";
import { Box, Paper, List, Alert } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailConversation, EmailLabel } from "../types/email.types";
import { useConversationListHover } from "../hooks/use-conversation-list-hover";
import { ConversationListHeader } from "./conversation/conversation-list-header";
import { ConversationListItem } from "./conversation/conversation-list-item";
import { ConversationListEmpty } from "./conversation/conversation-list-empty";
import { ConversationListLoading } from "./conversation/conversation-list-loading";
import { EmailHoverProfile } from "./email-hover-profile";
import { useInfiniteScroll } from "@/widgets/frontdesk/hooks/use-infinite-scroll";
import { InfiniteScrollLoader } from "@/widgets/frontdesk/components/shared";

interface EmailConversationListProps {
  conversations: EmailConversation[];
  selectedConversationId?: string;
  onConversationSelect: (conversation: EmailConversation) => void;
  loading?: boolean;
  error?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  selectedLabel?: EmailLabel | null;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  searchDisabled?: boolean;
}

export const EmailConversationList: React.FC<EmailConversationListProps> = ({
  conversations,
  selectedConversationId,
  onConversationSelect,
  loading = false,
  error,
  hasMore = false,
  onLoadMore,
  onRefresh,
  selectedLabel,
  onSearch,
  searchQuery,
  searchDisabled = false,
}) => {
  const { neutralColor } = useGomakeTheme();

  const {
    hoveredEmail,
    hoveredElement,
    showProfile,
    handleMouseEnter,
    handleMouseLeave,
    handleProfileMouseEnter,
    handleProfileMouseLeave,
  } = useConversationListHover({
    onShowProfile: () => {},
    onHideProfile: () => {},
  });

  // Infinite scroll setup
  const sentinelRef = useInfiniteScroll({
    onLoadMore: onLoadMore || (() => {}),
    hasMore: hasMore,
    loading: loading,
    threshold: 200,
    enabled: !!onLoadMore && hasMore,
  });

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        border: `1px solid ${neutralColor(200)}`,
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ConversationListHeader
        selectedLabel={selectedLabel}
        onSearch={onSearch}
        searchQuery={searchQuery}
        searchDisabled={searchDisabled}
      />

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto", px: 1 }}>
        {error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : loading && conversations.length === 0 ? (
          <ConversationListLoading />
        ) : conversations.length === 0 ? (
          <ConversationListEmpty selectedLabel={selectedLabel} />
        ) : (
          <List sx={{ py: 1 }}>
            {conversations.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedConversationId}
                onSelect={onConversationSelect}
                onParticipantHover={handleMouseEnter}
                onParticipantLeave={handleMouseLeave}
              />
            ))}

            {/* Infinite scroll sentinel element - always render for observer to work */}
            <div ref={sentinelRef} style={{ height: 1, width: "100%" }} />

            {/* Loading indicator at bottom */}
            {loading && conversations.length > 0 && <InfiniteScrollLoader />}
          </List>
        )}
      </Box>

      {/* Hover Profile */}
      <EmailHoverProfile
        email={hoveredEmail || ""}
        visible={showProfile && !!hoveredEmail}
        anchorEl={hoveredElement}
        onMouseEnter={handleProfileMouseEnter}
        onMouseLeave={handleProfileMouseLeave}
      />
    </Paper>
  );
};
