import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { IStation } from "../types/kanban-types";
import { JobCard } from "../job-card/job-card";
import { useDrop } from "react-dnd";
import { useProductionFloorData } from "../../use-production-floor-data";
import {
  STATUS_COLUMNS,
  STATUS_NAME_MAPPING,
} from "../constants/status-columns";

interface IProps {
  station: IStation;
  missions: IStatusesBoardsMissions[];
  isMobile?: boolean;
}

const StationLane: React.FC<IProps> = ({ station, missions, isMobile }) => {
  const { updateStatus } = useProductionFloorData();

  // Use fixed status columns that match the header
  const statusColumns = STATUS_COLUMNS;

  // Helper function to get the actual status ID for a given status name
  const getStatusIdForName = (statusName: string): string | null => {
    const possibleNames = STATUS_NAME_MAPPING[statusName] || [statusName];

    const statusMission = missions.find((mission) => {
      const missionStatusName =
        mission.boardMissionStatus.boardMissionStatus.name;
      return possibleNames.includes(missionStatusName);
    });

    return statusMission?.boardMissionStatus.boardMissionStatus.id || null;
  };

  // Helper function to get missions for a specific status
  const getMissionsForStatus = (statusName: string) => {
    const possibleNames = STATUS_NAME_MAPPING[statusName] || [statusName];

    const statusMission = missions.find((mission) => {
      const missionStatusName =
        mission.boardMissionStatus.boardMissionStatus.name;
      return possibleNames.includes(missionStatusName);
    });

    return statusMission?.boardMissions || [];
  };

  return (
    <Stack
      direction="row"
      spacing={0}
      sx={{
        borderBottom: "1px solid #e0e0e0",
        minHeight: "120px",
      }}
    >
      {/* Station Header */}
      <Box
        sx={{
          width: isMobile ? "120px" : "200px",
          minWidth: isMobile ? "120px" : "200px",
          backgroundColor: "#f8f9fa",
          borderRight: "1px solid #e0e0e0",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#495057",
            fontSize: isMobile ? "0.8rem" : "0.9rem",
            marginBottom: "4px",
          }}
        >
          {station.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "#6c757d",
            fontSize: "0.75rem",
          }}
        >
          Capacity: {station.capacity} | {station.activeJobs} Active
        </Typography>
      </Box>

      {/* Status Columns */}
      {statusColumns.map((status, index) => {
        const statusMissions = getMissionsForStatus(status.name);

        // Drop functionality for each status column
        const [{ isOver, canDrop }, drop] = useDrop(
          () => ({
            accept: "task",
            canDrop: (item: any) => {
              // Only allow drops within the same station
              return item.stationId === station.id;
            },
            drop: (item: any, monitor) => {
              const didDrop = monitor.didDrop();
              if (didDrop) {
                return;
              }
              // Get the actual status ID for this status name
              const actualStatusId = getStatusIdForName(status.name);
              if (actualStatusId) {
                // Update the mission status
                updateStatus([item], actualStatusId).then();
              }
            },
            collect: (monitor) => ({
              isOver: !!monitor.isOver(),
              canDrop: !!monitor.canDrop(),
            }),
          }),
          [status.name, station.id, getStatusIdForName]
        );

        return (
          <Box
            ref={drop}
            key={status.name}
            sx={{
              flex: 1,
              minWidth: isMobile ? "120px" : "150px",
              backgroundColor: isOver && canDrop ? "#f0f8ff" : "white",
              borderRight:
                index < statusColumns.length - 1 ? "1px solid #e0e0e0" : "none",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflow: "auto",
              maxHeight: "120px",
              border: isOver && canDrop ? "2px dashed #1976d2" : "none",
              "::-webkit-scrollbar": {
                width: "4px",
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: "#CCCDCF",
                borderRadius: "2px",
              },
              "::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#888",
              },
            }}
          >
            {statusMissions.length > 0 ? (
              statusMissions.map((mission, missionIndex) => (
                <JobCard
                  key={`${mission.id}-${missionIndex}`}
                  mission={mission}
                  isMobile={isMobile}
                  stationId={station.id}
                />
              ))
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6c757d",
                  fontSize: "0.8rem",
                }}
              >
                No tasks
              </Box>
            )}
          </Box>
        );
      })}
    </Stack>
  );
};

export { StationLane };
