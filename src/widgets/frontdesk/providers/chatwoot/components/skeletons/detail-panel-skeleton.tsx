import React from "react";
import { Box, Skeleton, Stack, Paper, Divider , useTheme, alpha } from "@mui/material";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";

/**
 * Skeleton loader for Chatwoot conversation detail panel
 *
 * Displays animated shimmer skeletons that match the structure of
 * the conversation detail sidebar including contact info, attributes, and actions.
 *
 * @example
 * ```tsx
 * {loading ? (
 *   <DetailPanelSkeleton />
 * ) : (
 *   <ChatwootConversationDetailPanel conversation={conversation} />
 * )}
 * ```
 */
export const DetailPanelSkeleton: React.FC = () => {
  return (
    <Paper
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: radiusTokens.lg,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colorTokens.semantic.background.primary,
        boxShadow: shadowTokens.sm,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: 2,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
        }}
      >
        <Skeleton
          variant="text"
          width="60%"
          height={28}
          sx={{
            bgcolor: colorTokens.neutral[300],
          }}
        />
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          padding: 2,
        }}
      >
        <Stack spacing={3}>
          {/* Contact Information Section */}
          <ContactInfoSkeleton />

          <Divider sx={{ borderColor: colorTokens.neutral[200] }} />

          {/* Conversation Details Section */}
          <ConversationDetailsSkeleton />

          <Divider sx={{ borderColor: colorTokens.neutral[200] }} />

          {/* Labels Section */}
          <LabelsSkeleton />

          <Divider sx={{ borderColor: colorTokens.neutral[200] }} />

          {/* Custom Attributes Section */}
          <CustomAttributesSkeleton />

          <Divider sx={{ borderColor: colorTokens.neutral[200] }} />

          {/* Actions Section */}
          <ActionsSkeleton />
        </Stack>
      </Box>
    </Paper>
  );
};

/**
 * Contact information section skeleton
 */
