import React from "react";
import { Box, Skeleton, Stack, Paper, Grid , useTheme, alpha } from "@mui/material";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";

/**
 * Skeleton loader for Chatwoot dashboard view
 *
 * Displays animated shimmer skeletons that match the structure of
 * the dashboard including stats cards, charts, and recent activity.
 *
 * @example
 * ```tsx
 * {loading ? (
 *   <DashboardSkeleton />
 * ) : (
 *   <ChatwootDashboard stats={stats} activity={activity} />
 * )}
 * ```
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        padding: 3,
        height: "100%",
        overflow: "auto",
        backgroundColor: colorTokens.neutral[50],
      }}
    >
      <Stack spacing={3}>
        {/* Dashboard Header */}
        <Box>
          <Skeleton
            variant="text"
            width="30%"
            height={36}
            sx={{
              mb: 1,
              bgcolor: colorTokens.neutral[300],
            }}
          />
          <Skeleton
            variant="text"
            width="50%"
            height={20}
            sx={{
              bgcolor: colorTokens.neutral[200],
            }}
          />
        </Box>

        {/* Stats Cards Grid */}
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <StatsCardSkeleton index={item} />
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          {/* Main Chart */}
          <Grid item xs={12} md={8}>
            <ChartCardSkeleton />
          </Grid>

          {/* Side Stats */}
          <Grid item xs={12} md={4}>
            <SideStatsCardSkeleton />
          </Grid>
        </Grid>

        {/* Recent Activity Section */}
        <RecentActivitySkeleton />
      </Stack>
    </Box>
  );
};

/**
 * Stats card skeleton (KPI cards)
 */
const StatsCardSkeleton: React.FC<{ index: number }> = ({ index }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={2}
      sx={{
        padding: 2.5,
        borderRadius: 2,
        backgroundColor: colorTokens.semantic.background.primary,
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`,
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
      <Stack spacing={1.5}>
        {/* Icon */}
        <Skeleton
          variant="circular"
          width={48}
          height={48}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          }}
        />

        {/* Stat Value */}
        <Skeleton
          variant="text"
          width="60%"
          height={40}
          sx={{
            bgcolor: colorTokens.neutral[300],
          }}
        />

        {/* Stat Label */}
        <Skeleton
          variant="text"
          width="80%"
          height={20}
          sx={{
            bgcolor: colorTokens.neutral[200],
          }}
        />

        {/* Change Indicator */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Skeleton
            variant="circular"
            width={16}
            height={16}
            sx={{
              bgcolor: colorTokens.neutral[200],
            }}
          />
          <Skeleton
            variant="text"
            width={60}
            height={16}
            sx={{
              bgcolor: colorTokens.neutral[200],
            }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

/**
 * Chart card skeleton (main dashboard chart)
 */
const ChartCardSkeleton: React.FC = () => {
  const theme = useTheme();
  return (
    <Paper
      elevation={2}
      sx={{
        padding: 3,
        borderRadius: 2,
        backgroundColor: colorTokens.semantic.background.primary,
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`,
        height: 400,
      }}
    >
      <Stack spacing={2} sx={{ height: "100%" }}>
        {/* Chart Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton
            variant="text"
            width="40%"
            height={28}
            sx={{
              bgcolor: colorTokens.neutral[300],
            }}
          />
          <Skeleton
            variant="rounded"
            width={120}
            height={36}
            sx={{
              borderRadius: 1,
              bgcolor: colorTokens.neutral[100],
            }}
          />
        </Box>

        {/* Chart Area */}
        <Box sx={{ flex: 1, position: "relative" }}>
          {/* Y-axis labels */}
          <Stack
            spacing={2}
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 40,
            }}
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton
                key={item}
                variant="text"
                width={30}
                height={16}
                sx={{
                  bgcolor: colorTokens.neutral[200],
                }}
              />
            ))}
          </Stack>

          {/* Chart bars/lines */}
          <Box
            sx={{
              ml: 5,
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
              gap: 1,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                sx={{
                  flex: 1,
                  height: `${30 + Math.random() * 60}%`, // Random heights 30-90%
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  borderRadius: "4px 4px 0 0",
                }}
              />
            ))}
          </Box>
        </Box>

        {/* X-axis labels */}
        <Box
          sx={{
            ml: 5,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Skeleton
              key={item}
              variant="text"
              width={40}
              height={16}
              sx={{
                bgcolor: colorTokens.neutral[200],
              }}
            />
          ))}
        </Box>
      </Stack>
    </Paper>
  );
};

