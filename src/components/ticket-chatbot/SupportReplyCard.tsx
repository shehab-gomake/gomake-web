import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import {
  Ticket,
  TicketMessage,
} from "@/services/api-service/tickets/tickets-api";

interface SupportReplyCardProps {
  ticket: Ticket;
  lastSupportMessage: TicketMessage;
  onCardClick: () => void;
  onDismiss: () => void;
}

export const SupportReplyCard = ({
  ticket,
  lastSupportMessage,
  onCardClick,
  onDismiss,
}: SupportReplyCardProps) => {
  const { primaryColor, secondColor, neutralColor, grayColor } =
    useGomakeTheme();
  const { t } = useTranslation();
  const direction: "rtl" | "ltr" = t("direction") || "ltr";
  const isRTL = direction === "rtl";

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking the close button
    if ((e.target as HTMLElement).closest(".dismiss-button")) {
      return;
    }
    onCardClick();
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss();
  };

  // Truncate message if too long (allow more characters for better readability)
  const truncatedMessage =
    lastSupportMessage.message.length > 120
      ? `${lastSupportMessage.message.substring(0, 120)}...`
      : lastSupportMessage.message;

  // Truncate title/summary
  const truncatedTitle =
    (ticket.summary || ticket.title).length > 40
      ? `${(ticket.summary || ticket.title).substring(0, 40)}...`
      : ticket.summary || ticket.title;

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        width: 280,
        cursor: "pointer",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease",
        borderRadius: 2,
        ...(isRTL
          ? { borderRight: `3px solid ${primaryColor(500)}` }
          : { borderLeft: `3px solid ${primaryColor(500)}` }),
        backgroundColor: "white",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transform: isRTL ? "translateX(2px)" : "translateX(-2px)",
          ...(isRTL
            ? { borderRightColor: primaryColor(600) }
            : { borderLeftColor: primaryColor(600) }),
        },
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack spacing={0.75}>
          {/* Header with ticket ID and close button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                ...FONT_FAMILY.Lexend(600, 11),
                color: primaryColor(500),
                letterSpacing: 0.3,
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {ticket.ticketId}
            </Typography>
            <IconButton
              className="dismiss-button"
              size="small"
              onClick={handleDismiss}
              sx={{
                p: 0.25,
                minWidth: 20,
                width: 20,
                height: 20,
                color: grayColor(400),
                "&:hover": {
                  color: secondColor(500),
                  backgroundColor: grayColor(100),
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>

          {/* Ticket title/summary - compact */}
          <Typography
            sx={{
              ...FONT_FAMILY.Heebo(500, 11),
              color: neutralColor(800),
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {truncatedTitle}
          </Typography>

          {/* Support message preview - bigger and clearer */}
          <Box
            sx={{
              p: 1.25,
              backgroundColor: primaryColor(50),
              borderRadius: 1.25,
              border: `1px solid ${primaryColor(100)}`,
            }}
          >
            {/* Sender name */}
            <Typography
              sx={{
                ...FONT_FAMILY.Heebo(600, 11),
                color: primaryColor(600),
                mb: 0.5,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {lastSupportMessage.senderName}
            </Typography>
            {/* Message text - bigger and clearer */}
            <Typography
              sx={{
                ...FONT_FAMILY.Heebo(500, 13),
                color: neutralColor(800),
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              {truncatedMessage}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
