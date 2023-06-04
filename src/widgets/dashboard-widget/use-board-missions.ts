import {useCallback, useState} from "react";
import {IBoardMissions, IDashboardStatistic} from "@/widgets/dashboard-widget/interfaces";
import {IDateRange, IMachine, IMachineProgress} from "@/shared";
import {useGomakeAxios, useGomakeMachines} from "@/hooks";

const useBoardMissions = () => {
    const {machines, getCheckedMachines} = useGomakeMachines();
    const [boardsMissions, setBoardsMissions] = useState<IBoardMissions[]>([]);
    const [machinesProgress, setMachinesProgress] = useState<Record<string, IMachineProgress>>({})
    const [statistics, setStatistics] = useState<IDashboardStatistic>();
    const {callApi} = useGomakeAxios();

    const getBoardsMissionsByDateRange = async (dateRange: IDateRange) => {
        const res = await callApi("GET", '/boardMissions', {
            startDate: dateRange?.startDate?.toISOString(),
            endDate: dateRange?.endDate?.toISOString()
        }, true, true);

        setBoardsMissions(res?.data?.boardsMissions);
        setMachinesProgress(res?.data?.machinesProgress);
        setStatistics(res?.data?.statistics);
    };

    const getLateBoardsMissions = async () => {
        const res = await callApi("GET", '/lateBoardMissions', {}, true, true);
        setBoardsMissions(res?.data?.boardsMissions);
        setMachinesProgress(res?.data?.machinesProgress);
        setStatistics(res?.data?.statistics);
    };


    const updateBoardMissions = useCallback((boards: IBoardMissions[]) => {
        setBoardsMissions(boards);
    }, [])


    const getFilteredBoardsMissions = useCallback(() => {
        let boards = boardsMissions;
        if (machinesProgress && boardsMissions) {
            boards = addCurrentMachineName(boards);
            boards = sortBoardMissionsByUrgent(boards);
            boards = sortBoardMissionsByReady(boards);
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
        boardsMissions
    }
}

export {useBoardMissions};