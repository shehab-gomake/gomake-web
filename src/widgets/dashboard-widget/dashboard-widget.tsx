import {
    IBoardMissions,
    IDashboardStatistic,
    IDashboardWidget,
} from "@/widgets/dashboard-widget/interfaces";
import {useStyle} from "@/widgets/dashboard-widget/style";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {Cards} from "@/widgets/dashboard-widget/cards/cards";
import {IMachine} from "@/shared/interfaces";
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
import {Box} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
const DashboardWidget = ({}: IDashboardWidget) => {
    const INTERVAL_TIMEOUT = 2 * 60 * 1000;
    const {machines, addMachineProgress} = useGomakeMachines();
    const [tasksFilter, setTasksFilter] = useState<string>('');
    const selectedClient = useRecoilValue(selectedClientIdState);
    const clients = useRecoilValue(clientsState);
    const {classes} = useStyle();
    const {date} = useGomakeDateRange();
    const {t} = useTranslation();
    const {
        getBoardsMissionsByDateRange,
        statistics,
        machinesProgress,
        boardsMissions,
        getFilteredBoardsMissions,
        getLateBoardsMissions
    } = useBoardMissions();

    useEffect(() => {
        if (!!date.startDate && !!date.endDate) {
            getBoardsMissionsByDateRange(date).then();
        }
        else {
            getLateBoardsMissions().then();
        }
    }, [date])

    useEffect(() => {
        addMachineProgress(machinesProgress);
    }, [boardsMissions])

    useEffect(() => {
        const interval = setInterval(async () => {
            if (date.startDate && date.endDate) {
                await getBoardsMissionsByDateRange(date);
            }else {
                await getLateBoardsMissions();
            }
        }, INTERVAL_TIMEOUT);
        return () => clearInterval(interval);
    }, [date]);

    const handelSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setTasksFilter(value);
    }
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
        return tasksFilter ?
            tasksArray.filter((boardsMissions: IBoardMissions) => {
                return boardsMissions.code.toLowerCase().includes(tasksFilter.toLowerCase()) ||
                    boardsMissions.orderNumber.toLowerCase().includes(tasksFilter.toLowerCase())
            })
            : tasksArray;
    }, [tasksFilter, getFilteredBoardsMissions(), selectedClient])
    return (
        <div style={classes.container}>
            <Cards data={statistics ? statistics : {} as IDashboardStatistic}/>
            <DashboardDates>
                <div style={{display: 'flex', gap: '16px', width: 'fit-content', alignItems: 'center',}}>
                    <Box sx={{ position: 'relative' }}>
                        <SearchInput placeholder={t('dashboard-widget.search') as string}
                                     onChange={handelSearchValueChange}/>
                        <SearchIcon sx={{ position: 'absolute', left: '5px', top: '8px', color: 'action.active'}} />
                    </Box>

                    <ClientsList/>
                </div>
            </DashboardDates>
            <div>
                {usedMachines() && getFilteredBoardsMissions() &&
                    <BoardMissionsTable boardsMissions={tasks()}
                                        usedMachines={usedMachines()}
                    />}
            </div>
        </div>
    );
}
export {DashboardWidget}


