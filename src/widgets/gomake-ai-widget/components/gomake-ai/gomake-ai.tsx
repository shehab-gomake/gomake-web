import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { AISidebar } from "../ai-sidebar/ai-sidebar";
import { AIMainPanel } from "../ai-main-panel/ai-main-panel";
import { useStyle } from "./style";
import { useAISocketIO } from "@/hooks/socket-io/use-ai-socket-io";
import { PriceListPageWidget } from "@/pages-components/products/digital-offset-price/digital-offset-price";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";
import { LandingModal } from "../landing-modal/landing-modal";
import { getUserToken, updateTokenStorage } from "@/services/storage-data";
import { useGomakeAxios } from "@/hooks";
import {
  createGuestUserForGomakeAIApi,
  validateGoAiVerificationCodeApi,
} from "@/services/api-service/customers/employees-api";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"; // ✅ toggle icon
import MenuIcon from "@mui/icons-material/Menu"; // ✅ hamburger menu
import { IconButton } from "@mui/material"; // ✅ icon buttons
import { useIsMobile } from "@/hooks/use-responsive";

const GoMakeAIComponent = () => {
  const { classes } = useStyle();
  const router = useRouter();
  const { callApi } = useGomakeAxios();
  const isMobile = useIsMobile(); // ✅
  const [isChatView, setIsChatView] = useState(true); // ✅ controls which panel is visible
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ Start closed on mobile to show chat

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [conversationsHistory, setConversationsHistory] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const [productUpdateVersion, setProductUpdateVersion] = useState(0);
  const hasInitialized = useRef(false);
  const [interactionId, setInteractionId] = useState("");
  const [showLandingModal, setShowLandingModal] = useState(false);
  const [onboardingData, setOnboardingData] = useState<{
    email: string;
    country: string;
    userId?: string;
  } | null>(null);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [isFabAnimating, setIsFabAnimating] = useState(true); // ✅ Track FAB animation state

  const handleRealTimeMessage = (message: any) => {
    setChatMessages((prev) => [...prev, message]);

    if (selectedConversation) {
      setSelectedConversation((prev: any) => ({
        ...prev,
        messages: [...(prev?.messages || []), message],
      }));
    }

    // // ✅ Update conversation history to reflect latest message
    // setConversationsHistory((prev) =>
    //   prev.map((conv) =>
    //     conv.sessionId === sessionId
    //       ? {
    //           ...conv,
    //           lastMessage: message.message,
    //           timestamp: message.timestamp,
    //         }
    //       : conv
    //   )
    // );
  };

  const handleProductIdReceived = (productId: string) => {
    setProductId(productId);
    setIsFabAnimating(true); // ✅ Restart animation when new product is created

    if (selectedConversation) {
      setSelectedConversation((prev) => ({
        ...prev,
        productId,
      }));
    }

    setConversationsHistory((prev) =>
      prev.map((conv) =>
        conv.sessionId === sessionId ? { ...conv, productId } : conv
      )
    );
  };

  const handleProductUpdated = (interactionId: string) => {
    setInteractionId(interactionId);
    setProductUpdateVersion((prev) => prev + 1);
  };

  const {
    isProcessing,
    sessionId,
    startSession,
    sendMessage,
    getConversationsHistory,
    getConversation,
    setSessionIdManually,
    resetProcessingState,
  } = useAISocketIO(
    handleRealTimeMessage,
    handleProductIdReceived,
    handleProductUpdated
  );

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const conversations = await getConversationsHistory();
        setConversationsHistory(conversations);
        setIsHistoryLoaded(true);
      } catch (error) {
        console.error("Error loading conversations history:", error);
        setIsHistoryLoaded(true);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.token) {
      const token = router.query.token as string;
      updateTokenStorage(token);

      const { token: _, ...restQuery } = router.query;
      router.replace(
        {
          pathname: router.pathname,
          query: restQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router.isReady, router.query.token]);

  useEffect(() => {
    if (router.isReady) {
      const hasToken = !!getUserToken();
      if (!hasToken) {
        setShowLandingModal(true);
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!router.isReady || !isHistoryLoaded || hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeSession = async () => {
      try {
        setProductId(null);
        const { sessionId: urlSessionId } = router.query;

        if (urlSessionId && typeof urlSessionId === "string") {
          const messages = await getConversation(urlSessionId);
          setChatMessages(messages);

          const convFromHistory = conversationsHistory.find(
            (conv) => conv.sessionId === urlSessionId
          );

          setSelectedConversation({
            sessionId: urlSessionId,
            messages,
            productId: convFromHistory?.productId || null,
          });

          if (convFromHistory?.productId) {
            setProductId(convFromHistory.productId);
          }

          setSessionIdManually(urlSessionId);
        } else {
          const newSession = await startSession();
          if (newSession?.sessionId) {
            router.replace(
              {
                pathname: router.pathname,
                query: { ...router.query, sessionId: newSession.sessionId },
              },
              undefined,
              { shallow: true }
            );
          }
        }
      } catch (error) {
        console.error("Error initializing session:", error);
        try {
          await startSession();
        } catch (fallbackError) {
          console.error("Fallback session start failed:", fallbackError);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
  }, [router.isReady, isHistoryLoaded]);

  const handleNewJobClick = async () => {
    setChatMessages([]);
    setSelectedConversation(null);
    setProductId(null);
    resetProcessingState();

    // ✅ Close sidebar on mobile when new job is clicked
    if (isMobile) {
      setIsSidebarOpen(false);
    }

    try {
      const newSession = await startSession();
      if (newSession?.sessionId) {
        // ✅ Refresh conversation history to include the new session
        await refreshConversationsHistory();

        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, sessionId: newSession.sessionId },
          },
          undefined,
          { shallow: true }
        );
      }
    } catch (error) {
      console.error("Error starting new session:", error);
    }
  };

  const handleConversationSelect = async (selectedSessionId: string) => {
    try {
      setProductId(null);
      setIsConversationLoading(true);

      // ✅ Close sidebar on mobile when conversation is selected
      if (isMobile) {
        setIsSidebarOpen(false);
      }

      const messages = await getConversation(selectedSessionId);
      setChatMessages(messages);
      setSessionIdManually(selectedSessionId);

      const convFromHistory = conversationsHistory.find(
        (conv) => conv.sessionId === selectedSessionId
      );

      setSelectedConversation({
        sessionId: selectedSessionId,
        messages,
        productId: convFromHistory?.productId || null,
      });

      if (convFromHistory?.productId) {
        setProductId(convFromHistory.productId);
      } else {
        setProductId(null);
      }

      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, sessionId: selectedSessionId },
        },
        undefined,
        { shallow: true }
      );
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setIsConversationLoading(false);
    }
  };

  const refreshConversationsHistory = async () => {
    try {
      const conversations = await getConversationsHistory();
      setConversationsHistory(conversations);
    } catch (error) {
      console.error("Error refreshing conversations history:", error);
    }
  };

  const handleChatMessagesUpdate = (messages: any[]) => {
    setChatMessages(messages);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleLandingModalClose = () => {};

  const handleLandingModalContinue = async (email: string, country: string) => {
    try {
      const callBack = (res: any) => {
        if (res.success) {
          const {
            email: returnedEmail,
            country: returnedCountry,
            userId,
          } = res?.data || {};

          // Store the data for verification step
          setOnboardingData({
            email: returnedEmail || email,
            country: returnedCountry || country,
            userId,
          });

          // Switch to verification step
          setIsVerificationStep(true);
        }
      };

      await createGuestUserForGomakeAIApi(callApi, callBack, {
        email,
        country,
      });
    } catch (error) {
      console.error("Error creating guest user:", error);
    }
  };

  const handleVerificationCodeSubmit = async (code: string) => {
    try {
      if (!onboardingData) return;

      const callBack = (res: any) => {
        if (res.success) {
          const redirectUrl = res?.data?.redirectUrl;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        }
      };

      await validateGoAiVerificationCodeApi(callApi, callBack, {
        email: onboardingData.email,
        country: onboardingData.country,
        userId: onboardingData.userId,
        code,
      });
    } catch (error) {
      console.error("Error validating verification code:", error);
    }
  };

  if (isInitializing) {
    return (
      <div style={classes.initializationContainer}>
        <div
          style={{
            ...classes.initializationCard,
            ...(isMobile ? classes.initializationCardMobile : {}),
          }}
        >
          <div
            style={{
              ...classes.initializationLogo,
              ...(isMobile ? classes.initializationLogoMobile : {}),
            }}
          >
            <div
              style={{
                ...classes.initializationSpinner,
                ...(isMobile ? classes.initializationSpinnerMobile : {}),
              }}
            />
          </div>
          <div
            style={{
              ...classes.initializationTitle,
              ...(isMobile ? classes.initializationTitleMobile : {}),
            }}
          >
            GoMake AI
          </div>
          <div
            style={{
              ...classes.initializationSubtitle,
              ...(isMobile ? classes.initializationSubtitleMobile : {}),
            }}
          >
            Initializing your intelligent assistant...
          </div>
          <div style={classes.initializationDotsContainer}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  ...classes.initializationDot,
                  ...(isMobile ? classes.initializationDotMobile : {}),
                  animation: `ai-pulse 1.5s infinite ${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const showFab = isMobile && !!productId && !!sessionId;

  return (
    <div style={classes.container}>
      {/* ✅ Backdrop for mobile sidebar */}
      {isMobile && isSidebarOpen && (
        <div style={classes.backdrop} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ✅ Sidebar wrapper with mobile drawer support */}
      {(!isMobile || isSidebarOpen) && (
        <div
          style={
            isMobile ? classes.sidebarWrapperMobile : classes.sidebarWrapper
          }
        >
          <AISidebar
            onNewJobClick={handleNewJobClick}
            conversationsHistory={conversationsHistory}
            onConversationSelect={handleConversationSelect}
            onRefreshHistory={refreshConversationsHistory}
            selectedConversation={selectedConversation}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            onClose={isMobile ? () => setIsSidebarOpen(false) : undefined}
          />
        </div>
      )}

      {/* ✅ Menu button to open sidebar on mobile - hide when viewing price */}
      {isMobile && !isSidebarOpen && isChatView && (
        <IconButton
          onClick={() => setIsSidebarOpen(true)}
          style={classes.menuButton}
        >
          <MenuIcon style={{ color: "#9333ea" }} />
        </IconButton>
      )}

      <div style={classes.mainContentContainer}>
        {/* Chat panel */}
        <div
          style={{
            flex: 1,
            transition: "all 0.3s ease",
            transform: isMobile
              ? isChatView
                ? "translateX(0)"
                : "translateX(-100%)"
              : "none",
            opacity: isMobile && !isChatView ? 0 : 1,
            display: isMobile && !isChatView ? "none" : "flex",
          }}
        >
          <AIMainPanel
            sendMessage={sendMessage}
            isProcessing={isProcessing}
            sessionId={sessionId}
            chatMessages={chatMessages}
            onChatMessagesUpdate={handleChatMessagesUpdate}
            isFullWidth={isMobile || !productId}
            isLoadingConversation={isConversationLoading}
          />
        </div>

        {/* Price panel */}
        {productId && sessionId && (
          <div
            style={{
              flex: 1,
              transition: "all 0.3s ease",
              transform: isMobile
                ? isChatView
                  ? "translateX(100%)"
                  : "translateX(0)"
                : "none",
              opacity: isMobile && isChatView ? 0 : 1,
              display: isMobile && isChatView ? "none" : "flex",
            }}
          >
            <div
              style={{
                ...classes.priceWidgetContainer,
                ...(isMobile ? { width: "100%", maxWidth: "100%" } : {}),
              }}
            >
              <PriceListPageWidget
                key={productUpdateVersion}
                widgetType={EWidgetProductType.CREATE}
                isMobileScreen={true}
                productId={productId}
                sessionId={sessionId}
                interactionId={interactionId}
              />
            </div>
          </div>
        )}
      </div>

      {/* ✅ Floating Toggle FAB */}
      {showFab && (
        <IconButton
          onClick={() => {
            setIsChatView((prev) => !prev);
            setIsFabAnimating(false); // ✅ Stop animation on click
          }}
          className={isFabAnimating ? "ai-fab-toggle" : ""}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 100,
            backgroundColor: "#FFF",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            width: 42,
            height: 42,
          }}
        >
          <SwapHorizIcon style={{ color: "#9333ea", fontSize: 24 }} />
        </IconButton>
      )}

      <LandingModal
        open={showLandingModal}
        onClose={handleLandingModalClose}
        onContinue={handleLandingModalContinue}
        isVerificationStep={isVerificationStep}
        onVerifyCode={handleVerificationCodeSubmit}
        userEmail={onboardingData?.email}
      />
    </div>
  );
};

export { GoMakeAIComponent };
