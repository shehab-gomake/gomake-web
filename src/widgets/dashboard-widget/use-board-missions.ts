import { useCallback, useState } from "react";
import {
  IBoardMissions,
  IDashboardStatistic,
} from "@/widgets/dashboard-widget/interfaces";
import {
  IDashboardColumns,
  IDateRange,
  IMachine,
  IMachineProgress,
} from "@/shared";
import { useGomakeAxios, useGomakeMachines } from "@/hooks";
import { TODAY_DATE_RANGE } from "@/shared/constant";
import { useRecoilValue } from "recoil";
import { selectedAgentsState } from "@/store/agents-state";

const useBoardMissions = () => {
  const { machines, getCheckedMachines } = useGomakeMachines();
  const [boardsMissions, setBoardsMissions] = useState<IBoardMissions[]>([]);
  const [machinesProgress, setMachinesProgress] = useState<
    Record<string, IMachineProgress>
  >({});
  const [dashboardColumns, setDashboardColumns] = useState<IDashboardColumns[]>(
    []
  );
  const [statistics, setStatistics] = useState<IDashboardStatistic>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const selectedAgents = useRecoilValue(selectedAgentsState);
  const [abortController, setAbortController] = useState(null);
  const [lastRequestParams, setLastRequestParams] = useState<string>("");

  const { callApi } = useGomakeAxios();

  const createRequestKey = (params: any) => {
    return JSON.stringify(params);
  };

  const shouldSkipRequest = (params: any) => {
    const currentKey = createRequestKey(params);
    return currentKey === lastRequestParams && isLoading;
  };

  const getBoardsMissionsByDateRange = async (dateRange: IDateRange) => {
    const requestParams = {
      startDate: dateRange?.startDate?.toISOString(),
      endDate: dateRange?.endDate?.toISOString(),
      agents: selectedAgents,
    };

    // Skip if same request is already in progress
    if (shouldSkipRequest(requestParams)) {
      return;
    }

    if (abortController) {
      abortController.abort();
    }
    setIsLoading(true);
    setLastRequestParams(createRequestKey(requestParams));
    const newRequestAbortController = new AbortController();
    setAbortController(newRequestAbortController);

    const makeRequest = async (retryCount = 0) => {
      try {
        const res = await callApi(
          "POST",
          "/v1/erp-service/board-missions/get-board-missions-for-dashboard",
          {
            startDate: dateRange?.startDate?.toISOString(),
            endDate: dateRange?.endDate?.toISOString(),
            agents: selectedAgents,
          },
          true,
          newRequestAbortController
        );
        if (res?.success) {
          setBoardsMissions(res?.data?.data?.data?.boardsMissions);
          setMachinesProgress(res?.data?.data?.data?.machinesProgress);
          setDashboardColumns(res?.data?.data?.data?.dashboardColumns);
          setStatistics(res?.data?.data?.data?.statistics);
          return true;
        } else if (retryCount < 2) {
          // Retry after 1 second
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return makeRequest(retryCount + 1);
        }
        return false;
      } catch (error) {
        if (retryCount < 2) {
          // Retry after 1 second
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return makeRequest(retryCount + 1);
        }
        return false;
      }
    };

    try {
      await makeRequest();
    } finally {
      setIsLoading(false);
    }
  };

  const getLateBoardsMissions = async () => {
    const requestParams = { isLate: true };

    // Skip if same request is already in progress
    if (shouldSkipRequest(requestParams)) {
      return;
    }

    if (abortController) {
      abortController.abort();
    }
    setIsLoading(true);
    setLastRequestParams(createRequestKey(requestParams));
    const newRequestAbortController = new AbortController();
    setAbortController(newRequestAbortController);

    const makeRequest = async (retryCount = 0) => {
      try {
        const res = await callApi(
          "POST",
          "/v1/erp-service/board-missions/get-board-missions-for-dashboard",
          {
            isLate: true,
          },
          true,
          newRequestAbortController
        );
        if (res?.success) {
          setBoardsMissions(res?.data?.data?.data?.boardsMissions);
          setMachinesProgress(res?.data?.data?.data?.machinesProgress);
          setDashboardColumns(res?.data?.data?.data?.dashboardColumns);
          setStatistics(res?.data?.data?.data?.statistics);
          return true;
        } else if (retryCount < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return makeRequest(retryCount + 1);
        }
        return false;
      } catch (error) {
        if (retryCount < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return makeRequest(retryCount + 1);
        }
        return false;
      }
    };

    try {
      await makeRequest();
    } finally {
      setIsLoading(false);
    }
  };

  const getLateTodayBoardsMissions = async () => {
    const requestParams = {
      startDate: TODAY_DATE_RANGE.startDate?.toISOString(),
      endDate: TODAY_DATE_RANGE.endDate?.toISOString(),
      agents: selectedAgents,
      isLate: true,
    };

    // Skip if same request is already in progress
    if (shouldSkipRequest(requestParams)) {
      return;
    }

    if (abortController) {
      abortController.abort();
    }
    setIsLoading(true);
    setLastRequestParams(createRequestKey(requestParams));
    const newRequestAbortController = new AbortController();
    setAbortController(newRequestAbortController);

    const makeRequest = async (retryCount = 0) => {
      try {
        const res = await callApi(
          "POST",
          "/v1/erp-service/board-missions/get-board-missions-for-dashboard",
          {
            startDate: TODAY_DATE_RANGE.startDate?.toISOString(),
            endDate: TODAY_DATE_RANGE.endDate?.toISOString(),
            agents: selectedAgents,
            isLate: true,
          },
          true,
          newRequestAbortController
        );
        if (res?.success) {
          setBoardsMissions(res?.data?.data?.data?.boardsMissions);
          setMachinesProgress(res?.data?.data?.data?.machinesProgress);
          setDashboardColumns(res?.data?.data?.data?.dashboardColumns);
          setStatistics(res?.data?.data?.data?.statistics);
          return true;
        } else if (retryCount < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return makeRequest(retryCount + 1);
        }
        return false;
      } catch (error) {
        if (retryCount < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return makeRequest(retryCount + 1);
        }
        return false;
      }
    };

    try {
      await makeRequest();
    } finally {
      setIsLoading(false);
    }
  };
  const getAllBoardsMissions = async () => {
    const requestParams = {};

    // Skip if same request is already in progress
    if (shouldSkipRequest(requestParams)) {
      return;
    }

    if (abortController) {
      abortController.abort();
    }
    setIsLoading(true);
    setLastRequestParams(createRequestKey(requestParams));
    const newRequestAbortController = new AbortController();
    setAbortController(newRequestAbortController);

    const makeRequest = async (retryCount = 0) => {
      try {
        const res = await callApi(
          "POST",
          "/v1/erp-service/board-missions/get-board-missions-for-dashboard",
          {},
          true,
          newRequestAbortController
        );
        if (res?.success) {
          setBoardsMissions(res?.data?.data?.data?.boardsMissions);
          setMachinesProgress(res?.data?.data?.data?.machinesProgress);
          setDashboardColumns(res?.data?.data?.data?.dashboardColumns);
          setStatistics(res?.data?.data?.data?.statistics);
          return true;
        } else if (retryCount < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return makeRequest(retryCount + 1);
        }
        return false;
      } catch (error) {
        if (retryCount < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return makeRequest(retryCount + 1);
        }
        return false;
      }
    };

    try {
      await makeRequest();
    } finally {
      setIsLoading(false);
    }
  };

  const updateBoardMissions = useCallback((boards: IBoardMissions[]) => {
    setBoardsMissions(boards);
  }, []);

  const getFilteredBoardsMissions = useCallback(() => {
    let boards = boardsMissions;
    if (machinesProgress && boardsMissions) {
      boards = addCurrentMachineName(boards);
      boards = sortBoardMissionsByUrgent(boards);
      boards = sortBoardMissionsByReady(boards);
      boards = sortBoardMissionsByIsLate(boards);
    }
    return boards?.filter((boardMissions: IBoardMissions) => {
      return getCheckedMachines().some((m) =>
        Object.keys(boardMissions.machinesStatuses).includes(m.id)
      );
    });
  }, [boardsMissions, machinesProgress, machines]);

  const sortBoardMissionsByUrgent = (
    boards: IBoardMissions[]
  ): IBoardMissions[] => {
    return boards.sort(
      (board1: IBoardMissions, board2: IBoardMissions) =>
        Number(board2.isUrgent) - Number(board1.isUrgent)
    );
  };
  const sortBoardMissionsByReady = (
    boards: IBoardMissions[]
  ): IBoardMissions[] => {
    return boards.sort(
      (board1: IBoardMissions, board2: IBoardMissions) =>
        Number(board1.isReady) - Number(board2.isReady)
    );
  };
  const sortBoardMissionsByIsLate = (
    boards: IBoardMissions[]
  ): IBoardMissions[] => {
    return boards.sort(
      (board1: IBoardMissions, board2: IBoardMissions) =>
        Number(board2.isLate) - Number(board1.isLate)
    );
  };

  const addCurrentMachineName = (
    boards: IBoardMissions[]
  ): IBoardMissions[] => {
    boards.forEach((board: IBoardMissions) => {
      if (board.currentStation.machineId !== null) {
        const machine = machines.find(
          (m: IMachine) => m.id === board.currentStation.machineId
        );
        if (machine) {
          board.currentStation.rowName = machine.name;
        }
      }
      if (board.splittedBoards?.length > 0) {
        board.splittedBoards = addCurrentMachineName(board.splittedBoards);
      }
    });
    return boards;
  };

  const filterMachinesOfBoards = (
    machines: IMachine[],
    boards: IBoardMissions[]
  ): IMachine[] => {
    return machines.filter((machine: IMachine) => {
      for (const board of boards) {
        if (board.machinesStatuses[machine.id]) {
          return true;
        }
      }
      return false;
    });
  };

  return {
    statistics,
    getBoardsMissionsByDateRange,
    getLateBoardsMissions,
    filterMachinesOfBoards,
    updateBoardMissions,
    machinesProgress,
    getFilteredBoardsMissions,
    boardsMissions,
    getLateTodayBoardsMissions,
    getAllBoardsMissions,
    dashboardColumns,
    setBoardsMissions,
    setStatistics,
    isLoading,
  };
};

export { useBoardMissions };
