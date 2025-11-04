import { useGomakeAxios } from "@/hooks/use-gomake-axios";

export interface Ticket {
  id: number;
  ticketId: string;
  status: string;
  username: string;
  printHouseId: string;
  printHouseName: string;
  assignedTo?: string;
  assignedEmployeeId?: number;
  assignedEmployeeName?: string;
  priority: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUserId?: string;
}

export interface CreateTicketRequest {
  title: string;
  description?: string;
  priority: string;
  printHouseId?: string;
  printHouseName?: string;
  createdByUserId?: string;
  username?: string;
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  message: string;
  senderType: 'user' | 'support';
  senderId: string;
  senderName: string;
  senderEmail: string;
  createdAt: string;
}

export const getTickets = async (callApi: any, filters?: any): Promise<Ticket[]> => {
  const params: any = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.priority) params.priority = filters.priority;
  
  const res = await callApi("GET", "/api/tickets", params);
  return res?.data || [];
};

export const getTicketById = async (callApi: any, ticketId: number): Promise<Ticket> => {
  const res = await callApi("GET", `/api/tickets/${ticketId}`);
  return res?.data;
};

export const createTicket = async (callApi: any, ticketData: CreateTicketRequest): Promise<Ticket> => {
  const res = await callApi("POST", "/api/tickets", ticketData);
  return res?.data;
};

export const getTicketMessages = async (callApi: any, ticketId: number): Promise<TicketMessage[]> => {
  const res = await callApi("GET", `/api/tickets/${ticketId}/messages`);
  return res?.data || [];
};

export const addTicketMessage = async (
  callApi: any,
  ticketId: number,
  message: string,
  senderType: 'user' | 'support',
  username?: string
): Promise<TicketMessage> => {
  const res = await callApi("POST", `/api/tickets/${ticketId}/messages`, {
    message,
    senderType,
    username,
  });
  return res?.data;
};

