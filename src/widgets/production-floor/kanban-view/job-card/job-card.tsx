import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { useRouter } from "next/router";
import { useDrag } from "react-dnd";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";

interface IProps {
  mission: IBoardMissions;
  isMobile?: boolean;
  stationId?: string;
}

const JobCard: React.FC<IProps> = ({ mission, isMobile, stationId }) => {
  const { push } = useRouter();
  const { CheckPermission } = useUserPermission();

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
    push(
      `/production-floor?boardMissionsId=${mission?.id}&productType=${mission?.productType}&step=stations`
    );
  };

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

  return (
    <Box
      ref={canDrag ? drag : null}
      onClick={handleOpenMission}
      sx={{
        backgroundColor: "white",
        border: `2px solid ${mission.productionFloorJobColor || "#e0e0e0"}`,
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
            color: mission.productionFloorJobColor || "#1976d2",
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

      {/* Bottom Row: Job Name and Quantity */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        {/* Job Name */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "#6c757d",
            fontSize: isMobile ? "0.7rem" : "0.8rem",
            maxWidth: "60%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {mission.jobName || mission.productName}
        </Typography>

        {/* Quantity badge */}
        {mission.quantity && (
          <Chip
            label={mission.quantity}
            size="small"
            sx={{
              height: "18px",
              fontSize: isMobile ? "0.65rem" : "0.7rem",
              backgroundColor: mission.productionFloorJobColor || "#e3f2fd",
              color: "white",
              fontWeight: 600,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export { JobCard };
