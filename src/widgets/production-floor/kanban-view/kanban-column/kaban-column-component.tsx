import { KanbanCardComponent } from "@/widgets/production-floor/kanban-view/kanban-card/kanban-card-component";
import { useDrop } from "react-dnd";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { Stack } from "@mui/material";
import { IProductionStatus } from "@/widgets/production-floor/interfaces/production-floor-status";
import { useProductionFloorData } from "@/widgets/production-floor/use-production-floor-data";
import { useRecoilState } from "recoil";
import { productionFloorTextSearchState } from "../../state/text-search";
import { useCallback, } from "react";
import { useStyle } from "../kanban-card/style";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";
import { useSimpleApproveModal } from "@/hooks/use-simple-approve-modal";

interface IProps {
  status: IProductionStatus;
  boardsMissions: IBoardMissions[];
  count?: number;
  isMobile?: boolean;
}

function KanbanColumnComponent({ status, boardsMissions, isMobile }: IProps) {
  const { classes } = useStyle();
  const [search] = useRecoilState(productionFloorTextSearchState);
  const { updateStatus, t, RTL } = useProductionFloorData();
  const { openSimpleApproveModal, handleOpenModal, handleCloseModal, handleConfirm } = useSimpleApproveModal(updateStatus);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "task",
      drop: (item: IBoardMissions, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        if (status.key === "Approval required" && !item.isNeedExample) {
          handleOpenModal(status.id, [item], item.id);
        } else {
          updateStatus([item], status.id).then();
        }
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
          ) ||
          `${board?.jobName?.toLowerCase()}`.includes(search.toLowerCase())
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
        ...(!isMobile && { margin: "0 10px" }),
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

      <Stack
        overflow={"auto"} // Ensures scrolling
        gap={"10px"}
        padding={"0px 4px"}
        maxHeight={"calc(100vh - 200px)"}
        sx={{
          "::-webkit-scrollbar": {
            width: "8px",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#CCCDCF",
            borderRadius: "4px",
            cursor: "pointer",
          },
          "::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#888",
          },
        }}
      >
        {getBoards()?.map((board, index) => (
          <KanbanCardComponent
            key={`${index}-${board.id}`}
            board={board}
            status={status}
          />
        ))}
      </Stack>
      <GoMakeDeleteModal
        title={t("sales.quote.simpleApproveMail")}
        yesBtn={t("modal.yes")}
        modalType={ModalType.WARNING}
        subTitle={" "}
        openModal={openSimpleApproveModal}
        onClose={handleCloseModal}
        onClickDelete={handleConfirm}
        onClickCancel={handleCloseModal}
      />
    </Stack>
  );
}

export { KanbanColumnComponent };
