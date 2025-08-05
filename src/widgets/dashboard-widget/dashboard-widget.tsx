import {
  IBoardMissions,
  IDashboardStatistic,
  IDashboardWidget,
} from "@/widgets/dashboard-widget/interfaces";
import { useStyle } from "@/widgets/dashboard-widget/style";
import { useCallback, useEffect, useState } from "react";
import { Cards } from "@/widgets/dashboard-widget/cards/cards";
import { IDateRange } from "@/shared/interfaces";
import { BoardMissionsTable } from "@/widgets/dashboard-widget/table";
import { useGomakeDateRange, useGomakeMachines } from "@/hooks";
import { useBoardMissions } from "@/widgets/dashboard-widget/use-board-missions";
import { useRecoilValue } from "recoil";
import { DashboardActions } from "@/store";
import { selectedAgentsState } from "@/store/agents-state";
import { dashboardClientsState } from "@/widgets/dashboard-widget/clients/clients-state";
import { Skeleton } from "@mui/material";
import { DashboardDates } from "@/widgets/dashboard-widget/dates";
import Stack from "@mui/material/Stack";
import { useDashboardSocketIo } from "@/hooks/socket-io/use-dashboard-socket-io";
import { useTranslation } from "react-i18next";

const DashboardWidget = ({}: IDashboardWidget) => {
  const {
    machines,
    addMachineProgress,
    addEmployeeProgress,
    getCheckedMachines,
  } = useGomakeMachines();
  const [tasksFilter, setTasksFilter] = useState<string>("");
  const selectedClients = useRecoilValue(dashboardClientsState);
  const { classes } = useStyle();
  const { dates, action } = useGomakeDateRange();
  const selectedAgents = useRecoilValue(selectedAgentsState);
  const {} = useDashboardSocketIo(() => actions(action, dates));
  const { t } = useTranslation();
  const {
    getBoardsMissionsByDateRange,
    statistics,
    machinesProgress,
    boardsMissions,
    getFilteredBoardsMissions,
    getLateBoardsMissions,
    getLateTodayBoardsMissions,
    getAllBoardsMissions,
    dashboardColumns,
    setBoardsMissions,
    setStatistics,
    isLoading,
  } = useBoardMissions();
  const actions = useCallback(
    (action: DashboardActions, dateRange: IDateRange) => {
      switch (action) {
        case DashboardActions.LATE_TODAY_BOARDS_MISSIONS:
          getLateTodayBoardsMissions().then();
          break;
        case DashboardActions.LATE_BOARDS_MISSIONS:
          getLateBoardsMissions().then();
          break;
        case DashboardActions.ALL_BOARDS_MISSIONS:
          getAllBoardsMissions().then();
          break;
        default:
          getBoardsMissionsByDateRange(dateRange).then();
      }
    },
    [
      getLateTodayBoardsMissions,
      getLateBoardsMissions,
      getAllBoardsMissions,
      getBoardsMissionsByDateRange,
    ]
  );

  useEffect(() => {
    // Only clear data if we're changing filters, not on initial load
    if (boardsMissions.length > 0 || statistics) {
      setBoardsMissions([]);
      setStatistics(null);
    }
    actions(action, dates);
  }, [action, dates, selectedAgents]);

  useEffect(() => {
    addMachineProgress(machinesProgress);
    addEmployeeProgress(machinesProgress);
  }, [boardsMissions]);

  // useEffect(() => {
  //     const interval = setInterval(async () => {
  //         actions(action, dates);
  //     }, INTERVAL_TIMEOUT);
  //     return () => clearInterval(interval);
  // }, [dates, action, selectedAgents]);

  const handelSearchValueChange = (event) => {
    setTasksFilter(event);
  };

  const usedMachines = useCallback(() => {
    const checkedMachines = getCheckedMachines();
    const filteredBoardsMissions = getFilteredBoardsMissions();
    if (!Array.isArray(filteredBoardsMissions)) {
      console.error(
        "getFilteredBoardsMissions did not return an array:",
        filteredBoardsMissions
      );
      return [];
    }

    // Filter machines that are used in the boards and maintain their order in the machines array
    return machines.filter((machine) => {
      // Check if machine is checked
      if (!machine.checked) return false;

      // Check if machine is used in any board
      for (const board of filteredBoardsMissions) {
        if (board.machinesStatuses[machine.id]) {
          return true;
        }
      }
      return false;
    });
  }, [machines, getFilteredBoardsMissions()]);

  const tasks = useCallback(() => {
    const selectedClientsIds = selectedClients
      ?.filter((client) => client?.checked)
      ?.map((client) => client?.id);
    let tasksArray = getFilteredBoardsMissions();
    tasksArray =
      selectedClientsIds.length !== 0
        ? tasksArray.filter((board) =>
            selectedClientsIds.includes(board.clientId)
          )
        : tasksArray;
    return tasksFilter
      ? tasksArray.filter((boardsMissions: IBoardMissions) => {
          return (
            boardsMissions.code
              .toLowerCase()
              .includes(tasksFilter.toLowerCase()) ||
            boardsMissions.orderNumber
              .toLowerCase()
              .includes(tasksFilter.toLowerCase())
          );
        })
      : tasksArray;
  }, [tasksFilter, getFilteredBoardsMissions(), selectedClients]);

  return (
    <div style={classes.container}>
      {statistics ? (
        <Cards data={statistics ? statistics : ({} as IDashboardStatistic)} />
      ) : (
        <Stack style={{ ...classes.SkeletonCardsContainer }} gap={"15px"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {new Array(6).fill(null).map((_) => (
              <Skeleton
                variant="rectangular"
                width={215}
                height={80}
                style={{ borderRadius: 16 }}
              />
            ))}
          </Stack>
        </Stack>
      )}

      <DashboardDates handelSearchValueChange={handelSearchValueChange} />
      <Stack style={{ height: "100%" }}>
        {tasks()?.length > 0 ? (
          <div>
            {usedMachines() && getFilteredBoardsMissions() && (
              <BoardMissionsTable
                boardsMissions={tasks()}
                usedMachines={usedMachines()}
              />
            )}
          </div>
        ) : isLoading ? (
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={400}
            style={{ borderRadius: 16 }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 400,
              borderRadius: 16,
              backgroundColor: "#f5f5f5",
              color: "#666",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            {tasksFilter
              ? t("dashboard.noDataSearch")
              : t("dashboard.noDataAvailable")}
          </div>
        )}
      </Stack>
    </div>
  );
};
export { DashboardWidget };
