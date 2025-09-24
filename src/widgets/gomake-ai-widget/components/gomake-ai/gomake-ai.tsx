import { useEffect, useState } from "react";
import { AISidebar } from "../ai-sidebar/ai-sidebar";
import { AIMainPanel } from "../ai-main-panel/ai-main-panel";
import { useStyle } from "./style";
import { useAISocketIO } from "@/hooks/socket-io/use-ai-socket-io";

const GoMakeAIComponent = () => {
  const { classes } = useStyle();
  const [jobHistory, setJobHistory] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const { isProcessing, jobResults, sessionId, startSession, sendMessage } =
    useAISocketIO();

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

    // Start a new session when clicking + New Job
    try {
      await startSession();
    } catch (error) {
      console.error("Error starting new session:", error);
    }
  };

  const handleNewJobCreated = (job: any) => {
    setJobHistory((prev) => [job, ...prev]);
  };

  //!here
  const handleChatMessagesUpdate = (messages: any[]) => {
    setChatMessages(messages);
  };

  // Update job history when socket results come in
  useEffect(() => {
    if (jobResults.length > 0) {
      setJobHistory((prev) => [...jobResults, ...prev]);
    }
  }, [jobResults]);

  return (
    <div style={classes.container}>
      <AISidebar onNewJobClick={handleNewJobClick} jobHistory={jobHistory} />
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
