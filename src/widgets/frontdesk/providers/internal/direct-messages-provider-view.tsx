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
  Snackbar,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { ConversationList, MessageList, MessageInput, UserSelector, ParticipantsList } from "./components/direct-messages";
import { UserPresence } from "./components";
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
    onlineUsers,
    userPresence,
    typingUsers,
    draft,
    isSending,
    userSuggestions,
    isLoadingSuggestions,
    suggestionsOnlineOnly,
    setUserSuggestionsOnlineOnly,
    selectConversation,
    createConversation,
    startDirectMessage,
    sendMessage,
    updateDraft,
    loadUserSuggestions,
    loadConversations,
    loadMoreMessages,
    messageCursors,
    setActiveConversationId,
    setError,
    connect,
    disconnect,
  } = useDirectMessages();

  const [showUserSelector, setShowUserSelector] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [userSelectorMode, setUserSelectorMode] = useState<'new' | 'add'>('new');
  const [userErrorMessage, setUserErrorMessage] = useState<string | null>(null);


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
      onlineUsersCount: onlineUsers.length,
      onlineUsers,
      userPresenceCount: Object.keys(userPresence).length,
      userPresence,
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
    onlineUsers,
    userPresence,
  ]);

  // Auto-clear error message after 6 seconds
  React.useEffect(() => {
    if (userErrorMessage) {
      const timer = setTimeout(() => {
        setUserErrorMessage(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [userErrorMessage]);

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
    disconnect();
    connect();
  };

  const handleStartNewConversation = () => {
    setShowUserSelector(true);
    setUserSelectorMode('new');
    loadUserSuggestions('');
  };

  const handleCloseConversation = () => {
    console.log('Closing conversation, current activeConversationId:', activeConversationId);
    setActiveConversationId(null);
    console.log('Conversation closed');
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
    loadUserSuggestions('');
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
        if (!activeConversationId) {
          console.error('[DM] No active conversation to add members to');
          return;
        }
        
        try {
          console.log('[DM] Adding members to conversation:', {
            conversationId: activeConversationId,
            participantIds: users.map(u => u.userId),
            users: users
          });
          
          // Try to add members using the API
          await directMessagesService.addMembers(activeConversationId, {
            participantIds: users.map(u => u.userId),
          });
          
          console.log('[DM] Members added successfully');
          await loadConversations();
        } catch (error: any) {
          console.error('[DM] Failed to add members:', error);
          
          // Check if it's a 500 error - the endpoint might not be implemented yet
          if (error.message?.includes('500') || error.message?.includes('Internal server error')) {
            console.warn('[DM] Add members endpoint not available. This feature may not be implemented on the server yet.');
            setUserErrorMessage('Adding members to conversations is not available yet. Please create a new group conversation instead.');
          } else {
            setUserErrorMessage(error.message || 'Failed to add members to conversation');
          }
        }
      }
    } catch (error: any) {
      console.error('[DM] Error in handleUserConfirm:', error);
      setUserErrorMessage(error.message || 'An error occurred');
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
    <Stack sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 0,
      overflow: "hidden",
      boxSizing: "border-box"
    }}>
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
      <Stack direction="row" gap={2} sx={{
        width: "100%",
        flex: 1,
        height: "100%",
        mt: 2
      }}>
        {/* Left: Conversations sidebar */}
        <div style={{ width: 280, minWidth: 280, height: "100%" }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
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
                  <Tooltip title="Start new conversation">
                    <IconButton size="small" onClick={handleStartNewConversation}>
                      <AddIcon fontSize="small" />
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
                currentUserId={currentUser?.userId}
                onSelect={selectConversation}
                loading={isLoadingConversations}
              />
            </Box>
          </Paper>
        </div>

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
                    </div>
                    {/* Close button */}
                    <Tooltip title="Close conversation">
                      <IconButton 
                        size="medium" 
                        onClick={(e) => {
                          console.log('Close button clicked!', e);
                          console.log('Current activeConversationId before close:', activeConversationId);
                          alert('Close button clicked!');
                          handleCloseConversation();
                        }}
                        sx={{ 
                          color: "#374151",
                          backgroundColor: "#F3F4F6",
                          border: "1px solid #D1D5DB",
                          '&:hover': {
                            color: "#111827",
                            backgroundColor: "#E5E7EB",
                            border: "1px solid #9CA3AF",
                          }
                        }}
                      >
                        <CloseIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
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
              <Box sx={{ 
                flex: 1, 
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 0
              }}>
                <MessageList
                  messages={messages}
                  currentUserId={currentUser?.userId}
                  typingUsers={typingUsers}
                  userPresence={userPresence}
                  isLoadingHistory={isLoadingHistory}
                  onLoadMore={() => {
                    if (activeConversationId && messageCursors[activeConversationId]?.hasMoreOlder) {
                      loadMoreMessages(activeConversationId);
                    }
                  }}
                  lastReadMessageId={activeConversation?.members?.find(member => member.userId === currentUser?.userId)?.lastReadMessageId}
                  onScrollToUnread={() => {
                    // Mark messages as read when user scrolls to unread section
                    if (activeConversationId && currentUser?.userId) {
                      // This would typically call an API to mark messages as read
                      console.log('Scrolled to unread messages, marking as read');
                    }
                  }}
                />
              </Box>

              {/* Message input - fixed at bottom */}
              <Box sx={{ borderTop: "1px solid #EAECF0" }}>
                <MessageInput
                  value={draft}
                  onChange={handleDraftChange}
                  onSend={handleSendMessage}
                  placeholder={`Message ${getConversationTitle()}`}
                  disabled={false}
                  isSending={isSending}
                />
              </Box>
            </>
          ) : (
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Stack alignItems="center" spacing={3}>
                <ChatIcon sx={{ fontSize: 64, color: "#D1D5DB" }} />
                <Typography variant="h6" sx={{ color: "#6B7280" }}>
                  Select a conversation
                </Typography>
                <Typography variant="body2" sx={{ color: "#9CA3AF", textAlign: "center" }}>
                  Choose a conversation from the sidebar to start messaging
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleStartNewConversation}
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }}
                >
                  Start New Conversation
                </Button>
                <Typography variant="caption" sx={{ color: "#9CA3AF", textAlign: "center" }}>
                  Current user: {currentUser?.email || "Loading..."}
                </Typography>
              </Stack>
            </Box>
          )}
        </Paper>

        {/* Right: User presence */}
        <div style={{ width: 240, minWidth: 240, height: "100%" }}>
          <UserPresence
            onlineUsers={onlineUsers}
            userPresence={userPresence}
            currentUserId={currentUser?.userId}
            onUserClick={(userId: string) => {
              startDirectMessage(userId);
            }}
          />
        </div>
      </Stack>

      {/* User Selector Dialog */}
      <UserSelector
        users={userSuggestions}
        onSelect={handleUserSelect}
        onConfirm={handleUserConfirm}
        onSearch={handleUserSearch}
        onlineOnly={suggestionsOnlineOnly}
        onToggleOnlineOnly={setUserSuggestionsOnlineOnly}
        loading={isLoadingSuggestions}
        onClose={() => setShowUserSelector(false)}
        open={showUserSelector}
      />

      {/* Error Snackbar */}
      <Snackbar
        open={!!userErrorMessage}
        autoHideDuration={6000}
        onClose={() => setUserErrorMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setUserErrorMessage(null)}
          severity="warning"
          sx={{ width: '100%' }}
        >
          {userErrorMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export { DirectMessagesProviderView };
