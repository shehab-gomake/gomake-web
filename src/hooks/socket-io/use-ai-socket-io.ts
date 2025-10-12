import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useAISocketIO = (
  onMessageReceived?: (message: any) => void,
  onProductIdReceived?: (productId: string) => void,
  onProductUpdated?: () => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { callApi } = useGomakeAxios();
  const { alertFault } = useSnackBar();

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    const socket = io(config.api_server);
    socket.on(sessionId, (message: any) => {
      if (onMessageReceived) {
        onMessageReceived(message);
      }

      // Update processing state based on message type
      if (message.type === "ai") {
        setIsProcessing(false);
      }
    });

    socket.on("error", (error: any) => {
      setIsProcessing(false);
    });

    // Listen for productId result
    socket.on(`${sessionId}-productId-result`, (data: any) => {
      if (data?.productId && onProductIdReceived) {
        onProductIdReceived(data.productId);
      }
    });
    socket.on(`${sessionId}-parameters-result`, () => {
      if(onProductUpdated){
        onProductUpdated();
      }
      
    });
    return () => {
      socket.off(`${sessionId}-productId-result`);
      socket.disconnect();
    };
  }, [sessionId]);

  const startSession = async () => {
    try {
      // Start new AI session
      const response = await callApi(
        "POST",
        "/v1/gomake-ai-service/start-session",
        {},
        false
      );

      const responseData = response.data?.data?.data?.sessionId;

      if (response?.success && responseData) {
        setSessionId(responseData);
        return response.data?.data?.data;
      } else {
        const errorMessage = response?.message || "Failed to start AI session";
        alertFault(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error starting AI session:", error);
      throw error;
    }
  };

  const sendMessage = async (prompt: string) => {
    try {
      if (!sessionId) {
        throw new Error("No active session. Please start a new job first.");
      }

      // Set processing state when sending message
      setIsProcessing(true);

      // Send message to AI
      const response = await callApi(
        "POST",
        "/v1/gomake-ai-service/send-message",
        {
          sessionId: sessionId,
          prompt: prompt,
        },
        false
      );

      // Check HTTP status code
      if (response?.status && response.status !== 200) {
        const errorMessage =
          response?.message ||
          response?.msg ||
          `Request failed with status ${response.status}`;
        alertFault(errorMessage);
        setIsProcessing(false);
        throw new Error(errorMessage);
      }

      // Response is empty, we get the actual response from socket.io
      console.log("Message sent successfully, waiting for socket response");
      return { success: true };
    } catch (error) {
      console.error("Error sending message:", error);
      setIsProcessing(false);
      throw error;
    }
  };

  const getConversationsHistory = async () => {
    try {
      const response = await callApi(
        "GET",
        "/v1/gomake-ai-service/get-conversations-history",
        {},
        false
      );

      // Check HTTP status code
      if (response?.status && response.status !== 200) {
        const errorMessage =
          response?.message ||
          response?.msg ||
          `Request failed with status ${response.status}`;
        alertFault(errorMessage);
        throw new Error(errorMessage);
      }

      const responseData = response.data?.data?.data;
      if (response?.success && responseData) {
        return responseData;
      } else {
        const errorMessage =
          response?.message || "Failed to get conversations history";
        alertFault(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error getting conversations history:", error);
      throw error;
    }
  };

  const getConversation = async (sessionId: string) => {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required to get conversation");
      }

      // Reset processing state when loading a conversation
      setIsProcessing(false);

      const response = await callApi(
        "GET",
        `/v1/gomake-ai-service/get-conversation/${sessionId}`,
        {},
        false
      );

      // Check HTTP status code
      if (response?.status && response.status !== 200) {
        const errorMessage =
          response?.message ||
          response?.msg ||
          `Request failed with status ${response.status}`;
        alertFault(errorMessage);
        throw new Error(errorMessage);
      }

      const responseData = response.data?.data?.data;
      if (response?.success && responseData) {
        return responseData;
      } else {
        const errorMessage = response?.message || "Failed to get conversation";
        alertFault(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error getting conversation:", error);
      throw error;
    }
  };

  // Function to manually set session ID (for continuing conversations)
  const setSessionIdManually = (newSessionId: string) => {
    setSessionId(newSessionId);
  };

  // Function to reset processing state (for new jobs)
  const resetProcessingState = () => {
    setIsProcessing(false);
  };

  return {
    isProcessing,
    sessionId,
    startSession,
    sendMessage,
    getConversationsHistory,
    getConversation,
    setSessionIdManually,
    resetProcessingState,
  };
};

export { useAISocketIO };
