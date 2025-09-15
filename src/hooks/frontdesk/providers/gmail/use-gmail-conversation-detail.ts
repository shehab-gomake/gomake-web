import { useCallback, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { selectedGmailConversationState, GmailConversationDetail } from "@/store/frontdesk/providers/gmail";
import { getGmailConversationDetail } from "@/services/api-service/frontdesk/providers/gmail/gmail-endpoints";

export const useGmailConversationDetail = () => {
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedGmailConversationState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversationDetail = useCallback(async (conversationId: string) => {
    if (!conversationId) {
      setError("Conversation ID is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getGmailConversationDetail(conversationId);

      console.log("Gmail conversation detail response:", response);

      if (response.success && response.data) {
        const conversationDetail: GmailConversationDetail = {
          id: response.data.id || conversationId,
          messages: response.data.messages || [],
          messageCount: response.data.messageCount || response.data.messages?.length || 0,
        };
        setSelectedConversation(conversationDetail);
        setError(null);
      } else {
        const errorMessage = response.error || response.message || "Failed to fetch conversation details";
        setError(errorMessage);
        console.error("Failed to fetch conversation details:", response);
      }
    } catch (err: any) {
      console.error("Error fetching conversation detail:", err);
      const errorMessage = err.message || "Failed to fetch conversation details";
      setError(errorMessage);
      setSelectedConversation(null);
    } finally {
      setLoading(false);
    }
  }, [setSelectedConversation]);

  const clearSelectedConversation = useCallback(() => {
    setSelectedConversation(null);
    setError(null);
  }, [setSelectedConversation]);

  const markAsRead = useCallback(async (messageIds: string[]) => {
    // This would be implemented when we have the mark as read endpoint
    console.log("Mark as read requested for messages:", messageIds);
    // TODO: Implement mark as read functionality
  }, []);

  return {
    selectedConversation,
    loading,
    error,
    fetchConversationDetail,
    clearSelectedConversation,
    markAsRead,
  };
};