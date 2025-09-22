import React, { useState } from "react";
import {
  Stack,
  Paper,
  Typography,
  Alert,
  Button,
  Box,
  IconButton,
  Tooltip,
  Fab,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { ConversationList, MessageList, MessageInput, UserSelector, ParticipantsList } from "./components/direct-messages";
import { useDirectMessages } from "@/hooks/use-direct-messages";
import { ConversationMember } from "./types/direct-messages.types";
import { directMessagesService } from "@/services/api-service/frontdesk/providers/internal/direct-messages.service";

const DirectMessagesProviderView: React.FC = () => {
  const {
    connected,
    connectionStatus,
    isLoading,
    isLoadingHistory,
    isLoadingConversations,
    error,
    currentUser,
    conversations,
    activeConversation,
    activeConversationId,
    messages,
    userPresence,
    typingUsers,
    draft,
    isSending,
    userSuggestions,
    isLoadingSuggestions,
    selectConversation,
    createConversation,
    startDirectMessage,
    sendMessage,
    updateDraft,
    loadUserSuggestions,
    setError,
  } = useDirectMessages();

  const [showUserSelector, setShowUserSelector] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [userSelectorMode, setUserSelectorMode] = useState<'new' | 'add'>('new');

  // Debug logging
  React.useEffect(() => {
    console.log("Direct Messages Provider - State:", {
      connected,
      connectionStatus,
      isLoading,
      isLoadingHistory,
      isLoadingConversations,
      error,
      currentUser,
      activeConversationId,
      messagesCount: messages.length,
      conversationsCount: conversations.length,
      userPresenceCount: Object.keys(userPresence).length,
    });
  }, [
    connected,
    connectionStatus,
    isLoading,
    isLoadingHistory,
    isLoadingConversations,
    error,
    currentUser,
    activeConversationId,
    messages,
    conversations,
    userPresence,
  ]);

  const getSeverity = (status: typeof connectionStatus) => {
    switch (status) {
      case "connected":
        return "success";
      case "connecting":
        return "info";
      case "error":
        return "error";
      default:
        return "warning";
    }
  };

  const getStatusMessage = (status: typeof connectionStatus) => {
    switch (status) {
      case "connected":
        return `Connected to Direct Messages${currentUser ? ` as ${currentUser.name}` : ""}`;
      case "connecting":
        return "Connecting to Direct Messages service...";
      default:
        return `Disconnected from Direct Messages service${error ? `: ${error}` : ""}`;
    }
  };

  const handleRetryConnection = () => {
    setError(null);
    // The connect function will be called automatically by the hook
  };

  const handleStartNewConversation = () => {
    setShowUserSelector(true);
    setUserSelectorMode('new');
    loadUserSuggestions();
  };

  const handleUserSelect = async (user: ConversationMember) => {
    await startDirectMessage(user.userId);
    setShowUserSelector(false);
  };

  const handleUserSearch = (query: string) => {
    loadUserSuggestions(query);
  };

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleDraftChange = (content: string) => {
    if (activeConversationId) {
      updateDraft(activeConversationId, content);
    }
  };

  const getConversationTitle = () => {
    if (!activeConversation) return "Select a conversation";
    
    if (activeConversation.name) return activeConversation.name;
    
    if (activeConversation.type === 'DM') {
      const otherMember = activeConversation.members?.find(
        member => member.userId !== currentUser?.userId
      );
      return otherMember?.name || "Direct Message";
    }
    
    return "Group Chat";
  };

  const getConversationSubtitle = () => {
    if (!activeConversation) return "";
    
    if (activeConversation.type === 'DM') {
      return "Direct message";
    }
    
    return `${activeConversation.participantCount} members`;
  };

  const handleAddParticipant = () => {
    setShowUserSelector(true);
    setUserSelectorMode('add');
    loadUserSuggestions();
  };

  const handleRemoveParticipant = async (userId: string) => {
    // Placeholder: will call service when API is confirmed
    console.log('Remove participant', userId);
  };

  const handleUserConfirm = async (users: ConversationMember[]) => {
    try {
      if (!users || users.length === 0) return;
      if (userSelectorMode === 'new') {
        if (users.length === 1) {
          await startDirectMessage(users[0].userId);
        } else {
          await createConversation({ participantIds: users.map(u => u.userId) });
        }
      } else if (userSelectorMode === 'add') {
        if (!activeConversationId) return;
        await directMessagesService.addMembers(activeConversationId, {
          participantIds: users.map(u => u.userId),
        });
        await loadConversations();
      }
    } finally {
      setShowUserSelector(false);
    }
  };

  // Connection error state
  if (connectionStatus === "error") {
    return (
      <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
        <Alert
          severity="error"
          action={
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleRetryConnection}
                startIcon={<RefreshIcon />}
                disabled={isLoading}
              >
                Retry
              </Button>
            </Stack>
          }
        >
          Failed to connect to Direct Messages service: {error}
        </Alert>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            border: "1px solid #EAECF0",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <ChatIcon sx={{ fontSize: 64, color: "#D1D5DB" }} />
            <Typography variant="h6" sx={{ color: "#6B7280" }}>
              Connection Failed
            </Typography>
            <Typography variant="body2" sx={{ color: "#9CA3AF", textAlign: "center" }}>
              Unable to connect to the Direct Messages service. Please check your connection and try again.
            </Typography>
            <Button variant="contained" onClick={handleRetryConnection} startIcon={<RefreshIcon />} disabled={isLoading}>
              Retry Connection
            </Button>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  // Connecting state
  if (connectionStatus === "connecting" || isLoading) {
    return (
      <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
        <Alert severity="info">Connecting to Direct Messages service...</Alert>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            border: "1px solid #EAECF0",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <ChatIcon sx={{ fontSize: 64, color: "#D1D5DB" }} />
            <Typography variant="h6" sx={{ color: "#6B7280" }}>
              Connecting...
            </Typography>
            <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
              Establishing connection to Direct Messages service
            </Typography>
            <Typography variant="caption" sx={{ color: "#9CA3AF", mt: 2 }}>
              Debug: {connectionStatus} | User: {currentUser?.email || "Loading..."}
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
      {/* Connection status */}
      <Alert
        severity={getSeverity(connectionStatus)}
        action={
          connectionStatus !== "connected" && (
            <Button
              size="small"
              variant="outlined"
              onClick={handleRetryConnection}
              startIcon={<RefreshIcon />}
              disabled={isLoading}
            >
              Retry
            </Button>
          )
        }
      >
        {getStatusMessage(connectionStatus)}
      </Alert>

      {/* Three-pane layout */}
      <Stack direction="row" gap={2} sx={{ width: "100%", flex: 1, height: "100%" }}>
        {/* Left: Conversations sidebar */}
        <Paper
          elevation={0}
          sx={{
            width: 320,
            minWidth: 320,
            border: "1px solid #EAECF0",
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Conversations header */}
          <Box sx={{ p: 2, borderBottom: "1px solid #EAECF0" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#101828" }}>
                Conversations
              </Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Search conversations">
                  <IconButton size="small" onClick={() => setShowSearch(!showSearch)}>
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Filter conversations">
                  <IconButton size="small">
                    <FilterIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Box>

          {/* Conversations list */}
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <ConversationList
              conversations={conversations}
              selectedId={activeConversationId}
              onSelect={selectConversation}
              loading={isLoadingConversations}
            />
          </Box>
        </Paper>

        {/* Center: Message area */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            border: "1px solid #EAECF0",
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100%",
          }}
        >
          {activeConversationId ? (
            <>
              {/* Message header */}
              <Box sx={{ p: 2, borderBottom: "1px solid #EAECF0" }}>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <div>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#101828" }}>
                        {getConversationTitle()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {getConversationSubtitle()}
                      </Typography>
                    </div>
                    {/* Debug info */}
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontFamily: "monospace" }}>
                      Status: {connectionStatus}
                    </Typography>
                  </Stack>
                  
                  {/* Participants */}
                  {activeConversation?.members && activeConversation.members.length > 0 && (
                    <ParticipantsList
                      members={activeConversation.members}
                      currentUserId={currentUser?.userId}
                      userPresence={userPresence}
                      conversationType={activeConversation.type}
                      onAddMember={handleAddParticipant}
                      onRemoveMember={handleRemoveParticipant}
                      maxVisible={4}
                    />
                  )}
                </Stack>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: "hidden" }}>
                <MessageList
                  messages={messages}
                  currentUserId={currentUser?.userId}
                  typingUsers={typingUsers}
                  userPresence={userPresence}
                  isLoadingHistory={isLoadingHistory}
                />
              </Box>

              {/* Message input */}
              <MessageInput
                value={draft}
                onChange={handleDraftChange}
                onSend={handleSendMessage}
                placeholder={`Message ${getConversationTitle()}`}
                disabled={false}
                isSending={isSending}
              />
            </>
          ) : (
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Stack alignItems="center" spacing={2}>
                <ChatIcon sx={{ fontSize: 64, color: "#D1D5DB" }} />
                <Typography variant="h6" sx={{ color: "#6B7280" }}>
                  Select a conversation
                </Typography>
                <Typography variant="body2" sx={{ color: "#9CA3AF", textAlign: "center" }}>
                  Choose a conversation from the sidebar to start messaging, or start a new conversation
                </Typography>
                <Typography variant="caption" sx={{ color: "#9CA3AF", textAlign: "center" }}>
                  Current user: {currentUser?.email || "Loading..."}
                </Typography>
              </Stack>
            </Box>
          )}
        </Paper>
      </Stack>

      {/* Floating Action Button for new conversation */}
      <Fab
        color="primary"
        aria-label="start new conversation"
        onClick={handleStartNewConversation}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }}
      >
        <AddIcon />
      </Fab>

      {/* User Selector Dialog */}
      <UserSelector
        users={userSuggestions}
        onSelect={handleUserSelect}
        onConfirm={handleUserConfirm}
        onSearch={handleUserSearch}
        loading={isLoadingSuggestions}
        onClose={() => setShowUserSelector(false)}
        open={showUserSelector}
      />
    </Stack>
  );
};

export { DirectMessagesProviderView };