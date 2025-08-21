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
import { useRecoilValue } from "recoil";
import { productionFloorStatusesState } from "../../state/boards";
import { useTranslation } from "react-i18next";

interface IProps {
  station: IStation;
  missions: IStatusesBoardsMissions[];
  isMobile?: boolean;
}

const StationLane: React.FC<IProps> = ({ station, missions, isMobile }) => {
  const { updateStatus } = useProductionFloorData();
  const globalStatuses = useRecoilValue(productionFloorStatusesState);
  const { t } = useTranslation();

  // Use fixed status columns that match the header
  const statusColumns = STATUS_COLUMNS;

  // Helper function to get the actual status ID for a given status name
  const getStatusIdForName = (statusName: string): string | null => {
    const possibleNames = STATUS_NAME_MAPPING[statusName] || [statusName];

    // First try to find in the current missions data
    const statusMission = missions.find((statusGroup) => {
      const statusGroupName =
        statusGroup.boardMissionStatus.boardMissionStatus.name;
      return possibleNames.includes(statusGroupName);
    });

    if (statusMission) {
      return statusMission.boardMissionStatus.boardMissionStatus.id;
    }

    // If not found in current missions, try to find in global statuses
    if (globalStatuses && globalStatuses.length > 0) {
      const globalStatus = globalStatuses.find((status) => {
        return possibleNames.includes(status.name);
      });

      if (globalStatus) {
        return globalStatus.id;
      }
    }

    // Fallback to known status IDs
    const statusIdMapping: Record<string, string> = {
      "In Progress": "52e1b026-2028-4dc6-b8fc-0b80ff04db15", // This is the actual "In process" status ID from the data
      "Waiting Approval": "79251980-1c2d-4b4f-9ab4-9ccb9cb9fb63", // This is the actual approval status ID
      Stuck: "56dd1e80-7436-462c-82e9-cf8a90afd614", // This is the actual stuck status ID
    };

    return statusIdMapping[statusName] || null;
  };

  // Helper function to get missions for a specific status
  const getMissionsForStatus = (statusName: string) => {
    const possibleNames = STATUS_NAME_MAPPING[statusName] || [statusName];

    console.log(`Looking for status: ${statusName}`);
    console.log(`Possible names:`, possibleNames);
    console.log(`Available missions in this station:`, missions);

    // Find the status group that matches our status name
    const matchingStatusGroup = missions.find((statusGroup) => {
      const statusGroupName =
        statusGroup.boardMissionStatus.boardMissionStatus.name;
      console.log(`Status group: ${statusGroupName}`);
      return possibleNames.includes(statusGroupName);
    });

    if (matchingStatusGroup) {
      console.log(
        `Found ${matchingStatusGroup.boardMissions.length} missions for status ${statusName}:`,
        matchingStatusGroup.boardMissions
      );
      return matchingStatusGroup.boardMissions || [];
    }

    console.log(`No missions found for status ${statusName}`);
    return [];
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
        {/* !here translation */}
        <Typography
          variant="caption"
          sx={{
            color: "#6c757d",
            fontSize: "0.75rem",
          }}
        >
          {t("boardMissions.capacity")}: {station.capacity} |{" "}
          {station.activeJobs} {t("boardMissions.active")}
        </Typography>
      </Box>

      {/* Status Columns */}
      {statusColumns.map((status, index) => {
        const statusMissions = getMissionsForStatus(status.name);

        // Debug: Log the number of missions for this status
        console.log(`Status ${status.name}: ${statusMissions.length} missions`);

        // Check if any status column has more than 1 mission to determine height
        const hasMultipleCards = statusColumns.some((col) => {
          const missions = getMissionsForStatus(col.name);
          return missions.length > 1;
        });

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
              console.log(
                `Dropping item to status: ${status.name}, statusId: ${actualStatusId}`,
                item
              );
              if (actualStatusId) {
                // Update the mission status
                updateStatus([item], actualStatusId).then();
              } else {
                console.warn(
                  `No status ID found for status name: ${status.name}`
                );
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
              borderRight: "1px solid #e0e0e0", // Always show right border
              borderLeft: index === 0 ? "none" : "1px solid #e0e0e0", // Show left border except for first column
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflow: "auto",
              maxHeight: hasMultipleCards ? "204px" : "106px", // Dynamic height: 2 cards if any column has multiple, 1 card if all single
              minHeight: hasMultipleCards ? "204px" : "106px", // Ensure minimum height for consistent layout
              border: isOver && canDrop ? "2px dashed #1976d2" : "none",
              "::-webkit-scrollbar": {
                width: "8px",
              },
              "::-webkit-scrollbar-track": {
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: "#bdbdbd",
                borderRadius: "4px",
                border: "1px solid #f5f5f5",
              },
              "::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#9e9e9e",
              },
              "::-webkit-scrollbar-corner": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            {statusMissions.length > 0 ? (
              <>
                {statusMissions.map((mission, missionIndex) => (
                  <JobCard
                    key={`${mission.id}-${missionIndex}`}
                    mission={mission}
                    isMobile={isMobile}
                    stationId={station.id}
                  />
                ))}
              </>
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
                {t("boardMissions.noTasks")}
              </Box>
            )}
          </Box>
        );
      })}
    </Stack>
  );
};

export { StationLane };
