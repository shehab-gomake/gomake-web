import { IBoardMissionsTable } from "@/widgets/dashboard-widget/table/interface";
import { useStyle } from "@/widgets/dashboard-widget/table/style";
import { useTranslation } from "react-i18next";
import { IBoardMissions } from "@/widgets/dashboard-widget/interfaces";
import { IMachine } from "@/shared/interfaces";
import { StatusView } from "@/components/status-view";
import ElectricBoltSharpIcon from "@mui/icons-material/ElectricBoltSharp";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { EStatus } from "@/shared";
import { useRecoilValue } from "recoil";
import { boardsMissionsStatusFilterState } from "@/store/boards-missions-status-filter";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { adaptLeft, adaptRight } from "@/utils/adapter";
import { Divider, IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";
import { DateTimeComponent } from "@/components/date-time/date-time-component";
import { useTableScroll } from "@/widgets/dashboard-widget/table/use-table-scroll";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { ShutterIcon } from "@/components/icons/shutter-icon";
import { MachineTimeProgressComponent } from "@/widgets/dashboard-widget/table/machine-time-progress-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { FixedSizeList as List } from 'react-window';

export const exportExcel = (rows, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Board Missions");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([excelBuffer], { type: "application/octet-stream" }),
    filename
  );
};

