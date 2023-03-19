import {
    IBoardMissions,
    IDashboardStatistic,
    IDashboardWidget,
} from "@/widgets/dashboard-widget/interfaces";
import {useStyle} from "@/widgets/dashboard-widget/style";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {getApiRequest} from "@/services/api-request";
import {Cards} from "@/widgets/dashboard-widget/cards/cards";
import {IMachine, IMachineProgress} from "@/shared/interfaces";
import {useRecoilValue} from "recoil";
import {machinesListState} from "@/store/machines";
import {BoardMissionsTable} from "@/widgets/dashboard-widget/table";
import {DashboardDates} from "@/widgets/dashboard-widget/dates/dates";
import {dashboardDateState} from "@/store";

const DashboardWidget = ({}: IDashboardWidget) => {
    const [boardsMissions, setBoardsMissions] = useState<IBoardMissions[]>();
    const [statistics, setStatistics] = useState<IDashboardStatistic>();
    const [usedMachines, setUsedMachines] = useState<IMachine[]>()
    const machines: IMachine[] = useRecoilValue(machinesListState);
    const fMachines: IMachine[] = machines.filter((machine) => machine.checked);
    const {classes} = useStyle();
    const {t} = useTranslation();

    const selectedDate = useRecoilValue(dashboardDateState);
    useEffect(() => {
        getApiRequest('/boardMissions', {
            startDate: selectedDate.startDate.toISOString(),
            endDate: selectedDate.endDate.toISOString()
        })
            .then(
                (res) => {
                    if (res && res.data) {
                        const sortedBoards = res.data.boardsMissions.filter((boardMissions: IBoardMissions) => {
                            return fMachines.some((m) => Object.keys(boardMissions.machinesStatuses).includes(m.id))
                        }).sort((v: IBoardMissions, v2: IBoardMissions) => Number(v.isReady) - Number(v2.isReady))
                            .sort((v: IBoardMissions, v2: IBoardMissions) => Number(v2.isUrgent) - Number(v.isUrgent))
                        setBoardsMissions(sortedBoards);
                        sortedBoards?.forEach((board: IBoardMissions) => {
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
                                for (const board of sortedBoards) {
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

    }, [selectedDate, machines, setUsedMachines, setStatistics, setBoardsMissions])

    return (
        <div style={classes.container}>
            <Cards data={statistics ? statistics : {} as IDashboardStatistic}/>
            <DashboardDates/>
            {boardsMissions && statistics && usedMachines && machines &&
                <BoardMissionsTable boardsMissions={boardsMissions}
                                    usedMachines={usedMachines}
                />}
        </div>
    );
}
export {DashboardWidget}