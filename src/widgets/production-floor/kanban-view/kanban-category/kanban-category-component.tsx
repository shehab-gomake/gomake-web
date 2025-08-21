import React from "react";
import { Stack, Typography, IconButton, Box } from "@mui/material";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { ICategory, IStation } from "../types/kanban-types";
import { StationLane } from "../station-lane/station-lane";

interface IProps {
  category: ICategory;
  missionsByStation: Record<string, IStatusesBoardsMissions[]>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

const KanbanCategoryComponent: React.FC<IProps> = ({
  category,
  missionsByStation,
  isCollapsed,
  onToggleCollapse,
  isMobile,
}) => {
  const totalStations = category.stations.length;
  const totalActiveJobs = category.stations.reduce(
    (sum, station) => sum + station.activeJobs,
    0
  );

  return (
    <Stack
      spacing={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        width: "100%",
      }}
    >
      {/* Category Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          cursor: "pointer",
          padding: "16px 20px",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e0e0e0",
          "&:hover": {
            backgroundColor: "#e9ecef",
          },
        }}
        onClick={onToggleCollapse}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
            {category.icon} {category.name}
          </Typography>
          {/* !here need translation with prefix boardMissions */}
          <Box
            sx={{
              backgroundColor: "#e3f2fd",
              color: "#1976d2",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "0.8rem",
              fontWeight: 500,
            }}
          >
            {totalStations} stations with {totalActiveJobs} active jobs
          </Box>
        </Stack>
        <IconButton size="small">
          {isCollapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      </Stack>

      {/* Category Content - Station Lanes */}
      {!isCollapsed && (
        <Stack spacing={0}>
          {category.stations.map((station) => (
            <StationLane
              key={station.id}
              station={station}
              missions={missionsByStation[station.id] || []}
              isMobile={isMobile}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export { KanbanCategoryComponent };
