import { useEffect, useState, useCallback } from "react";
import { getGmailConversations } from "@/services/api-service/gmail/gmail-endpoints";

export interface GmailConversation {
  id: string;
  subject: string;
  from: string;
  to: string;
  snippet: string;
  messageCount: number;
  hasUnread: boolean;
  latestDate: string;
  labels: string[];
}

export interface GmailConversationsResponse {
  conversations: GmailConversation[];
  nextPageToken?: string;
  hasMore: boolean;
}

const useGmailConversations = () => {
  console.log("🚀 useGmailConversations hook initialized"); // Debug log

  const [conversations, setConversations] = useState<GmailConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);

  const fetchConversations = useCallback(async (pageToken?: string) => {
    console.log("📡 fetchConversations called with pageToken:", pageToken); // Debug log
    setLoading(true);
    setError(null);

    try {
      const response = await getGmailConversations({
        limit: 20,
        ...(pageToken && { pageToken })
      });

      console.log("Gmail conversations API response:", response); // Debug log

      if (response.success && response.data) {
        const responseData = response.data;

        if (responseData.conversations) {
          if (pageToken) {
            // Append to existing conversations for pagination
            setConversations((prev) => [...prev, ...responseData.conversations]);
          } else {
            // Replace conversations for initial load
            setConversations(responseData.conversations);
          }

          setNextPageToken(responseData.nextPageToken);
          setHasMore(responseData.hasMore || false);
          setError(null);
        } else {
          console.error("No conversations in response:", response);
          setError("No conversations found");
          if (!pageToken) {
            setConversations([]);
          }
          setHasMore(false);
        }
      } else {
        console.error("Invalid response structure:", response);
        const errorMessage = response.error || response.message || "Failed to fetch conversations";
        setError(errorMessage);
        if (!pageToken) {
          setConversations([]);
        }
        setHasMore(false);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch conversations");
      if (!pageToken) {
        setConversations([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (nextPageToken && !loading && hasMore) {
      fetchConversations(nextPageToken);
    }
  }, [nextPageToken, loading, hasMore, fetchConversations]);

  const refresh = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};

export { useGmailConversations };
