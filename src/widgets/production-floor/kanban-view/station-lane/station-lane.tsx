import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
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
import { useSimpleApproveModal } from "@/hooks/use-simple-approve-modal";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";
import { AddStuckReasonWidget } from "../../add-stuck-reason/add-stuck-reason";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { FrontDeskEmailComposerWrapper } from "@/pages-components/quotes/components/frontdesk-email-composer-wrapper";
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";

interface IProps {
  station: IStation;
  missions: IStatusesBoardsMissions[];
  isMobile?: boolean;
  categoryName?: string; // Add category name to validate action boundaries
  isEmailComposerOpenApproval?: boolean;
  emailDataApproval?: any;
  openEmailComposerApproval?: (documentId: string | number) => void;
  closeEmailComposerApproval?: () => void;
  isLoadingEmailDataApproval?: boolean;
}

const StationLane: React.FC<IProps> = ({
  station,
  missions,
  isMobile,
  categoryName,
  isEmailComposerOpenApproval,
  emailDataApproval,
  openEmailComposerApproval,
  closeEmailComposerApproval,
  isLoadingEmailDataApproval,
}) => {
  const { updateStatus, t: productionFloorT } = useProductionFloorData();
  const globalStatuses = useRecoilValue(productionFloorStatusesState);
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);
  const {
    openSimpleApproveModal,
    handleOpenModal,
    handleCloseModal,
    handleConfirm,
    openSimpleStuckModal,
    handleOpenStuckModal,
    handleCloseStuckModal,
    stuckReason,
    setStuckReason,
    onUpdateStuckReason,
    boardMissionId,
  } = useSimpleApproveModal(updateStatus);

  // Use fixed status columns that match the header
  const statusColumns = STATUS_COLUMNS;

  // Memoize missions per status to avoid recalculating on every render
  const missionsByStatus = useMemo(() => {
    const result: Record<string, any[]> = {};
    statusColumns.forEach((col) => {
      const possibleNames = STATUS_NAME_MAPPING[col.name] || [col.name];
      const matchingStatusGroup = missions.find((statusGroup) => {
        const statusGroupName =
          statusGroup.boardMissionStatus.boardMissionStatus.name;
        return possibleNames.includes(statusGroupName);
      });
      result[col.name] = matchingStatusGroup?.boardMissions || [];
    });
    return result;
  }, [missions, statusColumns]);

  // Optimized getMissionsForStatus using memoized data
  const getMissionsForStatusOptimized = useCallback(
    (statusName: string) => {
      return missionsByStatus[statusName] || [];
    },
    [missionsByStatus]
  );

  // Row resizing functionality
  const SINGLE_CARD_HEIGHT = 110; // Height for single card (card minHeight + padding + gap)
  // Height for multiple cards: 2.5 cards visible by default
  // Card height (~105px) * 2.5 + padding (8px top + 8px bottom) + gap (8px between cards) ≈ 287px
  const MULTIPLE_CARDS_HEIGHT = 287; // Height for multiple cards (shows 2.5 cards)

  // Calculate default height based on max cards in any column
  const calculateDefaultHeight = useCallback(() => {
    let maxCardsInAnyColumn = 0;
    statusColumns.forEach((col) => {
      const statusMissions = missionsByStatus[col.name] || [];
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
  }, [statusColumns, missionsByStatus]);

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
  const initialTopRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const pendingHeightRef = useRef<number | null>(null);

  // Handle resize mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!rowRef.current) return;

    // Store the initial top position of the row to avoid repeated getBoundingClientRect calls
    // We'll calculate height as distance from row top to mouse position
    const rect = rowRef.current.getBoundingClientRect();
    initialTopRef.current = rect.top;

    setIsResizing(true);
  }, []);

  // Handle resize mouse move - optimized with requestAnimationFrame
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      // Cancel any pending animation frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Calculate new height as distance from row top to current mouse position
      // This approach works correctly for both increasing and decreasing
      const newHeight = e.clientY - initialTopRef.current;

      const minHeight = SINGLE_CARD_HEIGHT;
      // No maximum height limit - allow unlimited expansion
      // Only enforce minimum height
      const clampedHeight = Math.max(minHeight, newHeight);

      // Store pending height
      pendingHeightRef.current = clampedHeight;

      // Use requestAnimationFrame for smooth updates
      rafIdRef.current = requestAnimationFrame(() => {
        if (pendingHeightRef.current !== null) {
          setRowHeight(pendingHeightRef.current);
          pendingHeightRef.current = null;
        }
        rafIdRef.current = null;
      });
    },
    [isResizing]
  );

  // Handle resize mouse up
  const handleMouseUp = useCallback(() => {
    // Cancel any pending animation frame
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (isResizing) {
      setIsResizing(false);

      // Save final height to localStorage
      const finalHeight =
        pendingHeightRef.current !== null
          ? pendingHeightRef.current
          : rowHeight;

      if (typeof window !== "undefined") {
        localStorage.setItem(
          `kanban-station-height-${station.id}`,
          finalHeight.toString()
        );
      }

      pendingHeightRef.current = null;
    }
  }, [isResizing, rowHeight, station.id]);

  // Attach/detach mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
      document.body.style.pointerEvents = "none"; // Prevent interactions during resize

      // Re-enable pointer events on the row itself
      if (rowRef.current) {
        rowRef.current.style.pointerEvents = "auto";
      }
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.body.style.pointerEvents = "";

      if (rowRef.current) {
        rowRef.current.style.pointerEvents = "";
      }
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.body.style.pointerEvents = "";

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Check if any column has multiple cards - memoized for performance
  const hasMultipleCardsInAnyColumn = useMemo(() => {
    return statusColumns.some((col) => {
      const statusMissions = missionsByStatus[col.name] || [];
      return statusMissions.length > 1;
    });
  }, [statusColumns, missionsByStatus]);

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

  // Helper function to handle status update with modal checks
  const handleStatusUpdate = useCallback((mission: any, statusId: string) => {
    if (statusId === "79251980-1c2d-4b4f-9ab4-9ccb9cb9fb63" && mission.isNeedExample) {
      handleOpenModal(statusId, [mission], mission.id);
    } else if (statusId === "56dd1e80-7436-462c-82e9-cf8a90afd614") {
      handleOpenStuckModal(statusId, [mission], mission.id, mission.productType);
    } else {
      updateStatus([mission], statusId).then();
    }
  }, [handleOpenModal, handleOpenStuckModal, updateStatus]);

  // Helper function to update station (machine or employee)
  const updateStation = async (
    mission: any,
    targetStationInfo: any,
    targetStatusId?: string
  ) => {
    const callBack = (res: any) => { };

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
      handleStatusUpdate(mission, targetStatusId);
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
        maxHeight: "none", // No limit - allow unlimited expansion
        position: "relative",
        overflowX: "auto",
        overflowY: "hidden",
        boxSizing: "border-box",
        flexWrap: "nowrap",
        "::-webkit-scrollbar": {
          height: "8px",
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
        const statusMissions = getMissionsForStatusOptimized(status.name);

        // Check if this specific column has multiple cards
        const hasMultipleCardsInThisColumn = statusMissions.length > 1;

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
                  handleStatusUpdate(item, actualStatusId);
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
            handleStatusUpdate,
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
              flex: status.name === "Waiting" ? 2 : 1,
              minWidth:
                status.name === "Waiting"
                  ? isMobile
                    ? "240px"
                    : "300px"
                  : isMobile
                    ? "120px"
                    : "150px",
              backgroundColor:
                isOver && canDrop
                  ? "#f0f8ff"
                  : isOver && !canDrop
                    ? "#fff5f5"
                    : "white",
              padding: "8px",
              display: status.name === "Waiting" ? "grid" : "flex",
              flexDirection: status.name === "Waiting" ? undefined : "column",
              gridTemplateColumns:
                status.name === "Waiting" ? "1fr 1fr" : undefined,
              gap: "8px",
              alignItems: status.name === "Waiting" ? "start" : "flex-start", // Prevent cards from stretching
              alignContent: status.name === "Waiting" ? "start" : undefined, // Align grid content to start
              justifyContent: "flex-start", // Align cards to top, don't distribute space
              overflow: hasMultipleCardsInThisColumn ? "auto" : "hidden",
              height: hasMultipleCardsInAnyColumn
                ? `${statusColumnHeight}px`
                : "auto",
              maxHeight: "none", // No limit - allow unlimited expansion
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
                {statusMissions.map((mission) => (
                  <Box
                    key={mission.id}
                    sx={
                      status.name === "Waiting"
                        ? {
                          width: "100%",
                          minWidth: 0,
                          height: "auto",
                          alignSelf: "start",
                        }
                        : {
                          width: "100%",
                          flexShrink: 0,
                          flexGrow: 0,
                          height: "auto",
                        }
                    }
                  >
                    <JobCard
                      mission={mission}
                      isMobile={isMobile}
                      stationId={station.id}
                      categoryName={categoryName}
                      isDisabled={false}
                    />
                  </Box>
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
      <GoMakeDeleteModal
        title={t("sales.quote.simpleApproveMail")}
        yesBtn={t("modal.yes")}
        modalType={ModalType.WARNING}
        subTitle={" "}
        openModal={openSimpleApproveModal}
        onClose={handleCloseModal}
        onClickDelete={hasFrontDeskFeature && boardMissionId ? () => {
          openEmailComposerApproval?.(boardMissionId);
          handleCloseModal();
        } : () => {
          handleConfirm();
        }}
        onClickCancel={handleCloseModal}
      />

      {isEmailComposerOpenApproval && boardMissionId && (
        <FrontDeskEmailComposerWrapper
          open={isEmailComposerOpenApproval}
          onClose={closeEmailComposerApproval}
          emailData={emailDataApproval}
          documentId={boardMissionId}
          documentType={21 as DOCUMENT_TYPE}
          isLoading={isLoadingEmailDataApproval}
        />
      )}
      <GoMakeDeleteModal
        title={t("sales.quote.stuckReasonTitleModal")}
        yesBtn={t("modal.yes")}
        modalType={ModalType.WARNING}
        subTitle={" "}
        openModal={openSimpleStuckModal}
        onClose={handleCloseStuckModal}
        onClickDelete={() => onUpdateStuckReason(stuckReason)}
      >
        <AddStuckReasonWidget
          stuckReason={stuckReason}
          setStuckReason={setStuckReason}
        />
      </GoMakeDeleteModal>
    </Stack>
  );
};

export { StationLane };
