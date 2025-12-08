import { Box, Stack, useMediaQuery, Fade } from "@mui/material";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTicketChatbot } from "./ticket-chatbot-context";
import { useSupportReplyCards } from "./use-support-reply-cards";
import { SupportReplyCard } from "./SupportReplyCard";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

export const SupportReplyCardsContainer = () => {
  const { isOpen, navigateToTicket, currentTicketId } = useTicketChatbot();
  const { cards, isLoading, dismissCard } = useSupportReplyCards();
  const isMobileScreen = useMediaQuery("(max-width:768px)");
  const { primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const direction: "rtl" | "ltr" = t("direction") || "ltr";
  const isRTL = direction === "rtl";

  // All hooks must be called before any conditional returns
  const handleCardClick = useCallback(
    (ticketId: number) => {
      // Ensure we're using the exact ticketId passed, not relying on any array indices
      if (!ticketId) {
        console.error("Invalid ticketId in handleCardClick:", ticketId);
        return;
      }
      // Remove card immediately for better performance
      dismissCard(ticketId);
      // Navigate to ticket
      navigateToTicket(ticketId);
    },
    [navigateToTicket, dismissCard]
  );

  const handleDismiss = useCallback(
    (ticketId: number) => {
      if (!ticketId) {
        console.error("Invalid ticketId in handleDismiss:", ticketId);
        return;
      }
      dismissCard(ticketId);
    },
    [dismissCard]
  );

  // Hide all cards when Support Drawer is open globally
  if (isOpen) {
    return null;
  }

  // Hide on mobile (same display rules as support icon)
  if (isMobileScreen) {
    return null;
  }

  // Filter out card for currently open ticket
  const visibleCards = cards.filter(
    (card) => card.ticket.id !== currentTicketId
  );

  // Sort cards by last message timestamp (most recent first) for consistent ordering
  const sortedCards = [...visibleCards].sort((a, b) => {
    const timeA = new Date(a.lastSupportMessage.createdAt).getTime();
    const timeB = new Date(b.lastSupportMessage.createdAt).getTime();
    return timeB - timeA; // Most recent first
  });

  if (sortedCards.length === 0) {
    return null;
  }

  return (
    <Fade in={true} timeout={300}>
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          ...(isRTL ? { left: 20 } : { right: 20 }),
          zIndex: 1000,
          width: 300,
          maxHeight: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
          pointerEvents: "auto",
          // Subtle backdrop effect
          "&::before": {
            content: '""',
            position: "absolute",
            top: -10,
            left: -10,
            right: -10,
            bottom: -10,
            background: `linear-gradient(135deg, ${primaryColor(
              50
            )}15 0%, transparent 100%)`,
            borderRadius: 3,
            zIndex: -1,
            pointerEvents: "none",
          },
        }}
      >
        {/* Scrollable container with custom scrollbar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflowY: "auto",
            overflowX: "hidden",
            ...(isRTL ? { pl: 0.5 } : { pr: 0.5 }),
            pb: 0.5,
            // Smooth scrolling
            scrollBehavior: "smooth",
            // Custom scrollbar styling
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "3px",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              },
            },
            // Firefox scrollbar
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
          }}
        >
          {sortedCards.map((card, index) => {
            // Ensure ticketId exists and is valid
            const ticketId = card.ticket.id;
            if (!ticketId) {
              console.error("Card missing ticket ID:", card);
              return null;
            }

            return (
              <Fade
                key={ticketId}
                in={true}
                timeout={200}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Box>
                  <SupportReplyCard
                    ticket={card.ticket}
                    lastSupportMessage={card.lastSupportMessage}
                    onCardClick={() => handleCardClick(ticketId)}
                    onDismiss={() => handleDismiss(ticketId)}
                  />
                </Box>
              </Fade>
            );
          })}
        </Box>
      </Box>
    </Fade>
  );
};
