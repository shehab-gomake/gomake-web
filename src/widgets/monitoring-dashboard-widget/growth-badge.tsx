import { Stack, Tooltip } from "@mui/material";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRounded from "@mui/icons-material/ArrowDownwardRounded";
import TrendingFlatRounded from "@mui/icons-material/TrendingFlatRounded";
import { useTranslation } from "react-i18next";

interface GrowthBadgeProps {
    value?: number | null;
    size?: "small" | "medium";
    exportText?: string; // Plain text for excel export
}

const formatPercent = (num: number) => {
    if (isNaN(num)) return "0%";
    const sign = num > 0 ? "+" : num < 0 ? "" : "";
    return `${sign}${num.toFixed(1)}%`;
};

export const GrowthBadge = ({ value, size = "small", exportText }: GrowthBadgeProps) => {
    if (value === undefined || value === null) return <span>-</span>;

    const isPositive = value > 0;
    const isNegative = value < 0;

    const bg = isPositive ? "#EAF7EE" : isNegative ? "#FDEAEA" : "#F4F5F7";
    const color = isPositive ? "#117A37" : isNegative ? "#C62828" : "#5F6C72";
    const border = isPositive ? "#C9EBD2" : isNegative ? "#F7C8C8" : "#E1E6EA";

    const iconSize = size === "small" ? 16 : 18;
    const { t } = useTranslation();
    const tooltipText = `${t("dashboard.growth")}`


    return (
        <Tooltip title={tooltipText} arrow placement="top">
            <Stack
                direction="row"
                alignItems="center"
                gap={0.5}
                data-export={exportText ?? formatPercent(value)}
                sx={{
                    display: "inline-flex",
                    // height,
                    // px,
                    padding: "0px 6px",
                    borderRadius: "6px",
                    backgroundColor: bg,
                    color,
                    border: `1px solid ${border}`,
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1,
                }}
            >
                {isPositive ? (
                    <ArrowUpwardRounded sx={{ fontSize: iconSize }} />
                ) : isNegative ? (
                    <ArrowDownwardRounded sx={{ fontSize: iconSize }} />
                ) : (
                    <TrendingFlatRounded sx={{ fontSize: iconSize }} />
                )}
                <span>{formatPercent(value)}</span>
            </Stack>
        </Tooltip>
    );
};

export default GrowthBadge;


