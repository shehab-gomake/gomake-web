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
import { useGomakeAxios } from "@/hooks";
import {
  boardMissionsUpdateActionMachine,
  boardMissionsUpdateActionEmployee,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { Console } from "console";

interface IProps {
  station: IStation;
  missions: IStatusesBoardsMissions[];
  isMobile?: boolean;
  categoryName?: string; // Add category name to validate action boundaries
}

const StationLane: React.FC<IProps> = ({
  station,
  missions,
  isMobile,
  categoryName,
}) => {
  const { updateStatus } = useProductionFloorData();
  const globalStatuses = useRecoilValue(productionFloorStatusesState);
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();

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

    // If not found in current missions or global statuses, try to find in any mission data
    // This ensures we get the actual boardMissionStatus.id from the API response
    for (const statusGroup of missions) {
      const statusGroupName =
        statusGroup.boardMissionStatus.boardMissionStatus.name;
      if (possibleNames.includes(statusGroupName)) {
        return statusGroup.boardMissionStatus.boardMissionStatus.id;
      }
    }

    // If still not found, return null instead of using mock data
    console.warn(`No status ID found for status name: ${statusName}`);
    return null;
  };

  // Helper function to get missions for a specific status
  const getMissionsForStatus = (statusName: string) => {
    const possibleNames = STATUS_NAME_MAPPING[statusName] || [statusName];

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

    return [];
  };

  // Helper function to get station info from missions
  const getStationInfo = () => {
    // Get the first mission to extract station info
    const firstMission = missions.flatMap((m) => m.boardMissions)[0];
    if (firstMission?.currentStation) {
      return {
        machineId: firstMission.currentStation.machineId,
        machineName: firstMission.currentStation.machineName,
        employeeId: firstMission.currentStation.employeeId,
        actionId: firstMission.currentStation.actionId,
        actionName: firstMission.currentStation.actionName,
        //!here
      };
    }
    return null;
  };

  const stationInfo = getStationInfo();

  // Drop functionality for station header
  const [{ isOver: isHeaderOver, canDrop: canHeaderDrop }, headerDrop] =
    useDrop(
      () => ({
        accept: "task",
        canDrop: (item: any) => {
          // Only allow drops from different stations within the same action/category
          return (
            item.stationId !== station.id && item.categoryName === categoryName
          );
        },
        drop: (item: any, monitor) => {
          const didDrop = monitor.didDrop();
          if (didDrop) {
            return;
          }
          // This is a station change - update machine/employee
          if (stationInfo) {
            updateStation(item, stationInfo);
          }
        },
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop(),
        }),
      }),
      [station.id, stationInfo, categoryName]
    );

  // Helper function to update station (machine or employee)
  const updateStation = async (
    mission: any,
    targetStationInfo: any,
    targetStatusId?: string
  ) => {
    const callBack = (res: any) => {
      if (res.success) {
        console.log("Station updated successfully");
        // Optionally refresh data or show success message
      } else {
        console.error("Failed to update station:", res);
        // Optionally show error message
      }
    };

    if (targetStationInfo.machineId && targetStationInfo.machineName) {
      // Update machine
      await boardMissionsUpdateActionMachine(callApi, callBack, {
        boardMissionActionId: mission?.currentStation?.id,
        machineId: targetStationInfo.machineId,
        machineName: targetStationInfo.machineName,
        workFlowActionId: mission?.currentStation?.workFlowActionId, //!here
      });
    } else if (targetStationInfo.employeeId) {
      // Update employee
      await boardMissionsUpdateActionEmployee(callApi, callBack, {
        boardMissionActionId: mission?.currentStation?.id,
        employeeId: targetStationInfo.employeeId,
        employeeName: targetStationInfo.machineName
          ? targetStationInfo.machineName.split("(")[0].trim()
          : "",
      });
    }

    // If we have a target status ID, also update the status
    if (targetStatusId) {
      updateStatus([mission], targetStatusId).then();
    }
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
        ref={headerDrop}
        sx={{
          width: isMobile ? "120px" : "200px",
          minWidth: isMobile ? "120px" : "200px",
          backgroundColor:
            isHeaderOver && canHeaderDrop
              ? "#f0f8ff"
              : isHeaderOver && !canHeaderDrop
              ? "#fff5f5"
              : "#f8f9fa",
          borderRight: "1px solid #e0e0e0",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          border:
            isHeaderOver && canHeaderDrop
              ? "2px dashed #1976d2"
              : isHeaderOver && !canHeaderDrop
              ? "2px dashed #f44336"
              : "none",
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
          {isHeaderOver && canHeaderDrop && (
            <span
              style={{
                color: "#1976d2",
                fontSize: "0.7rem",
                marginLeft: "4px",
              }}
            >
              (Drop to change station)
            </span>
          )}
          {isHeaderOver && !canHeaderDrop && (
            <span
              style={{
                color: "#f44336",
                fontSize: "0.7rem",
                marginLeft: "4px",
              }}
            >
              (Cannot drop from different action)
            </span>
          )}
        </Typography>
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
              // Allow drops from any station within the same action/category
              return item.categoryName === categoryName;
            },
            drop: (item: any, monitor) => {
              const didDrop = monitor.didDrop();
              if (didDrop) {
                return;
              }

              // Check if this is a station change (different stationId)
              if (item.stationId !== station.id) {
                // This is a station change - update machine/employee AND status
                if (stationInfo) {
                  const actualStatusId = getStatusIdForName(status.name);
                  updateStation(item, stationInfo, actualStatusId);
                }
              } else {
                // This is a status change within the same station
                const actualStatusId = getStatusIdForName(status.name);
                if (actualStatusId) {
                  updateStatus([item], actualStatusId).then();
                } else {
                  console.warn(
                    `No status ID found for status name: ${status.name}`
                  );
                }
              }
            },
            collect: (monitor) => ({
              isOver: !!monitor.isOver(),
              canDrop: !!monitor.canDrop(),
            }),
          }),
          [
            status.name,
            station.id,
            getStatusIdForName,
            stationInfo,
            categoryName,
          ]
        );

        return (
          <Box
            ref={drop}
            key={status.name}
            sx={{
              flex: 1,
              minWidth: isMobile ? "120px" : "150px",
              backgroundColor:
                isOver && canDrop
                  ? "#f0f8ff"
                  : isOver && !canDrop
                  ? "#fff5f5"
                  : "white",
              borderRight: "1px solid #e0e0e0", // Always show right border
              borderLeft: index === 0 ? "none" : "1px solid #e0e0e0", // Show left border except for first column
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflow: "auto",
              maxHeight: hasMultipleCards ? "204px" : "106px", // Dynamic height: 2 cards if any column has multiple, 1 card if all single
              minHeight: hasMultipleCards ? "204px" : "106px", // Ensure minimum height for consistent layout
              border:
                isOver && canDrop
                  ? "2px dashed #1976d2"
                  : isOver && !canDrop
                  ? "2px dashed #f44336"
                  : "none",
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
                    categoryName={categoryName}
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
                {isOver && canDrop ? (
                  <span style={{ color: "#1976d2", fontSize: "0.8rem" }}>
                    Drop to change station & status
                  </span>
                ) : isOver && !canDrop ? (
                  <span style={{ color: "#f44336", fontSize: "0.8rem" }}>
                    Cannot drop from different action
                  </span>
                ) : (
                  t("boardMissions.noTasks")
                )}
              </Box>
            )}
          </Box>
        );
      })}
    </Stack>
  );
};

export { StationLane };
