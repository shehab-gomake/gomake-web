import { EStatisticsLabels } from "@/pages-components/quotes/enums";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { PerformanceIcon } from "@/icons/performance";
import { OrderBoxIcon } from "@/icons/order-box";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTheme } from "@/contexts/theme";

const useCardWidget = () => {
  // Keep MUI theme as fallback for components that still need it
  const {
    primaryColor,
    secondColor,
    warningColor,
    successColor,
    errorColor,
    neutralColor,
  } = useGomakeTheme();

  // Get theme context for icon overrides
  const { getIconOverride } = useTheme();

  /**
   * Returns card text color from CSS variables (theme-aware)
   * Falls back to white for colored cards, dark for white cards
   * This is defined first so it can be used by getCardIcon
   */
  const getCardTextColor = (cardKey: string) => {
    // Helper to get CSS variable or fallback
    const getThemeColor = (cssVar: string, fallback: string) => {
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        const cssValue = computedStyle.getPropertyValue(cssVar).trim();
        return cssValue || fallback;
      }
      return fallback;
    };

    // Check for theme-specific text color first
    let textColorVar = "";
    if (cardKey === EStatisticsLabels.SUCCESS_RATE) {
      textColorVar = "--theme-card-success-rate-text";
    } else if (cardKey === EStatisticsLabels.MONTHLY_PERFORMANCE) {
      textColorVar = "--theme-card-monthly-performance-text";
    } else if (cardKey === EStatisticsLabels.APPROVED) {
      textColorVar = "--theme-card-approved-text";
    } else if (cardKey === EStatisticsLabels.PENDING) {
      textColorVar = "--theme-card-pending-text";
    } else if (cardKey === EStatisticsLabels.ORDERS) {
      textColorVar = "--theme-card-orders-text";
    } else if (cardKey === EStatisticsLabels.CANCELED) {
      textColorVar = "--theme-card-canceled-text";
    } else if (cardKey === EStatisticsLabels.STUCK_JOBS) {
      textColorVar = "--theme-card-stuck-jobs-text";
    }

    // If theme-specific text color exists, use it
    if (textColorVar) {
      const themeTextColor = getThemeColor(textColorVar, "");
      if (themeTextColor) {
        return themeTextColor;
      }
    }

    // Fallback: Use card background color to determine text color
    const cardBgColor = getCardColor(cardKey);

    // If card is white or very light, use dark text
    if (
      cardBgColor === "#FFFFFF" ||
      cardBgColor.toLowerCase() === "#ffffff" ||
      cardBgColor === "#E0E0E0" ||
      cardBgColor.toLowerCase() === "#e0e0e0"
    ) {
      return "#1a202c";
    }

    return "#FFFFFF";
  };

  const getCardNumberColor = (cardKey: string) => {
    if (
      cardKey === EStatisticsLabels.MONTHLY_PERFORMANCE ||
      cardKey === EStatisticsLabels.ORDERS
    ) {
      return "#000000";
    }
    // For other cards, use the same color as text
    return getCardTextColor(cardKey);
  };

  const getCardIcon = (cardKey: string) => {
    // Get theme-aware icon color based on text color
    const textColor = getCardTextColor(cardKey);
    const iconColor = textColor;

    // Icon mapping - default icons for each card type
    const defaultIcons: Record<string, () => JSX.Element> = {
      [EStatisticsLabels.SUCCESS_RATE]: () => <TrendingUpIcon />,
      [EStatisticsLabels.MONTHLY_PERFORMANCE]: () => (
        <PerformanceIcon color={iconColor} />
      ),
      [EStatisticsLabels.APPROVED]: () => <DoneAllIcon />,
      [EStatisticsLabels.PENDING]: () => <HourglassTopIcon />,
      [EStatisticsLabels.ORDERS]: () => <OrderBoxIcon color={iconColor} />,
      [EStatisticsLabels.CANCELED]: () => <DoDisturbAltIcon />,
      [EStatisticsLabels.STUCK_JOBS]: () => <HourglassTopIcon />,
    };

    // Icon name mapping - maps card keys to icon registry names
    const iconNameMap: Record<string, string> = {
      [EStatisticsLabels.SUCCESS_RATE]: "SuccessRateIcon",
      [EStatisticsLabels.MONTHLY_PERFORMANCE]: "MonthlyPerformanceIcon",
      [EStatisticsLabels.APPROVED]: "ApprovedIcon",
      [EStatisticsLabels.PENDING]: "PendingIcon",
      [EStatisticsLabels.ORDERS]: "OrdersIcon",
      [EStatisticsLabels.CANCELED]: "CanceledIcon",
      [EStatisticsLabels.STUCK_JOBS]: "StuckJobsIcon",
    };

    // Check for theme-specific icon override
    const iconName = iconNameMap[cardKey];
    if (iconName) {
      const ThemeIcon = getIconOverride(iconName);
      if (ThemeIcon) {
        return <ThemeIcon color={iconColor} />;
      }
    }

    // Fallback to default icon
    const DefaultIcon = defaultIcons[cardKey];
    return DefaultIcon ? DefaultIcon() : null;
  };

  /**
   * Returns card colors from CSS variables (theme-aware)
   * Falls back to MUI theme colors if CSS variables not available
   */
  const getCardColor = (cardKey: string) => {
    // Helper to get CSS variable or fallback
    const getThemeColor = (cssVar: string, fallback: string) => {
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        const cssValue = computedStyle.getPropertyValue(cssVar).trim();
        return cssValue || fallback;
      }
      return fallback;
    };

    if (cardKey === EStatisticsLabels.SUCCESS_RATE) {
      return getThemeColor(
        "--theme-card-success-rate",
        getThemeColor("--theme-primary-color", primaryColor(300))
      );
    }
    if (cardKey === EStatisticsLabels.MONTHLY_PERFORMANCE) {
      return getThemeColor(
        "--theme-card-monthly-performance",
        getThemeColor("--theme-secondary-color", secondColor(200))
      );
    }
    if (cardKey === EStatisticsLabels.APPROVED) {
      return getThemeColor(
        "--theme-card-approved",
        getThemeColor("--theme-status-success", successColor(300))
      );
    }
    if (cardKey === EStatisticsLabels.PENDING) {
      return getThemeColor(
        "--theme-card-pending",
        getThemeColor("--theme-status-error", errorColor(300))
      );
    }
    if (cardKey === EStatisticsLabels.ORDERS) {
      return getThemeColor(
        "--theme-card-orders",
        getThemeColor("--theme-status-warning", warningColor(300))
      );
    }
    if (cardKey === EStatisticsLabels.CANCELED) {
      return getThemeColor(
        "--theme-card-canceled",
        getThemeColor("--theme-status-neutral", neutralColor(300))
      );
    }
    if (cardKey === EStatisticsLabels.STUCK_JOBS) {
      return getThemeColor(
        "--theme-card-stuck-jobs",
        getThemeColor("--theme-status-error", errorColor(300))
      );
    }

    // Default fallback
    return primaryColor(300);
  };

  /**
   * Returns card border from CSS variables (theme-aware)
   * Returns border for white/light cards, none for colored cards
   */
  const getCardBorder = (cardKey: string) => {
    // Helper to get CSS variable or fallback
    const getThemeColor = (cssVar: string, fallback: string) => {
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        const cssValue = computedStyle.getPropertyValue(cssVar).trim();
        return cssValue || fallback;
      }
      return fallback;
    };

    // Check for theme-specific border first
    let borderVar = "";
    if (cardKey === EStatisticsLabels.SUCCESS_RATE) {
      borderVar = "--theme-card-success-rate-border";
    } else if (cardKey === EStatisticsLabels.MONTHLY_PERFORMANCE) {
      borderVar = "--theme-card-monthly-performance-border";
    } else if (cardKey === EStatisticsLabels.APPROVED) {
      borderVar = "--theme-card-approved-border";
    } else if (cardKey === EStatisticsLabels.PENDING) {
      borderVar = "--theme-card-pending-border";
    } else if (cardKey === EStatisticsLabels.ORDERS) {
      borderVar = "--theme-card-orders-border";
    } else if (cardKey === EStatisticsLabels.CANCELED) {
      borderVar = "--theme-card-canceled-border";
    } else if (cardKey === EStatisticsLabels.STUCK_JOBS) {
      borderVar = "--theme-card-stuck-jobs-border";
    }

    // If theme-specific border exists, use it
    if (borderVar) {
      const themeBorder = getThemeColor(borderVar, "");
      if (themeBorder) {
        return themeBorder;
      }
    }

    // Fallback: Use card background color to determine border
    const cardBgColor = getCardColor(cardKey);

    // If card is white, add border
    if (cardBgColor === "#FFFFFF" || cardBgColor.toLowerCase() === "#ffffff") {
      return "1px solid var(--Stroke-Decorative-Default, #E8E8E8)";
    }

    // Default: no border for colored cards
    return "none";
  };

  const getCardLabel = (cardKey: string) => {
    if (cardKey === EStatisticsLabels.SUCCESS_RATE) {
      return "sales.quote.successRate";
    }
    if (cardKey === EStatisticsLabels.MONTHLY_PERFORMANCE) {
      return "sales.quote.monthlyPerformance";
    }
    if (cardKey === EStatisticsLabels.APPROVED) {
      return "sales.quote.approved";
    }
    if (cardKey === EStatisticsLabels.PENDING) {
      return "sales.quote.pending";
    }
    if (cardKey === EStatisticsLabels.ORDERS) {
      return "tabs.orders";
    }
    if (cardKey === EStatisticsLabels.CANCELED) {
      return "sales.quote.canceled";
    }
    if (cardKey === EStatisticsLabels.STUCK_JOBS) {
      return "sales.quote.stuckJobs";
    }
  };

  return {
    getCardIcon,
    getCardColor,
    getCardTextColor,
    getCardNumberColor,
    getCardBorder,
    getCardLabel,
  };
};

export { useCardWidget };
