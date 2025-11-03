import React from "react";
import { Box, Skeleton, Stack, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface ConversationListSkeletonProps {
  /**
   * Number of skeleton items to render
   * @default 8
   */
  count?: number;
}

/**
 * Skeleton loader for Chatwoot conversation list
 *
 * Displays animated shimmer skeletons that match the structure of
 * ChatwootConversationListItem for a smooth loading experience.
 *
 * @example
 * ```tsx
 * {loading ? (
 *   <ConversationListSkeleton count={5} />
 * ) : (
 *   conversations.map(conv => <ChatwootConversationListItem {...conv} />)
 * )}
 * ```
 */
export const ConversationListSkeleton: React.FC<ConversationListSkeletonProps> = ({
  count = 8,
}) => {
  const theme = useTheme();
  const { neutralColor } = useGomakeTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ConversationItemSkeleton key={index} index={index} />
      ))}
    </Box>
  );
};

/**
 * Single conversation list item skeleton
 */
const ConversationItemSkeleton: React.FC<{ index: number }> = ({ index }) => {
  const theme = useTheme();
  const { neutralColor } = useGomakeTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        padding: 2,
        borderBottom: `1px solid ${neutralColor(200)}`,
        backgroundColor: neutralColor(0),
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
        },
        // Add staggered animation delay for visual effect
        animation: "pulse 1.5s ease-in-out infinite",
        animationDelay: `${index * 0.05}s`,
        "@keyframes pulse": {
          "0%, 100%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.7,
          },
        },
      }}
    >
      {/* Avatar */}
      <Skeleton
        variant="circular"
        width={40}
        height={40}
        sx={{
          flexShrink: 0,
          bgcolor: neutralColor(200),
        }}
      />

      {/* Content */}
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        {/* Header: Name and Time */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          {/* Name */}
          <Skeleton
            variant="text"
            width={`${60 + Math.random() * 30}%`} // Random width 60-90%
            height={20}
            sx={{
              bgcolor: neutralColor(300),
            }}
          />

          {/* Time */}
          <Skeleton
            variant="text"
            width={50}
            height={16}
            sx={{
              flexShrink: 0,
              bgcolor: neutralColor(200),
            }}
          />
        </Box>

        {/* Subtitle/Email */}
        <Skeleton
          variant="text"
          width={`${40 + Math.random() * 40}%`} // Random width 40-80%
          height={16}
          sx={{
            bgcolor: neutralColor(200),
          }}
        />

        {/* Message Preview */}
        <Skeleton
          variant="text"
          width="95%"
          height={16}
          sx={{
            bgcolor: neutralColor(200),
          }}
        />

        {/* Second line of message preview */}
        <Skeleton
          variant="text"
          width={`${50 + Math.random() * 30}%`} // Random width 50-80%
          height={16}
          sx={{
            bgcolor: neutralColor(200),
          }}
        />

        {/* Footer: Status badges/labels */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 0.5,
          }}
        >
          {/* Unread badge or status indicator */}
          <Skeleton
            variant="rounded"
            width={60}
            height={20}
            sx={{
              borderRadius: "12px",
              bgcolor: neutralColor(200),
            }}
          />

          {/* Channel/Inbox indicator */}
          <Skeleton
            variant="rounded"
            width={70}
            height={20}
            sx={{
              borderRadius: "12px",
              bgcolor: neutralColor(200),
            }}
          />
        </Box>
      </Stack>

      {/* Unread count badge (appears randomly for visual variety) */}
      {Math.random() > 0.5 && (
        <Skeleton
          variant="circular"
          width={24}
          height={24}
          sx={{
            flexShrink: 0,
            bgcolor: alpha(theme.palette.primary.main, 0.2),
          }}
        />
      )}
    </Box>
  );
};

/**
 * Compact conversation list skeleton with fewer items
 * Useful for loading states when only a few items are expected
 */
export const ConversationListSkeletonCompact: React.FC = () => {
  return <ConversationListSkeleton count={3} />;
};

/**
 * Full-page conversation list skeleton
 * Fills the entire available space with loading items
 */
export const ConversationListSkeletonFull: React.FC = () => {
  return <ConversationListSkeleton count={12} />;
};
