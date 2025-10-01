import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      chatContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        height: "100%",
        maxHeight: "100%",
        //!here style
        // border: "1px solid #E5E7EB",
        // borderRadius: 8,
        // backgroundColor: "#FAFAFA",
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
      messageContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 8,
        maxWidth: "80%",
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
        backgroundColor: "#F3F4F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
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
    };
  }, []);

  return {
    classes,
  };
};

export { useStyle };
