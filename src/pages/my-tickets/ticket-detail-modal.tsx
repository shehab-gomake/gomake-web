import { useEffect, useState } from "react";
import { GoMakeModal } from "@/components";
import { useTranslation } from "react-i18next";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Ticket, TicketMessage } from "@/services/api-service/tickets/tickets-api";
import {
  getTicketMessages,
  addTicketMessage,
} from "@/services/api-service/tickets/tickets-api";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useRecoilValue } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import { userProfileState } from "@/store/user-profile";

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const TicketDetailModal = ({
  ticket,
  isOpen,
  onClose,
  onUpdate,
}: TicketDetailModalProps) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const printHouse = useRecoilValue(printHouseProfile);
  const userProfile = useRecoilValue(userProfileState);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ticket && isOpen) {
      fetchMessages();
    }
  }, [ticket, isOpen]);

  const fetchMessages = async () => {
    if (!ticket) return;
    try {
      setLoading(true);
      const data = await getTicketMessages(callApi, ticket.id!);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!ticket || !newMessage.trim()) return;
    try {
      setSubmitting(true);
      
      // Get username from userProfile (firstName + lastName) or fallback to email
      const username = userProfile?.firstName && userProfile?.lastName
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : userProfile?.email || "Unknown";
      
      await addTicketMessage(callApi, ticket.id!, newMessage.trim(), "user", username);
      setNewMessage("");
      await fetchMessages();
      onUpdate();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSendMessage();
    }
  };

  if (!ticket) return null;

  const statusColors: Record<string, string> = {
    open: "#4CAF50",
    in_progress: "#2196F3",
    resolved: "#FF9800",
    closed: "#9E9E9E",
  };

  const priorityColors: Record<string, string> = {
    low: "#9E9E9E",
    medium: "#FFC107",
    high: "#FF9800",
    urgent: "#F44336",
  };

  return (
    <GoMakeModal
      openModal={isOpen}
      modalTitle={`${t("tickets.conversationWithSupport")} - ${ticket.ticketId}`}
      onClose={onClose}
      insideStyle={{ width: 900, maxHeight: "85vh" }}
    >
      <Stack direction="column" spacing={3} sx={{ padding: "20px" }}>
        {/* Ticket Info Header */}
        <Stack direction="column" spacing={1} sx={{ borderBottom: "2px solid #e0e0e0", paddingBottom: "15px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>{ticket.title}</h2>
          <Stack direction="row" spacing={2} alignItems="center">
            <span
              style={{
                padding: "6px 16px",
                borderRadius: "16px",
                backgroundColor: statusColors[ticket.status] || "#9E9E9E",
                color: "white",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {ticket.status.toUpperCase()}
            </span>
            <span
              style={{
                padding: "6px 16px",
                borderRadius: "16px",
                backgroundColor: priorityColors[ticket.priority] || "#9E9E9E",
                color: "white",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {ticket.priority.toUpperCase()}
            </span>
            {ticket.assignedEmployeeName && (
              <span style={{ fontSize: "14px", color: "#666" }}>
                {t("tickets.assignedTo")}: <strong>{ticket.assignedEmployeeName}</strong>
              </span>
            )}
          </Stack>
          {ticket.description && (
            <p style={{ marginTop: "8px", marginBottom: 0, color: "#555", fontSize: "14px" }}>
              {ticket.description}
            </p>
          )}
        </Stack>

        {/* Conversation Section */}
        <Stack direction="column" spacing={2} sx={{ flex: 1, minHeight: "300px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
            {t("tickets.conversation")}
          </h3>
          {loading ? (
            <Stack justifyContent="center" alignItems="center" sx={{ py: 4 }}>
              <p>{t("tickets.loading")}</p>
            </Stack>
          ) : messages.length === 0 ? (
            <Stack justifyContent="center" alignItems="center" sx={{ py: 4, border: "2px dashed #e0e0e0", borderRadius: "8px" }}>
              <p style={{ color: "#999", margin: 0 }}>{t("tickets.noMessages")}</p>
              <p style={{ color: "#999", fontSize: "12px", margin: "8px 0 0 0" }}>
                {t("tickets.startConversationHint")}
              </p>
            </Stack>
          ) : (
            <Stack 
              direction="column" 
              spacing={2} 
              sx={{ 
                maxHeight: "400px", 
                overflowY: "auto",
                padding: "10px",
                backgroundColor: "#FAFAFA",
                borderRadius: "8px",
              }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: message.senderType === "user" ? "#E3F2FD" : "#FFF",
                    borderRadius: "12px",
                    alignSelf: message.senderType === "user" ? "flex-end" : "flex-start",
                    maxWidth: "75%",
                    border: message.senderType === "user" ? "1px solid #90CAF9" : "1px solid #E0E0E0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: "6px", fontSize: "14px", color: "#1976d2" }}>
                    {message.senderType === "user" ? "You" : message.senderName}
                  </div>
                  <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#333", whiteSpace: "pre-wrap" }}>
                    {message.message}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#999",
                      marginTop: "8px",
                    }}
                  >
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </Stack>
          )}
        </Stack>

        {/* Reply Form */}
        <Stack direction="column" spacing={1} sx={{ borderTop: "2px solid #e0e0e0", paddingTop: "15px" }}>
          <TextField
            multiline
            rows={3}
            placeholder={t("tickets.typeMessage")}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
            helperText={t("tickets.pressCtrlEnterToSend")}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onClose}
            >
              {t("materials.buttons.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || submitting}
              sx={{ minWidth: "120px" }}
            >
              {submitting ? t("tickets.sending") : t("tickets.sendReply")}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

