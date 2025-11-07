import { createContext, useContext, useState, ReactNode } from "react";

interface TicketChatbotContextType {
  isOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
}

const TicketChatbotContext = createContext<TicketChatbotContextType | undefined>(
  undefined
);

export const TicketChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openChatbot = () => setIsOpen(true);
  const closeChatbot = () => setIsOpen(false);
  const toggleChatbot = () => setIsOpen((prev) => !prev);

  return (
    <TicketChatbotContext.Provider
      value={{ isOpen, openChatbot, closeChatbot, toggleChatbot }}
    >
      {children}
    </TicketChatbotContext.Provider>
  );
};

export const useTicketChatbot = () => {
  const context = useContext(TicketChatbotContext);
  if (!context) {
    // During SSR, provide a default context to prevent errors
    if (typeof window === 'undefined') {
      return {
        isOpen: false,
        openChatbot: () => {},
        closeChatbot: () => {},
        toggleChatbot: () => {},
      };
    }
    throw new Error(
      "useTicketChatbot must be used within TicketChatbotProvider"
    );
  }
  return context;
};

