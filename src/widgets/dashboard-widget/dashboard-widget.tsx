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
import {styled} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const DashboardWidget = ({}: IDashboardWidget) => {
    const INTERVAL_TIMEOUT = 5 * 60 * 1000;
    const {machines, addMachineProgress} = useGomakeMachines();
    const [tasksFilter, setTasksFilter] = useState<string>('');
    const selectedClient = useRecoilValue(selectedClientIdState);
    const {classes} = useStyle();
    const {date} = useGomakeDateRange();
    const {t} = useTranslation();
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

    useEffect(() => {
        const interval = setInterval(async () => {
            await getBoardsMissionsByDateRange(date);
        }, INTERVAL_TIMEOUT);
        return () => clearInterval(interval);
    }, []);

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
        let tasksArray = getFilteredBoardsMissions();
        if (selectedClient) {
            tasksArray = getFilteredBoardsMissions().filter(board => board.clientId === selectedClient);
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
                <div style={{display: 'flex', gap: '5px', width: 'fit-content', alignItems: 'center',}}>
                    <StyledTextField placeholder={t('dashboard-widget.search') as string} onChange={handelSearchValueChange}/>
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

export const StyledTextField = styled(TextField)(() => {
    const {primaryColor} = useGomakeTheme();
    return {
    input: {
        backgroundColor: "#FFFFFF",
        boxSizing: "border-box",
        borderRadius: '10px',
        height: 40,
        fontFamily: "Jost",
        fontStyle: "normal",
        fontWeight: 300,
        fontSize: 14,
        lineHeight: "21px",
        display: "flex",
        alignItems: "center",
        color: primaryColor(500),
    },

    "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
            border: `2px solid ${primaryColor(500)}`

        },
        "& fieldset": {
            border: `1px solid ${primaryColor(500)}`,
            boxSizing: "border-box",
            borderRadius: 10,
            width: "100%",
        },
        "&.Mui-focused fieldset": {
            borderColor:primaryColor(500),
            borderRadius: 10,
            width: "100%",
        },
    },
}});
