import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { AISidebar } from "../ai-sidebar/ai-sidebar";
import { AIMainPanel } from "../ai-main-panel/ai-main-panel";
import { useStyle } from "./style";
import { useAISocketIO } from "@/hooks/socket-io/use-ai-socket-io";
import { PriceListPageWidget } from "@/pages-components/products/digital-offset-price/digital-offset-price";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";

const GoMakeAIComponent = () => {
  const { classes } = useStyle();
  const router = useRouter();
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [conversationsHistory, setConversationsHistory] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  const hasInitialized = useRef(false);

  // Handle real-time messages from socket
  const handleRealTimeMessage = (message: any) => {
    setChatMessages((prev) => [...prev, message]);

    if (selectedConversation) {
      setSelectedConversation((prev: any) => ({
        ...prev,
        messages: [...(prev?.messages || []), message],
      }));
    }
  };

  const handleProductIdReceived = (productId: string) => {
    setProductId(productId);

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

  const {
    isProcessing,
    sessionId,
    startSession,
    sendMessage,
    getConversationsHistory,
    getConversation,
    setSessionIdManually,
    resetProcessingState,
  } = useAISocketIO(handleRealTimeMessage, handleProductIdReceived);

  // Load conversations history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const conversations = await getConversationsHistory();
        setConversationsHistory(conversations);
        setIsHistoryLoaded(true);
      } catch (error) {
        console.error("Error loading conversations history:", error);
        setIsHistoryLoaded(true); // Set to true even on error to prevent infinite loading
      }
    };
    loadHistory();
  }, []);

  // Initialize only once — handles page load or refresh
  // Wait for both router to be ready AND conversations history to be loaded
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

  // Handle new job creation
  const handleNewJobClick = async () => {
    setChatMessages([]);
    setSelectedConversation(null);
    setProductId(null);
    resetProcessingState();

    try {
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
    } catch (error) {
      console.error("Error starting new session:", error);
    }
  };

  const handleConversationSelect = async (selectedSessionId: string) => {
    try {
      setProductId(null);
      setIsConversationLoading(true);

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

  // Refresh conversation history
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

  if (isInitializing) {
    return (
      <div style={classes.initializationContainer}>
        <div style={classes.initializationCard}>
          <div style={classes.initializationLogo}>
            <div style={classes.initializationSpinner} />
          </div>
          <div style={classes.initializationTitle}>GoMake AI</div>
          <div style={classes.initializationSubtitle}>
            Initializing your intelligent assistant...
          </div>
          <div style={classes.initializationDotsContainer}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  ...classes.initializationDot,
                  animation: `ai-pulse 1.5s infinite ${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={classes.container}>
      <AISidebar
        onNewJobClick={handleNewJobClick}
        conversationsHistory={conversationsHistory}
        onConversationSelect={handleConversationSelect}
        onRefreshHistory={refreshConversationsHistory}
        selectedConversation={selectedConversation}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      <div style={classes.mainContentContainer}>
        <AIMainPanel
          sendMessage={sendMessage}
          isProcessing={isProcessing}
          sessionId={sessionId}
          chatMessages={chatMessages}
          onChatMessagesUpdate={handleChatMessagesUpdate}
          isFullWidth={!productId}
          isLoadingConversation={isConversationLoading}
        />
        {productId && sessionId && (
          <div style={classes.priceWidgetContainer}>
            <PriceListPageWidget
              widgetType={EWidgetProductType.CREATE}
              isMobileScreen={true}
              productId={productId}
              sessionId={sessionId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { GoMakeAIComponent };
