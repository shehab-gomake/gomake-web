import { useDrag } from "react-dnd";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { Popover, Stack } from "@mui/material";
import { useStyle } from "@/widgets/production-floor/kanban-view/kanban-card/style";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { OrderJObNumbersComponent } from "./order-job-num-coponent";
import { toRgba } from "@/utils/helpers";
import { ChangeColorMenu } from "./change-color-menu";
import { useKanbanCard } from "./use-kanban-card";
import { SketchPicker } from "react-color";
import { useRef, useEffect } from "react";
import { getTruncatedLabel } from "@/utils/get-truncated-text";
import { DateFormatter } from "@/utils/date-formatters";

interface IProp {
  board: IBoardMissions;
  status?: any;
  stationId?: string;
}

const ItemTypes = {
  TASK: "task",
};

const KanbanCardComponent = ({ board, stationId }: IProp) => {
  const { classes } = useStyle();
  const { CheckPermission } = useUserPermission();
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const {
    t,
    dir,
    isRTL,
    contextMenuPosition,
    handleContextMenu,
    handleCloseContextMenu,
    handleOpenMission,
    contextMenuOptions,
    handleColorChange,
    color,
    showColorPicker,
    handleColorPickerClose,
  } = useKanbanCard(board);

  const canDrag = CheckPermission(
    Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.TASK,
      item: { ...board, stationId }, // Include stationId in the dragged item
      canDrag: canDrag,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [canDrag, stationId]
  );

  useEffect(() => {
    if (canDrag) {
      drag(dragRef.current);
    }
  }, [drag, canDrag]);

  return (
    <Stack
      direction={"column"}
      gap={"15px"}
      padding={"10px"}
      borderRadius={"12px"}
      width={"100%"}
      maxHeight={"fit-content"}
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.8 : 1,
        cursor: isDragging ? "grabbing" : "pointer",
        borderRadius: "8px",
        border: `1px solid var(--Colors-Yellow-600,${color})`,
        background: toRgba(color, 0.1),
        boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.08)",
      }}
      onClick={handleOpenMission}
      onContextMenu={handleContextMenu}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        display={"flex"}
        flexWrap={"wrap"}
      >
        {getTruncatedLabel(
          board?.jobName || t("boardMissions.jobName"),
          15,
          classes.jobTitle
        )}
        <OrderJObNumbersComponent
          boardMission={board}
          textColor={color}
          bgColor={toRgba(color, 0.2)}
        />
      </Stack>
      <Stack>
        <Stack direction={"row"} justifyContent={"space-between"} gap={"5px"}>
          <span style={classes.productTitle}>{board?.productName}</span>
          <span style={classes.productTitle}>{board?.clientName}</span>
          {/* {getTruncatedLabel(board?.productName, 15, {
            ...FONT_FAMILY.Inter(700, 15),
            color: "#101828",
          })}
          {getTruncatedLabel(board?.clientName, 15, {
            ...FONT_FAMILY.Inter(700, 15),
            color: "#101828",
          })} */}
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          display={"flex"}
          flexWrap={"wrap"}
        >
          <span style={classes.secondLabel}>
            {`${board?.numberOfJobsInOrder} ${t(
              "boardMissions.numberOfBoardMissionsInOrder"
            )}`}
          </span>
          <span style={classes.secondLabel}>
            {DateFormatter(board?.dueDate)}
          </span>
        </Stack>
      </Stack>
      {contextMenuPosition && (
        <ChangeColorMenu
          options={contextMenuOptions}
          position={contextMenuPosition}
          onClose={handleCloseContextMenu}
          dir={dir}
          colorPickerRef={colorPickerRef}
        />
      )}
      <Popover
        key={`popover-${board?.id}`}
        open={showColorPicker}
        onClose={handleColorPickerClose}
        anchorReference="anchorPosition"
        anchorPosition={{
          top:
            showColorPicker && contextMenuPosition
              ? contextMenuPosition?.y
              : undefined,
          left:
            showColorPicker && contextMenuPosition
              ? contextMenuPosition?.x
              : undefined,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isRTL ? "right" : "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isRTL ? "right" : "center",
        }}
      >
        <div ref={colorPickerRef}>
          <SketchPicker
            key={`SketchPicker-${board?.id}`}
            color={color}
            onChange={handleColorChange}
          />
        </div>
      </Popover>
    </Stack>
  );
};

export { KanbanCardComponent };
