import { useEffect, useState, useCallback } from "react";
import { getUserToken } from "@/services/storage-data";

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
      // Get user token for authentication
      const userToken = getUserToken();

      console.log("User token:", userToken ? `Token exists (length: ${userToken.length})` : "No token"); // Debug log

      // Build URL - directly call localhost:3000/api messaging service
      const url = pageToken
        ? `http://localhost:3000/api/gmail/conversations?nextPageToken=${encodeURIComponent(pageToken)}`
        : "http://localhost:3000/api/gmail/conversations";

      const headers = {
        "Content-Type": "application/json",
        ...(userToken && { Authorization: `Bearer ${userToken}` }), // Try with Bearer prefix
      };

      console.log("Making request to:", url); // Debug log
      console.log("Request headers:", headers); // Debug log

      // Make direct fetch call to messaging service at localhost:3000
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      console.log("Response status:", response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API error:", errorData);
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }

      const res = await response.json();
      console.log("Gmail conversations API response:", res); // Debug log

      // Handle different response structures
      let responseData: GmailConversationsResponse | null = null;

      if (res.success) {
        // Check multiple possible response structures
        if (res.data?.conversations) {
          responseData = res.data;
        } else if (res.conversations) {
          responseData = res;
        }
      }

      if (responseData && responseData.conversations) {
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
        console.error("Invalid response structure:", res); // Debug log
        setError(res.message || "Failed to fetch conversations");
        // Don't clear conversations if this is a pagination request
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
