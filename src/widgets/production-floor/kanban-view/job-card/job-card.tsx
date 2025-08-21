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
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        padding: "8px",
        cursor: isDragging ? "grabbing" : "pointer",
        transition: "all 0.2s ease",
        opacity: isDragging ? 0.5 : 1,
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transform: isDragging ? "none" : "translateY(-1px)",
        },
      }}
    >
      {/* Job Code and Priority */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: "#1976d2",
            fontSize: isMobile ? "0.7rem" : "0.75rem",
          }}
        >
          {mission.boardMissionNumber}
        </Typography>
        <Box
          sx={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: getPriorityColor(mission.priority || 0),
          }}
        />
      </Box>

      {/* Customer Name */}
      <Typography
        variant="caption"
        sx={{
          fontWeight: 500,
          color: "#495057",
          fontSize: isMobile ? "0.7rem" : "0.75rem",
          marginBottom: "2px",
          display: "block",
        }}
      >
        {mission.clientName}
      </Typography>

      {/* Job Type */}
      <Typography
        variant="caption"
        sx={{
          color: "#6c757d",
          fontSize: isMobile ? "0.65rem" : "0.7rem",
          marginBottom: "4px",
          display: "block",
        }}
      >
        {mission.productName || mission.jobName}
      </Typography>

      {/* Due Date */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#6c757d",
            fontSize: isMobile ? "0.65rem" : "0.7rem",
          }}
        >
          {mission.dueDate ? formatDate(mission.dueDate) : "No due date"}
        </Typography>

        {/* Quantity badge */}
        {mission.quantity && (
          <Chip
            label={mission.quantity}
            size="small"
            sx={{
              height: "16px",
              fontSize: isMobile ? "0.6rem" : "0.65rem",
              backgroundColor: "#e3f2fd",
              color: "#1976d2",
            }}
          />
        )}
      </Box>

      {/* Tags */}
      {mission.automatedTags && mission.automatedTags.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2px",
            marginTop: "4px",
          }}
        >
          {mission.automatedTags.slice(0, 2).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                height: "14px",
                fontSize: isMobile ? "0.55rem" : "0.6rem",
                backgroundColor: "#f5f5f5",
                color: "#666",
              }}
            />
          ))}
          {mission.automatedTags.length > 2 && (
            <Typography
              variant="caption"
              sx={{
                color: "#999",
                fontSize: isMobile ? "0.55rem" : "0.6rem",
                alignSelf: "center",
              }}
            >
              +{mission.automatedTags.length - 2}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export { JobCard };
