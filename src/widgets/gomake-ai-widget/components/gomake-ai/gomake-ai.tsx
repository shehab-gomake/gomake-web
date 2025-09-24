import React, { useState } from "react";
import { AISidebar } from "../ai-sidebar/ai-sidebar";
import { AIMainPanel } from "../ai-main-panel/ai-main-panel";
import { useStyle } from "./style";
import { useAISocketIO } from "@/hooks/socket-io/use-ai-socket-io";

const GoMakeAIComponent = () => {
  const { classes } = useStyle();
  const [selectedTab, setSelectedTab] = useState<"new-job">("new-job");
  const [jobHistory, setJobHistory] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  // Initialize socket connection for AI functionality
  const { isProcessing, jobResults, sendAIJob, sendAIChatMessage } =
    useAISocketIO();

  const handleNewJobClick = () => {
    setSelectedTab("new-job");
    setChatMessages([]); // Clear chat messages for fresh start
  };

  const handleJobHistoryClick = () => {
    // This could open a modal or navigate to a separate page
    console.log("Job History clicked");
  };

  const handleNewJobCreated = (job: any) => {
    setJobHistory((prev) => [job, ...prev]);
  };

  const handleChatMessagesUpdate = (messages: any[]) => {
    setChatMessages(messages);
  };

  // Update job history when socket results come in
  React.useEffect(() => {
    if (jobResults.length > 0) {
      setJobHistory((prev) => [...jobResults, ...prev]);
    }
  }, [jobResults]);

  return (
    <div style={classes.container}>
      <AISidebar
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        onNewJobClick={handleNewJobClick}
        onJobHistoryClick={handleJobHistoryClick}
        jobHistory={jobHistory}
      />
      <AIMainPanel
        selectedTab={selectedTab}
        onNewJobCreated={handleNewJobCreated}
        sendAIJob={sendAIJob}
        sendAIChatMessage={sendAIChatMessage}
        isProcessing={isProcessing}
        chatMessages={chatMessages}
        onChatMessagesUpdate={handleChatMessagesUpdate}
      />
    </div>
  );
};

export { GoMakeAIComponent };
