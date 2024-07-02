import {useStatusTable} from "@/widgets/production-floor/table-view/status-table/use-status-Table";
import {Collapse, Paper, Stack, Table, TableBody, TableContainer, TableHead} from "@mui/material";
import Button from "@mui/material/Button";
import {IProductionStatus} from "@/widgets/production-floor/interfaces/production-floor-status";
import {IBoardMissions} from "@/widgets/production-floor/interfaces/board-missions";
import {SecondaryTableCell, SecondaryTableRow} from "@/components/tables/secondary-table";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {useDrop} from "react-dnd";
import {TableRowComponent} from "@/widgets/production-floor/table-view/status-table/table-row/table-row-component";
import {useProductionFloorData} from "@/widgets/production-floor/use-production-floor-data";

interface IProps {
    status: IProductionStatus;
    boards: IBoardMissions[];
    count: number;
}

const StatusTableComponent = ({status, boards}: IProps) => {
    const {isOpen, onClickStatus, tableHeaders} = useStatusTable();

    const {updateStatus, t} = useProductionFloorData();
    const [{isOver}, drop] = useDrop(() => ({
        accept: 'task',
        drop: (item: { board: IBoardMissions, selectedIds: IBoardMissions[] }, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) {
                return;
            }
            if (item.board.statusId !== status.id) {
                updateStatus(item.selectedIds.length > 0 ? item.selectedIds : [item.board], status.id).then();
            }
        },
        collect: monitor => ({
            isOver: monitor.getItem()?.board?.statusId === status.id ? false : !!monitor.isOver(),
            canDrop: monitor.getItem()?.board?.statusId === status.id ? false : !!monitor.canDrop(),
        }),
    }), [status, boards]);


    return <Stack ref={drop} border={isOver ? '1px solid black' : 'none'} gap={'5px'}>
        <Button onClick={onClickStatus}
                startIcon={isOpen ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}
                sx={{
                    height: '35px',
                    padding: '6px 12px',
                    width: 'fit-content',
                    margin: 0,
                    backgroundColor: status.backgroundColor,
                    color: status.textColor,
                    '&:hover': {
                        opacity: 0.7,
                        backgroundColor: status?.backgroundColor,
                        color: status?.textColor,
                    }
                }}>{`${t('productionStatuses.' + status.name)} (${boards.length})`}
        </Button>
        {
            boards.length > 0 &&
            <Collapse in={isOpen}>
                <Paper>
                    <TableContainer>
                        <Table stickyHeader={false}>
                            <TableHead style={{backgroundColor: status.backgroundColor}}>
                                <SecondaryTableRow>
                                    {
                                        tableHeaders(status.id)?.map((header) =>
                                            <SecondaryTableCell style={{backgroundColor: status.backgroundColor}}
                                                                key={'statusTable' + status.id}
                                                                align={"center"}>{header}</SecondaryTableCell>)
                                    }
                                </SecondaryTableRow>
                            </TableHead>
                            <TableBody>
                                {[...boards]?.sort((a, b) => a.priority - b.priority)?.map((boardMission) => {
                                    return <>
                                        <TableRowComponent key={'status' + status.id + boardMission.id}
                                                           boardMission={boardMission}/>
                                    </>
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Collapse>
        }
    </Stack>
}
export {StatusTableComponent}