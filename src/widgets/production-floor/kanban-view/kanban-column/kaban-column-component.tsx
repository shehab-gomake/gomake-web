import { KanbanCardComponent } from "@/widgets/production-floor/kanban-view/kanban-card/kanban-card-component";
import { useDrop } from "react-dnd";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { Stack, Box } from "@mui/material";
import { IProductionStatus } from "@/widgets/production-floor/interfaces/production-floor-status";
import { useProductionFloorData } from "@/widgets/production-floor/use-production-floor-data";
import { useRecoilState } from "recoil";
import { productionFloorTextSearchState } from "../../state/text-search";
import { useCallback, useRef, useEffect } from "react";
import { useStyle } from "../kanban-card/style";
import { GoMakeDeleteModal, GomakeTextInput } from "@/components";
import { ModalType } from "@/enums";
import { useSimpleApproveModal } from "@/hooks/use-simple-approve-modal";
import { AddStuckReasonWidget } from "../../add-stuck-reason/add-stuck-reason";

interface IProps {
  status: IProductionStatus;
  boardsMissions: IBoardMissions[];
  count?: number;
  isMobile?: boolean;
  stationId?: string;
  maxCards?: number;
}

function KanbanColumnComponent({
  status,
  boardsMissions,
  isMobile,
  stationId,
  maxCards = 4,
}: IProps) {
  const { classes } = useStyle();
  const [search] = useRecoilState(productionFloorTextSearchState);
  const { updateStatus, t, RTL } = useProductionFloorData();
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
  } = useSimpleApproveModal(updateStatus);
  const dropRef = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "task",
      canDrop: (item: any) => {
        // Only allow drops within the same station or within the same category
        if (stationId && item.stationId) {
          // Allow drops within the same station
          return item.stationId === stationId;
        }
        // If no stationId is set, allow all drops (backward compatibility)
        return true;
      },
      drop: (item: IBoardMissions, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        if (status.id === "79251980-1c2d-4b4f-9ab4-9ccb9cb9fb63" && item.isNeedExample) {
          handleOpenModal(status.id, [item], item.id);
        } else if (status.id === "56dd1e80-7436-462c-82e9-cf8a90afd614") {
          handleOpenStuckModal(status.id, [item], item.id, item.productType);
        } else {
          updateStatus([item], status.id).then();
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [status, boardsMissions, stationId]
  );

  useEffect(() => {
    drop(dropRef.current);
  }, [drop]);

  const getBoards = useCallback(() => {
    const filteredBoards = !!search
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

    // Limit the number of cards displayed
    return filteredBoards?.slice(0, maxCards);
  }, [boardsMissions, search, maxCards]);

  return (
    <Stack
      ref={dropRef}
      gap={"10px"}
      minHeight={"100%"}
      maxHeight={"fit-content"}
      width={"100%"}
      minWidth={isMobile ? "200px" : "250px"}
      maxWidth={isMobile ? "100%" : "300px"}
      borderRadius={"16px"}
      style={{
        ...(!isMobile && { margin: "0 5px" }),
        padding: "10px",
        backgroundColor: isOver ? "#f0f8ff" : "white",
        opacity: isOver ? 0.8 : 1,
        overflow: "hidden",
        border: isOver ? "2px dashed #1976d2" : "1px solid #e0e0e0",
        transition: "all 0.2s ease",
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
        maxHeight={isMobile ? "200px" : "300px"}
        sx={{
          "::-webkit-scrollbar": {
            width: isMobile ? "4px" : "6px",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#CCCDCF",
            borderRadius: isMobile ? "2px" : "3px",
            cursor: "pointer",
          },
          "::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#888",
          },
        }}
      >
        {/* Show overflow indicator if there are more cards than maxCards */}
        {boardsMissions?.length > maxCards && (
          <Box
            sx={{
              backgroundColor: "#f0f0f0",
              color: "#666",
              padding: "8px",
              borderRadius: "6px",
              fontSize: "0.8rem",
              textAlign: "center",
              border: "1px dashed #ccc",
            }}
          >
            +{boardsMissions.length - maxCards} more cards
          </Box>
        )}
        {getBoards()?.map((board, index) => (
          <KanbanCardComponent
            key={`${index}-${board.id}`}
            board={board}
            status={status}
            stationId={stationId}
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
}

export { KanbanColumnComponent };
