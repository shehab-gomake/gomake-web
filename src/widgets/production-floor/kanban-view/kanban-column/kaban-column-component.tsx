import { KanbanCardComponent } from "@/widgets/production-floor/kanban-view/kanban-card/kanban-card-component";
import { useDrop } from "react-dnd";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { Stack } from "@mui/material";
import { IProductionStatus } from "@/widgets/production-floor/interfaces/production-floor-status";
import { useProductionFloorData } from "@/widgets/production-floor/use-production-floor-data";
import { useRecoilState } from "recoil";
import { productionFloorTextSearchState } from "../../state/text-search";
import { useCallback } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useStyle } from "../kanban-card/style";

interface IProps {
  status: IProductionStatus;
  boardsMissions: IBoardMissions[];
  count?: number;
}

function KanbanColumnComponent({ status, boardsMissions }: IProps) {
  const { classes } = useStyle();
  const [search] = useRecoilState(productionFloorTextSearchState);
  const { updateStatus, t } = useProductionFloorData();
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "task",
      drop: (item: IBoardMissions, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        updateStatus([item], status.id).then();
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [status, boardsMissions]
  );

  const getBoards = useCallback(() => {
    return !!search
      ? boardsMissions?.filter(
          (board) =>
            `${board?.boardMissionNumber}\\${board?.orderNumber}`.includes(
              search
            ) ||
            `${board?.clientName?.toLowerCase()}`.includes(
              search.toLowerCase()
            ) ||
            board?.automatedTags?.some((tag) =>
              `${tag.toLowerCase()}`.includes(search.toLowerCase())
            )
        )
      : boardsMissions;
  }, [boardsMissions, search]);

  return (
    <Stack
      ref={drop}
      gap={"10px"}
      minHeight={"100%"}
      maxHeight={"fit-content"}
      width={"100%"}
      borderRadius={"16px"}
      style={{
        margin: "0 10px",
        padding: "10px",
        backgroundColor: "white",
        opacity: isOver ? 0.6 : 1,
        overflow: "hidden",
      }}
    >
      <h3 style={{ ...classes.kanbanColumnLabel, color: status.textColor }}>
        {`${t("productionStatuses." + status.name)}`}
        <div
          style={{
            ...classes.kanbanColumnCircle,
            border: `1px solid ${status.textColor}`,
            color: status.textColor,
            boxShadow: `0 0 0 0.5 ${status.textColor}`,
          }}
        >
          {getBoards()?.length}
        </div>
      </h3>

      <Stack overflow={"auto"} gap={"10px"}>
        {getBoards()?.map((board, index) => (
          <KanbanCardComponent
            key={`${index}-${board.id}`}
            board={board}
            status={status}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export { KanbanColumnComponent };
