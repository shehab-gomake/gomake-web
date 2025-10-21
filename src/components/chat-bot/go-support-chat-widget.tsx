import { useEffect, useState } from "react";
import { getGoSupportUserTokenApi } from "@/services/api-service/support/support-endpoints";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { IconButton } from "@mui/material";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";

// Extend Window interface for TypeScript
declare global {
  interface Window {
    GoMakeSupportWidget?: {
      open: () => void;
      close: () => void;
    };
  }
}

interface GoSupportChatWidgetProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  primaryColor?: string;
  theme?: "dark" | "light";
}

const GoSupportChatWidget: React.FC<GoSupportChatWidgetProps> = ({
                                                                   position = "bottom-right",
                                                                   primaryColor = "#8b5cf6",
                                                                   theme = "dark",
                                                                 }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const apiKey =
      "54cf7618c497b6d1f1f3938a5ca39c5dc58c61135453361f90d742c6a789c7f0";
  const [userToken, setUserToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const userProfile = useRecoilValue(userProfileState);
  const { callApi } = useGomakeAxios();

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;
    let closeCallbackTriggered = false;

    // Load widget immediately with hidden button

    const loadChatWidget = async () => {
      try {
        setIsLoading(true);

        // Get user token from API
        const callBack = (res: { success: boolean; data: any }) => {
          if (res?.success && res?.data) {
            setUserToken(res.data);
            initializeChatWidget(res.data);
          } else {
            setError("Failed to get user token");
            setIsLoading(false);
            initializeChatWidget("");
          }
        };

        await getGoSupportUserTokenApi(callApi, callBack);
      } catch (err) {
        console.error("Error loading chat widget:", err);
        setError("Failed to initialize chat widget");
        setIsLoading(false);
      }
    };

    const initializeChatWidget = (token: string) => {
      // Load the chat widget script with data attributes
      const script = document.createElement("script");
      script.src =
          "https://know-base-qassamat.replit.app/public/chat-widget.js";
      script.setAttribute(
          "data-api-url",
          "https://know-base-qassamat.replit.app"
      );
      script.setAttribute("data-hide-button", "true"); // Hide default button
      script.setAttribute("data-position", position);
      script.setAttribute("data-api-key", apiKey);
      script.setAttribute("data-api-url", "https://know-base-qassamat.replit.app");
      script.setAttribute("data-user-token", token);
      script.setAttribute("data-primary-color", primaryColor);
      script.setAttribute("data-theme", theme);
      script.setAttribute("data-user-id", userProfile?.userId || "");
      script.setAttribute(
          "data-user-name",
          `${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`.trim()
      );
      script.setAttribute("data-user-email", userProfile?.email || "");
      script.setAttribute(
          "data-user-avatar",
          userProfile?.imagePath || userProfile?.avatarInitials || ""
      );
      script.async = true;
      script.id = "gomake-chat-widget-script";

      script.onload = () => {
        setIsLoading(false);
        setupCloseDetection();
      };

      script.onerror = () => {
        setError("Failed to load chat widget script");
        setIsLoading(false);
      };

      document.body.appendChild(script);
      scriptElement = script;
    };

    const setupCloseDetection = () => {
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        if (
            target.closest('[class*="close"]') ||
            target.closest('[class*="Close"]') ||
            target.closest('button[aria-label*="close"]') ||
            target.closest('button[aria-label*="Close"]') ||
            target.closest("[data-close]")
        ) {
          const chatWidget = target.closest(
              '[id*="gomake-chat"], [class*="chat-widget"]'
          );
          if (chatWidget && !closeCallbackTriggered) {
            closeCallbackTriggered = true;
            setTimeout(() => {
              setIsChatOpen(false);
              document.removeEventListener("click", handleClick, true);
            }, 100);
          }
        }
      };

      document.addEventListener("click", handleClick, true);
      (window as any)._chatCloseHandler = handleClick;
    };

    loadChatWidget();

    // Cleanup function
    return () => {
      if ((window as any)._chatCloseHandler) {
        document.removeEventListener(
            "click",
            (window as any)._chatCloseHandler,
            true
        );
        delete (window as any)._chatCloseHandler;
      }

      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }

      const widgetContainer = document.getElementById("gomake-chat-widget");
      if (widgetContainer && widgetContainer.parentNode) {
        widgetContainer.parentNode.removeChild(widgetContainer);
      }

      const widgetElements = document.querySelectorAll(
          '[class*="chat-widget"], [id*="chat-widget"], [class*="gomake-chat"]'
      );
      widgetElements.forEach((element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });

      if (window.GoMakeSupportWidget) {
        delete window.GoMakeSupportWidget;
      }
    };
  }, [apiKey, position, primaryColor, theme, userProfile, callApi]);

  const handleClick = () => {
    if (typeof window !== "undefined" && window.GoMakeSupportWidget) {
      window.GoMakeSupportWidget.open();
      setIsChatOpen(true);
    }
  };

  // if (isChatOpen) {
  //   return null;
  // }

  return (
      <IconButton
          style={{ backgroundColor: "#f6f6f6", padding: "8px" }}
          onClick={handleClick}
      >
        <HeadsetMicOutlinedIcon
            style={{ color: "#2e3092", width: 22, height: 22 }}
        />
      </IconButton>
  );
};

export { GoSupportChatWidget };