const ContactInfoSkeleton: React.FC = () => {
  return (
    <Box>
      {/* Section Title */}
      <Skeleton
        variant="text"
        width="50%"
        height={20}
        sx={{
          mb: 1.5,
          bgcolor: colorTokens.neutral[300],
        }}
      />

      <Stack spacing={2} alignItems="center">
        {/* Avatar */}
        <Skeleton
          variant="circular"
          width={80}
          height={80}
          sx={{
            bgcolor: colorTokens.neutral[200],
          }}
        />

        {/* Contact Name */}
        <Skeleton
          variant="text"
          width="70%"
          height={24}
          sx={{
            bgcolor: colorTokens.neutral[300],
          }}
        />

        {/* Email/Phone */}
        <Skeleton
          variant="text"
          width="80%"
          height={18}
          sx={{
            bgcolor: colorTokens.neutral[200],
          }}
        />

        {/* Company */}
        <Skeleton
          variant="text"
          width="60%"
          height={18}
          sx={{
            bgcolor: colorTokens.neutral[200],
          }}
        />

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Skeleton
            variant="rounded"
            width={80}
            height={32}
            sx={{
              borderRadius: 1,
              bgcolor: colorTokens.neutral[200],
            }}
          />
          <Skeleton
            variant="rounded"
            width={80}
            height={32}
            sx={{
              borderRadius: 1,
              bgcolor: colorTokens.neutral[200],
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

/**
 * Conversation details section skeleton
 */
const ConversationDetailsSkeleton: React.FC = () => {
  return (
    <Box>
      {/* Section Title */}
      <Skeleton
        variant="text"
        width="60%"
        height={20}
        sx={{
          mb: 1.5,
          bgcolor: colorTokens.neutral[300],
        }}
      />

      <Stack spacing={1.5}>
        {/* Detail rows */}
        {[1, 2, 3, 4, 5].map((item) => (
          <Box
            key={item}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Skeleton
              variant="text"
              width="40%"
              height={18}
              sx={{
                bgcolor: colorTokens.neutral[200],
              }}
            />
            <Skeleton
              variant="text"
              width="50%"
              height={18}
              sx={{
                bgcolor: colorTokens.neutral[300],
              }}
            />
          </Box>
        ))}

        {/* Dropdowns for assignee/team */}
        <Box sx={{ mt: 1 }}>
          <Skeleton
            variant="text"
            width="30%"
            height={16}
            sx={{
              mb: 0.5,
              bgcolor: colorTokens.neutral[200],
            }}
          />
          <Skeleton
            variant="rounded"
            width="100%"
            height={40}
            sx={{
              borderRadius: 1,
              bgcolor: colorTokens.neutral[100],
            }}
          />
        </Box>

        <Box>
          <Skeleton
            variant="text"
            width="30%"
            height={16}
            sx={{
              mb: 0.5,
              bgcolor: colorTokens.neutral[200],
            }}
          />
          <Skeleton
            variant="rounded"
            width="100%"
            height={40}
            sx={{
              borderRadius: 1,
              bgcolor: colorTokens.neutral[100],
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

/**
 * Labels section skeleton
 */
const LabelsSkeleton: React.FC = () => {
  return (
    <Box>
      {/* Section Title */}
      <Skeleton
        variant="text"
        width="40%"
        height={20}
        sx={{
          mb: 1.5,
          bgcolor: colorTokens.neutral[300],
        }}
      />

      {/* Label chips */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {[1, 2, 3].map((item) => (
          <Skeleton
            key={item}
            variant="rounded"
            width={80 + Math.random() * 40} // Random width 80-120
            height={28}
            sx={{
              borderRadius: "14px",
              bgcolor: colorTokens.neutral[200],
            }}
          />
        ))}
      </Box>

      {/* Add label button */}
      <Skeleton
        variant="rounded"
        width="100%"
        height={36}
        sx={{
          mt: 1.5,
          borderRadius: 1,
          bgcolor: colorTokens.neutral[100],
        }}
      />
    </Box>
  );
};

/**
 * Custom attributes section skeleton
 */
const CustomAttributesSkeleton: React.FC = () => {
  return (
    <Box>
      {/* Section Title */}
      <Skeleton
        variant="text"
        width="70%"
        height={20}
        sx={{
          mb: 1.5,
          bgcolor: colorTokens.neutral[300],
        }}
      />

      <Stack spacing={1.5}>
        {/* Attribute rows */}
        {[1, 2, 3].map((item) => (
          <Box key={item}>
            <Skeleton
              variant="text"
              width="50%"
              height={16}
              sx={{
                mb: 0.5,
                bgcolor: colorTokens.neutral[200],
              }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={18}
              sx={{
                bgcolor: colorTokens.neutral[300],
              }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

/**
 * Actions section skeleton
 */
const ActionsSkeleton: React.FC = () => {
  return (
    <Box>
      {/* Section Title */}
      <Skeleton
        variant="text"
        width="40%"
        height={20}
        sx={{
          mb: 1.5,
          bgcolor: colorTokens.neutral[300],
        }}
      />

      <Stack spacing={1}>
        {/* Action buttons */}
        {[1, 2, 3, 4].map((item) => (
          <Skeleton
            key={item}
            variant="rounded"
            width="100%"
            height={40}
            sx={{
              borderRadius: 1,
              bgcolor: colorTokens.neutral[100],
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

/**
 * Compact detail panel skeleton with fewer sections
 */
export const DetailPanelSkeletonCompact: React.FC = () => {
  const theme = useTheme();
  return (
    <Paper
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colorTokens.semantic.background.primary,
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`,
      }}
    >
      <Box sx={{ padding: 2 }}>
        <Stack spacing={2}>
          <ContactInfoSkeleton />
          <Divider sx={{ borderColor: colorTokens.neutral[200] }} />
          <ConversationDetailsSkeleton />
        </Stack>
      </Box>
    </Paper>
  );
};
