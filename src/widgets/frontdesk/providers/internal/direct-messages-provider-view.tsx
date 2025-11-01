import React, { useState, useRef, useEffect } from "react";
import {
  Stack,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import {
  Panel,
  PanelContent,
  EmptyState,
  ConnectionStatusBanner,
  MessageViewHeader,
  ConversationSidebar,
  ConnectionErrorState,
  ConnectingState,
} from "@/widgets/frontdesk/design-system";
import { LoadingOverlay } from "@/widgets/frontdesk/components/shared";
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
    isFetchingConversation,
    fetchError,
    clearFetchError,
  } = useDirectMessages();

  const [showUserSelector, setShowUserSelector] = useState(false);
  const [userSelectorMode, setUserSelectorMode] = useState<'new' | 'add'>('new');
  const [userErrorMessage, setUserErrorMessage] = useState<string | null>(null);
  const [showConnectionStatus, setShowConnectionStatus] = useState(true);
  const [isTeamColumnVisible, setIsTeamColumnVisible] = useState(true);

  // Track if we've auto-selected a conversation from URL parameter
  const hasAutoSelectedRef = useRef(false);

  // Auto-select conversation from URL parameter (from notifications)
  useEffect(() => {
    // If activeConversationId is set, conversations are loaded, and we haven't auto-selected yet
    if (activeConversationId && conversations.length > 0 && !hasAutoSelectedRef.current) {
      const conversation = conversations.find(c => c.id === activeConversationId);
      if (conversation) {
        console.log('[DirectMessagesProviderView] Auto-selecting conversation from URL:', activeConversationId);
        selectConversation(conversation);
        hasAutoSelectedRef.current = true;
      }
    }
  }, [activeConversationId, conversations, selectConversation]);

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
          await addMembersToConversation(activeConversationId, users.map(u => u.userId));
        } catch (error: any) {
          console.error('[DM] Failed to add members:', error);

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
      <ConnectionErrorState
        error={error || 'Unknown error'}
        onRetry={handleRetryConnection}
        isLoading={isLoading}
        icon={<ChatIcon sx={{ fontSize: 64 }} />}
        title="Connection Failed"
        description="Unable to connect to the Direct Messages service. Please check your connection and try again."
      />
    );
  }

  // Connecting state
  if (connectionStatus === "connecting" || isLoading) {
    return (
      <ConnectingState
        icon={<ChatIcon sx={{ fontSize: 64 }} />}
        title="Connecting..."
        description="Establishing connection to Direct Messages service"
        alertMessage="Connecting to Direct Messages service..."
      />
    );
  }

  const currentMember = activeConversation?.members?.find(m => m.userId === currentUser?.userId);

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
      {/* Connection status banner */}
      <ConnectionStatusBanner
        status={connectionStatus}
        show={showConnectionStatus}
        error={error}
        userName={currentUser?.name}
        onRetry={handleRetryConnection}
        isLoading={isLoading}
      />

      {/* Error banner for conversation fetch failures */}
      {fetchError && (
        <Alert
          severity="error"
          onClose={clearFetchError}
          sx={{ mx: 2, mt: 2 }}
        >
          Failed to load conversation: {fetchError}
        </Alert>
      )}

      {/* Three-pane layout */}
      <Stack direction="row" gap={2} sx={{
        width: "100%",
        flex: 1,
        height: "100%",
        mt: 2
      }}>
        {/* Left: Conversations sidebar */}
        <Box sx={{ position: "relative", width: 280 }}>
          {/* Loading overlay when fetching conversation */}
          <LoadingOverlay 
            loading={isFetchingConversation} 
            message="Loading conversation..."
            spinnerSize={32}
          />

          <ConversationSidebar
            title="Conversations"
            filter={conversationsFilter}
            onFilterChange={setConversationFilter}
            onSearch={openGlobalSearch}
            onNewConversation={handleStartNewConversation}
            width={280}
          >
            <ConversationList
              conversations={conversations}
              selectedId={activeConversationId}
              currentUserId={currentUser?.userId}
              onSelect={selectConversation}
              loading={isLoadingConversations}
            />
          </ConversationSidebar>
        </Box>

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
              <MessageViewHeader
                title={getConversationTitle()}
                conversationType={activeConversation?.type}
                isFavorite={currentMember?.isFavorite}
                isArchived={currentMember?.isArchived}
                isSearchActive={conversationSearchOpen}
                onSearch={openConversationSearch}
                onFavorite={handleStarConversation}
                onArchive={handleArchiveConversation}
                onClose={handleCloseConversation}
              >
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
              </MessageViewHeader>

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
                  lastReadMessageId={currentMember?.lastReadMessageId}
                  onScrollToUnread={() => {
                    if (activeConversationId && currentUser?.userId) {
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

export default DirectMessagesProviderView;