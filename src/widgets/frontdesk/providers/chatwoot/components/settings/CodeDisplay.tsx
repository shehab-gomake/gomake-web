/**
 * CodeDisplay Component
 *
 * Displays code snippets with syntax highlighting and copy-to-clipboard functionality.
 * Used for webhook URLs, API tokens, installation scripts, etc.
 */

import React, { useState } from "react";
import { Box, Typography, IconButton, Tooltip, Paper } from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export interface CodeDisplayProps {
  /** Code content to display */
  code: string;
  /** Optional label */
  label?: string;
  /** Programming language for syntax highlighting (future enhancement) */
  language?: "javascript" | "bash" | "json" | "html" | "text";
  /** Maximum height before scrolling */
  maxHeight?: number;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  code,
  label,
  language = "text",
  maxHeight = 200,
  showLineNumbers = false,
}) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const lines = showLineNumbers ? code.split("\n") : [];

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {label}
        </Typography>
      )}

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {/* Copy Button */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.1)",
                },
              }}
            >
              {copied ? (
                <CheckIcon sx={{ fontSize: 16, color: theme.palette.success.main }} />
              ) : (
                <CopyIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Code Content */}
        <Box
          sx={{
            p: 2,
            pr: 6, // Space for copy button
            maxHeight,
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: "0.8125rem",
            lineHeight: 1.6,
          }}
        >
          {showLineNumbers ? (
            <Box sx={{ display: "flex" }}>
              {/* Line Numbers */}
              <Box
                sx={{
                  pr: 2,
                  mr: 2,
                  borderRight: `1px solid ${theme.palette.divider}`,
                  color: theme.palette.text.disabled,
                  userSelect: "none",
                  minWidth: 40,
                  textAlign: "right",
                }}
              >
                {lines.map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </Box>

              {/* Code Lines */}
              <Box sx={{ flex: 1, color: theme.palette.text.primary }}>
                {lines.map((line, index) => (
                  <div key={index}>{line || "\u00A0"}</div>
                ))}
              </Box>
            </Box>
          ) : (
            <pre
              style={{
                margin: 0,
                color: theme.palette.text.primary,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {code}
            </pre>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