/**
 * Side stats card skeleton (secondary metrics)
 */
const SideStatsCardSkeleton: React.FC = () => {
  const theme = useTheme();
  return (
    <Paper
      elevation={2}
      sx={{
        padding: 3,
        borderRadius: 2,
        backgroundColor: colorTokens.semantic.background.primary,
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`,
        height: 400,
      }}
    >
      <Stack spacing={2} sx={{ height: "100%" }}>
        {/* Header */}
        <Skeleton
          variant="text"
          width="70%"
          height={28}
          sx={{
            bgcolor: colorTokens.neutral[300],
          }}
        />

        {/* Stat Items */}
        <Stack spacing={3} sx={{ flex: 1 }}>
          {[1, 2, 3, 4].map((item) => (
            <Box key={item}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Skeleton
                  variant="text"
                  width="50%"
                  height={18}
                  sx={{
                    bgcolor: colorTokens.neutral[200],
                  }}
                />
                <Skeleton
                  variant="text"
                  width="20%"
                  height={24}
                  sx={{
                    bgcolor: colorTokens.neutral[300],
                  }}
                />
              </Box>
              {/* Progress bar */}
              <Skeleton
                variant="rounded"
                width="100%"
                height={8}
                sx={{
                  borderRadius: "4px",
                  bgcolor: colorTokens.neutral[100],
                }}
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

/**
 * Recent activity section skeleton
 */
const RecentActivitySkeleton: React.FC = () => {
  const theme = useTheme();
  return (
    <Paper
      elevation={2}
      sx={{
        padding: 3,
        borderRadius: 2,
        backgroundColor: colorTokens.semantic.background.primary,
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`,
      }}
    >
      <Stack spacing={2}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton
            variant="text"
            width="30%"
            height={28}
            sx={{
              bgcolor: colorTokens.neutral[300],
            }}
          />
          <Skeleton
            variant="text"
            width={80}
            height={20}
            sx={{
              bgcolor: colorTokens.neutral[200],
            }}
          />
        </Box>

        {/* Activity Items */}
        <Stack spacing={2}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Box
              key={item}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                padding: 2,
                borderRadius: 1,
                backgroundColor: colorTokens.neutral[50],
              }}
            >
              {/* Avatar */}
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{
                  flexShrink: 0,
                  bgcolor: colorTokens.neutral[200],
                }}
              />

              {/* Content */}
              <Stack spacing={0.5} sx={{ flex: 1 }}>
                <Skeleton
                  variant="text"
                  width="70%"
                  height={18}
                  sx={{
                    bgcolor: colorTokens.neutral[300],
                  }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  height={16}
                  sx={{
                    bgcolor: colorTokens.neutral[200],
                  }}
                />
                <Skeleton
                  variant="text"
                  width="40%"
                  height={14}
                  sx={{
                    bgcolor: colorTokens.neutral[200],
                  }}
                />
              </Stack>

              {/* Timestamp */}
              <Skeleton
                variant="text"
                width={60}
                height={16}
                sx={{
                  flexShrink: 0,
                  bgcolor: colorTokens.neutral[200],
                }}
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

/**
 * Compact dashboard skeleton with fewer elements
 */
export const DashboardSkeletonCompact: React.FC = () => {
  return (
    <Box
      sx={{
        padding: 2,
        height: "100%",
        overflow: "auto",
        backgroundColor: colorTokens.neutral[50],
      }}
    >
      <Stack spacing={2}>
        <Grid container spacing={2}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={4} key={item}>
              <StatsCardSkeleton index={item} />
            </Grid>
          ))}
        </Grid>
        <ChartCardSkeleton />
      </Stack>
    </Box>
  );
};
