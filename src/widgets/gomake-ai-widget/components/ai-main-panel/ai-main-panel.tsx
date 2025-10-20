import React, { useState } from "react";
import { AIChatInterface } from "../ai-chat-interface/ai-chat-interface";
import { ProductSelector } from "../product-selector/product-selector";
import { useStyle } from "./style";
import SendIcon from "@mui/icons-material/Send";
import { useIsMobile } from "@/hooks/use-responsive";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

interface AIMainPanelProps {
  sendMessage: (prompt: string) => Promise<any>;
  selectProduct: (productId: string) => Promise<any>;
  isProcessing: boolean;
  sessionId: string | null;
  chatMessages: any[];
  onChatMessagesUpdate: (messages: any[]) => void;
  isFullWidth?: boolean;
  isLoadingConversation?: boolean;
}

const AIMainPanel = ({
  sendMessage,
  selectProduct,
  isProcessing,
  sessionId,
  chatMessages,
  onChatMessagesUpdate,
  isFullWidth = false,
  isLoadingConversation,
}: AIMainPanelProps) => {
  const { classes } = useStyle({ isFullWidth });
  const isMobile = useIsMobile();
  const [jobDescription, setJobDescription] = useState("");

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

  const handleOptionClick = async (option: string) => {
    // Add user message to chat
    const newMessages = [
      ...chatMessages,
      {
        id: Date.now().toString(),
        type: "user",
        message: option,
        timestamp: new Date().toISOString(),
      },
    ];

    onChatMessagesUpdate(newMessages);

    try {
      // Send the selected option as a message to AI
      await sendMessage(option);
    } catch (error) {
      console.error("Error sending option message:", error);
      // Add error message to chat
      const errorMessages = [
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          message:
            "Sorry, I encountered an error processing your selection. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ];
      onChatMessagesUpdate(errorMessages);
    }
  };

  const handleProductSelect = async (productId: string) => {
    try {
      // Call the select product API
      await selectProduct(productId);

      // Add a system message to the chat
      const newMessages = [
        ...chatMessages,
        {
          id: Date.now().toString(),
          type: "system",
          message:
            "Product selected successfully! You can now start customizing it.",
          timestamp: new Date().toISOString(),
        },
      ];

      onChatMessagesUpdate(newMessages);
    } catch (error) {
      console.error("Error selecting product:", error);
      // Add error message to chat
      const errorMessages = [
        ...chatMessages,
        {
          id: Date.now().toString(),
          type: "ai",
          message:
            "Sorry, I encountered an error selecting the product. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ];
      onChatMessagesUpdate(errorMessages);
    }
  };

  if (isLoadingConversation) {
    return <div style={classes.mainPanelContainer} />;
  }

  return (
    <div style={classes.mainPanelContainer}>
      <div
        style={{
          ...classes.newJobContainer,
          ...(isMobile ? classes.newJobContainerMobile : {}),
        }}
      >
        {/* Product Selector - Only show when no chat messages */}
        {chatMessages.length === 0 && (
          <ProductSelector
            onProductSelect={handleProductSelect}
            isProcessing={isProcessing}
          />
        )}

        {/* Chat Interface */}
        <div
          style={{
            ...classes.chatContainer,
            ...(isMobile ? classes.chatContainerMobile : {}),
          }}
        >
          <AIChatInterface
            messages={chatMessages}
            isProcessing={isProcessing}
            onOptionClick={handleOptionClick}
          />
        </div>

        {/* Job Description Form - Always at Bottom */}
        <div style={classes.bottomFormContainer}>
          <div style={classes.bottomFormWrapper}>
            <textarea
              style={{
                ...classes.bottomTextArea,
                ...(isMobile ? classes.bottomTextAreaMobile : {}),
              }}
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
                ...(isMobile ? classes.sendButtonMobile : {}),
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
