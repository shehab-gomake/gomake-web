import { useStatusTable } from "@/widgets/production-floor/table-view/status-table/use-status-Table";
import {
  Box,
  Collapse,
  IconButton,
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
import { useCallback, useState } from "react";
import { ThreeOptionsModal } from "@/components";
import { PrintPackingSlipModalWidget } from "../../views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { ModalType } from "@/enums";
import { useMediaQuery } from "@mui/material";

import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { productionFloorFiltersState } from "../../state/production-floor-filters";

interface IProps {
  status: IProductionStatus;
  boards: IBoardMissions[];
  count?: number;
  onClickClient?: (clientId: any) => void;
  allBoardMissions?: IBoardMissions[];
  setFilters?: any
}

const StatusTableComponent = ({
  status,
  boards,
  count,
  allBoardMissions,
  onClickClient,
  setFilters
}: IProps) => {
  const { isOpen, onClickStatus, tableHeaders } = useStatusTable();
  const [search] = useRecoilState(productionFloorTextSearchState);
  const isMobileScreen = useMediaQuery("(max-width:768px)");
  const [filtersState, setFiltersState] = useRecoilState(productionFloorFiltersState);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "", direction: "asc" });

  const reSortingCurrentStation = async (direction: "asc" | "desc") => {
    await setFilters({
      ...filtersState,
      currentStation: direction
    });
  };
  const hasUrgentOrApproval = allBoardMissions?.some(board =>
    board.isUrgentWork ||
    board.showGraphicsApprovalAlert === 1 ||
    board.showGraphicsApprovalAlert === 0 ||
    board.showGraphicsApprovalAlert === 2
  );
  const {
    t,
    RTL,
    updateStatus,
    onOpenMarkReadyModal,
    openMarkReadyModal,
    onCloseMarkReadyModal,
    onClickMoveBoardMissionToDone,
    openPackagesModal,
    onClosePrintDeliverTicketModal,
    onOpenPrintDeliverTicketModal,
    selectedMission,
    tryMoveBoardMissionsToDone,
    updateJobDueDate
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

  const getCustomWidth = (index: number) => {
    const widths = [
      "3%",
      "13%",
      "7%",
      "9%",
      "9%",
      "23%",
      "12%",
      "12%",
      "12%",
      "2%",
    ];
    return widths[index] || "auto";
  };

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
        {`${!status.isGroup ? t("productionStatuses." + status.name) : status.name
          } (${getBoards().length})`}
      </Button>
      {getBoards().length > 0 && (
        <Collapse in={isOpen}>
          <Paper>
            <TableContainer>
              <Table stickyHeader={false}>
                <TableHead style={{ backgroundColor: status.backgroundColor }}>
                  <SecondaryTableRow>
                    {tableHeaders(status.id)?.map((header, index) => {
                      console.log("header", header)
                      return (
                        <SecondaryTableCell
                          style={{
                            backgroundColor: "#F9FAFB",
                            placeItems: "center",
                            minWidth: getCustomWidth(index),
                            maxWidth: getCustomWidth(index),
                            width: getCustomWidth(index),
                            // Spread the mobile styles conditionally
                            ...(isMobileScreen && {
                              position: index <= 1 ? "sticky" : "relative",
                              [RTL ? "right" : "left"]:
                                index === 0 ? 0 : index === 1 ? 48 : "auto",
                              zIndex: index <= 1 ? 2 : 1,
                              background: index <= 1 ? "#f2f2f5" : "#F9FAFB",
                            }),
                          }}
                          key={"statusTable" + status.id + index}
                          align={"center"}
                          sx={{
                            '& .sort-icon': {
                              opacity: 0
                            },
                            '&:hover .sort-icon': {
                              opacity: 1
                            }
                          }}
                        >
                          <div
                            style={{
                              width: "max-content",
                              minWidth: "max-content",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "5px",
                            }}
                          >
                            {header}
                            {header === t("productionFloor.currentStation") && (
                              <IconButton
                                className="sort-icon"
                                onClick={() => {
                                  setSortConfig({
                                    key: t("productionFloor.currentStation"),
                                    direction: sortConfig.direction === "asc" ? "desc" : "asc"
                                  })
                                  reSortingCurrentStation(sortConfig.direction === "asc" ? "desc" : "asc")
                                }}>
                                {sortConfig.direction === "asc"
                                  ? <ArrowUpward sx={{ fontSize: "18px" }} />
                                  : <ArrowDownward sx={{ fontSize: "18px" }} />
                                }
                              </IconButton>
                            )}
                          </div>
                        </SecondaryTableCell>
                      )
                    })}
                  </SecondaryTableRow>
                </TableHead>
                <TableBody>
                  {(() => {


                    return [...getBoards()]
                      ?.sort((a, b) => a.priority - b.priority)
                      ?.map((boardMission, index) => (
                        <TableRowComponent
                          key={"status" + status.id + boardMission.id + index}
                          boardMission={boardMission}
                          status={status}
                          onClickDone={tryMoveBoardMissionsToDone}
                          onClickPrintDTicket={onOpenPrintDeliverTicketModal}
                          index={index}
                          onClickClient={onClickClient}
                          isMobileScreen={isMobileScreen}
                          isRTL={RTL}
                          isUrgentWork={hasUrgentOrApproval}
                          onUpdateJobDueDate={updateJobDueDate}
                        />
                      ));
                  })()}
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
