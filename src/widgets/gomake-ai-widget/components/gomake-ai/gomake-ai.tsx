import { useEffect, useState } from "react";
import { AISidebar } from "../ai-sidebar/ai-sidebar";
import { AIMainPanel } from "../ai-main-panel/ai-main-panel";
import { useStyle } from "./style";
import { useAISocketIO } from "@/hooks/socket-io/use-ai-socket-io";

const GoMakeAIComponent = () => {
  const { classes } = useStyle();
  const [jobHistory, setJobHistory] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [conversationsHistory, setConversationsHistory] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  const {
    isProcessing,
    jobResults,
    sessionId,
    startSession,
    sendMessage,
    getConversationsHistory,
    getConversation,
  } = useAISocketIO();

  // Load conversations history when component mounts
  useEffect(() => {
    const loadConversationsHistory = async () => {
      try {
        const conversations = await getConversationsHistory();
        setConversationsHistory(conversations);
        console.log("Loaded conversations history:", conversations);
      } catch (error) {
        console.error("Error loading conversations history:", error);
      }
    };

    loadConversationsHistory();
  }, []);

  // Start session when component mounts (first time loading the page)
  useEffect(() => {
    const initializeSession = async () => {
      try {
        await startSession();
      } catch (error) {
        console.error("Error starting initial session:", error);
      }
    };

    initializeSession();
  }, []);

  const handleNewJobClick = async () => {
    setChatMessages([]); // Clear chat messages for fresh start
    setSelectedConversation(null); // Clear selected conversation

    // Start a new session when clicking + New Job
    try {
      await startSession();
    } catch (error) {
      console.error("Error starting new session:", error);
    }
  };

  // Function to load a specific conversation
  const handleConversationSelect = async (sessionId: string) => {
    try {
      const conversationMessages = await getConversation(sessionId);
      setChatMessages(conversationMessages);
      setSelectedConversation({ sessionId, messages: conversationMessages });
      console.log("Loaded conversation messages:", conversationMessages);
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

  const handleNewJobCreated = (job: any) => {
    setJobHistory((prev) => [job, ...prev]);
  };

  //!here
  const handleChatMessagesUpdate = (messages: any[]) => {
    debugger;
    setChatMessages(messages);
  };

  // Update job history when socket results come in
  useEffect(() => {
    if (jobResults.length > 0) {
      setJobHistory((prev) => [...jobResults, ...prev]);
    }

    debugger;
    const jji = jobHistory;
  }, [jobResults]);

  return (
    <div style={classes.container}>
      <AISidebar
        onNewJobClick={handleNewJobClick}
        conversationsHistory={conversationsHistory}
        onConversationSelect={handleConversationSelect}
        onRefreshHistory={refreshConversationsHistory}
        selectedConversation={selectedConversation}
      />
      <AIMainPanel
        onNewJobCreated={handleNewJobCreated}
        startSession={startSession}
        sendMessage={sendMessage}
        isProcessing={isProcessing}
        sessionId={sessionId}
        chatMessages={chatMessages}
        onChatMessagesUpdate={handleChatMessagesUpdate}
      />
    </div>
  );
};

export { GoMakeAIComponent };
