import React from "react";
import { Stack, Paper, Typography, Alert, Button, Box } from "@mui/material";
import { Chat as ChatIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import config from "@/config";
import { ChannelSidebar, MessageList, MessageInput, UserPresence } from "./components";
import { useInternalProvider } from "./hooks/use-internal-provider";
import { getChannelTitle } from "./utils/internal-utils";

const InternalProviderView: React.FC = () => {
  const {
    isConnected,
    connectionStatus,
    isLoading,
    isLoadingHistory,
    error,
    currentUser,
    activeChannelId,
    messages,
    onlineUsers,
    userPresence,
    typingUsers,
    draft,
    isSending,
    handleChannelSelect,
    handleSendMessage,
    handleInputChange,
    handleRetryConnection,
    handleStartDirectMessage,
    handleCreateChannel,
  } = useInternalProvider();

  // Debug logging
  React.useEffect(() => {
    console.log("Internal Provider - Messaging State:", {
      isConnected,
      connectionStatus,
      isLoading,
      isLoadingHistory,
      error,
      currentUser,
      activeChannelId,
      messagesCount: messages.length,
      onlineUsersCount: onlineUsers.length,
      userPresenceCount: Object.keys(userPresence).length,
    });
  }, [
    isConnected,
    connectionStatus,
    isLoading,
    isLoadingHistory,
    error,
    currentUser,
    activeChannelId,
    messages,
    onlineUsers,
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
        return `Connected to internal messaging service${currentUser ? ` as ${currentUser.name || currentUser.email}` : ""}`;
      case "connecting":
        return "Connecting to messaging service...";
      default:
        return `Disconnected from messaging service${error ? `: ${error}` : ""}`;
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
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  // Add mock data for testing UI
                  console.log("Loading mock data for UI testing...");
                  // TODO: We can add mock data here if needed
                }}
              >
                Show Demo UI
              </Button>
            </Stack>
          }
        >
          Failed to connect to messaging service: {error}
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
              Unable to connect to the messaging service. Please check your connection and try again.
            </Typography>
            <Typography variant="caption" sx={{ color: "#9CA3AF", mt: 1, fontFamily: "monospace" }}>
              Trying to connect to: {config.messaging_server}/messaging
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
        <Alert severity="info">Connecting to messaging service...</Alert>

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
              Establishing connection to messaging service
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
        {/* Left: Channel sidebar */}
        <div style={{ width: 280, minWidth: 280, height: "100%" }}>
          <ChannelSidebar
            activeChannelId={activeChannelId}
            currentUser={currentUser}
            onChannelSelect={handleChannelSelect}
            onStartDirectMessage={handleStartDirectMessage}
            onCreateChannel={handleCreateChannel}
          />
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
          {activeChannelId ? (
            <>
              {/* Message header */}
              <Box sx={{ p: 2, borderBottom: "1px solid #EAECF0" }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <div>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#101828" }}>
                      {getChannelTitle(activeChannelId || "", userPresence, currentUser)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {connectionStatus === "connected"
                        ? `${onlineUsers.length} member${onlineUsers.length !== 1 ? "s" : ""} online`
                        : "Disconnected - messages may not send"}
                    </Typography>
                  </div>
                  {/* Debug info */}
                  <Typography variant="caption" sx={{ color: "#9CA3AF", fontFamily: "monospace" }}>
                    Status: {connectionStatus}
                  </Typography>
                </Stack>
              </Box>

              {/* Messages */}
              <MessageList
                messages={messages}
                currentUserId={currentUser?.id}
                typingUsers={typingUsers}
                userPresence={userPresence}
                isLoadingHistory={isLoadingHistory}
              />

              {/* Message input */}
              <MessageInput
                value={draft}
                onChange={handleInputChange}
                onSend={handleSendMessage}
                placeholder={
                  connectionStatus === "connected"
                    ? `Message ${getChannelTitle(activeChannelId || "", userPresence, currentUser)}`
                    : `Message ${getChannelTitle(activeChannelId || "", userPresence, currentUser)} (offline mode)`
                }
                disabled={false} // Allow typing even when disconnected for testing
                isSending={isSending}
              />
            </>
          ) : (
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Stack alignItems="center" spacing={2}>
                <ChatIcon sx={{ fontSize: 64, color: "#D1D5DB" }} />
                <Typography variant="h6" sx={{ color: "#6B7280" }}>
                  Select a channel
                </Typography>
                <Typography variant="body2" sx={{ color: "#9CA3AF", textAlign: "center" }}>
                  Choose a channel from the sidebar to start messaging
                </Typography>
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
            currentUserId={currentUser?.id}
            onUserClick={handleStartDirectMessage}
          />
        </div>
      </Stack>
    </Stack>
  );
};

export { InternalProviderView };
