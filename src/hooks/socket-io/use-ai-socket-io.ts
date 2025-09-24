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

const useAISocketIO = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobResults, setJobResults] = useState<any[]>([]);
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

    // Join AI room for this user
    socket.emit("joinAIRoom", {
      userId: localStorage.getItem("userId") || "anonymous",
      timestamp: new Date().toISOString(),
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendAIJob = async (jobDescription: string) => {
    try {
      setIsProcessing(true);

      // Send job to backend via API
      const response = await callApi("POST", "/v1/ai/create-job", {
        description: jobDescription,
        timestamp: new Date().toISOString(),
      });

      if (response?.success) {
        console.log("AI Job created successfully:", response.data);
        return response.data;
      } else {
        throw new Error(response?.message || "Failed to create AI job");
      }
    } catch (error) {
      console.error("Error creating AI job:", error);
      setIsProcessing(false);
      throw error;
    }
  };

  const sendAIChatMessage = async (message: string, jobId?: string) => {
    try {
      const response = await callApi("POST", "/v1/ai/chat", {
        message,
        jobId,
        timestamp: new Date().toISOString(),
      });

      if (response?.success) {
        return response.data;
      } else {
        throw new Error(response?.message || "Failed to send chat message");
      }
    } catch (error) {
      console.error("Error sending AI chat message:", error);
      throw error;
    }
  };

  return {
    isProcessing,
    jobResults,
    sendAIJob,
    sendAIChatMessage,
  };
};

export { useAISocketIO };
