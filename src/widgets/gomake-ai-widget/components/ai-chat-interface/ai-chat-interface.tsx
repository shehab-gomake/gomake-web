import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { useStyle } from "./style";
import { useIsMobile } from "@/hooks/use-responsive";

interface AIChatInterfaceProps {
  messages: Array<{
    id: string;
    type: "user" | "ai";
    message: string;
    timestamp: string;
    messageType?: "text" | "list";
    list?: string[];
  }>;
  isProcessing?: boolean;
  onOptionClick?: (option: string) => void;
}

// Translation keys for processing steps
const PROCESSING_STEP_KEYS = [
  { key: "aiChat.processing.analyzingMessage", duration: 3000 },
  { key: "aiChat.processing.locatingContext", duration: 3500 },
  { key: "aiChat.processing.identifyingCharacteristics", duration: 3200 },
  { key: "aiChat.processing.buildingFlowChart", duration: 4000 },
  { key: "aiChat.processing.checkingResources", duration: 3500 },
  { key: "aiChat.processing.analyzingCosts", duration: 3800 },
  { key: "aiChat.processing.finalizingResponse", duration: 3500 },
  { key: "aiChat.processing.gettingPrice", duration: 3000 },
];

const AIChatInterface = ({
  messages,
  isProcessing,
  onOptionClick,
}: AIChatInterfaceProps) => {
  const { classes } = useStyle();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
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

  const [currentStep, setCurrentStep] = useState(0);

  // Reset step to 0 when processing starts
  useEffect(() => {
    if (isProcessing) {
      setCurrentStep(0);
    }
  }, [isProcessing]);

  // Cycle through processing steps
  useEffect(() => {
    if (!isProcessing) return;

    const currentDuration = PROCESSING_STEP_KEYS[currentStep].duration;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % PROCESSING_STEP_KEYS.length);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [currentStep, isProcessing]);

  return (
    <div style={classes.chatContainer}>
      <div
        style={{
          ...classes.messagesContainer,
          ...(isMobile ? classes.messagesContainerMobile : {}),
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...classes.messageContainer,
              ...(isMobile ? classes.messageContainerMobile : {}),
              ...(message.type === "user"
                ? classes.userMessage
                : classes.aiMessage),
            }}
          >
            <div style={classes.messageHeader}>
              <div
                style={{
                  ...classes.messageAvatar,
                  ...(isMobile ? classes.messageAvatarMobile : {}),
                }}
              >
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
            <div
              style={{
                ...classes.messageContent,
                ...(isMobile ? classes.messageContentMobile : {}),
              }}
            >
              {message.message}
              {message.messageType === "list" &&
                message.list &&
                message.list.length > 0 && (
                  <div style={classes.optionsContainer}>
                    {message.list.map((option, index) => (
                      <button
                        key={index}
                        style={{
                          ...classes.optionButton,
                          ...(isMobile ? classes.optionButtonMobile : {}),
                        }}
                        onClick={() => onOptionClick?.(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div style={classes.processingMessage}>
            <div style={classes.messageHeader}>
              <div
                style={{
                  ...classes.messageAvatar,
                  ...(isMobile ? classes.messageAvatarMobile : {}),
                }}
              >
                🤖
              </div>
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
              <div style={classes.processingText}>
                {t(PROCESSING_STEP_KEYS[currentStep].key)}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export { AIChatInterface };
