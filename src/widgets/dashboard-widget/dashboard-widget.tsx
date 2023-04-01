import {
    IBoardMissions,
    IDashboardStatistic,
    IDashboardWidget,
} from "@/widgets/dashboard-widget/interfaces";
import {useStyle} from "@/widgets/dashboard-widget/style";
import { useEffect, useState} from "react";
import {Cards} from "@/widgets/dashboard-widget/cards/cards";
import {IMachine, IMachineProgress} from "@/shared/interfaces";
import {BoardMissionsTable} from "@/widgets/dashboard-widget/table";
import {DashboardDates} from "@/widgets/dashboard-widget/dates/dates";
import {useGomakeAxios, useGomakeDateRange, useGomakeMachines} from "@/hooks";

const DashboardWidget = ({}: IDashboardWidget) => {
    const [boardsMissions, setBoardsMissions] = useState<IBoardMissions[]>();
    const [fBoards, setFBoards] = useState<IBoardMissions[]>()
    const [statistics, setStatistics] = useState<IDashboardStatistic>();
    const [usedMachines, setUsedMachines] = useState<IMachine[]>()
    const {machines, getCheckedMachines} = useGomakeMachines();
    const {classes} = useStyle();
    const {date} = useGomakeDateRange();
   const {callApi} = useGomakeAxios();

    useEffect(() => {
        callApi("GET",'/boardMissions', {
            startDate: date.startDate.toISOString(),
            endDate: date.endDate.toISOString()
        }, true, true)
            .then(
                (res) => {
                    if (res && res.data) {
                        const sortedBoards = res.data.boardsMissions
                            .sort((v: IBoardMissions, v2: IBoardMissions) => Number(v2.isUrgent) - Number(v.isUrgent))
                            .sort((v: IBoardMissions, v2: IBoardMissions) => Number(v.isReady) - Number(v2.isReady))
                        setBoardsMissions(sortedBoards);
                        const boards = sortedBoards.filter((boardMissions: IBoardMissions) => {
                            return getCheckedMachines().some((m) => Object.keys(boardMissions.machinesStatuses).includes(m.id))
                        })
                        setFBoards(boards);
                        boards?.forEach((board: IBoardMissions) => {
                            if (board.currentStation.machineId !== null) {
                                const machine = machines.find((m: IMachine) => m.id === board.currentStation.machineId)
                                if (machine) {
                                    board.currentStation.rowName = machine.name;
                                }
                            }
                        })
                        setStatistics(res.data.statistics);
                        const machinesProgress: Record<string, IMachineProgress> = res.data.machinesProgress;
                        const usedMachinesArray: IMachine[] = machines.filter((machine) => machinesProgress && machinesProgress[machine.id])
                            .map(m => ({...m, progress: machinesProgress[m.id]}))
                            .filter((machine: IMachine) => {
                                for (const board of boards) {
                                    if (board.machinesStatuses[machine.id]) {
                                        return true;
                                    }
                                }
                                return false;
                            });
                        setUsedMachines(usedMachinesArray)
                    }
                }
            );

    }, [date])

    useEffect(() => {
        if (boardsMissions) {
            const boards = boardsMissions.filter((boardMissions: IBoardMissions) => {
                return getCheckedMachines().some((m) => Object.keys(boardMissions.machinesStatuses).includes(m.id))
            });
            setFBoards(boards);
        }
    }, [machines]);


    return (
        <div style={classes.container}>
            <Cards data={statistics ? statistics : {} as IDashboardStatistic}/>
            <DashboardDates/>
            {fBoards && statistics && usedMachines && machines &&
                <BoardMissionsTable boardsMissions={fBoards}
                                    usedMachines={usedMachines}
                />}
        </div>
    );
}
export {DashboardWidget}