import { useStatusTable } from "@/widgets/production-floor/table-view/status-table/use-status-Table";
import {
  Collapse,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import Button from "@mui/material/Button";
import { IProductionStatus } from "@/widgets/production-floor/interfaces/production-floor-status";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import {
  SecondaryTableCell,
  SecondaryTableRow,
} from "@/components/tables/secondary-table";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useDrop } from "react-dnd";
import { TableRowComponent } from "@/widgets/production-floor/table-view/status-table/table-row/table-row-component";
import { useProductionFloorData } from "@/widgets/production-floor/use-production-floor-data";
import { useRecoilState } from "recoil";
import { productionFloorTextSearchState } from "@/widgets/production-floor/state/text-search";
import { useCallback } from "react";
import { ThreeOptionsModal } from "@/components";
import { PrintPackingSlipModalWidget } from "../../views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { ModalType } from "@/enums";

interface IProps {
  status: IProductionStatus;
  boards: IBoardMissions[];
  count?: number;
}

const StatusTableComponent = ({ status, boards, count }: IProps) => {
  const { isOpen, onClickStatus, tableHeaders } = useStatusTable();
  const [search] = useRecoilState(productionFloorTextSearchState);
  const {
    t,
    updateStatus,
    onOpenMarkReadyModal,
    openMarkReadyModal,
    onCloseMarkReadyModal,
    onClickMoveBoardMissionToDone,
    openPackagesModal,
    onClosePrintDeliverTicketModal,
    onOpenPrintDeliverTicketModal,
    selectedMission,
  } = useProductionFloorData();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "task",
      drop: (
        item: { board: IBoardMissions; selectedIds: IBoardMissions[] },
        monitor
      ) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        if (item.board.statusId !== status.id) {
          updateStatus(
            item.selectedIds.length > 0 ? item.selectedIds : [item.board],
            status.id
          ).then();
        }
      },
      collect: (monitor) => ({
        isOver:
          monitor.getItem()?.board?.statusId === status.id
            ? false
            : !!monitor.isOver(),
        canDrop:
          monitor.getItem()?.board?.statusId === status.id
            ? false
            : !!monitor.canDrop(),
      }),
    }),
    [status, boards]
  );

  //   const getBoards = useCallback(() => {
  //     return !!search ? boards?.filter((board) => `${board?.boardMissionNumber}\\${board?.orderNumber}`.includes(search)) : boards;
  //   }, [boards, search]);

  const getBoards = useCallback(() => {
    return !!search
      ? boards?.filter(
        (board) =>
          `${board?.boardMissionNumber}\\${board?.orderNumber}`.includes(
            search
          ) ||
          `${board?.clientName?.toLowerCase()}`.includes(
            search.toLowerCase()
          ) ||
          `${board?.productName?.toLowerCase()}`.includes(
            search.toLowerCase()
          ) ||
          board?.automatedTags?.some((tag) =>
            `${tag.toLowerCase()}`.includes(search.toLowerCase())
          ) ||
          `${board?.jobName?.toLowerCase()}`.includes(search.toLowerCase())
      )
      : boards;
  }, [boards, search]);

  return (
    <Stack ref={drop} border={isOver ? "1px solid black" : "none"} gap={"5px"}>
      <Button
        onClick={onClickStatus}
        startIcon={isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        sx={{
          height: "35px",
          padding: "6px 12px",
          width: "fit-content",
          margin: 0,
          backgroundColor: status.backgroundColor,
          color: status.textColor,
          "&:hover": {
            opacity: 0.7,
            backgroundColor: status?.backgroundColor,
            color: status?.textColor,
          },
        }}
      >
        {`${t("productionStatuses." + status.name)} (${getBoards().length})`}
      </Button>
      {getBoards().length > 0 && (
        <Collapse in={isOpen}>
          <Paper>
            <TableContainer>
              <Table stickyHeader={false}>
                <TableHead style={{ backgroundColor: status.backgroundColor }}>
                  <SecondaryTableRow>
                    {tableHeaders(status.id)?.map((header) => (
                      <SecondaryTableCell
                        style={{
                          backgroundColor: "#F9FAFB",
                          placeItems: "center"
                        }}
                        key={"statusTable" + status.id}
                        align={"center"}
                      >
                        <div style={{ width: "max-content", minWidth: "max-content", }}>
                          {header}
                        </div>
                      </SecondaryTableCell>
                    ))}
                  </SecondaryTableRow>
                </TableHead>
                <TableBody>
                  {[...getBoards()]
                    ?.sort((a, b) => a.priority - b.priority)
                    ?.map((boardMission) => {
                      return (
                        <>
                          <TableRowComponent
                            key={"status" + status.id + boardMission.id}
                            boardMission={boardMission}
                            status={status}
                            onClickDone={onOpenMarkReadyModal}
                            onClickPrintDTicket={onOpenPrintDeliverTicketModal}
                          />
                        </>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Collapse>
      )}
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        yesBtn={"boardMissions.markDoneModalYes"}
        noBtn={"boardMissions.markDoneModalNo"}
        openModal={openMarkReadyModal}
        onClose={onCloseMarkReadyModal}
        onClickYes={() => onClickMoveBoardMissionToDone(true)}
        onClickNo={() => onClickMoveBoardMissionToDone(false)}
      />
      <PrintPackingSlipModalWidget
        openModal={openPackagesModal}
        onClose={onClosePrintDeliverTicketModal}
        boardMissionId={selectedMission?.id}
        quantity={selectedMission?.quantity}
      />
    </Stack>
  );
};
export { StatusTableComponent };
