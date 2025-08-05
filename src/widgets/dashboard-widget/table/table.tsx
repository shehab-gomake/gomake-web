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
import { useVirtualScroll } from "@/widgets/dashboard-widget/table/use-virtual-scroll";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { ShutterIcon } from "@/components/icons/shutter-icon";
import { MachineTimeProgressComponent } from "@/widgets/dashboard-widget/table/machine-time-progress-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

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
  const [dueDateSortDirection, setDueDateSortDirection] = useState<
    "asc" | "desc"
  >("asc");
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const { replace } = useRouter();
  const {
    scrollRef,
    canScrollRight,
    canScrollLeft,
    scroll,
    checkScrollPosition,
  } = useTableScroll();

  // Virtual scrolling configuration
  const ROW_HEIGHT = 80; // Approximate height of each row
  const CONTAINER_HEIGHT = 600; // Fixed container height for virtual scrolling

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
  const sortBoards = useCallback(
    (boardsToSort: IBoardMissions[]) => {
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
        const boardsWithParsedDates = boardsToSort.map((board) => ({
          ...board,
          parsedDueDate: new Date(board.dueDate),
        }));

        return boardsWithParsedDates
          .sort((board1, board2) => {
            const dueDate1 = board1.parsedDueDate;
            const dueDate2 = board2.parsedDueDate;
            if (dueDate1 < dueDate2)
              return dueDateSortDirection === "asc" ? -1 : 1;
            if (dueDate1 > dueDate2)
              return dueDateSortDirection === "asc" ? 1 : -1;
            return 0;
          })
          .map(({ parsedDueDate, ...board }) => board); // Remove parsed date before returning
      }

      return boardsToSort;
    },
    [orderByMachine, isOrderByDueDate, dueDateSortDirection]
  );

  const boards = useMemo(() => {
    if (isSorting) {
      return filteredBoards; // Return unsorted data while sorting
    }
    return sortBoards(filteredBoards);
  }, [filteredBoards, sortBoards, isSorting]);

  const {
    containerRef: virtualScrollRef,
    totalHeight,
    visibleData,
    offsetY,
    startIndex,
    endIndex,
    handleScroll,
    scrollToIndex,
    scrollLeft,
  } = useVirtualScroll({
    data: boards,
    itemHeight: ROW_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 10, // Render 10 extra rows above and below for smooth scrolling
  });

  const sortByDueDate = () => {
    // Prevent multiple rapid clicks
    if (isSorting) return;

    setIsSorting(true);

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      if (!isOrderByDueDate) {
        setIsOrderByDueDate(true);
        setDueDateSortDirection("asc");
      } else {
        setDueDateSortDirection(
          dueDateSortDirection === "asc" ? "desc" : "asc"
        );
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

  // Initialize virtual scrolling container
  useEffect(() => {
    if (virtualScrollRef.current) {
      virtualScrollRef.current.scrollTop = 0;
    }
  }, [boards.length]); // Re-initialize when data changes

  return boards.length > 0 ? (
    <>
      <div
        style={{
          marginTop: 10,
          marginBottom: 10,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton onClick={exportToExcel}>
          <DownloadIcon />
        </IconButton>
        <div style={{ display: "flex", gap: 10 }}>
          <IconButton
            style={{
              backgroundColor: "#FFF",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              width: 40,
              height: 40,
            }}
            onClick={() => scrollLeft(direction === "ltr" ? "left" : "right")}
          >
            {direction === "ltr" ? (
              <KeyboardArrowLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
          <IconButton
            style={{
              backgroundColor: "#FFF",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              width: 40,
              height: 40,
            }}
            onClick={() => scrollLeft(direction === "ltr" ? "right" : "left")}
          >
            {direction === "ltr" ? (
              <KeyboardArrowRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
      </div>
      <div
        style={{
          ...classes.tableWrapper,
          // Custom scrollbar styling
          scrollbarWidth: "thin",
          scrollbarColor: "#c1c1c1 #f1f1f1",
        }}
        className={"dashboard-table-scrollbar"}
      >
        {isSorting && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <CircularProgress size={40} />
          </div>
        )}

        {/* Single table with sticky header and virtual scrolling body */}
        <div style={{ position: "relative" }}>
          <div
            ref={scrollRef}
            onScroll={checkScrollPosition}
            style={{
              height: CONTAINER_HEIGHT,
              overflow: "auto",
              position: "relative",
              //overflowX: "auto",
              overflowY: "auto",
              // Custom scrollbar styling for vertical scroll
              scrollbarWidth: "thin",
              scrollbarColor: "#c1c1c1 #f1f1f1",
            }}
            className="dashboard-table-scrollbar"
          >
            <div
              ref={virtualScrollRef}
              onScroll={handleScroll}
              style={{
                height: CONTAINER_HEIGHT,
                overflow: "auto",
                position: "relative",
                // Custom scrollbar styling for vertical scroll
                scrollbarWidth: "thin",
                scrollbarColor: "#c1c1c1 #f1f1f1",
              }}
              className="dashboard-table-scrollbar"
              onLoad={() => {
                // Ensure the container is properly initialized
                if (virtualScrollRef.current) {
                  virtualScrollRef.current.scrollTop = 0;
                }
              }}
            >
              <table
                id={"dashboard-table"}
                style={{
                  ...classes.table,
                  width: "max-content",
                  minWidth: "100%",
                  tableLayout: "fixed",
                }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: "#fff",
                  }}
                >
                  <tr>
                    <th
                      style={{
                        ...classes.tableHead,
                        ...classes.firstColHead,
                        width: "300px",
                      }}
                    >
                      <div style={classes.firstColHeadContent}>
                        <div style={{ width: "5%" }}>#</div>
                        <div style={{ width: "5%" }}></div>
                        <div style={{ width: "35%" }}>
                          {t("dashboard-widget.client")}
                        </div>
                        <div style={{ width: "38%" }}>
                          {t("dashboard-widget.task")}
                        </div>
                        <div
                          style={{
                            width: "30%",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            ...(isOrderByDueDate
                              ? classes.selectedMachine
                              : {}),
                            ...(isSorting ? { opacity: 0.7 } : {}),
                          }}
                          onClick={() => sortByDueDate()}
                        >
                          {t("dashboard-widget.dueDate")}
                          {isOrderByDueDate && (
                            <span style={{ fontSize: "12px" }}>
                              {dueDateSortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                          {isSorting && <CircularProgress size={12} />}
                        </div>
                        <div style={{ width: "20%" }}>
                          {t("dashboard-widget.product")}
                        </div>
                        <div style={{ width: "35%" }}>
                          {t("dashboard-widget.status")}
                        </div>
                      </div>
                    </th>

                    {usedMachines.map((machine: IMachine) => {
                      return (
                        <th
                          key={machine?.id}
                          style={{
                            ...(orderByMachine === machine?.id
                              ? {
                                  ...classes.tableHead,
                                  ...classes.selectedMachine,
                                }
                              : classes.tableHead),
                            width: "120px",
                          }}
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
                  {/* Virtual scrolling spacer */}
                  <tr style={{ height: offsetY }}>
                    <td
                      colSpan={usedMachines.length + 1}
                      style={{ padding: 0, border: 0 }}
                    ></td>
                  </tr>

                  {visibleData && visibleData.length > 0
                    ? visibleData.map(
                        (board: IBoardMissions, virtualIndex: number) => {
                          const actualIndex = startIndex + virtualIndex;
                          return board?.splittedBoards?.length > 0 ? (
                            board.splittedBoards.map((splitBoard, k) => {
                              return (
                                <tr
                                  key={`${actualIndex}-${k}`}
                                  style={{
                                    ...(board.isLate
                                      ? classes.lateMission
                                      : {}),
                                    height: ROW_HEIGHT,
                                  }}
                                >
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
                                        width: "300px",
                                      }}
                                    >
                                      <div
                                        style={classes.firstColCellSplitBoards}
                                      >
                                        <div style={{ width: "5%" }}>
                                          {actualIndex + 1}
                                        </div>
                                        <div style={{ width: "5%" }}>
                                          {board.isUrgent ? (
                                            <ElectricBoltSharpIcon
                                              color={"error"}
                                            />
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                        <div style={{ width: "35%" }}>
                                          <span>
                                            {board?.clientName &&
                                            board?.clientName?.length > 10
                                              ? board.clientName?.slice(0, 9) +
                                                ".."
                                              : board?.clientName}
                                          </span>
                                        </div>
                                        <div
                                          style={{
                                            width: "25%",
                                            height: "100%",
                                          }}
                                        >
                                          <div style={classes.tdRows}>
                                            <div>
                                              <span>{board.code}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            width: "30%",
                                            height: "100%",
                                          }}
                                        >
                                          <div style={classes.tdRows}>
                                            <DateTimeComponent
                                              dateTime={board.dueDate.toString()}
                                              gap={"20px"}
                                              direction={"column"}
                                            />
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            width: "20%",
                                            height: "100%",
                                          }}
                                        >
                                          <div style={classes.tdRows}>
                                            <span>
                                              {board?.productName &&
                                              board?.productName?.length > 8
                                                ? board.productName?.slice(
                                                    0,
                                                    7
                                                  ) + ".."
                                                : board?.productName}
                                            </span>
                                          </div>
                                        </div>
                                        <div
                                          style={classes.splitBoardsStatuses}
                                        >
                                          {board.splittedBoards.map(
                                            (sBoard, cellNumber) => (
                                              <div
                                                key={cellNumber}
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
                                                <Button
                                                  onClick={() =>
                                                    boardLink(sBoard)
                                                  }
                                                >
                                                  {sBoard.productTypeName}
                                                </Button>
                                                <StatusView
                                                  status={sBoard.status}
                                                  label={
                                                    sBoard.currentStation
                                                      .rowName
                                                  }
                                                />
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                  )}
                                  {usedMachines.map(
                                    (machine: IMachine, i: number) => {
                                      return (
                                        <td
                                          key={machine?.id + i}
                                          style={{
                                            ...(k + 1 ===
                                            board.splittedBoards.length
                                              ? classes.tableCell
                                              : {
                                                  ...classes.tableCell,
                                                  borderBottom: 0,
                                                }),
                                            width: "120px",
                                          }}
                                        >
                                          <StatusView
                                            style={{ margin: "auto" }}
                                            status={
                                              splitBoard.machinesStatuses[
                                                machine?.id
                                              ]
                                            }
                                          />
                                        </td>
                                      );
                                    }
                                  )}
                                </tr>
                              );
                            })
                          ) : (
                            <tr
                              key={actualIndex}
                              style={{
                                ...(board.isLate ? classes.lateMission : {}),
                                height: ROW_HEIGHT,
                              }}
                            >
                              <td
                                style={{
                                  ...classes.tableCell,
                                  position: "sticky",
                                  ...adaptRight(direction, 0),
                                  backgroundColor: board.isLate
                                    ? classes.lateMission.backgroundColor
                                    : "#FFFFFF",
                                  width: "300px",
                                }}
                              >
                                <div style={classes.firstColCell}>
                                  <div style={{ width: "5%" }}>
                                    {actualIndex + 1}
                                  </div>
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
                                        <Button
                                          onClick={() => boardLink(board)}
                                        >
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
                                          ? board.productName?.slice(0, 7) +
                                            ".."
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
                              {usedMachines.map(
                                (machine: IMachine, i: number) => {
                                  return (
                                    <td
                                      key={machine?.id + i}
                                      style={{
                                        ...classes.tableCell,
                                        width: "120px",
                                      }}
                                    >
                                      <StatusView
                                        style={{ margin: "auto" }}
                                        status={
                                          board.machinesStatuses[machine?.id]
                                        }
                                      />
                                    </td>
                                  );
                                }
                              )}
                            </tr>
                          );
                        }
                      )
                    : null}

                  {/* Virtual scrolling spacer */}
                  <tr
                    style={{
                      height:
                        totalHeight -
                        offsetY -
                        (visibleData ? visibleData.length * ROW_HEIGHT : 0),
                    }}
                  >
                    <td
                      colSpan={usedMachines.length + 1}
                      style={{ padding: 0, border: 0 }}
                    ></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div></div>
  );
};

export { BoardMissionsTable };
