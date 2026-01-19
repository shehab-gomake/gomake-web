import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { secondColor, theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      chatContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        height: "100%",
        maxHeight: "100%",
        overflow: "hidden",
      },
      messagesContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        padding: "16px",
        gap: 16,
        overflowY: "auto" as "auto",
      },
      messagesContainerMobile: {
        padding: "12px 8px",
        paddingTop: "50px",
        gap: 12,
      },
      messageContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 8,
        maxWidth: "80%",
      },
      messageContainerMobile: {
        maxWidth: "90%",
        gap: 6,
      },
      userMessage: {
        alignSelf: "flex-end" as "flex-end",
      },
      aiMessage: {
        alignSelf: "flex-start" as "flex-start",
      },
      messageHeader: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: 8,
      },
      messageAvatar: {
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: "#FFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
      },
      messageAvatarMobile: {
        width: 28,
        height: 28,
        fontSize: 14,
      },
      messageInfo: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 2,
      },
      messageSender: {
        ...FONT_FAMILY.Inter(500, 12),
        color: "#374151",
      },
      messageTime: {
        ...FONT_FAMILY.Inter(400, 11),
        color: "#9CA3AF",
      },
      messageContent: {
        ...FONT_FAMILY.Inter(400, 14),
        color: "#1F2937",
        lineHeight: "20px",
        backgroundColor: "#FFF",
        padding: "12px 16px",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
      messageContentMobile: {
        fontSize: 13,
        padding: "10px 12px",
        borderRadius: 10,
      },
      processingMessage: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 8,
        alignSelf: "flex-start" as "flex-start",
        maxWidth: "80%",
      },
      processingContent: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#FFF",
        padding: "12px 16px",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
      typingIndicator: {
        display: "flex",
        flexDirection: "row" as "row",
        gap: 4,
      },
      typingDot: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: "#9CA3AF",
        animation: "typing 1.4s infinite ease-in-out",
        "&:nth-child(1)": {
          animationDelay: "0s",
        },
        "&:nth-child(2)": {
          animationDelay: "0.2s",
        },
        "&:nth-child(3)": {
          animationDelay: "0.4s",
        },
      },
      processingText: {
        ...FONT_FAMILY.Inter(400, 14),
        color: "#6B7280",
        fontStyle: "italic",
      },
      optionsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        flexWrap: "wrap" as "wrap",
        gap: 8,
        marginTop: 12,
      },
      optionButton: {
        ...FONT_FAMILY.Inter(400, 14),
        color: secondColor(500), 
        backgroundColor: secondColor(50),
        border: `1px solid ${secondColor(50)}`,
        borderRadius: 8,
        padding: "8px 12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left" as "left",
        "&:hover": {
          backgroundColor: secondColor(50), 
          borderColor: secondColor(500), 
        },
        "&:active": {
          backgroundColor: secondColor(200), 
        },
      },
      optionButtonMobile: {
        fontSize: 13,
        padding: "10px 14px",
        borderRadius: 10,
      },
    };
  }, [theme]);

  return {
    classes,
  };
};

export { useStyle };
