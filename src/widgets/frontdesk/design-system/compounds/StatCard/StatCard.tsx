import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { colorTokens, spacingTokens, shadowTokens } from '../../tokens';

export interface StatCardProps {
  /**
   * The main metric label
   */
  label: string;

  /**
   * The primary metric value (large number display)
   */
  value: number | string;

  /**
   * Optional icon to display
   */
  icon?: React.ReactNode;

  /**
   * Optional trend indicator
   * Positive values show green up arrow, negative show red down arrow
   */
  trend?: {
    value: number;
    label?: string;
  };

  /**
   * Optional description or subtext
   */
  description?: string;

  /**
   * Color variant for the card accent
   */
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Custom background color
   */
  backgroundColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  description,
  variant = 'primary',
  isLoading = false,
  onClick,
  backgroundColor,
}) => {
  const theme = useTheme();

  // Variant color mapping
  const variantColors = {
    primary: colorTokens.primary[600],
    success: colorTokens.success[600],
    warning: colorTokens.warning[600],
    error: colorTokens.error[600],
    neutral: colorTokens.neutral[600],
  };

  const accentColor = variantColors[variant];

  // Trend color
  const trendColor = trend && trend.value > 0
    ? colorTokens.success[600]
    : trend && trend.value < 0
    ? colorTokens.error[600]
    : colorTokens.neutral[500];

  const TrendIcon = trend && trend.value > 0 ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: backgroundColor || theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${colorTokens.neutral[200]}`,
        p: 3,
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: shadowTokens.sm,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': onClick ? {
          boxShadow: shadowTokens.md,
          transform: 'translateY(-2px)',
          borderColor: accentColor,
        } : {},
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: accentColor,
        }
      }}
    >
      {/* Header Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={20} />
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: colorTokens.neutral[600],
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {label}
            </Typography>
          )}
        </Box>

        {icon && !isLoading && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: `${accentColor}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      {/* Value Display */}
      <Box sx={{ mb: trend || description ? 1 : 0 }}>
        {isLoading ? (
          <Skeleton variant="text" width="40%" height={40} />
        ) : (
          <Typography
            variant="h3"
            sx={{
              fontSize: '2rem',
              fontWeight: 700,
              color: colorTokens.neutral[900],
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
        )}
      </Box>

      {/* Footer Row - Trend or Description */}
      {(trend || description) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isLoading ? (
            <Skeleton variant="text" width="50%" height={16} />
          ) : (
            <>
              {trend && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: trendColor,
                  }}
                >
                  <TrendIcon sx={{ fontSize: 16 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.813rem',
                      fontWeight: 600,
                    }}
                  >
                    {Math.abs(trend.value)}%
                  </Typography>
                  {trend.label && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.813rem',
                        color: colorTokens.neutral[500],
                        ml: 0.5,
                      }}
                    >
                      {trend.label}
                    </Typography>
                  )}
                </Box>
              )}

              {description && !trend && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.813rem',
                    color: colorTokens.neutral[500],
                  }}
                >
                  {description}
                </Typography>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StatCard;
