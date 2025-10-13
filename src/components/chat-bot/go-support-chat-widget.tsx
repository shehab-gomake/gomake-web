import { useEffect, useState } from "react";
import { getGoSupportUserTokenApi } from "@/services/api-service/support/support-endpoints";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const apiKey =
    "54cf7618c497b6d1f1f3938a5ca39c5dc58c61135453361f90d742c6a789c7f0";
  const [userToken, setUserToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const userProfile = useRecoilValue(userProfileState);
  const { callApi } = useGomakeAxios();

  // Hide widget on specific pages where it might interfere with the UI
  const hiddenPages = ["/gomake-ai"];
  const shouldHideWidget = hiddenPages.includes(router.pathname);

  useEffect(() => {
    // Don't load widget if it should be hidden
    if (shouldHideWidget) {
      setIsLoading(false);
      return;
    }

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
      script.onload = () => {
        setIsLoading(false);
      };
      script.onerror = () => {
        setError("Failed to load chat widget script");
        setIsLoading(false);
      };

      document.body.appendChild(script);
    };

    loadChatWidget();
  }, [
    apiKey,
    position,
    primaryColor,
    theme,
    userProfile,
    callApi,
    shouldHideWidget,
  ]);

  // Don't render anything visible - the widget will be injected by the script
  // Hide widget on specific pages
  if (shouldHideWidget) {
    return null;
  }

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
