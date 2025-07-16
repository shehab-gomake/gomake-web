import { useStatusTable } from "@/widgets/production-floor/table-view/status-table/use-status-Table";
import {
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
import { useRecoilState, useRecoilValue } from "recoil";
import { productionFloorTextSearchState } from "@/widgets/production-floor/state/text-search";
import { useCallback, useEffect, useState } from "react";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  ThreeOptionsModal,
} from "@/components";
import { PrintPackingSlipModalWidget } from "../../views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { CurrentStationOrderingEnum, ModalType } from "@/enums";
import { useMediaQuery } from "@mui/material";
import { useSimpleApproveModal } from "@/hooks/use-simple-approve-modal";
import { EPreferences } from "@/enums/prefernces";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";

import { ArrowUpward } from "@mui/icons-material";
import { productionFloorFiltersState } from "../../state/production-floor-filters";
import { currentStationOrderingState } from "@/store/agents-state";
import { useProductionFloorData } from "../../use-production-floor-data";
import { AddStuckReasonWidget } from "../../add-stuck-reason/add-stuck-reason";
import { ColumnSettingsMenu } from "../components/column-settings-menu";
import {
  columnOrderState,
  columnVisibilityState,
  getCustomWidth,
} from "../../state/production-floor-coulmns-table-settings";

interface IProps {
  status: IProductionStatus;
  boards: IBoardMissions[];
  count?: number;
  onClickClient?: (clientId: any) => void;
  allBoardMissions?: IBoardMissions[];
  setFilters?: any;
  storageList?: any;
  inputValue?: any;
  defaultValue?: any;
  addPrintHouseJobsStorage?: any;
  handleStorageChange?: any;
  setInputValue?: any;
  employeesCategories?: any;
  visibleColumns: string[];
}

