import {useCallback, useState} from "react";
import {IBoardMissions, IDashboardStatistic} from "@/widgets/dashboard-widget/interfaces";
import {IDateRange, IMachine, IMachineProgress} from "@/shared";
import {useGomakeAxios, useGomakeMachines} from "@/hooks";
import {TODAY_DATE_RANGE} from "@/shared/constant";
import {endOfDay} from "date-fns";
import {useRecoilValue} from "recoil";
import {selectedAgentsState} from "@/store/agents-state";

const useBoardMissions = () => {
    const {machines, getCheckedMachines} = useGomakeMachines();
    const [boardsMissions, setBoardsMissions] = useState<IBoardMissions[]>([]);
    const [machinesProgress, setMachinesProgress] = useState<Record<string, IMachineProgress>>({})
    const [statistics, setStatistics] = useState<IDashboardStatistic>();
    const selectedAgents = useRecoilValue(selectedAgentsState);

    const {callApi} = useGomakeAxios();

    const getBoardsMissionsByDateRange = async (dateRange: IDateRange) => {
        const res = await callApi("POST", '/boardMissions', {
            startDate: dateRange?.startDate?.toISOString(),
            endDate: dateRange?.endDate?.toISOString(),
            agents: selectedAgents,
        }, true, true);

        setBoardsMissions(res?.data?.boardsMissions);
        setMachinesProgress(res?.data?.machinesProgress);
        setStatistics(res?.data?.statistics);
    };

    const getLateBoardsMissions = async () => {
        const res = await callApi("POST", '/lateBoardMissions', {agents: selectedAgents}, true, true);
        setBoardsMissions(res?.data?.boardsMissions);
        setMachinesProgress(res?.data?.machinesProgress);
        setStatistics(res?.data?.statistics);
    };


    const getLateTodayBoardsMissions = async () => {
        const res = await callApi("POST", '/today-late-boardMissions', {
            startDate: TODAY_DATE_RANGE.startDate?.toISOString(),
            endDate: TODAY_DATE_RANGE.endDate?.toISOString(),
            agents: selectedAgents,
        }, true, true);
        setBoardsMissions(res?.data?.boardsMissions);
        setMachinesProgress(res?.data?.machinesProgress);
        setStatistics(res?.data?.statistics);

    }
    const getAllBoardsMissions = async () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const nextYearDate = new Date(year + 1, month, day);
        const res = await callApi("POST", '/today-late-boardMissions', {
            startDate: TODAY_DATE_RANGE.startDate?.toISOString(),
            endDate: endOfDay(nextYearDate).toISOString(),
            agents: selectedAgents,
        }, true, true);
        setBoardsMissions(res?.data?.boardsMissions);
        setMachinesProgress(res?.data?.machinesProgress);
        setStatistics(res?.data?.statistics);

    }


    const updateBoardMissions = useCallback((boards: IBoardMissions[]) => {
        setBoardsMissions(boards);
    }, [])


    const getFilteredBoardsMissions = useCallback(() => {
        let boards = boardsMissions;
        if (machinesProgress && boardsMissions) {
            boards = addCurrentMachineName(boards);
            boards = sortBoardMissionsByUrgent(boards);
            boards = sortBoardMissionsByReady(boards);
            boards = sortBoardMissionsByIsLate(boards);
        }
        return boards?.filter((boardMissions: IBoardMissions) => {
            return getCheckedMachines().some((m) => Object.keys(boardMissions.machinesStatuses).includes(m.id))
        });
    }, [boardsMissions, machinesProgress, machines])

    const sortBoardMissionsByUrgent = (boards: IBoardMissions[]): IBoardMissions[] => {
        return boards.sort((board1: IBoardMissions, board2: IBoardMissions) => Number(board2.isUrgent) - Number(board1.isUrgent))
    };
    const sortBoardMissionsByReady = (boards: IBoardMissions[]): IBoardMissions[] => {
        return boards.sort((board1: IBoardMissions, board2: IBoardMissions) => Number(board1.isReady) - Number(board2.isReady))
    };
    const sortBoardMissionsByIsLate = (boards: IBoardMissions[]): IBoardMissions[] => {
        return boards.sort((board1: IBoardMissions, board2: IBoardMissions) => Number(board2.isLate) - Number(board1.isLate))
    };

    const addCurrentMachineName = (boards: IBoardMissions[]): IBoardMissions[] => {
        boards.forEach((board: IBoardMissions) => {
            if (board.currentStation.machineId !== null) {
                const machine = machines.find((m: IMachine) => m.id === board.currentStation.machineId)
                if (machine) {
                    board.currentStation.rowName = machine.name;
                }
            }
            if (board.splittedBoards?.length > 0) {
                board.splittedBoards = addCurrentMachineName(board.splittedBoards);
            }
        });
        return boards;
    }

    const filterMachinesOfBoards = (machines: IMachine[], boards: IBoardMissions[]): IMachine[] => {
        return machines.filter((machine: IMachine) => {
            for (const board of boards) {
                if (board.machinesStatuses[machine.id]) {
                    return true;
                }
            }
            return false;
        });
    }


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
        getAllBoardsMissions
    }
}

export {useBoardMissions};