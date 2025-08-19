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
  Typography,
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
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
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
import {
  columnOrderState,
  columnVisibilityState,
  getCustomWidth,
} from "../../state/production-floor-coulmns-table-settings";
import React from "react";
import { TableVirtuoso } from 'react-virtuoso';

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
  isVirtualizing?: boolean;
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
  isVirtualizing = false,
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

  const virtuosoRef = useRef<any>(null);

  const reSortingCurrentStation = useCallback(
    async (direction: CurrentStationOrderingEnum) => {
      await setFilters({
        ...filtersState,
        currentStationOrdering: direction,
      });
    },
    [setFilters, filtersState]
  );

  const hasUrgentOrApproval = useMemo(
    () =>
      allBoardMissions?.some(
        (board) =>
          board.isUrgentWork ||
          board.showGraphicsApprovalAlert === 1 ||
          board.showGraphicsApprovalAlert === 0 ||
          board.showGraphicsApprovalAlert === 2
      ),
    [allBoardMissions]
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
          } else {
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

  // Optimized board filtering with memoization
  const getBoards = useCallback(() => {
    if (!search) return boards;

    const searchLower = search.toLowerCase();
    return boards?.filter((board) => {
      const missionNumber = `${board?.boardMissionNumber}\\${board?.orderNumber}`;
      const clientName = board?.clientName?.toLowerCase() || "";
      const productName = board?.productName?.toLowerCase() || "";
      const jobName = board?.jobName?.toLowerCase() || "";

      return (
        missionNumber.includes(search) ||
        clientName.includes(searchLower) ||
        productName.includes(searchLower) ||
        jobName.includes(searchLower) ||
        board?.automatedTags?.some((tag) =>
          `${tag.toLowerCase()}`.includes(searchLower)
        )
      );
    });
  }, [boards, search]);

  // Memoized sorted boards
  const sortedBoards = useMemo(() => {
    const filteredBoards = getBoards();
    return [...filteredBoards].sort((a, b) => a.priority - b.priority);
  }, [getBoards]);

  const columnOrder = useRecoilValue(columnOrderState);
  const columnVisibility = useRecoilValue(columnVisibilityState);

  // Memoized table headers
  const memoizedTableHeaders = useMemo(
    () => tableHeaders(status.id),
    [tableHeaders, status.id]
  );

  // Create a stable reference for the TableRow renderer
  const renderTableRow = useCallback((props: any) => {
    const { item: boardMission, ...restProps } = props;

    // If this is a data row (has item), render TableRowComponent
    if (boardMission) {
      return (
        <TableRowComponent
          {...restProps}
          boardMission={boardMission}
          status={status}
          onClickDone={tryMoveBoardMissionsToDone}
          onClickPrintDTicket={onOpenPrintDeliverTicketModal}
          index={sortedBoards.indexOf(boardMission)}
          onClickClient={onClickClient}
          isMobileScreen={isMobileScreen}
          isRTL={RTL}
          isUrgentWork={hasUrgentOrApproval}
          onUpdateJobDueDate={updateJobDueDate}
          employeesCategories={employeesCategories}
          visibleColumns={visibleColumns}
        />
      );
    }

    // For header rows, use SecondaryTableRow
    return <SecondaryTableRow {...restProps} />;
  }, [
    status,
    sortedBoards,
    tryMoveBoardMissionsToDone,
    onOpenPrintDeliverTicketModal,
    onClickClient,
    isMobileScreen,
    RTL,
    hasUrgentOrApproval,
    updateJobDueDate,
    employeesCategories,
    visibleColumns,
  ]);

  // Custom Table components for TableVirtuoso - with minimal dependencies
  const TableComponents = useMemo(() => ({
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
      <TableContainer {...props} ref={ref} sx={{ height: '100%' }} />
    )),
    Table: (props: any) => (
      <Table {...props} stickyHeader sx={{ tableLayout: 'fixed' }} />
    ),
    TableHead: TableHead,
    // IMPORTANT: do not override TableRow here; let Virtuoso manage rows
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  }), []);



  // Fixed header content function
  const fixedHeaderContent = useCallback(() => {
    return (
      <SecondaryTableRow>
        {memoizedTableHeaders?.map((header, index) => {
          const key = columnOrder.filter((k) => columnVisibility[k])[index];
          const width = getCustomWidth(key);

          return (
            <SecondaryTableCell
              style={{
                backgroundColor: "#F9FAFB",
                placeItems: "center",
                minWidth: width,
                maxWidth: width,
                width,
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
                  ? currentStationOrdering === CurrentStationOrderingEnum.NONE
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
                          currentStationOrdering === CurrentStationOrderingEnum.NONE
                            ? CurrentStationOrderingEnum.ASC
                            : CurrentStationOrderingEnum.NONE,
                      });
                      setCurrentStationOrdering(
                        currentStationOrdering === CurrentStationOrderingEnum.NONE
                          ? CurrentStationOrderingEnum.ASC
                          : CurrentStationOrderingEnum.NONE
                      );
                      reSortingCurrentStation(
                        currentStationOrdering === CurrentStationOrderingEnum.NONE
                          ? CurrentStationOrderingEnum.ASC
                          : CurrentStationOrderingEnum.NONE
                      );
                    }}
                  >
                    <ArrowUpward sx={{ fontSize: "18px" }} />
                  </IconButton>
                )}
              </div>
            </SecondaryTableCell>
          );
        })}
      </SecondaryTableRow>
    );
  }, [
    memoizedTableHeaders,
    columnOrder,
    columnVisibility,
    isMobileScreen,
    RTL,
    status.id,
    t,
    currentStationOrdering,
    setSortConfig,
    setCurrentStationOrdering,
    reSortingCurrentStation,
  ]);

  const TABLE_CONFIG = {
    ITEM_HEIGHT: columnVisibility.description ? 85 : 68,
    HEADER_HEIGHT: 50,
    MAX_VISIBLE_ITEMS: 10
  };

  const calculateConfigurableHeight = () => {
    const boardsCount = getBoards().length;
    const visibleItems = Math.min(boardsCount, TABLE_CONFIG.MAX_VISIBLE_ITEMS);
    const totalHeight = (visibleItems * TABLE_CONFIG.ITEM_HEIGHT) + TABLE_CONFIG.HEADER_HEIGHT;

    console.log("totalHeight", { boardsCount, totalHeight, visibleItems })

    return `${totalHeight}px`;
  };


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
      </Stack>

      {getBoards().length > 0 && (
        <Collapse in={isOpen}>
          <Paper sx={{ overflow: 'auto' }}>
            <TableVirtuoso
              key={`virtuoso-${status.id}-${sortedBoards.length}`}
              ref={virtuosoRef}
              style={{ height: calculateConfigurableHeight() }}
              data={sortedBoards}
              overscan={5}
              components={TableComponents}
              fixedHeaderContent={fixedHeaderContent}
              itemContent={(index: number, boardMission: IBoardMissions) => (
                <TableRowComponent
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
                  cellsOnly
                />
              )}
            />
          </Paper>
        </Collapse>
      )}

      {/* All modals remain the same */}
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