import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import { STATUS_COLUMNS } from "../constants/status-columns";
import { useTranslation } from "react-i18next";

interface IProps {
  isMobile?: boolean;
}

const FixedStatusHeader: React.FC<IProps> = ({ isMobile }) => {
  const { t } = useTranslation();
  const statusColumns = STATUS_COLUMNS;

  return (
    <Stack
      direction="row"
      spacing={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "2px solid #e0e0e0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Production Stations Header */}
      <Box
        sx={{
          width: isMobile ? "120px" : "200px",
          minWidth: isMobile ? "120px" : "200px",
          backgroundColor: "#f8f9fa",
          borderRight: "1px solid #e0e0e0",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#495057",
            fontSize: isMobile ? "0.9rem" : "1rem",
          }}
        >
          {t("boardMissions.productionStations")}
        </Typography>
      </Box>

      {/* Status Columns */}
      {statusColumns.map((status, index) => (
        <Box
          key={status.name}
          sx={{
            flex: 1,
            minWidth: isMobile ? "120px" : "150px",
            backgroundColor: status.bgColor,
            borderRight: "1px solid #e0e0e0", // Always show right border
            borderLeft: index === 0 ? "none" : "1px solid #e0e0e0", // Show left border except for first column
            padding: "16px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: status.color,
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              textAlign: "center",
            }}
          >
            {t(`productionStatuses.${status.name}`)}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
};

export { FixedStatusHeader };
