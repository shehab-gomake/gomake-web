import {IBoardMissions, IDashboardStatistic, IDashboardWidget,} from "@/widgets/dashboard-widget/interfaces";
import {useStyle} from "@/widgets/dashboard-widget/style";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {Cards} from "@/widgets/dashboard-widget/cards/cards";
import {IDateRange, IMachine} from "@/shared/interfaces";
import {BoardMissionsTable} from "@/widgets/dashboard-widget/table";
import {DashboardDates} from "@/widgets/dashboard-widget/dates/dates";
import {useGomakeDateRange, useGomakeMachines} from "@/hooks";
import {useBoardMissions} from "@/widgets/dashboard-widget/use-board-missions";
import {useTranslation} from "react-i18next";
import {ClientsList} from "@/widgets/clients/clients-list";
import {useRecoilValue} from "recoil";
import {selectedClientIdState} from "@/widgets/clients/state/selected-client-id";
import {SearchInput} from "@/widgets/dashboard-widget/components/search-input";
import {clientsState} from "@/store/clients-state";
import {Box, Link} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Button from "@mui/material/Button";
import {useDashboardLogout} from "@/hooks/use-dashboard-logout";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {DashboardActions} from "@/store";
import {AgentsList} from "@/widgets/agents/agents-list";
import {selectedAgentIdState} from "@/widgets/agents/state/selected-agent-id";

const DashboardWidget = ({}: IDashboardWidget) => {
    const INTERVAL_TIMEOUT = 2 * 60 * 1000;
    const {machines, addMachineProgress, getCheckedMachines} = useGomakeMachines();
    const [tasksFilter, setTasksFilter] = useState<string>('');
    const selectedClient = useRecoilValue(selectedClientIdState);
    const selectedAgent = useRecoilValue(selectedAgentIdState);
    const clients = useRecoilValue(clientsState);
    const {classes} = useStyle();
    const {dates, action} = useGomakeDateRange();
    const {t} = useTranslation();
    const {secondColor} = useGomakeTheme();
    const {logout} = useDashboardLogout();
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
    }, [action, dates])

    useEffect(() => {
        addMachineProgress(machinesProgress);
    }, [boardsMissions])

    useEffect(() => {
        const interval = setInterval(async () => {
            actions(action, dates);
        }, INTERVAL_TIMEOUT);
        return () => clearInterval(interval);
    }, [dates, action]);

    const handelSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setTasksFilter(value);
    }
    const usedMachines = useCallback(() => {
        return getCheckedMachines().filter((machine: IMachine) => {
            for (const board of getFilteredBoardsMissions()) {
                if (board.machinesStatuses[machine.id]) {
                    return true;
                }
            }
            return false;
        });
    }, [machines]);

    const tasks = useCallback(() => {
        let tasksArray = getFilteredBoardsMissions().map(board => {
            if (clients.length > 0) {
                const client = clients.find(client => client.id === board.clientId);
                return {
                    ...board,
                    clientName: client?.name
                }
            }
            return board
        });
        if (selectedClient) {
            tasksArray = tasksArray.filter(board => board.clientId === selectedClient);
        }
        if (selectedAgent) {
            tasksArray = tasksArray.filter(board => board.agentId === selectedAgent);
        }
        return tasksFilter ?
            tasksArray.filter((boardsMissions: IBoardMissions) => {
                return boardsMissions.code.toLowerCase().includes(tasksFilter.toLowerCase()) ||
                    boardsMissions.orderNumber.toLowerCase().includes(tasksFilter.toLowerCase())
            })
            : tasksArray;
    }, [tasksFilter, getFilteredBoardsMissions(), selectedClient,selectedAgent])
    return (
        <div style={classes.container}>
            <Cards data={statistics ? statistics : {} as IDashboardStatistic}/>
            <DashboardDates>
                <div style={{display: 'flex', gap: '16px', width: 'fit-content', alignItems: 'center',}}>
                    <Box sx={{position: 'relative'}}>
                        <SearchInput placeholder={t('dashboard-widget.search') as string}
                                     onChange={handelSearchValueChange}/>
                        <SearchIcon sx={{position: 'absolute', left: '5px', top: '8px', color: 'action.active'}}/>
                    </Box>

                    <ClientsList/>
                    <AgentsList/>
                </div>
            </DashboardDates>
            <div>
                {usedMachines() && getFilteredBoardsMissions() &&
                    <BoardMissionsTable boardsMissions={tasks()}
                                        usedMachines={usedMachines()}
                    />}
            </div>
            <div><Link component={Button} color={secondColor(500)}
                       onClick={logout}>{t('dashboard-widget.logout')}</Link></div>
        </div>
    );
}
export {DashboardWidget}


