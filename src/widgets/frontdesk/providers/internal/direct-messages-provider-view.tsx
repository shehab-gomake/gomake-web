import React, { useState } from "react";
import {
  Stack,
  Typography,
  Alert,
  Button,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Avatar,
  Fade,
  Divider,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Group as GroupIcon,
  Star,
  StarBorder,
  ArchiveOutlined,
  Unarchive,
} from "@mui/icons-material";
import {
  Panel,
  PanelHeader,
  PanelContent,
  EmptyState,
} from "@/widgets/frontdesk/design-system";
import { ConversationList, MessageList, MessageInput, UserSelector, ParticipantsList, GlobalSearch, InConversationSearch } from "./components/direct-messages";
import { UserPresence } from "./components";
import { useDirectMessages } from "./hooks";
import { ConversationMember } from "./types/direct-messages.types";

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
    favoriteConversation,
    archiveConversation,
    addMembersToConversation,
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
    // Search functionality
    conversationSearchResults,
    conversationSearchQuery,
    currentSearchIndex,
    highlightedMessageId,
    searchLoading,
    globalSearchOpen,
    conversationSearchOpen,
    performGlobalSearch,
    performConversationSearch,
    jumpToMessage,
    navigateToSearchResult,
    clearSearch,
    openGlobalSearch,
    openConversationSearch,
    setConversationSearchQuery,
    conversationsFilter,
    setConversationFilter,
  } = useDirectMessages();

  const [showUserSelector, setShowUserSelector] = useState(false);
  const [userSelectorMode, setUserSelectorMode] = useState<'new' | 'add'>('new');
  const [userErrorMessage, setUserErrorMessage] = useState<string | null>(null);
  const [showConnectionStatus, setShowConnectionStatus] = useState(true);
  const [isTeamColumnVisible, setIsTeamColumnVisible] = useState(true);


  // Auto-clear error message after 6 seconds
  React.useEffect(() => {
    if (userErrorMessage) {
      const timer = setTimeout(() => {
        setUserErrorMessage(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [userErrorMessage]);

  // Auto-hide connection status after 3 seconds on success
  React.useEffect(() => {
    setShowConnectionStatus(true); // Show on any status change
    if (connectionStatus === "connected") {
      const timer = setTimeout(() => {
        setShowConnectionStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [connectionStatus]);

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

  const getStatusColor = (status: typeof connectionStatus) => {
    switch (status) {
      case "connected":
        return "success.main";
      case "connecting":
        return "info.main";
      case "disconnected":
        return "warning.main";
      case "error":
        return "error.main";
      default:
        return "grey.main";
    }
  };

  const getStatusMessage = (status: typeof connectionStatus): React.ReactNode => {
    switch (status) {
      case "connected":
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2">
              Connected {currentUser ? ` as ${currentUser.name}` : ""}
            </Typography>
          </Stack>
        );
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
    setActiveConversationId(null);
  };

  const handleStarConversation = () => {
    if (activeConversationId) {
      favoriteConversation(activeConversationId);
    }
  };

  const handleArchiveConversation = () => {
    if (activeConversationId) {
      // The function in the hook will handle toggling based on current state
      archiveConversation(activeConversationId);
    }
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
          // Try to add members using the API
          await addMembersToConversation(activeConversationId, users.map(u => u.userId));
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

        <Panel
          elevation={0}
          border="default"
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
          }}
        >
          <PanelContent padding="lg">
            <EmptyState
              icon={<ChatIcon sx={{ fontSize: 64 }} />}
              title="Connection Failed"
              description="Unable to connect to the Direct Messages service. Please check your connection and try again."
              action={{
                label: "Retry Connection",
                onClick: handleRetryConnection,
              }}
            />
          </PanelContent>
        </Panel>
      </Stack>
    );
  }

  // Connecting state
  if (connectionStatus === "connecting" || isLoading) {
    return (
      <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
        <Alert severity="info">Connecting to Direct Messages service...</Alert>

        <Panel
          elevation={0}
          border="default"
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
          }}
        >
          <PanelContent padding="lg">
            <EmptyState
              icon={<ChatIcon sx={{ fontSize: 64 }} />}
              title="Connecting..."
              description="Establishing connection to Direct Messages service"
            />
          </PanelContent>
        </Panel>
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
      <Fade in={showConnectionStatus}>
        <Alert
          severity={getSeverity(connectionStatus)}
          icon={false}
          sx={{
            borderRadius: 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            width: 'fit-content',
            minWidth: 280,
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1200,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
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
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: getStatusColor(connectionStatus),
              mr: 1
            }} />
            {getStatusMessage(connectionStatus)}
          </Stack>
        </Alert>
      </Fade>

      {/* Three-pane layout */}
      <Stack direction="row" gap={2} sx={{
        width: "100%",
        flex: 1,
        height: "100%",
        mt: 2
      }}>
        {/* Left: Conversations sidebar */}
        <div style={{ width: 280, minWidth: 280, height: "100%" }}>
          <Panel
            elevation={0}
            border="default"
            sx={{
              height: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Conversations header */}
            <PanelHeader
              title="Conversations"
              actions={
                <>
                  <Tooltip title="Search conversations">
                    <IconButton size="small" onClick={openGlobalSearch}>
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Start new conversation">
                    <IconButton size="small" onClick={handleStartNewConversation}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={conversationsFilter === 'archived' ? "Show active conversations" : "Show archived conversations"}>
                    <IconButton
                      size="small"
                      onClick={() => setConversationFilter(conversationsFilter === 'active' ? 'archived' : 'active')}
                      sx={{
                        color: conversationsFilter === 'archived' ? 'primary.main' : 'inherit',
                      }}
                    >
                      <ArchiveOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              }
            />

            {/* Conversations list */}
            <PanelContent padding="none" scrollable sx={{ flex: 1 }}>
              <ConversationList
                conversations={conversations}
                selectedId={activeConversationId}
                currentUserId={currentUser?.userId}
                onSelect={selectConversation}
                loading={isLoadingConversations}
              />
            </PanelContent>
          </Panel>
        </div>

        {/* Center: Message area */}
        <Panel
          elevation={0}
          border="default"
          sx={{
            flex: 1,
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
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {activeConversation?.type === 'GROUP_DM' && (
                        <Tooltip title="Group Chat">
                          <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main' }}>
                            <GroupIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                        </Tooltip>
                      )}
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#101828" }}>
                        {getConversationTitle()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Search in conversation">
                        <IconButton
                          size="small"
                          onClick={openConversationSearch}
                          sx={{
                            color: conversationSearchOpen ? 'primary.main' : 'grey.500',
                            '&:hover': {
                              color: 'primary.main',
                            }
                          }}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={
                        activeConversation?.members?.find(m => m.userId === currentUser?.userId)?.isFavorite
                          ? "Unfavorite conversation"
                          : "Favorite conversation"
                      }>
                        <IconButton
                          size="small"
                          onClick={handleStarConversation}
                          sx={{
                            color: activeConversation?.members?.find(m => m.userId === currentUser?.userId)?.isFavorite
                              ? 'warning.main'
                              : 'grey.500',
                            '&:hover': {
                              color: 'warning.main',
                            }
                          }}
                        >
                          {activeConversation?.members?.find(m => m.userId === currentUser?.userId)?.isFavorite ? (
                            <Star fontSize="small" />
                          ) : (
                            <StarBorder fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={
                        activeConversation?.members?.find(m => m.userId === currentUser?.userId)?.isArchived
                          ? "Unarchive conversation"
                          : "Archive conversation"
                      }>
                        <IconButton
                          size="small"
                          onClick={handleArchiveConversation}
                          sx={{
                            color: activeConversation?.members?.find(m => m.userId === currentUser?.userId)?.isArchived
                              ? 'primary.main'
                              : 'grey.500',
                            '&:hover': {
                              color: 'primary.main',
                            }
                          }}
                        >
                          {activeConversation?.members?.find(m => m.userId === currentUser?.userId)?.isArchived ? (
                            <Unarchive fontSize="small" />
                          ) : (
                            <ArchiveOutlined fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Close conversation">
                        <IconButton
                          size="small"
                          onClick={handleCloseConversation}
                          sx={{
                            color: 'grey.500',
                            '&:hover': {
                              color: 'error.main',
                            }
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
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

              {/* In-conversation Search */}
              <InConversationSearch
                open={conversationSearchOpen}
                query={conversationSearchQuery}
                results={conversationSearchResults}
                currentIndex={currentSearchIndex}
                onQueryChange={setConversationSearchQuery}
                onClose={() => clearSearch('conversation')}
                onSearch={performConversationSearch}
                onNavigateToResult={navigateToSearchResult}
                conversationName={getConversationTitle()}
                loading={searchLoading}
              />

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
                  highlightedMessageId={highlightedMessageId}
                  searchQuery={conversationSearchQuery.trim() || undefined}
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
            <PanelContent padding="lg">
              <EmptyState
                icon={<ChatIcon sx={{ fontSize: 64 }} />}
                title="Select a conversation"
                description="Choose a conversation from the sidebar to start messaging"
                action={{
                  label: "Start New Conversation",
                  onClick: handleStartNewConversation,
                }}
              />
            </PanelContent>
          )}
        </Panel>

        {/* Right: User presence */}
        {isTeamColumnVisible ? (
          <div style={{ width: 240, minWidth: 240, height: "100%" }}>
            <UserPresence
              onlineUsers={onlineUsers}
              userPresence={userPresence}
              currentUserId={currentUser?.userId}
              onUserClick={(userId: string) => {
                startDirectMessage(userId);
              }}
              onToggleVisibility={() => setIsTeamColumnVisible(false)}
            />
          </div>
        ) : (
          <Tooltip title="Show Team">
            <IconButton
              onClick={() => setIsTeamColumnVisible(true)}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,
                transform: 'translateY(-50%)',
                zIndex: 1,
                color: 'primary.main',
                backgroundColor: 'white',
                border: '1px solid #EAECF0',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              <GroupIcon />
            </IconButton>
          </Tooltip>
        )}
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

      {/* Global Search Modal */}
      <GlobalSearch
        open={globalSearchOpen}
        onClose={() => clearSearch('global')}
        onSearch={performGlobalSearch}
        onResultSelect={(result) => {
          if (!result.conversationId) {
            console.warn('[DM] Global search result missing conversationId', result);
            return;
          }
          jumpToMessage(result.conversationId, result.id);
        }}
        loading={searchLoading}
      />
    </Stack>
  );
};

export { DirectMessagesProviderView };
