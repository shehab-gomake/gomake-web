import React, { useEffect } from "react";
import { Stack, Box } from "@mui/material";
import { Panel, PanelContent, EmptyState } from "@/widgets/frontdesk/design-system";
import { ChatwootConversationList } from "./components/chatwoot-conversation-list";
import { ChatwootMessageViewer } from "./components/chatwoot-message-viewer";
import { ChatwootNotificationsView } from "./components/chatwoot-notifications-view";
import { useChatwootProvider } from "./hooks/use-chatwoot-provider";
import { chatwootService } from "@/services/frontdesk";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  chatwootProfileAtom,
  chatwootProfileLoadingAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useRouter } from "next/router";

export const ChatwootProviderView: React.FC = () => {
  const router = useRouter();
  const setProfile = useSetRecoilState(chatwootProfileAtom);
  const setProfileLoading = useSetRecoilState(chatwootProfileLoadingAtom);
  
  // Determine if we're showing notifications (My Inbox) or conversations
  // Show notifications by default when in inbox section with chatwoot provider
  // Only show conversations when explicitly set to "conversations" view
  const isConversationsView = router.query.view === "conversations";
  const isNotificationsView = !isConversationsView; // Default to notifications unless explicitly conversations

  const {
    selectedAccountId: currentAccountId,
    conversations,
    conversationsLoading,
    conversationsError,
    hasMore,
    loadMore,
    refresh,
    filters,
    handleFiltersChange,
    selectedConversation,
    handleConversationSelect,
    handleBack,
  } = useChatwootProvider();

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const profile = await chatwootService.profile.getProfile();
        setProfile(profile);
      } catch (error) {
        console.error("Failed to load Chatwoot profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [setProfile, setProfileLoading]);

  // Show Notifications View (My Inbox)
  if (isNotificationsView) {
    return (
      <Box sx={{ height: "100%", p: 2 }}>
        <ChatwootNotificationsView />
      </Box>
    );
  }

  // Show Conversations View (default)
  return (
    <Stack direction="row" spacing={2} sx={{ height: "100%", p: 2 }}>
      {/* Conversation List */}
      <Panel
        elevation={0}
        border="default"
        sx={{
          width: 400,
          minWidth: 350,
          maxWidth: 500,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <ChatwootConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onConversationSelect={handleConversationSelect}
          loading={conversationsLoading}
          error={conversationsError}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onRefresh={refresh}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </Panel>

      {/* Message Viewer */}
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
        {selectedConversation ? (
          <ChatwootMessageViewer
            conversation={selectedConversation}
            accountId={currentAccountId || undefined}
            onBack={handleBack}
          />
        ) : (
          <PanelContent padding="lg">
            <EmptyState
              title="No conversation selected"
              description="Choose a conversation from the list to start viewing messages"
            />
          </PanelContent>
        )}
      </Panel>
    </Stack>
  );
};

