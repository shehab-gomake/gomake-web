import { createContext, useContext, useState, ReactNode, useRef } from "react";

interface TicketChatbotContextType {
  isOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
  navigateToTicket: (ticketId: number) => void;
  setNavigateToTicketCallback: (callback: (ticketId: number) => void) => void;
}

const TicketChatbotContext = createContext<TicketChatbotContextType | undefined>(
  undefined
);

export const TicketChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigateCallbackRef = useRef<((ticketId: number) => void) | null>(null);

  const openChatbot = () => setIsOpen(true);
  const closeChatbot = () => setIsOpen(false);
  const toggleChatbot = () => setIsOpen((prev) => !prev);
  
  const navigateToTicket = (ticketId: number) => {
    setIsOpen(true);
    if (navigateCallbackRef.current) {
      navigateCallbackRef.current(ticketId);
    }
  };

  const setNavigateToTicketCallback = (callback: (ticketId: number) => void) => {
    navigateCallbackRef.current = callback;
  };

  return (
    <TicketChatbotContext.Provider
      value={{ 
        isOpen, 
        openChatbot, 
        closeChatbot, 
        toggleChatbot,
        navigateToTicket,
        setNavigateToTicketCallback,
      }}
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
        navigateToTicket: () => {},
        setNavigateToTicketCallback: () => {},
      };
    }
    throw new Error(
      "useTicketChatbot must be used within TicketChatbotProvider"
    );
  }
  return context;
};

