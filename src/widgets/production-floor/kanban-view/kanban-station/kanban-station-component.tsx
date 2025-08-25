import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import { KanbanColumnComponent } from "../kanban-column/kaban-column-component";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { IStation } from "../types/kanban-types";

interface IProps {
  station: IStation;
  missions: IStatusesBoardsMissions[];
  isMobile?: boolean;
}

const KanbanStationComponent: React.FC<IProps> = ({
  station,
  missions,
  isMobile,
}) => {
  // Sort missions by kanban index to maintain proper column order
  const sortedMissions = [...missions].sort(
    (a, b) =>
      a.boardMissionStatus.boardMissionStatus.kanbanIndex -
      b.boardMissionStatus.boardMissionStatus.kanbanIndex
  );

  return (
    <Stack
      spacing={1}
      sx={{
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        padding: "12px",
        border: "1px solid #e9ecef",
      }}
    >
      {/* Station Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          padding: "8px 12px",
          backgroundColor: "white",
          borderRadius: "6px",
          border: "1px solid #dee2e6",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#495057",
            fontSize: "1rem",
          }}
        >
          {station.name}
        </Typography>
        <Box
          sx={{
            backgroundColor: "#e9ecef",
            color: "#6c757d",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "0.8rem",
            fontWeight: 500,
          }}
        >
          Capacity: {station.capacity} | {station.activeJobs} Active
        </Box>
      </Stack>

      {/* Station Kanban Board */}
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 1 : 2}
        sx={{
          minHeight: isMobile ? "150px" : "200px",
          overflow: "auto",
          maxHeight: isMobile ? "300px" : "400px",
          width: "100%",
          "::-webkit-scrollbar": {
            width: isMobile ? "4px" : "6px",
            height: isMobile ? "4px" : "6px",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#CCCDCF",
            borderRadius: isMobile ? "2px" : "3px",
            cursor: "pointer",
          },
          "::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#888",
          },
        }}
      >
        {sortedMissions.map((statusBoard) => (
          <KanbanColumnComponent
            key={`${station.id}-${statusBoard.boardMissionStatus.boardMissionStatus.id}`}
            status={statusBoard.boardMissionStatus.boardMissionStatus}
            boardsMissions={statusBoard.boardMissions}
            isMobile={isMobile}
            stationId={station.id}
            maxCards={4} // Show max 4 cards by default
          />
        ))}
      </Stack>
    </Stack>
  );
};

export { KanbanStationComponent };
