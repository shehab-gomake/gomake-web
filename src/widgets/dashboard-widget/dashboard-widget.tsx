import {
    IDashboardStatistic,
    IDashboardWidget,
} from "@/widgets/dashboard-widget/interfaces";
import {useStyle} from "@/widgets/dashboard-widget/style";
import {useCallback, useEffect} from "react";
import {Cards} from "@/widgets/dashboard-widget/cards/cards";
import {IMachine} from "@/shared/interfaces";
import {BoardMissionsTable} from "@/widgets/dashboard-widget/table";
import {DashboardDates} from "@/widgets/dashboard-widget/dates/dates";
import { useGomakeDateRange, useGomakeMachines} from "@/hooks";
import {useBoardMissions} from "@/widgets/dashboard-widget/use-board-missions";

const DashboardWidget = ({}: IDashboardWidget) => {
    const { machines, addMachineProgress } = useGomakeMachines();
    const {classes} = useStyle();
    const {date} = useGomakeDateRange();

    const {
        getBoardsMissionsByDateRange,
        statistics,
        machinesProgress,
        boardsMissions,
        getFilteredBoardsMissions
    } = useBoardMissions();

    useEffect(() => {
        getBoardsMissionsByDateRange(date).then();
    }, [date])

    useEffect(() => {
        addMachineProgress(machinesProgress);
    }, [boardsMissions])

    const usedMachines = useCallback(() => {
        return machines.filter((machine: IMachine) => {
            for (const board of getFilteredBoardsMissions()) {
                if (board.machinesStatuses[machine.id]) {
                    return true;
                }
            }
            return false;
        });
    }, [machines]);

    return (
        <div style={classes.container}>
            <Cards data={statistics ? statistics : {} as IDashboardStatistic}/>
            <DashboardDates/>
            <div>
                {usedMachines() && getFilteredBoardsMissions() &&
                    <BoardMissionsTable boardsMissions={getFilteredBoardsMissions()}
                                        usedMachines={usedMachines()}
                    />}
            </div>
        </div>
    );
}
export {DashboardWidget}