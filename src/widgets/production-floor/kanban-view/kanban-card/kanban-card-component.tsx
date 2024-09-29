import { useDrag } from "react-dnd";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { Stack } from "@mui/material";
import { DateFormatter } from "@/utils/adapter";
import { useStyle } from "@/widgets/production-floor/kanban-view/kanban-card/style";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { t } from "i18next";
import { OrderJObNumbersComponent } from "./order-job-num-coponent";
import { toRgba } from "@/utils/helpers";
import { useTranslation } from "react-i18next";

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
  const dir: "rtl" | "ltr" = t("direction");

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

  return (
    <Stack
      direction={"column"}
      gap={"10px"}
      padding={"10px"}
      borderRadius={"12px"}
      width={"100%"}
      maxHeight={"fit-content"}
      ref={canDrag ? drag : null}
      style={{
        opacity: isDragging ? 0.8 : 1,
        cursor: canDrag ? "move" : "not-allowed",
        borderRadius: "8px",
        border: `1px solid var(--Colors-Yellow-600,${status?.textColor})`,
        background: toRgba(status?.backgroundColor, 0.3),
        boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.08)",
      }}
    >
      <table>
        <tbody>
          <tr style={{ ...classes.rowStyle, marginBottom: "8px" }}>
            <td>
              <span style={classes.jobTitle}>
                {board.jobName || t("boardMissions.jobName")}
              </span>
            </td>
            <td style={classes.secondColOld}>
              <OrderJObNumbersComponent
                boardMission={board}
                textColor={status?.textColor}
                bgColor={status?.backgroundColor}
              />
            </td>
          </tr>
          <tr style={{ ...classes.rowStyle, gap: "5px" }}>
            <td style={classes.firstCol}>
              <span style={classes.productTitle}>{board?.productName}</span>
            </td>
            <td style={{ ...classes.secondCol, direction: dir }}>
              <span style={classes.productTitle}>{board?.clientName}</span>
            </td>
          </tr>
          <tr style={classes.rowStyle}>
            <td>
              <span style={classes.secondLabel}>
                {`${board?.numberOfJobsInOrder} ${t(
                  "boardMissions.numberOfBoardMissionsInOrder"
                )}`}
              </span>
            </td>
            <td style={classes.secondColOld}>
              <span style={classes.secondLabel}>
                {" "}
                {DateFormatter(board?.dueDate)}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </Stack>
  );
};

export { KanbanCardComponent };
