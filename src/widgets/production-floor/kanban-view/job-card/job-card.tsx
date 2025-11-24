import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Chip, Popover } from "@mui/material";
import { createPortal } from "react-dom";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { useRouter } from "next/router";
import { useDrag } from "react-dnd";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  resetProductionFloorJobColorApi,
  updateProductionFloorJobColorApi,
  updateBoardMissionCurrentStationApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { ColoredCycle, GoMakeDeleteModal } from "@/components";
import { ResetColorIcon } from "../../table-view/status-table/table-row/more-circle/icons/reset-color";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { ArrowRightIcon } from "@/icons";
import { useProductionFloorData } from "../../use-production-floor-data";
import { SketchPicker } from "react-color";
import { useTranslation } from "react-i18next";
import { ModalType } from "@/enums/tabs-icon-enums";
import { STATUS_COLUMNS } from "../constants/status-columns";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { toRgba } from "@/utils/helpers";

interface IProps {
  mission: IBoardMissions;
  isMobile?: boolean;
  stationId?: string;
  categoryName?: string; // Add category name for action boundary validation
  isDisabled?: boolean; // Add disabled state for upcoming works
}

const JobCard: React.FC<IProps> = ({
  mission,
  isMobile,
  stationId,
  categoryName,
  isDisabled = false,
}) => {
  const { push } = useRouter();
  const { CheckPermission } = useUserPermission();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const { tryMoveBoardMissionsToDone } = useProductionFloorData(); //!here

  // Get highlighting style preference (default: "border_and_background")
  const highlightingStyle = CheckPreferenceValue(
    EPreferences.KANBAN_HIGHLIGHTING_STYLE
  ) as string | undefined;
  const isBackgroundOnly = highlightingStyle === "background_only";

  // Get current direction for RTL support
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  // Get "Upcoming Works" status colors
  const upcomingWorksStatus = STATUS_COLUMNS.find(
    (status) => status.name === "Upcoming Works"
  );
  const upcomingWorksColor = mission.productionFloorJobColor || "#3949ab";
  // const upcomingWorksColor = upcomingWorksStatus?.color || "#3949ab";
  const upcomingWorksBgColor = upcomingWorksStatus?.bgColor || "#e8eaf6";

  // Context menu state
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState(mission?.productionFloorJobColor ?? "");
  const [initialColor, setInitialColor] = useState(color);
  const [openNextStationModal, setOpenNextStationModal] = useState(false);

  // Check if user can drag (disabled cards cannot be dragged)
  const canDrag =
    !isDisabled &&
    CheckPermission(Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get priority color
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 0:
        return "#4caf50"; // Low - Green
      case 1:
        return "#ff9800"; // Medium - Orange
      case 2:
        return "#f44336"; // High - Red
      default:
        return "#4caf50";
    }
  };

  // Handle card click to open mission details
  const handleOpenMission = () => {
    if (!showColorPicker && !isDisabled) {
      push(
        `/production-floor?boardMissionsId=${mission?.id}&productType=${mission?.productType}&step=stations`
      );
    }
  };

  // Context menu handlers
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!showColorPicker && !isDisabled) {
      setContextMenuPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenuPosition(null);
  };

  const onResetJobColor = async () => {
    const callBack = (res: any) => {
      if (res.success) {
        // Handle success case
      } else {
        // Handle failure case
      }
    };
    await resetProductionFloorJobColorApi(callApi, callBack, {
      boardMissionId: mission?.id,
    });
  };

  const onChangeJobColor = async () => {
    const callBack = (res: any) => {};
    await updateProductionFloorJobColorApi(callApi, callBack, {
      boardMissionId: mission?.id,
      productionFloorJobColor: color,
    });
  };

  const handleMoveToNextStation = async () => {
    if (!mission?.nextStation?.nextStationId) {
      console.warn("No next station available for this mission");
      return;
    }

    const callBack = (res: any) => {
      if (res.success) {
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };

    await updateBoardMissionCurrentStationApi(callApi, callBack, {
      boardId: mission?.id,
      stationId: mission?.nextStation?.nextStationId,
      productType: mission?.productType,
    });
  };

  const handleOpenNextStationModal = () => {
    setOpenNextStationModal(true);
  };

  const handleCloseNextStationModal = () => {
    setOpenNextStationModal(false);
  };

  const handleChangeColorClick = () => {
    setInitialColor(color);
    setShowColorPicker(true);
  };

  const handleMoveToDone = async () => {
    if (!isDisabled) {
      await tryMoveBoardMissionsToDone(mission);
      handleCloseContextMenu();
    }
  };

  const getColorPickerPosition = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY + 10,
        left: rect.left + window.scrollX + 10,
      };
    }
    return { top: 100, left: 100 };
  };

  const contextMenuOptions = [
    {
      label: t("productionFloor.changeColor"),
      icon: <ColoredCycle backgroundColor={color || "#000000"} size={12} />,
      onClick: (e: any) => {
        e.stopPropagation();
        handleChangeColorClick();
      },
    },
    {
      label: t("productionFloor.resetColor"),
      icon: <ResetColorIcon width={14} height={14} color="#000000" />,
      onClick: (e: any) => {
        e.stopPropagation();
        onResetJobColor();
        handleCloseContextMenu();
      },
    },
    ...(mission?.nextStation?.nextStationId
      ? [
          {
            label: t("productionFloor.nextStation"),
            icon: (
              <ArrowRightIcon
                color="#000000"
                style={{
                  transform: isRTL ? "scaleX(-1)" : "none",
                }}
              />
            ),
            onClick: (e: any) => {
              e.stopPropagation();
              handleOpenNextStationModal();
              handleCloseContextMenu();
            },
          },
        ]
      : []),
    {
      label: t("productionFloor.moveToDone"),
      icon: <TaskAltRoundedIcon style={{ fontSize: "16px" }} />,
      onClick: (e: any) => {
        e.stopPropagation();
        handleMoveToDone();
      },
    },
  ];

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
    handleCloseContextMenu();
    if (color !== initialColor) {
      onChangeJobColor();
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (contextMenuPosition && !showColorPicker) {
        // Don't close if clicking on the context menu itself
        if (!target.closest("[data-context-menu]")) {
          setContextMenuPosition(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenuPosition, showColorPicker]);

  // Drag functionality
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "task",
      item: { ...mission, stationId, categoryName }, // Include stationId and categoryName in the dragged item
      canDrag: canDrag,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [canDrag, stationId, mission, categoryName]
  );

  // Handle drag ref
  useEffect(() => {
    if (canDrag && cardRef.current) {
      drag(cardRef.current);
    }
  }, [canDrag, drag]);

  return (
    <Box
      ref={cardRef}
      onClick={openNextStationModal ? undefined : handleOpenMission}
      onContextMenu={handleContextMenu}
      sx={{
        backgroundColor: isDisabled
          ? "white"
          : isBackgroundOnly
          ? color || mission.productionFloorJobColor || "#ffffff"
          : "white",
        border: isDisabled
          ? `2px solid ${upcomingWorksColor}`
          : isBackgroundOnly
          ? `1px solid ${toRgba(
              color || mission.productionFloorJobColor || "#000000",
              0.2
            )}`
          : `2px solid ${
              color || mission.productionFloorJobColor || "#e0e0e0"
            }`,
        borderRadius: "8px",
        padding: "12px",
        cursor: isDisabled
          ? "not-allowed"
          : isDragging
          ? "grabbing"
          : "pointer",
        transition: "all 0.2s ease",
        opacity: isDragging ? 0.5 : isDisabled ? 0.8 : 1,
        minHeight: "90px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        boxShadow:
          isBackgroundOnly && !isDisabled
            ? `0 2px 8px ${toRgba(
                color || mission.productionFloorJobColor || "#000000",
                0.25
              )}, inset 0 1px 0 ${toRgba("#ffffff", 0.1)}`
            : isDisabled
            ? "none"
            : "0 1px 3px rgba(0,0,0,0.08)",
        "&:hover": {
          boxShadow: isDisabled
            ? "none"
            : isBackgroundOnly
            ? `0 4px 16px ${toRgba(
                color || mission.productionFloorJobColor || "#000000",
                0.35
              )}, inset 0 1px 0 ${toRgba("#ffffff", 0.15)}`
            : "0 4px 12px rgba(0,0,0,0.15)",
          transform: isDisabled
            ? "none"
            : isDragging
            ? "none"
            : "translateY(-2px)",
          border:
            isBackgroundOnly && !isDisabled
              ? `1px solid ${toRgba(
                  color || mission.productionFloorJobColor || "#000000",
                  0.3
                )}`
              : undefined,
        },
        // Add disabled overlay effect
        "&::before": isDisabled
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "8px",
              pointerEvents: "none",
              zIndex: 1,
            }
          : {},
      }}
    >
      {/* Disabled indicator for upcoming works */}
      {isDisabled && (
        <Box
          sx={{
            position: "absolute",
            top: "4px",
            ...(isRTL ? { left: "4px" } : { right: "4px" }),
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: upcomingWorksColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            "&::after": {
              content: '""',
              width: "8px",
              height: "2px",
              backgroundColor: "white",
              borderRadius: "1px",
            },
          }}
        />
      )}

      {/* Top Row: Job Code, Job Name, and Priority Dot */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
          position: "relative",
          zIndex: 3, // Above overlay
        }}
      >
        {/* Job Code and Job Name */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "8px",
            flex: 1,
            alignItems: "center",
          }}
        >
          {/* Job Code - Bold and prominent */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: isDisabled
                ? upcomingWorksColor
                : isBackgroundOnly && (color || mission.productionFloorJobColor)
                ? "white"
                : color || mission.productionFloorJobColor || "#1976d2",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              lineHeight: 1.2,
            }}
          >
            {mission.boardMissionNumber}/{mission.orderNumber}
          </Typography>

          {/* Job Name - if exists */}
          {mission.jobName && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: isDisabled
                  ? upcomingWorksColor
                  : isBackgroundOnly &&
                    (color || mission.productionFloorJobColor)
                  ? "white"
                  : "#6c757d",
                fontSize: isMobile ? "0.65rem" : "0.75rem",
                fontStyle: "italic",
                lineHeight: 1.2,
                opacity: isDisabled ? 0.7 : 1,
              }}
            >
              {mission.jobName}
            </Typography>
          )}
        </Box>

        {/* Priority Dot */}
        <Box
          sx={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: isDisabled
              ? upcomingWorksColor
              : getPriorityColor(mission.priority || 0),
            marginLeft: "4px",
            flexShrink: 0,
            opacity: isDisabled ? 0.6 : 1,
            border:
              isBackgroundOnly && !isDisabled
                ? `1px solid ${toRgba("#ffffff", 0.5)}`
                : "none",
            boxShadow:
              isBackgroundOnly && !isDisabled
                ? `0 0 4px ${toRgba(
                    getPriorityColor(mission.priority || 0),
                    0.6
                  )}`
                : "none",
          }}
        />
      </Box>

      {/* Middle Row: Customer Name and Due Date */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "6px",
        }}
      >
        {/* Customer Name */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: isDisabled
              ? upcomingWorksColor
              : isBackgroundOnly && (color || mission.productionFloorJobColor)
              ? "white"
              : "#495057",
            fontSize: isMobile ? "0.7rem" : "0.8rem",
            maxWidth: "60%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            opacity: isDisabled ? 0.7 : 1,
          }}
        >
          {mission.clientName}
        </Typography>

        {/* Due Date */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: isDisabled
              ? upcomingWorksColor
              : isBackgroundOnly && (color || mission.productionFloorJobColor)
              ? "white"
              : "#6c757d",
            fontSize: isMobile ? "0.7rem" : "0.8rem",
            textAlign: "right",
            opacity: isDisabled ? 0.7 : 1,
          }}
        >
          {mission.dueDate ? formatDate(mission.dueDate) : "No due date"}
        </Typography>
      </Box>

      {/* Bottom Row: Product Name and Jobs in Order */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        {/* Product Name - Bold */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: isDisabled
              ? upcomingWorksColor
              : isBackgroundOnly && (color || mission.productionFloorJobColor)
              ? "white"
              : "#495057",
            fontSize: isMobile ? "0.7rem" : "0.8rem",
            maxWidth: "60%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            opacity: isDisabled ? 0.7 : 1,
          }}
        >
          {mission.productName}
        </Typography>

        {/* Jobs in Order badge */}
        {mission.numberOfJobsInOrder && (
          <Chip
            label={`${mission.numberOfJobsInOrder} ${t(
              "boardMissions.numberOfBoardMissionsInOrder"
            )}`}
            size="small"
            sx={{
              height: "18px",
              fontSize: isMobile ? "0.65rem" : "0.7rem",
              backgroundColor: isDisabled
                ? upcomingWorksBgColor
                : isBackgroundOnly
                ? toRgba("#ffffff", 0.25)
                : color || mission.productionFloorJobColor || "#e3f2fd",
              color: isDisabled
                ? upcomingWorksColor
                : isBackgroundOnly
                ? "white"
                : "white",
              fontWeight: 600,
              border:
                isBackgroundOnly && !isDisabled
                  ? `1px solid ${toRgba("#ffffff", 0.3)}`
                  : "none",
              backdropFilter:
                isBackgroundOnly && !isDisabled ? "blur(4px)" : "none",
            }}
          />
        )}
      </Box>

      {/* Color Picker Popover */}
      <Popover
        open={showColorPicker}
        onClose={handleColorPickerClose}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: showColorPicker ? getColorPickerPosition().top : 0,
          left: showColorPicker ? getColorPickerPosition().left : 0,
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          zIndex: 1001,
        }}
      >
        <Box ref={colorPickerRef}>
          <SketchPicker color={color} onChange={handleColorChange} />
        </Box>
      </Popover>

      {/* Context Menu Portal */}
      {contextMenuPosition &&
        createPortal(
          <Box
            data-context-menu
            sx={{
              position: "fixed",
              top: contextMenuPosition.y,
              left: contextMenuPosition.x,
              backgroundColor: "white",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
              borderRadius: "8px",
              zIndex: 1000,
              minWidth: "150px",
              border: "1px solid #e0e0e0",
            }}
          >
            {contextMenuOptions.map((option, index) => (
              <Box
                key={index}
                onClick={option.onClick}
                sx={{
                  padding: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                  "&:first-of-type": {
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  },
                  "&:last-of-type": {
                    borderBottomLeftRadius: "8px",
                    borderBottomRightRadius: "8px",
                  },
                }}
              >
                <Typography variant="body2">{option.label}</Typography>
                {option.icon}
              </Box>
            ))}
          </Box>,
          document.body
        )}

      {/* Next Station Modal */}
      <GoMakeDeleteModal
        hideIcon={true}
        modalType={ModalType.WARNING}
        title={t("customers.modal.nextStationModalTitle")}
        // subTitle={t("productionFloor.nextStationModalSubTitle")}
        yesBtn={t("sales.quote.yesBtn")}
        cancelBtn={t("modal.no")}
        openModal={openNextStationModal}
        onClose={handleCloseNextStationModal}
        onClickDelete={handleMoveToNextStation}
      />
    </Box>
  );
};

export { JobCard };