const StatusTableComponent = ({
  status,
  boards,
  count,
  allBoardMissions,
  onClickClient,
  setFilters,
  storageList,
  inputValue,
  defaultValue,
  addPrintHouseJobsStorage,
  handleStorageChange,
  setInputValue,
  employeesCategories,
  visibleColumns,
}: IProps) => {
  const { isOpen, onClickStatus, tableHeaders } = useStatusTable();
  const [search] = useRecoilState(productionFloorTextSearchState);
  const isMobileScreen = useMediaQuery("(max-width:768px)");
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const [filtersState, setFiltersState] = useRecoilState(
    productionFloorFiltersState
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: CurrentStationOrderingEnum;
  }>({ key: "", direction: CurrentStationOrderingEnum.NONE });

  const reSortingCurrentStation = async (
    direction: CurrentStationOrderingEnum
  ) => {
    await setFilters({
      ...filtersState,
      currentStationOrdering: direction,
    });
  };
  const hasUrgentOrApproval = allBoardMissions?.some(
    (board) =>
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
    tryMoveBoardMissionsToDone,
    updateJobDueDate,
    selectedMission,
    onOpenMarkReadyModalForHasJobs,
    openMarkReadyModalForHasJobs,
    onCloseMarkReadyModalForHasJobs,
    onClickMarkReadyModalForHasJobs,
  } = useProductionFloorData();

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

  const [currentStationOrdering, setCurrentStationOrdering] = useRecoilState(
    currentStationOrderingState
  );

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
          if (status.key === "Approval required" && item.board.isNeedExample) {
            handleOpenModal(
              status.id,
              item.selectedIds.length > 0 ? item.selectedIds : [item.board],
              item.board.id
            );
          } /* else if (status.key === "Stuck") {
            handleOpenStuckModal(
              status.id,
              item.selectedIds.length > 0 ? item.selectedIds : [item.board],
              item.board.id,
              item.board.productType
            );
          }*/ else {
            updateStatus(
              item.selectedIds.length > 0 ? item.selectedIds : [item.board],
              status.id
            ).then();
          }
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

  const columnOrder = useRecoilValue(columnOrderState);
  const columnVisibility = useRecoilValue(columnVisibilityState);

  return (
    <Stack ref={drop} border={isOver ? "1px solid black" : "none"} gap={"5px"}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Button
          onClick={onClickStatus}
          startIcon={
            isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
          }
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
          {`${!status.isGroup
            ? t("productionStatuses." + status.name)
            : status.name
            } (${getBoards().length})`}
        </Button>
        {status.index === 1 && <ColumnSettingsMenu />}
      </Stack>

      {getBoards().length > 0 && (
        <Collapse in={isOpen}>
          <Paper>
            <TableContainer>
              <Table stickyHeader={false}>
                <TableHead style={{ backgroundColor: status.backgroundColor }}>
                  <SecondaryTableRow>
                    {tableHeaders(status.id)?.map((header, index) => {
                      const key = columnOrder.filter(
                        (k) => columnVisibility[k]
                      )[index];
                      const width = getCustomWidth(key);

                      return (
                        <SecondaryTableCell
                          style={{
                            backgroundColor: "#F9FAFB",
                            placeItems: "center",
                            minWidth: width,
                            maxWidth: width,
                            width,
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
                          sx={
                            header === t("productionFloor.currentStation")
                              ? currentStationOrdering ===
                                CurrentStationOrderingEnum.NONE
                                ? {
                                  "& .sort-icon": { opacity: 0 },
                                  "&:hover .sort-icon": { opacity: 1 },
                                }
                                : {
                                  "& .sort-icon": { opacity: 1 },
                                }
                              : undefined
                          }
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
                                    direction:
                                      currentStationOrdering ===
                                        CurrentStationOrderingEnum.NONE
                                        ? CurrentStationOrderingEnum.ASC
                                        : CurrentStationOrderingEnum.NONE,
                                  });
                                  setCurrentStationOrdering(
                                    currentStationOrdering ===
                                      CurrentStationOrderingEnum.NONE
                                      ? CurrentStationOrderingEnum.ASC
                                      : CurrentStationOrderingEnum.NONE
                                  );
                                  reSortingCurrentStation(
                                    currentStationOrdering ===
                                      CurrentStationOrderingEnum.NONE
                                      ? CurrentStationOrderingEnum.ASC
                                      : CurrentStationOrderingEnum.NONE
                                  );
                                }}
                              >
                                {<ArrowUpward sx={{ fontSize: "18px" }} />}
                              </IconButton>
                            )}
                          </div>
                        </SecondaryTableCell>
                      );
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
                          employeesCategories={employeesCategories}
                          visibleColumns={visibleColumns}
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
      >
        <div style={{ width: "100%", minWidth: 300 }}>
          <GoMakeAutoComplate
            options={
              storageList?.find(
                (option: any) => option.storage === inputValue
              ) || inputValue === ""
                ? storageList
                : [
                  {
                    storage: `Add "${inputValue}" as a new storage`,
                    id: "new",
                  },
                  ...storageList,
                ]
            }
            placeholder={t("boardMissions.selectStorage")}
            key={defaultValue}
            style={{
              width: "100%",
              border: "none",
              height: 45,
            }}
            getOptionLabel={(option: any) => option?.storage}
            value={defaultValue}
            onChange={(e: any, value: any) => {
              if (value?.id === "new") {
                addPrintHouseJobsStorage(inputValue);
                setInputValue("");
              } else {
                handleStorageChange(e, value);
                setInputValue("");
              }
            }}
            onInputChange={(event: any, newInputValue: string) => {
              setInputValue(newInputValue);
            }}
          />
        </div>
      </ThreeOptionsModal>
      <PrintPackingSlipModalWidget
        openModal={openPackagesModal}
        onClose={onClosePrintDeliverTicketModal}
        boardMissionId={selectedMission?.id}
        quantity={selectedMission?.quantity}
      />
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
        title={t("boardMissions.unReadyWitNotification")}
        yesBtn={t("modal.yes")}
        modalType={ModalType.WARNING}
        subTitle={" "}
        openModal={openMarkReadyModalForHasJobs}
        onClose={onCloseMarkReadyModalForHasJobs}
        onClickDelete={onClickMarkReadyModalForHasJobs}
        onClickCancel={onCloseMarkReadyModalForHasJobs}
      >
        <div style={{ width: "100%", minWidth: 300 }}>
          <GoMakeAutoComplate
            options={
              storageList?.find(
                (option: any) => option.storage === inputValue
              ) || inputValue === ""
                ? storageList
                : [
                  {
                    storage: `Add "${inputValue}" as a new storage`,
                    id: "new",
                  },
                  ...storageList,
                ]
            }
            placeholder={t("boardMissions.selectStorage")}
            key={defaultValue}
            style={{
              width: "100%",
              border: "none",
              height: 45,
            }}
            getOptionLabel={(option: any) => option?.storage}
            value={defaultValue}
            onChange={(e: any, value: any) => {
              if (value?.id === "new") {
                addPrintHouseJobsStorage(inputValue);
                setInputValue("");
              } else {
                handleStorageChange(e, value);
                setInputValue("");
              }
            }}
            onInputChange={(event: any, newInputValue: string) => {
              setInputValue(newInputValue);
            }}
          />
        </div>
      </GoMakeDeleteModal>
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
};
export { StatusTableComponent };
