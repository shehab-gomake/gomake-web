import React from "react";
import { Box, Skeleton, Stack, ListItem, ListItemButton } from "@mui/material";
import { colorTokens } from "@/widgets/frontdesk/design-system";

interface ConversationListSkeletonProps {
  /**
   * Number of skeleton items to render
   * @default 8
   */
  count?: number;
}

// Constants matching ConversationListItem
const AVATAR_SIZE = 24;
const INBOX_ICON_SIZE = 20;
const PRIORITY_ICON_SIZE = 12;
const ASSIGNEE_AVATAR_SIZE = 20;
const UNREAD_BADGE_SIZE = 20;

/**
 * Skeleton loader for Chatwoot conversation list
 *
 * Displays animated shimmer skeletons that match the exact structure of
 * ConversationListItem for a smooth loading experience.
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
 * Matches the exact structure of ConversationListItem component
 */
const ConversationItemSkeleton: React.FC<{ index: number }> = ({ index }) => {

  // Consistent widths for each item (no randomness for better UX)
  const titleWidths = ["65%", "70%", "60%", "75%", "68%", "72%", "65%", "70%"];
  const snippetWidths = ["85%", "90%", "80%", "88%", "82%", "86%", "84%", "87%"];
  const titleWidth = titleWidths[index % titleWidths.length];
  const snippetWidth = snippetWidths[index % snippetWidths.length];
  const showMetadata = index % 3 === 0; // Show metadata on every 3rd item
  const showUnread = index % 2 === 0; // Show unread badge on even items

  return (
    <ListItem disablePadding>
      <ListItemButton
        disabled
        sx={{
          py: 1,
          px: 1.5,
          borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
          backgroundColor: colorTokens.semantic.background.primary,
        }}
      >
        <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ width: "100%" }}>
          {/* Contact Avatar */}
          <Skeleton
            variant="circular"
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            sx={{
              flexShrink: 0,
              bgcolor: colorTokens.neutral[200],
            }}
          />

          {/* Content Section */}
          <Stack flex={1} spacing={0.5} sx={{ minWidth: 0 }}>
            {/* Top Row: Contact Name | Priority | Inbox | Timestamp */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              {/* Title */}
              <Skeleton
                variant="text"
                width={titleWidth}
                height={20}
                sx={{
                  bgcolor: colorTokens.neutral[300],
                  borderRadius: 1,
                }}
              />

              {/* Right Indicators: Priority | Inbox | Timestamp */}
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                {/* Priority icon (sometimes) */}
                {index % 4 === 0 && (
                  <Skeleton
                    variant="circular"
                    width={PRIORITY_ICON_SIZE}
                    height={PRIORITY_ICON_SIZE}
                    sx={{
                      bgcolor: colorTokens.neutral[200],
                    }}
                  />
                )}

                {/* Inbox icon */}
                <Skeleton
                  variant="circular"
                  width={INBOX_ICON_SIZE}
                  height={INBOX_ICON_SIZE}
                  sx={{
                    bgcolor: colorTokens.neutral[200],
                  }}
                />

                {/* Timestamp */}
                <Skeleton
                  variant="text"
                  width={50}
                  height={16}
                  sx={{
                    bgcolor: colorTokens.neutral[200],
                    borderRadius: 1,
                  }}
                />
              </Stack>
            </Stack>

            {/* Message Preview Row */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              {/* Snippet */}
              <Skeleton
                variant="text"
                width={snippetWidth}
                height={16}
                sx={{
                  bgcolor: colorTokens.neutral[200],
                  borderRadius: 1,
                }}
              />

              {/* Unread badge */}
              {showUnread && (
                <Skeleton
                  variant="circular"
                  width={UNREAD_BADGE_SIZE}
                  height={UNREAD_BADGE_SIZE}
                  sx={{
                    flexShrink: 0,
                    bgcolor: colorTokens.primary[600],
                    opacity: 0.3,
                  }}
                />
              )}
            </Stack>

            {/* Bottom Row: SLA | Labels | Assignee (conditional) */}
            {showMetadata && (
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                {/* Left: SLA & Labels */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ flexWrap: "wrap", gap: 0.5, flex: 1, minWidth: 0 }}
                >
                  {/* SLA label */}
                  {index % 6 === 0 && (
                    <Skeleton
                      variant="rounded"
                      width={60}
                      height={18}
                      sx={{
                        borderRadius: "10px",
                        bgcolor: colorTokens.neutral[200],
                      }}
                    />
                  )}

                  {/* Labels */}
                  {index % 4 === 0 && (
                    <>
                      <Skeleton
                        variant="rounded"
                        width={50}
                        height={18}
                        sx={{
                          borderRadius: "10px",
                          bgcolor: colorTokens.neutral[200],
                        }}
                      />
                      {index % 8 === 0 && (
                        <Skeleton
                          variant="rounded"
                          width={45}
                          height={18}
                          sx={{
                            borderRadius: "10px",
                            bgcolor: colorTokens.neutral[200],
                          }}
                        />
                      )}
                    </>
                  )}
                </Stack>

                {/* Right: Assignee */}
                {index % 5 === 0 && (
                  <Skeleton
                    variant="circular"
                    width={ASSIGNEE_AVATAR_SIZE}
                    height={ASSIGNEE_AVATAR_SIZE}
                    sx={{
                      flexShrink: 0,
                      bgcolor: colorTokens.neutral[200],
                    }}
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </ListItemButton>
    </ListItem>
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
