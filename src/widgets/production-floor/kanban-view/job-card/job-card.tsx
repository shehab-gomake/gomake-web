import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Chip, Popover } from "@mui/material";
import { createPortal } from "react-dom";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { useRouter } from "next/router";
import { useDrag } from "react-dnd";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useGomakeAxios } from "@/hooks";
import {
  resetProductionFloorJobColorApi,
  updateProductionFloorJobColorApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { ColoredCycle } from "@/components";
import { ResetColorIcon } from "../../table-view/status-table/table-row/more-circle/icons/reset-color";
import { SketchPicker } from "react-color";
import { useTranslation } from "react-i18next";

interface IProps {
  mission: IBoardMissions;
  isMobile?: boolean;
  stationId?: string;
}

const JobCard: React.FC<IProps> = ({ mission, isMobile, stationId }) => {
  const { push } = useRouter();
  const { CheckPermission } = useUserPermission();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Context menu state
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState(mission?.productionFloorJobColor ?? "");
  const [initialColor, setInitialColor] = useState(color);

  // Check if user can drag
  const canDrag = CheckPermission(
    Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
  );

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
    if (!showColorPicker) {
      push(
        `/production-floor?boardMissionsId=${mission?.id}&productType=${mission?.productType}&step=stations`
      );
    }
  };

  // Context menu handlers
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!showColorPicker) {
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

  const handleChangeColorClick = () => {
    setInitialColor(color);
    setShowColorPicker(true);
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
      item: { ...mission, stationId }, // Include stationId in the dragged item
      canDrag: canDrag,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [canDrag, stationId, mission]
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
      onClick={handleOpenMission}
      onContextMenu={handleContextMenu}
      sx={{
        backgroundColor: "white",
        border: `2px solid ${
          color || mission.productionFloorJobColor || "#e0e0e0"
        }`,
        borderRadius: "8px",
        padding: "12px",
        cursor: isDragging ? "grabbing" : "pointer",
        transition: "all 0.2s ease",
        opacity: isDragging ? 0.5 : 1,
        minHeight: "90px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transform: isDragging ? "none" : "translateY(-2px)",
        },
      }}
    >
      {/* Top Row: Job Code and Priority Dot */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
        }}
      >
        {/* Job Code - Bold and prominent */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: color || mission.productionFloorJobColor || "#1976d2",
            fontSize: isMobile ? "0.8rem" : "0.9rem",
            lineHeight: 1.2,
          }}
        >
          {mission.boardMissionNumber}/{mission.orderNumber}
        </Typography>

        {/* Priority Dot */}
        <Box
          sx={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: getPriorityColor(mission.priority || 0),
            marginLeft: "4px",
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
            color: "#495057",
            fontSize: isMobile ? "0.7rem" : "0.8rem",
            maxWidth: "60%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {mission.clientName}
        </Typography>

        {/* Due Date */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "#6c757d",
            fontSize: isMobile ? "0.7rem" : "0.8rem",
            textAlign: "right",
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
          marginBottom: "4px",
        }}
      >
        {/* Product Name - Bold */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: "#495057",
            fontSize: isMobile ? "0.7rem" : "0.8rem",
            maxWidth: "60%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
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
              backgroundColor:
                color || mission.productionFloorJobColor || "#e3f2fd",
              color: "white",
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      {/* Job Name Row */}
      {mission.jobName && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "#6c757d",
              fontSize: isMobile ? "0.65rem" : "0.75rem",
              fontStyle: "italic",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {mission.jobName}
          </Typography>
        </Box>
      )}

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
    </Box>
  );
};

export { JobCard };
