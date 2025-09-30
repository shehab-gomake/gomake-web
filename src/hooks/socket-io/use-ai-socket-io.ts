import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";
import { useRecoilState } from "recoil";
import { useGomakeAxios, useSnackBar } from "@/hooks";

// State for AI job processing
const aiJobProcessingState = {
  key: "aiJobProcessingState",
  default: false,
};

const aiJobResultsState = {
  key: "aiJobResultsState",
  default: [],
};

//!here socket
const useAISocketIO = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobResults, setJobResults] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { callApi } = useGomakeAxios();
  const { alertFault } = useSnackBar();

  useEffect(() => {
    const socket = io(config.api_server);

    // Listen for AI job status updates
    socket.on("AIJobStatusUpdate", (data) => {
      console.log("AI Job Status Update:", data);
      setIsProcessing(data.isProcessing);

      if (data.result) {
        setJobResults((prev) => [data.result, ...prev]);
      }
    });

    // Listen for AI chat messages
    socket.on("AIChatMessage", (message) => {
      console.log("AI Chat Message:", message);
      // Handle real-time AI responses
    });

    // Listen for AI job completion
    socket.on("AIJobCompleted", (jobData) => {
      console.log("AI Job Completed:", jobData);
      setIsProcessing(false);
      setJobResults((prev) => [jobData, ...prev]);
    });

    // Listen for AI job errors
    socket.on("AIJobError", (error) => {
      console.error("AI Job Error:", error);
      setIsProcessing(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const startSession = async () => {
    try {
      // setIsProcessing(true);

      // Start new AI session
      const response = await callApi(
        "POST",
        "/v1/gomake-ai-service/start-session"
      );

      // Check HTTP status code
      // if (response?.status && response.status !== 200) {
      //   const errorMessage =
      //     response?.message ||
      //     response?.msg ||
      //     `Request failed with status ${response.status}`;
      //   alertFault(errorMessage);
      //   throw new Error(errorMessage);
      // }

      if (response?.success && response.data?.sessionId) {
        console.log("AI Session started successfully:", response.data);
        setSessionId(response.data.sessionId);
        // setIsProcessing(false);
        return response.data;
      } else {
        const errorMessage = response?.message || "Failed to start AI session";
        alertFault(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error starting AI session:", error);
      // setIsProcessing(false);
      throw error;
    }
  };

  const sendMessage = async (prompt: string) => {
    try {
      if (!sessionId) {
        throw new Error("No active session. Please start a new job first.");
      }

      // Send message to AI
      const response = await callApi(
        "POST",
        "/v1/gomake-ai-service/send-message",
        {
          sessionId: sessionId,
          prompt: prompt,
        }
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

      // Response is empty, we get the actual response from socket.io
      console.log("Message sent successfully, waiting for socket response");
      return { success: true };
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const getConversationsHistory = async () => {
    try {
      const response = await callApi(
        "GET",
        "/v1/gomake-ai-service/get-conversations-history"
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

      if (response?.success && response.data) {
        console.log(
          "Conversations history retrieved successfully:",
          response.data
        );
        return response.data;
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

      const response = await callApi(
        "GET",
        `/v1/gomake-ai-service/get-conversation/${sessionId}`
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

      if (response?.success && response.data) {
        console.log("Conversation retrieved successfully:", response.data);
        return response.data;
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

  return {
    isProcessing,
    jobResults,
    sessionId,
    startSession,
    sendMessage,
    getConversationsHistory,
    getConversation,
  };
};

export { useAISocketIO };
