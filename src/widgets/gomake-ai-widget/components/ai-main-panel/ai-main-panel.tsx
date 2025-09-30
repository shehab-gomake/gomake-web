import React, { useState } from "react";
import { AIChatInterface } from "../ai-chat-interface/ai-chat-interface";
import { useStyle } from "./style";
import SendIcon from "@mui/icons-material/Send";

import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

const jobCards = [
  {
    title: "Start a Book Job",
    description: "Design covers, layouts, and more.",
    icon: <MenuBookOutlinedIcon style={{ fontSize: 24, color: "#3B82F6" }} />,
  },
  {
    title: "Start a Package Job",
    description: "Create packaging for a new product.",
    icon: <Inventory2OutlinedIcon style={{ fontSize: 24, color: "#3B82F6" }} />,
  },
  {
    title: "Start a Commercial Product Job",
    description: "Develop branding for a commercial item.",
    icon: <AssignmentOutlinedIcon style={{ fontSize: 24, color: "#3B82F6" }} />,
  },
  {
    title: "Start a Labels Job",
    description: "Design and print custom labels.",
    icon: <LocalOfferOutlinedIcon style={{ fontSize: 24, color: "#3B82F6" }} />,
  },
];

//!here main test
interface AIMainPanelProps {
  onNewJobCreated: (job: any) => void;
  startSession: () => Promise<any>;
  sendMessage: (prompt: string) => Promise<any>;
  isProcessing: boolean;
  sessionId: string | null;
  chatMessages: any[];
  onChatMessagesUpdate: (messages: any[]) => void;
}

const AIMainPanel = ({
  onNewJobCreated,
  startSession,
  sendMessage,
  isProcessing,
  sessionId,
  chatMessages,
  onChatMessagesUpdate,
}: AIMainPanelProps) => {
  const { classes } = useStyle();
  const [jobDescription, setJobDescription] = useState("");

  //!here
  const handleSendMessage = async () => {
    if (!jobDescription.trim()) return;

    const currentDescription = jobDescription; // Store the current description
    setJobDescription(""); // Clear the input immediately

    // Add user message to chat (moved outside try block for catch block access)
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

    try {
      // If this is the first message and we have a session, create job entry
      if (chatMessages.length === 0 && sessionId) {
        const newJob = {
          id: sessionId,
          title:
            currentDescription.substring(0, 50) +
            (currentDescription.length > 50 ? "..." : ""),
          description: currentDescription,
          createdAt: new Date().toISOString(),
          status: "processing" as const,
        };
        onNewJobCreated(newJob);
      }

      // Send message to AI
      await sendMessage(currentDescription);

      // Note: AI response will come through socket.io, not here
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message to chat (don't replace existing messages)
      const errorMessages = [
        ...newMessages, // Use newMessages instead of chatMessages
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          message:
            "Sorry, I encountered an error processing your message. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ];
      onChatMessagesUpdate(errorMessages);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleJobCardClick = async (title: string, description: string) => {
    // Clear the input immediately
    setJobDescription("");

    // Create the message directly without relying on state
    const currentDescription = title;

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

    try {
      // If this is the first message and we have a session, create job entry
      if (chatMessages.length === 0 && sessionId) {
        const newJob = {
          id: sessionId,
          title:
            currentDescription.substring(0, 50) +
            (currentDescription.length > 50 ? "..." : ""),
          description: currentDescription,
          createdAt: new Date().toISOString(),
          status: "processing" as const,
        };
        onNewJobCreated(newJob);
      }

      // Send message to AI
      await sendMessage(currentDescription);

      // Note: AI response will come through socket.io, not here
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message to chat (don't replace existing messages)
      const errorMessages = [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          message:
            "Sorry, I encountered an error processing your message. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ];
      onChatMessagesUpdate(errorMessages);
    }
  };

  return (
    <div style={classes.mainPanelContainer}>
      <div style={classes.newJobContainer}>
        {/* Header - Only show when no chat messages */}
        {chatMessages.length === 0 && (
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
        )}

        {chatMessages.length === 0 && (
          <div style={classes.jobTypeCardsContainer}>
            {jobCards.map((card, index) => (
              <div
                key={index}
                style={classes.jobTypeCard}
                onClick={() => handleJobCardClick(card.title, card.description)}
              >
                <div style={classes.jobTypeIconWrapper}>{card.icon}</div>
                <div style={classes.jobTypeTextContainer}>
                  <div style={classes.jobTypeTitle}>{card.title}</div>
                  <div style={classes.jobTypeDescription}>
                    {card.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
              onClick={handleSendMessage}
              disabled={!jobDescription.trim() || isProcessing}
            >
              <SendIcon style={classes.sendIcon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AIMainPanel };
