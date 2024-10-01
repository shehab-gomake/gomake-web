import { useDrag } from "react-dnd";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { Stack } from "@mui/material";
import { DateFormatter } from "@/utils/adapter";
import { useStyle } from "@/widgets/production-floor/kanban-view/kanban-card/style";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { OrderJObNumbersComponent } from "./order-job-num-coponent";
import { toRgba } from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface IProp {
  board: IBoardMissions;
  status?: any;
}

const ItemTypes = {
  TASK: "task",
};

const KanbanCardComponent = ({ board, status }: IProp) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const CardColor = board?.productionFloorJobColor ?? status?.textColor;

  const { CheckPermission } = useUserPermission();
  const canDrag = CheckPermission(
    Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.TASK,
      item: board,
      canDrag: canDrag,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [canDrag]
  );

  const { push } = useRouter();
  const handleOpenMission = () => {
    push(
      `/production-floor?boardMissionsId=${board?.id}&productType=${board?.productType}&step=stations`
    ).then();
  };

  return (
    <Stack
      direction={"column"}
      gap={"15px"}
      padding={"10px"}
      borderRadius={"12px"}
      width={"100%"}
      maxHeight={"fit-content"}
      ref={canDrag ? drag : null}
      style={{
        opacity: isDragging ? 0.8 : 1,
        cursor: isDragging ? "grabbing" : "pointer",
        borderRadius: "8px",
        border: `1px solid var(--Colors-Yellow-600,${CardColor})`,
        background: toRgba(CardColor, 0.1),
        boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.08)",
      }}
      onClick={handleOpenMission}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        display={"flex"}
        flexWrap={"wrap"}
      >
        <span style={classes.jobTitle}>
          {board.jobName || t("boardMissions.jobName")}
        </span>
        <OrderJObNumbersComponent
          boardMission={board}
          textColor={CardColor}
          bgColor={toRgba(CardColor, 0.2)}
        />
      </Stack>
      <Stack>
        <Stack direction={"row"} justifyContent={"space-between"} gap={"5px"}>
          <span style={classes.productTitle}>{board?.productName}</span>
          <span style={classes.productTitle}>{board?.clientName}</span>
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
    </Stack>
  );
};

export { KanbanCardComponent };