const BoardMissionsTable = ({
  boardsMissions,
  usedMachines,
}: IBoardMissionsTable) => {
  const { t } = useTranslation();
  const direction = t("direction");
  const { classes } = useStyle(direction);
  const [orderByMachine, setOrderByMachine] = useState<string>("");
  const selectedStatusFilter = useRecoilValue(boardsMissionsStatusFilterState);
  const [isOrderByDueDate, setIsOrderByDueDate] = useState<boolean>(false);
  const [dueDateSortDirection, setDueDateSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const { replace } = useRouter();
  const {
    scrollRef,
    canScrollRight,
    canScrollLeft,
    scroll,
    checkScrollPosition,
  } = useTableScroll();
  const boardLink = (boardMissions: IBoardMissions) => {
    replace(
      `/production-floor/?boardMissionsId=${
        boardMissions.id
      }&step=stations&productType=${
        !!boardMissions.productType ? boardMissions.productType : ""
      }`
    ).then();
  };
  const hasMachine = (board: IBoardMissions) => {
    switch (board.machinesStatuses[orderByMachine]) {
      case EStatus.IN_PROCESS:
        return 0;
      case EStatus.WAITING:
        return 1;
      case EStatus.FAULT:
        return 2;
      case EStatus.NOT_YET:
        return 3;
      case EStatus.DONE:
        return 4;
      default:
        return 5;
    }
  };
  const statusName = (status) => {
    switch (status) {
      case EStatus.IN_PROCESS:
        return "In process";
      case EStatus.WAITING:
        return "Waiting";
      case EStatus.FAULT:
        return "Failed";
      case EStatus.NOT_YET:
        return "Not yet.";
      case EStatus.DONE:
        return "Done";
    }
  };
  const getFilteredBoardMissions = (selectedStatusFilter: EStatus | null) => {
    var data = [...boardsMissions];
    if (selectedStatusFilter) {
      data.forEach((x) => {
        if (x.splittedBoards) {
          x.splittedBoards = x.splittedBoards.filter((y) =>
            selectedStatusFilter === EStatus.IN_PROCESS
              ? y.status === EStatus.IN_PROCESS || y.status === EStatus.NOT_YET
              : y.status === selectedStatusFilter
          );
        }
      });
      data = data.filter((board) =>
        selectedStatusFilter === EStatus.IN_PROCESS
          ? board.status === selectedStatusFilter ||
            board.status === EStatus.NOT_YET ||
            (board.splittedBoards && board.splittedBoards.length > 0)
          : board.status === selectedStatusFilter ||
            (board.splittedBoards && board.splittedBoards.length > 0)
      );
    }

    return data;
  };
  // Memoize filtered data to avoid recalculation
  const filteredBoards = useMemo(() => {
    return getFilteredBoardMissions(selectedStatusFilter);
  }, [boardsMissions, selectedStatusFilter]);

  // Optimized sorting function with memoized date parsing
  const sortBoards = useCallback((boardsToSort: IBoardMissions[]) => {
    if (orderByMachine) {
      return boardsToSort
        .sort((board1: IBoardMissions, board2: IBoardMissions) => {
          // First sort by due date (earliest first)
          const dueDate1 = new Date(board1.dueDate);
          const dueDate2 = new Date(board2.dueDate);
          if (dueDate1 < dueDate2) return -1;
          if (dueDate1 > dueDate2) return 1;
          return 0;
        })
        .sort((board1: IBoardMissions, board2: IBoardMissions) => {
          // Then sort by machine status
          return hasMachine(board1) - hasMachine(board2);
        });
    }
    
    if (isOrderByDueDate) {
      // Pre-parse dates for better performance
      const boardsWithParsedDates = boardsToSort.map(board => ({
        ...board,
        parsedDueDate: new Date(board.dueDate)
      }));
      
      return boardsWithParsedDates
        .sort((board1, board2) => {
          const dueDate1 = board1.parsedDueDate;
          const dueDate2 = board2.parsedDueDate;
          if (dueDate1 < dueDate2) return dueDateSortDirection === 'asc' ? -1 : 1;
          if (dueDate1 > dueDate2) return dueDateSortDirection === 'asc' ? 1 : -1;
          return 0;
        })
        .map(({ parsedDueDate, ...board }) => board); // Remove parsed date before returning
    }
    
    return boardsToSort;
  }, [orderByMachine, isOrderByDueDate, dueDateSortDirection]);

  const boards = useMemo(() => {
    if (isSorting) {
      return filteredBoards; // Return unsorted data while sorting
    }
    return sortBoards(filteredBoards);
  }, [filteredBoards, sortBoards, isSorting]);
  const sortByDueDate = () => {
    // Prevent multiple rapid clicks
    if (isSorting) return;
    
    setIsSorting(true);
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      if (!isOrderByDueDate) {
        setIsOrderByDueDate(true);
        setDueDateSortDirection('asc');
      } else {
        setDueDateSortDirection(dueDateSortDirection === 'asc' ? 'desc' : 'asc');
      }
      setOrderByMachine("");
      
      // Small delay to show loading state
      setTimeout(() => {
        setIsSorting(false);
      }, 100);
    });
  };

  const handleMachineClicked = (machineId: string) => {
    setOrderByMachine(machineId === orderByMachine ? "" : machineId);
    setIsOrderByDueDate(false);
  };

  const exportToExcel = () => {
    const rows = boards.flatMap((board, index) => {
      if (board?.splittedBoards?.length > 0) {
        return board.splittedBoards.map((splitBoard, k) => ({
          "#": k === 0 ? index + 1 : "",
          Client: board.clientName,
          Task: board.code,
          "Due Date": board.dueDate.toString(),
          Product: board.productName,
          Status: statusName(splitBoard.status) || "",
          ...Object.fromEntries(
            usedMachines.map((machine) => [
              machine.progress?.name,
              statusName(splitBoard.machinesStatuses[machine.id]) || "",
            ])
          ),
        }));
      }
      return {
        "#": index + 1,
        Client: board.clientName,
        Task: board.code,
        "Due Date": board.dueDate.toString(),
        Product: board.productName,
        Status: statusName(board.status) || "",
        ...Object.fromEntries(
          usedMachines.map((machine) => [
            machine.progress?.name,
            statusName(board.machinesStatuses[machine.id]) || "",
          ])
        ),
      };
    });

    exportExcel(rows, "BoardMissions.xlsx");
  };
  useEffect(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
    return () => {
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [boards, usedMachines]);
  return boards.length > 0 ? (
    <>
      <Stack
        direction={"row"}
        padding={"0 3px 0 0"}
        justifyContent={"flex-end"}
      >
        <IconButton onClick={exportToExcel}>
          {" "}
          <DownloadIcon />
        </IconButton>
      </Stack>
      <div style={{ position: "relative", width: "100%", right: 10 }}>
        {canScrollRight && (
          <IconButton
            onClick={() => scroll(direction === "ltr" ? "right" : "left")}
            style={{
              position: "absolute",
              ...adaptLeft(direction, 0),
              top: 32,
              zIndex: 1,
              backgroundColor: "#FFF",
            }}
          >
            {direction === "ltr" ? (
              <ChevronRightIcon />
            ) : (
              <KeyboardArrowLeftIcon />
            )}
          </IconButton>
        )}
      </div>
      <div
        ref={scrollRef}
        onScroll={checkScrollPosition}
        style={classes.tableWrapper}
        className={"show-scrollbar"}
      >
        {isSorting && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            <CircularProgress size={40} />
          </div>
        )}
        <table id={"dashboard-table"} style={classes.table}>
          <thead>
            <tr>
              <th style={{ ...classes.tableHead, ...classes.firstColHead }}>
                <div style={classes.firstColHeadContent}>
                  <div style={{ width: "5%" }}>#</div>
                  <div style={{ width: "5%" }}></div>
                  <div style={{ width: "35%" }}>
                    {t("dashboard-widget.client")}
                  </div>
                  <div style={{ width: "25%" }}>
                    {t("dashboard-widget.task")}
                  </div>
                  <Tooltip title={t("dashboard-widget.clickToSort") || "Click to sort by due date"}>
                    <div
                      style={{
                        width: "30%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        ...(isOrderByDueDate ? classes.selectedMachine : {}),
                        ...(isSorting ? { opacity: 0.7 } : {}),
                      }}
                      onClick={() => sortByDueDate()}
                    >
                      {t("dashboard-widget.dueDate")}
                      {isOrderByDueDate && (
                        <span style={{ fontSize: '12px' }}>
                          {dueDateSortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                      {isSorting && <CircularProgress size={12} />}
                    </div>
                  </Tooltip>
                  <div style={{ width: "20%" }}>
                    {t("dashboard-widget.product")}
                  </div>
                  <div style={{ width: "35%" }}>
                    {t("dashboard-widget.status")}
                  </div>
                  {canScrollLeft && (
                    <IconButton
                      style={{
                        position: "absolute",
                        ...adaptLeft(direction, -20),
                        top: -13,
                        zIndex: 1,
                        backgroundColor: "#FFF",
                      }}
                      onClick={() =>
                        scroll(direction === "ltr" ? "left" : "right")
                      }
                    >
                      {direction === "ltr" ? (
                        <KeyboardArrowLeftIcon />
                      ) : (
                        <ChevronRightIcon />
                      )}
                    </IconButton>
                  )}
                </div>
              </th>
              {usedMachines.map((machine: IMachine) => {
                return (
                  <th
                    key={machine?.id}
                    style={
                      orderByMachine === machine?.id
                        ? { ...classes.tableHead, ...classes.selectedMachine }
                        : classes.tableHead
                    }
                    onClick={() => handleMachineClicked(machine?.id)}
                  >
                    <Stack gap={"8x"} minWidth={"fit-content"}>
                      <Stack justifyContent={"center"} height={"48px"}>
                        {machine?.name}
                      </Stack>
                      <Divider flexItem orientation={"horizontal"} />
                      <Stack
                        justifyContent={"center"}
                        alignItems={"center"}
                        direction={"row"}
                        gap={"4px"}
                        height={"48px"}
                      >
                        <Stack
                          style={{
                            padding: "3px 6px",
                            borderRadius: "2px",
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            height: "fit-content",
                          }}
                        >
                          <ShutterIcon color={"#FFF"} />
                        </Stack>
                        <Stack gap={"2px"} alignItems={"start"}>
                          <MachineTimeProgressComponent
                            done={machine.progress?.doneTime}
                            total={machine.progress?.totalTime}
                          />
                          <Stack>
                            <span>
                              ( {machine?.progress?.doneJobsCount}/
                              {machine?.progress?.totalJobsCount}
                              {t("measurementUnits.shortJobs")}){" "}
                            </span>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Stack>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {boards &&
              boards.map((board: IBoardMissions, index: number) => {
                return board?.splittedBoards?.length > 0 ? (
                  board.splittedBoards.map((splitBoard, k) => {
                    return (
                      <tr style={board.isLate ? classes.lateMission : {}}>
                        {k === 0 && (
                          <td
                            rowSpan={board.splittedBoards.length}
                            style={{
                              ...classes.tableCell,
                              position: "sticky",
                              ...adaptRight(direction, 0),
                              backgroundColor: board.isLate
                                ? classes.lateMission.backgroundColor
                                : "#FFFFFF",
                            }}
                          >
                            <div style={classes.firstColCellSplitBoards}>
                              <div style={{ width: "5%" }}>{index + 1}</div>
                              <div style={{ width: "5%" }}>
                                {board.isUrgent ? (
                                  <ElectricBoltSharpIcon color={"error"} />
                                ) : (
                                  ""
                                )}
                              </div>
                              <div style={{ width: "35%" }}>
                                <span>
                                  {board?.clientName &&
                                  board?.clientName?.length > 10
                                    ? board.clientName?.slice(0, 9) + ".."
                                    : board?.clientName}
                                </span>
                              </div>
                              <div style={{ width: "25%", height: "100%" }}>
                                <div style={classes.tdRows}>
                                  <div>
                                    <span>{board.code}</span>
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: "30%", height: "100%" }}>
                                <div style={classes.tdRows}>
                                  <DateTimeComponent
                                    dateTime={board.dueDate.toString()}
                                    gap={"20px"}
                                    direction={"column"}
                                  />
                                </div>
                              </div>
                              <div style={{ width: "20%", height: "100%" }}>
                                <div style={classes.tdRows}>
                                  <span>
                                    {board?.productName &&
                                    board?.productName?.length > 8
                                      ? board.productName?.slice(0, 7) + ".."
                                      : board?.productName}
                                  </span>
                                </div>
                              </div>
                              <div style={classes.splitBoardsStatuses}>
                                {board.splittedBoards.map(
                                  (sBoard, cellNumber) => (
                                    <div
                                      style={
                                        cellNumber + 1 ===
                                        board.splittedBoards.length
                                          ? {
                                              ...classes.splitBoardsStatusesRow,
                                              borderBottom: 0,
                                            }
                                          : classes.splitBoardsStatusesRow
                                      }
                                    >
                                      <Button onClick={() => boardLink(sBoard)}>
                                        {sBoard.productTypeName}
                                      </Button>
                                      <StatusView
                                        status={sBoard.status}
                                        label={sBoard.currentStation.rowName}
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </td>
                        )}
                        {usedMachines.map((machine: IMachine, i: number) => {
                          return (
                            <td
                              key={machine?.id + i}
                              style={
                                k + 1 === board.splittedBoards.length
                                  ? classes.tableCell
                                  : {
                                      ...classes.tableCell,
                                      borderBottom: 0,
                                    }
                              }
                            >
                              <StatusView
                                style={{ margin: "auto" }}
                                status={
                                  splitBoard.machinesStatuses[machine?.id]
                                }
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <tr
                    key={index}
                    style={board.isLate ? classes.lateMission : {}}
                  >
                    <td
                      style={{
                        ...classes.tableCell,
                        position: "sticky",
                        ...adaptRight(direction, 0),
                        backgroundColor: board.isLate
                          ? classes.lateMission.backgroundColor
                          : "#FFFFFF",
                      }}
                    >
                      <div style={classes.firstColCell}>
                        <div style={{ width: "5%" }}>{index + 1}</div>
                        <div style={{ width: "5%" }}>
                          {board.isUrgent ? (
                            <ElectricBoltSharpIcon color={"error"} />
                          ) : (
                            ""
                          )}
                        </div>
                        <div style={{ width: "35%" }}>
                          <span>
                            {board?.clientName && board?.clientName?.length > 10
                              ? board.clientName?.slice(0, 9) + ".."
                              : board?.clientName}
                          </span>
                        </div>
                        <div style={{ width: "25%", height: "100%" }}>
                          <div style={classes.tdRows}>
                            <div>
                              <Button onClick={() => boardLink(board)}>
                                {board.code}
                              </Button>
                            </div>
                          </div>
                        </div>
                                                                                    <div style={{ width: "30%" }}>
                                <div style={classes.tdRows}>
                                  <DateTimeComponent
                                    dateTime={board.dueDate.toString()}
                                    gap={"20px"}
                                    direction={"column"}
                                  />
                                </div>
                              </div>
                        <div style={{ width: "20%", height: "100%" }}>
                          <div style={classes.tdRows}>
                            <span>
                              {board?.productName &&
                              board?.productName?.length > 8
                                ? board.productName?.slice(0, 7) + ".."
                                : board?.productName}
                            </span>
                          </div>
                        </div>
                        <div style={{ width: "35%" }}>
                          <StatusView
                            status={board.status}
                            style={{ margin: "auto", marginLeft: 0 }}
                            label={board.currentStation.rowName}
                          />
                        </div>
                      </div>
                    </td>
                    {usedMachines.map((machine: IMachine, i: number) => {
                      return (
                        <td key={machine?.id + i} style={classes.tableCell}>
                          <StatusView
                            style={{ margin: "auto" }}
                            status={board.machinesStatuses[machine?.id]}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <div></div>
  );
};

export { BoardMissionsTable };
