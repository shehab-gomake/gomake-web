/**
 * CSATDisplayTypeSelector Component
 *
 * Visual selector for CSAT display type (emoji or star rating).
 * Used in the CSAT tab of inbox settings.
 */

import React from "react";
import { Box, Paper, Typography, Radio } from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarOutlineIcon,
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export type CSATDisplayType = "emoji" | "star";

export interface CSATDisplayTypeSelectorProps {
  /** Currently selected type */
  value: CSATDisplayType;
  /** Change handler */
  onChange: (type: CSATDisplayType) => void;
  /** Disabled state */
  disabled?: boolean;
}

export const CSATDisplayTypeSelector: React.FC<
  CSATDisplayTypeSelectorProps
> = ({ value, onChange, disabled = false }) => {
  const theme = useTheme();

  const options: Array<{
    value: CSATDisplayType;
    label: string;
    description: string;
    preview: React.ReactNode;
  }> = [
    {
      value: "emoji",
      label: "Emoji Rating",
      description: "Visual faces from very dissatisfied to very satisfied",
      preview: (
        <Box sx={{ display: "flex", gap: 0.5, fontSize: 24 }}>
          <SentimentVeryDissatisfied sx={{ color: "#EF4444", fontSize: 28 }} />
          <SentimentDissatisfied sx={{ color: "#F59E0B", fontSize: 28 }} />
          <SentimentNeutral sx={{ color: "#6B7280", fontSize: 28 }} />
          <SentimentSatisfied sx={{ color: "#10B981", fontSize: 28 }} />
          <SentimentVerySatisfied sx={{ color: "#059669", fontSize: 28 }} />
        </Box>
      ),
    },
    {
      value: "star",
      label: "Star Rating",
      description: "Classic 5-star rating system",
      preview: (
        <Box sx={{ display: "flex", gap: 0.25 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              sx={{ color: "#F59E0B", fontSize: 28 }}
            />
          ))}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <Paper
            key={option.value}
            elevation={0}
            sx={{
              flex: "1 1 280px",
              minWidth: 280,
              p: 2.5,
              border: `2px solid ${
                isSelected ? theme.palette.primary.main : theme.palette.divider
              }`,
              borderRadius: 2,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
              transition: "all 0.2s",
              backgroundColor: isSelected
                ? theme.palette.primary.main + "08"
                : theme.palette.background.paper,
              "&:hover": disabled
                ? {}
                : {
                    borderColor: isSelected
                      ? theme.palette.primary.dark
                      : theme.palette.primary.light,
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[2],
                  },
            }}
            onClick={() => !disabled && onChange(option.value)}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              {/* Radio Button */}
              <Radio
                checked={isSelected}
                disabled={disabled}
                sx={{ mt: -0.5 }}
              />

              {/* Content */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                  }}
                >
                  {option.label}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: theme.palette.text.secondary,
                    mb: 2,
                    lineHeight: 1.4,
                  }}
                >
                  {option.description}
                </Typography>

                {/* Preview */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.02)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {option.preview}
                </Box>
              </Box>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};
