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
  summary?: string; // AI-generated summary for ticket tabs
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUserId?: string;
  expectedDeliveryDate?: string; // Expected delivery date (ISO string format)
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

export interface FileAttachment {
  id: number;
  messageId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  message: string;
  senderType: "user" | "support";
  senderId: string;
  senderName: string;
  senderEmail: string;
  createdAt: string;
  files?: FileAttachment[];
}

export const getTickets = async (
  callApi: any,
  filters?: any
): Promise<Ticket[]> => {
  const params: any = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.priority) params.priority = filters.priority;

  const res = await callApi("GET", "/api/tickets", params);
  return res?.data || [];
};

export const getTicketById = async (
  callApi: any,
  ticketId: number
): Promise<Ticket> => {
  const res = await callApi("GET", `/api/tickets/${ticketId}`);
  return res?.data;
};

export const createTicket = async (
  callApi: any,
  ticketData: CreateTicketRequest
): Promise<Ticket> => {
  const res = await callApi("POST", "/api/tickets", ticketData);
  return res?.data;
};

export const getTicketMessages = async (
  callApi: any,
  ticketId: number
): Promise<TicketMessage[]> => {
  const res = await callApi("GET", `/api/tickets/${ticketId}/messages`);
  return res?.data || [];
};

export const addTicketMessage = async (
  callApi: any,
  ticketId: number,
  message: string,
  senderType: "user" | "support",
  username?: string
): Promise<TicketMessage> => {
  const res = await callApi("POST", `/api/tickets/${ticketId}/messages`, {
    message,
    senderType,
    username,
  });
  return res?.data;
};

// Notification API functions
export const markTicketAsRead = async (
  callApi: any,
  ticketId: number
): Promise<void> => {
  await callApi("POST", `/api/tickets/${ticketId}/mark-read`, {});
};

export const getUnreadTicketCount = async (callApi: any): Promise<number> => {
  const res = await callApi("GET", "/api/tickets/unread-count");
  return res?.data?.unreadCount || 0;
};

export const getUnreadTicketIds = async (callApi: any): Promise<number[]> => {
  const res = await callApi("GET", "/api/tickets/unread-ids");
  return res?.data?.ticketIds || [];
};

export const getFirstUnreadTicketId = async (
  callApi: any
): Promise<number | null> => {
  const res = await callApi("GET", "/api/tickets/first-unread");
  return res?.data?.ticketId || null;
};

// File upload API functions
export const uploadFileToMessage = async (
  callApi: any,
  ticketId: number,
  messageId: number,
  file: File,
  onProgress?: (progress: number) => void
): Promise<FileAttachment> => {
  const axios = require("axios");
  const config = require("@/config").default;
  const { getUserToken } = require("@/services/storage-data");
  const { uploadFileResumable } = require("@/utils/resumable-upload");

  const userToken = getUserToken();
  const baseUrl = `${config.api_server}/api/tickets/${ticketId}/messages/${messageId}/files`;

  try {
    // Step 1: Request resumable upload URL from backend
    const urlResponse = await axios.post(
      `${baseUrl}/resumable-url`,
      {
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileSize: file.size,
      },
      {
        headers: {
          ...(userToken && { Authorization: `Bearer ${userToken}` }),
          "project-name": "business-dashboard",
          lang: "en",
          domain: "",
        },
      }
    );

    const { sessionUri, filePath, origin } = urlResponse.data;

    // Step 2: Upload file directly to Google Cloud Storage using resumable upload
    const uploadResult = await uploadFileResumable({
      sessionUri,
      file,
      onProgress,
      chunkSize: 8 * 1024 * 1024, // 8 MiB chunks
      origin, // Pass origin for CORS
    });

    if (!uploadResult.success) {
      throw new Error(uploadResult.error || "Upload failed");
    }

    // Step 3: Confirm upload completion with backend
    const confirmResponse = await axios.post(
      `${baseUrl}/confirm`,
      { filePath },
      {
        headers: {
          ...(userToken && { Authorization: `Bearer ${userToken}` }),
          "project-name": "business-dashboard",
          lang: "en",
          domain: "",
        },
      }
    );

    return confirmResponse.data;
  } catch (error: any) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
