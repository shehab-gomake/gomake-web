import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import { useRequestNotification } from "./request-notification-context";
import { useTicketChatbot } from "./ticket-chatbot-context";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useCallback, useState } from "react";
import { playNotificationSound } from "./play-notification-sound";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import io, { Socket } from "socket.io-client";
import config from "@/config";

export const RequestNotificationModal = () => {
  const { currentRequest, dismissRequest, addAcceptedRequest } =
    useRequestNotification();
  const { navigateToTicket } = useTicketChatbot();
  const { callApi } = useGomakeAxios();
  const userProfile = useRecoilValue(userProfileState);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = useCallback(async () => {
    if (!currentRequest) return;

    setIsAccepting(true);
    try {
      const userId = userProfile?.userId || userProfile?.id || "";

      // Accept the request via API/Socket.IO
      if (currentRequest.type === "remote_session") {
        // Emit response via Socket.IO
        const socket: Socket = io(config.api_server, {
          transports: ["websocket", "polling"],
        });

        socket.on("connect", () => {
          socket.emit(
            `ticket:${currentRequest.ticketId}:remote_session_response`,
            {
              ticketId: currentRequest.ticketId,
              sessionId: currentRequest.sessionId,
              accepted: true,
              userId,
            }
          );
          socket.disconnect();
        });

        // Store accepted request so sidebar can pick it up
        addAcceptedRequest({
          ticketId: currentRequest.ticketId,
          type: "remote_session",
          sessionId: currentRequest.sessionId,
          requestedBy: currentRequest.requestedBy,
        });
      } else if (currentRequest.type === "huddle") {
        // Send huddle response via API
        try {
          await callApi(
            "POST",
            `/api/tickets/${currentRequest.ticketId}/huddle-response`,
            {
              ticketId: currentRequest.ticketId,
              sessionId: currentRequest.sessionId,
              accepted: true,
              userId,
            }
          );
          console.log("✅ Huddle response sent via API from modal");
        } catch (error) {
          console.error("Error sending huddle response:", error);
        }

        // Store accepted request so sidebar can pick it up
        addAcceptedRequest({
          ticketId: currentRequest.ticketId,
          type: "huddle",
          sessionId: currentRequest.sessionId,
          requestedBy: currentRequest.requestedBy,
        });
      }

      // Navigate to the ticket (this will open the chatbot)
      navigateToTicket(currentRequest.ticketId);

      // Close the modal
      dismissRequest();
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setIsAccepting(false);
    }
  }, [
    currentRequest,
    navigateToTicket,
    dismissRequest,
    callApi,
    userProfile,
    addAcceptedRequest,
  ]);

  const handleReject = useCallback(async () => {
    if (!currentRequest) return;

    try {
      const userId = userProfile?.userId || userProfile?.id || "";

      // Reject the request via API/Socket.IO
      if (currentRequest.type === "remote_session") {
        // Emit response via Socket.IO
        const socket: Socket = io(config.api_server, {
          transports: ["websocket", "polling"],
        });

        socket.on("connect", () => {
          socket.emit(
            `ticket:${currentRequest.ticketId}:remote_session_response`,
            {
              ticketId: currentRequest.ticketId,
              sessionId: currentRequest.sessionId,
              accepted: false,
              userId,
            }
          );
          socket.disconnect();
        });
      } else if (currentRequest.type === "huddle") {
        // Send huddle response via API
        try {
          await callApi(
            "POST",
            `/api/tickets/${currentRequest.ticketId}/huddle-response`,
            {
              ticketId: currentRequest.ticketId,
              sessionId: currentRequest.sessionId,
              accepted: false,
              userId,
            }
          );
        } catch (error) {
          console.error("Error sending huddle rejection:", error);
        }
      }

      // Close the modal
      dismissRequest();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  }, [currentRequest, dismissRequest, callApi, userProfile]);

  if (!currentRequest) {
    return null;
  }

  const ticket = currentRequest.ticket;
  const isRemoteSession = currentRequest.type === "remote_session";
  const isHuddle = currentRequest.type === "huddle";

  return (
    <Dialog
      open={!!currentRequest}
      onClose={handleReject}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          {isRemoteSession ? (
            <ScreenShareIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          ) : (
            <MicIcon sx={{ fontSize: 40, color: "#4caf50" }} />
          )}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {isRemoteSession ? "Remote Session Request" : "Huddle Request"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
              Support wants to{" "}
              {isRemoteSession
                ? "start a remote session"
                : "start a voice call"}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {ticket && (
            <>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  Ticket #{ticket.ticketId || ticket.id}
                </Typography>
                {ticket.summary && (
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {ticket.summary}
                  </Typography>
                )}
                {ticket.title && !ticket.summary && (
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {ticket.title}
                  </Typography>
                )}
              </Box>
            </>
          )}
          {!ticket && (
            <Typography variant="body2" sx={{ color: "#666" }}>
              Loading ticket information...
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<CloseIcon />}
          onClick={handleReject}
          disabled={isAccepting}
        >
          Reject
        </Button>
        <Button
          variant="contained"
          color={isRemoteSession ? "primary" : "success"}
          startIcon={
            isAccepting ? <CircularProgress size={16} /> : <CheckIcon />
          }
          onClick={handleAccept}
          disabled={isAccepting}
        >
          {isAccepting ? "Accepting..." : "Accept"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
