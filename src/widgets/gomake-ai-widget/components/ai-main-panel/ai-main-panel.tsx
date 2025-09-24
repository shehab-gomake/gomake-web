import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { AIChatInterface } from "../ai-chat-interface/ai-chat-interface";
import { useStyle } from "./style";
import SendIcon from "@mui/icons-material/Send";

interface AIMainPanelProps {
  selectedTab: "new-job";
  onNewJobCreated: (job: any) => void;
  sendAIJob: (description: string) => Promise<any>;
  sendAIChatMessage: (message: string, jobId?: string) => Promise<any>;
  isProcessing: boolean;
  chatMessages: any[];
  onChatMessagesUpdate: (messages: any[]) => void;
}

const AIMainPanel = ({
  selectedTab,
  onNewJobCreated,
  sendAIJob,
  sendAIChatMessage,
  isProcessing,
  chatMessages,
  onChatMessagesUpdate,
}: AIMainPanelProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmitJob = async () => {
    if (!jobDescription.trim()) return;

    const currentDescription = jobDescription; // Store the current description
    setJobDescription(""); // Clear the input immediately

    try {
      // Add user message to chat
      const newMessages = [
        ...chatMessages,
        {
          id: Date.now().toString(),
          type: "user",
          message: currentDescription,
          timestamp: new Date().toISOString(),
        },
      ];
      onChatMessagesUpdate(newMessages);

      // Send job to AI via socket
      const jobResult = await sendAIJob(currentDescription);

      // Create new job object
      const newJob = {
        id: jobResult.id || Date.now().toString(),
        title:
          currentDescription.substring(0, 50) +
          (currentDescription.length > 50 ? "..." : ""),
        description: currentDescription,
        createdAt: new Date().toISOString(),
        status: "processing" as const,
      };

      onNewJobCreated(newJob);

      // Add AI response to chat
      const aiResponseMessages = [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          message:
            "I'm analyzing your job requirements. Let me help you create a detailed quote for this project...",
          timestamp: new Date().toISOString(),
        },
      ];
      onChatMessagesUpdate(aiResponseMessages);
    } catch (error) {
      console.error("Error submitting job:", error);
      // Add error message to chat
      const errorMessages = [
        ...chatMessages,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          message:
            "Sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ];
      onChatMessagesUpdate(errorMessages);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitJob();
    }
  };

  return (
    <div style={classes.mainPanelContainer}>
      {selectedTab === "new-job" && (
        <div style={classes.newJobContainer}>
          {/* Header */}
          <div style={classes.header}>
            <div style={classes.headerIcon}>✨</div>
            <div style={classes.headerTitle}>
              Start a New Job with GoMake AI
            </div>
            <div style={classes.headerSubtitle}>
              Describe your project, and our intelligent assistant will guide
              you through the creation process.
            </div>
          </div>

          {/* Chat Interface */}
          <div style={classes.chatContainer}>
            <AIChatInterface
              messages={chatMessages}
              isProcessing={isProcessing}
            />
          </div>

          {/* Job Description Form - Always at Bottom */}
          <div style={classes.bottomFormContainer}>
            <div style={classes.bottomFormWrapper}>
              <textarea
                style={classes.bottomTextArea}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe your new job requirements..."
                disabled={isProcessing}
                rows={1}
              />
              <button
                className={`send-button ${isProcessing ? "disabled" : ""}`}
                style={{
                  ...classes.sendButton,
                  ...(isProcessing ? classes.sendButtonDisabled : {}),
                }}
                onClick={handleSubmitJob}
                disabled={!jobDescription.trim() || isProcessing}
              >
                <SendIcon style={classes.sendIcon} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AIMainPanel };
