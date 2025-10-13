import React from "react";
import { Box, Paper, List, Alert } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailConversation, EmailLabel } from "../types/email.types";
import { useConversationListHover } from "../hooks/use-conversation-list-hover";
import { ConversationListHeader } from "./conversation/conversation-list-header";
import { ConversationListItem } from "./conversation/conversation-list-item";
import { ConversationListEmpty } from "./conversation/conversation-list-empty";
import { ConversationListLoading } from "./conversation/conversation-list-loading";
import { ConversationListLoadMore } from "./conversation/conversation-list-load-more";
import { EmailHoverProfile } from "./email-hover-profile";

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
        ) : loading ? (
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

            {hasMore && onLoadMore && <ConversationListLoadMore onLoadMore={onLoadMore} />}
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
