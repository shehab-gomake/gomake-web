import React, { useRef, useEffect, useState, useCallback } from "react";
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

  // Helper function to get missions for a specific status
  const getMissionsForStatus = (statusName: string) => {
    const possibleNames = STATUS_NAME_MAPPING[statusName] || [statusName];

    // Find the status group that matches our status name
    const matchingStatusGroup = missions.find((statusGroup) => {
      const statusGroupName =
        statusGroup.boardMissionStatus.boardMissionStatus.name;
      return possibleNames.includes(statusGroupName);
    });

    if (matchingStatusGroup) {
      return matchingStatusGroup.boardMissions || [];
    }

    return [];
  };

  // Row resizing functionality
  const SINGLE_CARD_HEIGHT = 110; // Height for single card (card minHeight + padding + gap)
  // Height for multiple cards: 2.5 cards visible by default
  // Card height (~105px) * 2.5 + padding (8px top + 8px bottom) + gap (8px between cards) ≈ 287px
  const MULTIPLE_CARDS_HEIGHT = 287; // Height for multiple cards (shows 2.5 cards)

  // Calculate default height based on max cards in any column
  const calculateDefaultHeight = useCallback(() => {
    let maxCardsInAnyColumn = 0;
    statusColumns.forEach((col) => {
      const statusMissions = getMissionsForStatus(col.name);
      maxCardsInAnyColumn = Math.max(
        maxCardsInAnyColumn,
        statusMissions.length
      );
    });

    const contentHeight =
      maxCardsInAnyColumn === 0 || maxCardsInAnyColumn === 1
        ? SINGLE_CARD_HEIGHT
        : MULTIPLE_CARDS_HEIGHT;

    // Total height = content height (header is auto, so we don't need to add it)
    return contentHeight;
  }, [statusColumns, missions]);

  // Get stored height from localStorage or use default
  const getStoredHeight = () => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(`kanban-station-height-${station.id}`);
    return stored ? parseInt(stored, 10) : null;
  };

  const [rowHeight, setRowHeight] = useState<number>(() => {
    const stored = getStoredHeight();
    return stored || calculateDefaultHeight();
  });

  const [isResizing, setIsResizing] = useState(false);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  // Handle resize mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  // Handle resize mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !rowRef.current) return;

      const rect = rowRef.current.getBoundingClientRect();
      const newHeight = e.clientY - rect.top;
      const minHeight = SINGLE_CARD_HEIGHT; // Minimum content height
      const maxHeight = 600; // Max 600px for content

      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setRowHeight(newHeight);
      }
    },
    [isResizing]
  );

  // Handle resize mouse up
  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `kanban-station-height-${station.id}`,
          rowHeight.toString()
        );
      }
    }
  }, [isResizing, rowHeight, station.id]);

  // Attach/detach mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Check if any column has multiple cards
  const hasMultipleCardsInAnyColumn = statusColumns.some((col) => {
    const missions = getMissionsForStatus(col.name);
    return missions.length > 1;
  });

  // Recalculate default height when missions change
  useEffect(() => {
    const stored = getStoredHeight();
    if (!stored) {
      const defaultHeight = calculateDefaultHeight();
      setRowHeight(defaultHeight);
    }
  }, [missions, calculateDefaultHeight]);

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
      };
    }
    return null;
  };

  const stationInfo = getStationInfo();

  // Helper function to calculate total production time across all status columns
  const getTotalProductionTime = () => {
    let totalTime = 0;

    missions.forEach((statusGroup) => {
      statusGroup.boardMissions.forEach((mission) => {
        if (mission?.currentStation?.totalProductionTime) {
          totalTime += mission.currentStation.totalProductionTime;
        }
      });
    });

    return totalTime;
  };

  // Helper function to format time from minutes to HH:MM:SS
  const formatTimeToHHMMSS = (minutes: number) => {
    if (!minutes || minutes === 0) return "00:00:00";

    // Convert minutes to seconds first
    const totalSeconds = minutes * 60;

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalProductionTime = getTotalProductionTime();

  // Drop functionality for station header
  const headerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    headerDrop(headerRef.current);
  }, [headerDrop]);

  // Helper function to update station (machine or employee)
  const updateStation = async (
    mission: any,
    targetStationInfo: any,
    targetStatusId?: string
  ) => {
    const callBack = (res: any) => {};

    if (targetStationInfo.machineId && targetStationInfo.machineName) {
      // Update machine
      await boardMissionsUpdateActionMachine(callApi, callBack, {
        boardMissionActionId: mission?.currentStation?.id,
        machineId: targetStationInfo.machineId,
        machineName: targetStationInfo.machineName,
        workFlowActionId: mission?.currentStation?.workFlowActionId,
      });
    } else if (targetStationInfo.employeeId) {
      // Update employee
      await boardMissionsUpdateActionEmployee(callApi, callBack, {
        boardMissionActionId: mission?.currentStation?.id,
        employeeId: targetStationInfo.employeeId,
        employeeName:
          targetStationInfo.employeeName ||
          (targetStationInfo.machineName
            ? targetStationInfo.machineName.split("(")[0].trim()
            : ""),
      });
    }

    // If we have a target status ID, also update the status
    if (targetStatusId) {
      updateStatus([mission], targetStatusId).then();
    }
  };

  // Calculate status column height
  // Since header is auto-height, rowHeight already represents the content area
  // For multi-card rows, we use the full rowHeight; for single-card rows, it's auto
  const statusColumnHeight = rowHeight;

  return (
    <Stack
      ref={rowRef}
      direction="row"
      spacing={0}
      sx={{
        borderBottom: "5px solid #e0e0e0",
        height: hasMultipleCardsInAnyColumn ? `${rowHeight}px` : "auto",
        minHeight: hasMultipleCardsInAnyColumn ? `${rowHeight}px` : "auto",
        maxHeight: hasMultipleCardsInAnyColumn ? `${rowHeight}px` : "none",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Station Header */}
      <Box
        ref={headerRef}
        sx={{
          width: isMobile ? "120px" : "200px",
          minWidth: isMobile ? "120px" : "200px",
          // height: `${DEFAULT_HEADER_HEIGHT}px`,
          flexShrink: 0,
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
          boxSizing: "border-box",
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
            marginBottom: "4px",
          }}
        >
          {t("boardMissions.capacity")}: {station.capacity} |{" "}
          {station.activeJobs} {t("boardMissions.active")}
        </Typography>

        {/* Total Production Time Display */}
        <Typography
          variant="caption"
          sx={{
            color: "#1976d2",
            fontSize: "0.8rem",
            fontWeight: 700,
            fontFamily: "monospace",
            backgroundColor: "#f0f8ff",
            padding: "2px 6px",
            borderRadius: "4px",
            border: "1px solid #e3f2fd",
          }}
        >
          {t("sales.quote.total")}: {formatTimeToHHMMSS(totalProductionTime)}
        </Typography>
      </Box>

      {/* Status Columns */}
      {statusColumns.map((status, index) => {
        const statusMissions = getMissionsForStatus(status.name);

        // Check if this specific column has multiple cards
        const hasMultipleCardsInThisColumn = statusMissions.length > 1;

        // Check if any status column has more than 1 mission to determine row height
        const hasMultipleCardsInAnyColumn = statusColumns.some((col) => {
          const missions = getMissionsForStatus(col.name);
          return missions.length > 1;
        });

        // Drop functionality for each status column
        const dropRef = useRef<HTMLDivElement>(null);
        const [{ isOver, canDrop }, drop] = useDrop(
          () => ({
            accept: "task",
            canDrop: (item: any) => {
              // Prevent drops into "Upcoming Works" column
              if (status.name === "Upcoming Works") {
                return false;
              }
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

        useEffect(() => {
          drop(dropRef.current);
        }, [drop]);

        return (
          <Box
            ref={dropRef}
            key={status.name}
            sx={{
              flex: 1,
              minWidth: isMobile ? "120px" : "150px",
              backgroundColor:
                status.name === "Upcoming Works"
                  ? // ? "#f8f9fa"
                    "white"
                  : isOver && canDrop
                  ? "#f0f8ff"
                  : isOver && !canDrop
                  ? "#fff5f5"
                  : "white",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflow: hasMultipleCardsInThisColumn ? "auto" : "hidden",
              height: hasMultipleCardsInAnyColumn
                ? `${statusColumnHeight}px`
                : "auto",
              maxHeight: hasMultipleCardsInAnyColumn
                ? `${statusColumnHeight}px`
                : "none",
              minHeight: hasMultipleCardsInAnyColumn
                ? `${statusColumnHeight}px`
                : "auto",
              boxSizing: "border-box",
              // Border styling - use outline for hover states to avoid conflicts
              borderRight: "1px solid #e0e0e0",
              outline:
                isOver && canDrop
                  ? "2px dashed #1976d2"
                  : isOver && !canDrop
                  ? "2px dashed #f44336"
                  : "none",
              outlineOffset: "-2px", // Adjust outline position
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
                    // isDisabled={status.name === "Upcoming Works"}
                    isDisabled={false}
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
                  color:
                    status.name === "Upcoming Works" ? "#999999" : "#6c757d",
                  fontSize: "0.8rem",
                }}
              >
                {status.name === "Upcoming Works" ? (
                  <span style={{ color: "#999999", fontSize: "0.8rem" }}>
                    {t("boardMissions.noUpcomingWorks")}
                  </span>
                ) : isOver && canDrop ? (
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

      {/* Resize Handle */}
      <Box
        ref={resizeHandleRef}
        onMouseDown={handleMouseDown}
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "8px",
          cursor: "row-resize",
          backgroundColor: "transparent",
          zIndex: 10,
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.1)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "3px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40px",
            height: "2px",
            backgroundColor: isResizing ? "#1976d2" : "#bdbdbd",
            borderRadius: "1px",
            transition: "background-color 0.2s",
          },
        }}
      />
    </Stack>
  );
};

export { StationLane };
