import { useEffect, useState } from "react";
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

  // Handle real-time messages from socket
  const handleRealTimeMessage = (message: any) => {
    // Add the new message to chat messages
    setChatMessages((prev) => [...prev, message]);

    // If we're viewing a conversation, update it as well
    if (selectedConversation) {
      setSelectedConversation((prev: any) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    }
  };

  const handleProductIdReceived = (productId: string) => {
    setProductId(productId);

    // Update the current conversation with the productId
    if (selectedConversation) {
      setSelectedConversation((prev) => ({
        ...prev,
        productId: productId,
      }));
    }

    // Update the conversation in the history list //!here not sure
    setConversationsHistory((prev) =>
      prev.map((conv) =>
        conv.sessionId === sessionId ? { ...conv, productId: productId } : conv
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

  // Load conversations history when component mounts
  useEffect(() => {
    const loadConversationsHistory = async () => {
      try {
        const conversations = await getConversationsHistory();

        // For now, just set all conversations without filtering to avoid too many API calls
        // The backend should ideally return only non-empty conversations
        setConversationsHistory(conversations);
        console.log("Loaded conversations history:", conversations);
      } catch (error) {
        console.error("Error loading conversations history:", error);
      }
    };

    loadConversationsHistory();
  }, []);

  // Handle URL parameters and initialize session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setProductId(null); // Reset productId when initializing session
        // Check if there's a sessionId in the URL
        const { sessionId: urlSessionId } = router.query;

        if (urlSessionId && typeof urlSessionId === "string") {
          // Load the conversation from URL (without updating URL again)
          const conversationMessages = await getConversation(urlSessionId);
          setChatMessages(conversationMessages);

          // Find the conversation in history to get productId //!here not sure
          const conversationFromHistory = conversationsHistory.find(
            (conv) => conv.sessionId === urlSessionId
          );

          setSelectedConversation({
            sessionId: urlSessionId,
            messages: conversationMessages,
            productId: conversationFromHistory?.productId || null, //!here not sure
          });

          // Update productId if found in conversation history //!here not sure
          if (conversationFromHistory?.productId) {
            setProductId(conversationFromHistory.productId);
          }

          setSessionIdManually(urlSessionId);
        } else {
          // Start a new session if no URL parameter
          const newSession = await startSession();

          // Update URL with the new session ID
          if (newSession?.sessionId) {
            router.push(
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
        // Fallback to starting a new session
        try {
          await startSession();
        } catch (fallbackError) {
          console.error("Error starting fallback session:", fallbackError);
        }
      }
    };
    // Only initialize when router is ready
    if (router.isReady) {
      initializeSession();
    }
  }, [router.isReady, router.query.sessionId]);

  const handleNewJobClick = async () => {
    setChatMessages([]); // Clear chat messages for fresh start
    setSelectedConversation(null); // Clear selected conversation
    setProductId(null); // Reset productId to hide pricing widget
    resetProcessingState(); // Reset AI thinking indicator immediately

    // Start a new session when clicking + New Job
    try {
      const newSession = await startSession();

      // Update URL with the new session ID
      if (newSession?.sessionId) {
        router.push(
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

  // Function to load a specific conversation
  const handleConversationSelect = async (selectedSessionId: string) => {
    try {
      // Find the conversation in history to get productId
      const conversationFromHistory = conversationsHistory.find(
        (conv) => conv.sessionId === selectedSessionId
      );

      // Set productId based on conversation history
      if (conversationFromHistory?.productId) {
        setProductId(conversationFromHistory.productId);
      } else {
        setProductId(null); // Reset if no productId found
      }

      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, sessionId: selectedSessionId },
        },
        undefined,
        { shallow: true }
      );
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  // Function to refresh conversations history
  const refreshConversationsHistory = async () => {
    try {
      const conversations = await getConversationsHistory();

      setConversationsHistory(conversations);
      console.log("Refreshed conversations history:", conversations);
    } catch (error) {
      console.error("Error refreshing conversations history:", error);
    }
  };

  const handleChatMessagesUpdate = (messages: any[]) => {
    setChatMessages(messages);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

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
        />
        {productId && (
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
