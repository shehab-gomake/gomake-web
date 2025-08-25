import React, { useState } from "react";
import { Stack, Typography, Tooltip } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { FONT_FAMILY } from "@/utils/font-family";

interface ZoomControlProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  currentZoom: number;
  minZoom?: number;
  maxZoom?: number;
}

const ZoomControl: React.FC<ZoomControlProps> = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  currentZoom,
  minZoom = 0.5,
  maxZoom = 2.0,
}) => {
  const handleZoomIn = () => {
    if (currentZoom < maxZoom) {
      onZoomIn();
    }
  };

  const handleZoomOut = () => {
    if (currentZoom > minZoom) {
      onZoomOut();
    }
  };

  const handleZoomReset = () => {
    onZoomReset();
  };

  const zoomPercentage = Math.round(currentZoom * 100);

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="8px"
      sx={{
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        padding: "4px 8px",
        border: "1px solid #e0e0e0",
      }}
    >
      <Tooltip title="Zoom Out">
        <PrimaryButton
          style={{
            width: "32px",
            height: "32px",
            padding: 0,
            minWidth: "32px",
          }}
          variant="outlined"
          onClick={handleZoomOut}
          disabled={currentZoom <= minZoom}
        >
          <RemoveIcon style={{ fontSize: "16px" }} />
        </PrimaryButton>
      </Tooltip>

      <Tooltip title="Reset Zoom">
        <Typography
          onClick={handleZoomReset}
          sx={{
            ...FONT_FAMILY.Lexend(500, 12),
            color: "#666",
            cursor: "pointer",
            minWidth: "40px",
            textAlign: "center",
            "&:hover": {
              color: "#333",
            },
          }}
        >
          {zoomPercentage}%
        </Typography>
      </Tooltip>

      <Tooltip title="Zoom In">
        <PrimaryButton
          style={{
            width: "32px",
            height: "32px",
            padding: 0,
            minWidth: "32px",
          }}
          variant="outlined"
          onClick={handleZoomIn}
          disabled={currentZoom >= maxZoom}
        >
          <AddIcon style={{ fontSize: "16px" }} />
        </PrimaryButton>
      </Tooltip>
    </Stack>
  );
};

export { ZoomControl };
