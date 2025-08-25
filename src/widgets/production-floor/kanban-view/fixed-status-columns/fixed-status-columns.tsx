import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import { KanbanColumnComponent } from "../kanban-column/kaban-column-component";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { ICategory } from "../types/kanban-types";

interface IProps {
  categories: ICategory[];
  missionsByStation: Record<string, IStatusesBoardsMissions[]>;
  isMobile?: boolean;
}

const FixedStatusColumns: React.FC<IProps> = ({
  categories,
  missionsByStation,
  isMobile,
}) => {
  // Get all unique statuses from all missions
  const getAllStatuses = () => {
    const statusSet = new Set<string>();
    Object.values(missionsByStation).forEach((stationMissions) => {
      stationMissions.forEach((statusBoard) => {
        statusSet.add(statusBoard.boardMissionStatus.boardMissionStatus.id);
      });
    });
    return Array.from(statusSet);
  };

  const allStatuses = getAllStatuses();

  // Get all stations from all categories
  const getAllStations = () => {
    return categories.flatMap((category) => category.stations);
  };

  const allStations = getAllStations();

  return (
    <Stack
      direction="row"
      spacing={0}
      sx={{
        width: "100%",
        minHeight: "100%",
      }}
    >
      {/* Production Stations Header */}
      <Stack
        sx={{
          width: isMobile ? "150px" : "200px",
          minWidth: isMobile ? "150px" : "200px",
          backgroundColor: "#f8f9fa",
          borderRight: "1px solid #e0e0e0",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#495057",
              fontSize: "1rem",
            }}
          >
            Production Stations
          </Typography>
        </Box>

        {/* Station Names */}
        <Stack spacing={0}>
          {allStations.map((station) => (
            <Box
              key={station.id}
              sx={{
                padding: "12px 16px",
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "white",
                minHeight: "60px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "#495057",
                  fontSize: "0.9rem",
                }}
              >
                {station.name}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>

      {/* Status Columns */}
      {allStatuses.map((statusId) => {
        // Find the status board for this status ID
        const statusBoard = Object.values(missionsByStation)
          .flat()
          .find(
            (board) =>
              board.boardMissionStatus.boardMissionStatus.id === statusId
          );

        if (!statusBoard) return null;

        const status = statusBoard.boardMissionStatus.boardMissionStatus;

        return (
          <Stack
            key={statusId}
            sx={{
              width: isMobile ? "200px" : "250px",
              minWidth: isMobile ? "200px" : "250px",
              borderRight: "1px solid #e0e0e0",
            }}
          >
            {/* Status Header */}
            <Box
              sx={{
                padding: "16px",
                backgroundColor: "white",
                borderBottom: "1px solid #e0e0e0",
                borderTop: `3px solid ${status.textColor || "#1976d2"}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: status.textColor || "#1976d2",
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              >
                {status.name}
              </Typography>
            </Box>

            {/* Station Rows */}
            <Stack spacing={0}>
              {allStations.map((station) => {
                const stationMissions = missionsByStation[station.id] || [];
                const statusMissions = stationMissions.find(
                  (board) =>
                    board.boardMissionStatus.boardMissionStatus.id === statusId
                );

                return (
                  <Box
                    key={`${station.id}-${statusId}`}
                    sx={{
                      padding: "8px",
                      borderBottom: "1px solid #e0e0e0",
                      backgroundColor: "white",
                      minHeight: "60px",
                    }}
                  >
                    {statusMissions &&
                    statusMissions.boardMissions.length > 0 ? (
                      <Stack spacing={1}>
                        {statusMissions.boardMissions
                          .slice(0, 3)
                          .map((mission, index) => (
                            <Box
                              key={`${mission.id}-${index}`}
                              sx={{
                                padding: "8px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "4px",
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 500,
                                  color: "#495057",
                                  fontSize: "0.8rem",
                                }}
                              >
                                {mission.boardMissionNumber} - {mission.jobName}
                              </Typography>
                            </Box>
                          ))}
                        {statusMissions.boardMissions.length > 3 && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#6c757d",
                              fontSize: "0.7rem",
                              textAlign: "center",
                            }}
                          >
                            +{statusMissions.boardMissions.length - 3} more
                          </Typography>
                        )}
                      </Stack>
                    ) : (
                      <Box
                        sx={{
                          height: "44px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6c757d",
                            fontSize: "0.8rem",
                          }}
                        >
                          No tasks
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};

export { FixedStatusColumns };
