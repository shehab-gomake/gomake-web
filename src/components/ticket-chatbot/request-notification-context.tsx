import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Ticket } from "@/services/api-service/tickets/tickets-api";

export interface RemoteSessionRequestNotification {
  type: "remote_session";
  ticketId: number;
  requestedBy: string;
  sessionId: string;
  ticket?: Ticket;
}

export interface HuddleRequestNotification {
  type: "huddle";
  ticketId: number;
  requestedBy: string;
  sessionId: string;
  ticket?: Ticket;
}

export type RequestNotification = RemoteSessionRequestNotification | HuddleRequestNotification;

interface AcceptedRequest {
  ticketId: number;
  type: "remote_session" | "huddle";
  sessionId: string;
  requestedBy: string;
}

interface RequestNotificationContextType {
  currentRequest: RequestNotification | null;
  showRequest: (request: RequestNotification) => void;
  dismissRequest: () => void;
  acceptedRequests: Map<number, AcceptedRequest>;
  addAcceptedRequest: (request: AcceptedRequest) => void;
  removeAcceptedRequest: (ticketId: number) => void;
  getAcceptedRequest: (ticketId: number) => AcceptedRequest | undefined;
}

const RequestNotificationContext = createContext<RequestNotificationContextType | undefined>(
  undefined
);

export const RequestNotificationProvider = ({ children }: { children: ReactNode }) => {
  const [currentRequest, setCurrentRequest] = useState<RequestNotification | null>(null);
  const [acceptedRequests, setAcceptedRequests] = useState<Map<number, AcceptedRequest>>(new Map());

  const showRequest = useCallback((request: RequestNotification) => {
    setCurrentRequest(request);
  }, []);

  const dismissRequest = useCallback(() => {
    setCurrentRequest(null);
  }, []);

  const addAcceptedRequest = useCallback((request: AcceptedRequest) => {
    setAcceptedRequests(prev => {
      const newMap = new Map(prev);
      newMap.set(request.ticketId, request);
      return newMap;
    });
  }, []);

  const removeAcceptedRequest = useCallback((ticketId: number) => {
    setAcceptedRequests(prev => {
      const newMap = new Map(prev);
      newMap.delete(ticketId);
      return newMap;
    });
  }, []);

  const getAcceptedRequest = useCallback((ticketId: number) => {
    return acceptedRequests.get(ticketId);
  }, [acceptedRequests]);

  return (
    <RequestNotificationContext.Provider
      value={{ 
        currentRequest, 
        showRequest, 
        dismissRequest,
        acceptedRequests,
        addAcceptedRequest,
        removeAcceptedRequest,
        getAcceptedRequest,
      }}
    >
      {children}
    </RequestNotificationContext.Provider>
  );
};

export const useRequestNotification = () => {
  const context = useContext(RequestNotificationContext);
  if (!context) {
    // During SSR, provide a default context to prevent errors
    if (typeof window === 'undefined') {
      return {
        currentRequest: null,
        showRequest: () => {},
        dismissRequest: () => {},
        acceptedRequests: new Map(),
        addAcceptedRequest: () => {},
        removeAcceptedRequest: () => {},
        getAcceptedRequest: () => undefined,
      };
    }
    throw new Error(
      "useRequestNotification must be used within RequestNotificationProvider"
    );
  }
  return context;
};

