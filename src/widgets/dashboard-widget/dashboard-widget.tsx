import {IBoardMissions, IDashboardStatistic, IDashboardWidget,} from "@/widgets/dashboard-widget/interfaces";
import {useStyle} from "@/widgets/dashboard-widget/style";
import {useCallback, useEffect, useState} from "react";
import {Cards} from "@/widgets/dashboard-widget/cards/cards";
import {IDateRange} from "@/shared/interfaces";
import {BoardMissionsTable} from "@/widgets/dashboard-widget/table";
import {DashboardDates} from "@/widgets/dashboard-widget/dates/dates";
import {useGomakeDateRange, useGomakeMachines} from "@/hooks";
import {useBoardMissions} from "@/widgets/dashboard-widget/use-board-missions";
import {useRecoilValue} from "recoil";
import {DashboardActions} from "@/store";
import {selectedAgentsState} from "@/store/agents-state";
import {dashboardClientsState} from "@/widgets/dashboard-widget/clients/clients-state";

const DashboardWidget = ({}: IDashboardWidget) => {
    const INTERVAL_TIMEOUT = 2 * 60 * 1000;
    const {machines, addMachineProgress, getCheckedMachines} = useGomakeMachines();
    const [tasksFilter, setTasksFilter] = useState<string>('');
    const selectedClients = useRecoilValue(dashboardClientsState);
    const {classes} = useStyle();
    const {dates, action} = useGomakeDateRange();
    const selectedAgents = useRecoilValue(selectedAgentsState);

    const {
        getBoardsMissionsByDateRange,
        statistics,
        machinesProgress,
        boardsMissions,
        getFilteredBoardsMissions,
        getLateBoardsMissions,
        getLateTodayBoardsMissions,
        getAllBoardsMissions
    } = useBoardMissions();

    const actions = (action: DashboardActions, dateRange: IDateRange) => {
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
    }

    useEffect(() => {
        actions(action, dates);
    }, [action, dates, selectedAgents])

    useEffect(() => {
        addMachineProgress(machinesProgress);
    }, [boardsMissions])

    useEffect(() => {
        const interval = setInterval(async () => {
            actions(action, dates);
        }, INTERVAL_TIMEOUT);
        return () => clearInterval(interval);
    }, [dates, action, selectedAgents]);

    const handelSearchValueChange = (event) => {
        setTasksFilter(event);
    }

    const usedMachines = useCallback(() => {
        const checkedMachines = getCheckedMachines();
        const filteredBoardsMissions = getFilteredBoardsMissions();
        if (!Array.isArray(filteredBoardsMissions)) {
            console.error("getFilteredBoardsMissions did not return an array:", filteredBoardsMissions);
            return [];
        }
        return checkedMachines.filter((machine) => {
            for (const board of filteredBoardsMissions) {
                if (board.machinesStatuses[machine.id]) {
                    return true;
                }
            }
            return false;
        });
    }, [machines]);

    const tasks = useCallback(() => {
        const selectedClientsIds = selectedClients?.filter(client => client?.checked)?.map(client => client?.id)
        let tasksArray = getFilteredBoardsMissions();
        tasksArray = selectedClientsIds.length !== 0 ? tasksArray.filter(board => selectedClientsIds.includes(board.clientId)) : tasksArray;
        return tasksFilter ?
            tasksArray.filter((boardsMissions: IBoardMissions) => {
                return boardsMissions.code.toLowerCase().includes(tasksFilter.toLowerCase()) ||
                    boardsMissions.orderNumber.toLowerCase().includes(tasksFilter.toLowerCase())
            })
            : tasksArray;
    }, [tasksFilter, getFilteredBoardsMissions(), selectedClients])

    return (
        <div style={classes.container}>
            <Cards data={statistics ? statistics : {} as IDashboardStatistic}/>
            <DashboardDates handelSearchValueChange={handelSearchValueChange}/>
            <div>
                {usedMachines() && getFilteredBoardsMissions() &&
                    <BoardMissionsTable boardsMissions={tasks()}
                                        usedMachines={usedMachines()}
                    />}
            </div>
            {/* <div><Link component={Button} color={secondColor(500)}
                onClick={logout}>{t('dashboard-widget.logout')}</Link></div> */}
        </div>
    );
}
export {DashboardWidget}


