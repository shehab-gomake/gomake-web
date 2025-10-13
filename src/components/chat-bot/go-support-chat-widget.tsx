import { useEffect, useState } from "react";
import { getGoSupportUserTokenApi } from "@/services/api-service/support/support-endpoints";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";

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
  const apiKey =
    "54cf7618c497b6d1f1f3938a5ca39c5dc58c61135453361f90d742c6a789c7f0";
  const [userToken, setUserToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const userProfile = useRecoilValue(userProfileState);
  const { callApi } = useGomakeAxios();

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;

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
      // Configure the chat widget
      (window as any).GoMakeChat = (window as any).GoMakeChat || {};
      (window as any).GoMakeChat.config = {
        apiKey: apiKey,
        position: position,
        userToken: token,
        primaryColor: primaryColor,
        theme: theme,
        user: {
          id: userProfile?.userId || "",
          name: `${userProfile?.firstName || ""} ${
            userProfile?.lastName || ""
          }`.trim(),
          email: userProfile?.email || "",
          avatar: userProfile?.imagePath || userProfile?.avatarInitials || "",
        },
      };

      // Load the chat widget script
      const script = document.createElement("script");
      script.src =
        "https://know-base-qassamat.replit.app/public/chat-widget.js";
      script.async = true;
      script.id = "gomake-chat-widget-script";
      script.onload = () => {
        setIsLoading(false);
      };
      script.onerror = () => {
        setError("Failed to load chat widget script");
        setIsLoading(false);
      };

      document.body.appendChild(script);
      scriptElement = script;
    };

    loadChatWidget();

    // Cleanup function
    return () => {
      // Remove the script element
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }

      // Remove widget DOM elements that the script may have created
      const widgetContainer = document.getElementById("gomake-chat-widget");
      if (widgetContainer && widgetContainer.parentNode) {
        widgetContainer.parentNode.removeChild(widgetContainer);
      }

      // Remove any other widget-related elements (button, iframe, etc.)
      const widgetElements = document.querySelectorAll(
        '[class*="chat-widget"], [id*="chat-widget"], [class*="gomake-chat"]'
      );
      widgetElements.forEach((element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });

      // Clean up global config
      if ((window as any).GoMakeChat) {
        delete (window as any).GoMakeChat;
      }
    };
  }, [apiKey, position, primaryColor, theme, userProfile, callApi]);

  // Don't render anything visible - the widget will be injected by the script
  if (isLoading) {
    return null; // You could show a loading indicator here if needed
  }

  if (error) {
    console.error("GoSupport Chat Widget Error:", error);
    return null; // You could show an error message here if needed
  }

  return null;
};

export { GoSupportChatWidget };
