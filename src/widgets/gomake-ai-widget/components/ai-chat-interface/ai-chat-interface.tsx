import React, { useEffect, useRef } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { useStyle } from "./style";

interface AIChatInterfaceProps {
  messages: Array<{
    id: string;
    type: "user" | "ai";
    message: string;
    timestamp: string;
  }>;
  isProcessing: boolean;
}

const AIChatInterface = ({ messages, isProcessing }: AIChatInterfaceProps) => {
  const { classes } = useStyle();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={classes.chatContainer}>
      <div style={classes.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...classes.messageContainer,
              ...(message.type === "user"
                ? classes.userMessage
                : classes.aiMessage),
            }}
          >
            <div style={classes.messageHeader}>
              <div style={classes.messageAvatar}>
                {message.type === "user" ? "👤" : "🤖"}
              </div>
              <div style={classes.messageInfo}>
                <div style={classes.messageSender}>
                  {message.type === "user" ? "You" : "GoMake AI"}
                </div>
                <div style={classes.messageTime}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
            <div style={classes.messageContent}>{message.message}</div>
          </div>
        ))}

        {isProcessing && (
          <div style={classes.processingMessage}>
            <div style={classes.messageHeader}>
              <div style={classes.messageAvatar}>🤖</div>
              <div style={classes.messageInfo}>
                <div style={classes.messageSender}>GoMake AI</div>
                <div style={classes.messageTime}>Now</div>
              </div>
            </div>
            <div style={classes.processingContent}>
              <div style={classes.typingIndicator}>
                <div style={classes.typingDot}></div>
                <div style={classes.typingDot}></div>
                <div style={classes.typingDot}></div>
              </div>
              <div style={classes.processingText}>AI is thinking...</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export { AIChatInterface };
