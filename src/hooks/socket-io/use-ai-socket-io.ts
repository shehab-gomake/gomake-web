import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";
import { useRecoilState } from "recoil";
import { useGomakeAxios } from "@/hooks";

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

    // Join AI room for this user with sessionId
    if (sessionId) {
      socket.emit("joinAIRoom", {
        sessionId: sessionId,
        userId: localStorage.getItem("userId") || "anonymous",
        timestamp: new Date().toISOString(),
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const startSession = async () => {
    try {
      // setIsProcessing(true);

      // Start new AI session
      const response = await callApi("POST", "/v1/ai/startSession", {
        userId: localStorage.getItem("userId") || "anonymous",
      });

      if (response?.success && response.data?.sessionId) {
        console.log("AI Session started successfully:", response.data);
        setSessionId(response.data.sessionId);
        // setIsProcessing(false);
        return response.data;
      } else {
        throw new Error(response?.message || "Failed to start AI session");
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
      const response = await callApi("POST", "/v1/ai/sendMessage", {
        sessionId: sessionId,
        prompt: prompt,
      });

      // Response is empty, we get the actual response from socket.io
      console.log("Message sent successfully, waiting for socket response");
      return { success: true };
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  return {
    isProcessing,
    jobResults,
    sessionId,
    startSession,
    sendMessage,
  };
};

export { useAISocketIO };
