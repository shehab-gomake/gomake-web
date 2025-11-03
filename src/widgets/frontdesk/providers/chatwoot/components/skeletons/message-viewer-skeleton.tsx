import React from "react";
import { Box, Skeleton, Stack, Paper, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface MessageViewerSkeletonProps {
  /**
   * Number of message skeletons to render
   * @default 5
   */
  messageCount?: number;
}

/**
 * Skeleton loader for Chatwoot message viewer
 *
 * Displays animated shimmer skeletons that match the structure of
 * the message thread view including header, messages, and composer.
 *
 * @example
 * ```tsx
 * {loading ? (
 *   <MessageViewerSkeleton />
 * ) : (
 *   <ChatwootMessageViewer conversation={conversation} />
 * )}
 * ```
 */
export const MessageViewerSkeleton: React.FC<MessageViewerSkeletonProps> = ({
  messageCount = 5,
}) => {
  const theme = useTheme();
  const { neutralColor } = useGomakeTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: neutralColor(0),
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}, 0 1px 3px ${alpha(theme.palette.common.black, 0.04)}`,
      }}
    >
      {/* Header Skeleton */}
      <MessageViewerHeaderSkeleton />

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          backgroundColor: neutralColor(50),
          padding: 2,
        }}
      >
        <Stack spacing={2}>
          {Array.from({ length: messageCount }).map((_, index) => (
            <MessageItemSkeleton
              key={index}
              isIncoming={index % 2 === 0} // Alternate incoming/outgoing
              index={index}
            />
          ))}
        </Stack>
      </Box>

      {/* Composer Skeleton */}
      <MessageComposerSkeleton />
    </Paper>
  );
};

/**
 * Message viewer header skeleton
 */
const MessageViewerHeaderSkeleton: React.FC = () => {
  const { neutralColor } = useGomakeTheme();

  return (
    <Box
      sx={{
        padding: 2,
        borderBottom: `1px solid ${neutralColor(200)}`,
        display: "flex",
        alignItems: "center",
        gap: 2,
        backgroundColor: neutralColor(0),
      }}
    >
      {/* Back button */}
      <Skeleton
        variant="circular"
        width={36}
        height={36}
        sx={{
          bgcolor: neutralColor(200),
        }}
      />

      {/* Avatar */}
      <Skeleton
        variant="circular"
        width={40}
        height={40}
        sx={{
          bgcolor: neutralColor(200),
        }}
      />

      {/* Contact info */}
      <Stack spacing={0.5} sx={{ flex: 1 }}>
        <Skeleton
          variant="text"
          width="40%"
          height={24}
          sx={{
            bgcolor: neutralColor(300),
          }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={16}
          sx={{
            bgcolor: neutralColor(200),
          }}
        />
      </Stack>

      {/* Action buttons */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Skeleton
          variant="circular"
          width={36}
          height={36}
          sx={{
            bgcolor: neutralColor(200),
          }}
        />
        <Skeleton
          variant="circular"
          width={36}
          height={36}
          sx={{
            bgcolor: neutralColor(200),
          }}
        />
        <Skeleton
          variant="circular"
          width={36}
          height={36}
          sx={{
            bgcolor: neutralColor(200),
          }}
        />
      </Box>
    </Box>
  );
};

/**
 * Single message item skeleton
 */
const MessageItemSkeleton: React.FC<{ isIncoming: boolean; index: number }> = ({
  isIncoming,
  index,
}) => {
  const theme = useTheme();
  const { neutralColor } = useGomakeTheme();

  const messageWidth = `${50 + Math.random() * 30}%`; // Random width 50-80%

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        justifyContent: isIncoming ? "flex-start" : "flex-end",
        animation: "pulse 1.5s ease-in-out infinite",
        animationDelay: `${index * 0.1}s`,
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
      {/* Avatar for incoming messages */}
      {isIncoming && (
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          sx={{
            flexShrink: 0,
            bgcolor: neutralColor(200),
          }}
        />
      )}

      {/* Message bubble */}
      <Box
        sx={{
          maxWidth: messageWidth,
        }}
      >
        {/* Sender name (for incoming only) */}
        {isIncoming && (
          <Skeleton
            variant="text"
            width="60%"
            height={16}
            sx={{
              mb: 0.5,
              bgcolor: neutralColor(200),
            }}
          />
        )}

        {/* Message content */}
        <Box
          sx={{
            bgcolor: isIncoming ? neutralColor(100) : alpha(theme.palette.primary.main, 0.1),
            borderRadius: 2,
            padding: 1.5,
          }}
        >
          <Stack spacing={0.5}>
            <Skeleton
              variant="text"
              width="100%"
              height={16}
              sx={{
                bgcolor: isIncoming ? neutralColor(200) : alpha(theme.palette.primary.main, 0.2),
              }}
            />
            <Skeleton
              variant="text"
              width="90%"
              height={16}
              sx={{
                bgcolor: isIncoming ? neutralColor(200) : alpha(theme.palette.primary.main, 0.2),
              }}
            />
            {Math.random() > 0.5 && ( // Random third line
              <Skeleton
                variant="text"
                width="70%"
                height={16}
                sx={{
                  bgcolor: isIncoming ? neutralColor(200) : alpha(theme.palette.primary.main, 0.2),
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Timestamp */}
        <Skeleton
          variant="text"
          width={60}
          height={12}
          sx={{
            mt: 0.5,
            bgcolor: neutralColor(200),
            marginLeft: isIncoming ? 0 : "auto",
          }}
        />
      </Box>
    </Box>
  );
};

/**
 * Message composer skeleton
 */
const MessageComposerSkeleton: React.FC = () => {
  const { neutralColor } = useGomakeTheme();

  return (
    <Box
      sx={{
        padding: 2,
        borderTop: `1px solid ${neutralColor(200)}`,
        backgroundColor: neutralColor(0),
      }}
    >
      <Stack spacing={1.5}>
        {/* Toolbar */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton
            variant="circular"
            width={32}
            height={32}
            sx={{
              bgcolor: neutralColor(200),
            }}
          />
          <Skeleton
            variant="circular"
            width={32}
            height={32}
            sx={{
              bgcolor: neutralColor(200),
            }}
          />
          <Skeleton
            variant="circular"
            width={32}
            height={32}
            sx={{
              bgcolor: neutralColor(200),
            }}
          />
        </Box>

        {/* Text input */}
        <Skeleton
          variant="rounded"
          width="100%"
          height={80}
          sx={{
            borderRadius: 2,
            bgcolor: neutralColor(100),
          }}
        />

        {/* Send button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Skeleton
            variant="rounded"
            width={100}
            height={36}
            sx={{
              borderRadius: 1,
              bgcolor: neutralColor(200),
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

/**
 * Compact message viewer skeleton with fewer messages
 */
export const MessageViewerSkeletonCompact: React.FC = () => {
  return <MessageViewerSkeleton messageCount={3} />;
};

/**
 * Message viewer skeleton for empty conversation
 * Shows just the header and composer, no messages
 */
export const MessageViewerSkeletonEmpty: React.FC = () => {
  return <MessageViewerSkeleton messageCount={0} />;
};
