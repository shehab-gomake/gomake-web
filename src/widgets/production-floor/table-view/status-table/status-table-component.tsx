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

const StatusTableComponent = ({status, boards, count}: IProps) => {
    const {isOpen, onClickStatus, tableHeaders} = useStatusTable();

    const {updateStatus} = useProductionFloorData();
    const [{isOver}, drop] = useDrop(() => ({
        accept: 'task',
        drop: (item: { id: string, selectedIds: string[] }, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) {
                return;
            }
            updateStatus(item.selectedIds.length > 0 ? item.selectedIds : [item.id], status.id).then();
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [status, boards]);


    return <Stack ref={drop} border={isOver ? '1px solid black' : 'none'}>
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
                }}>{`${status.name} (${count})`}</Button>
        {
            boards.length > 0 &&
            <Collapse in={isOpen}>
                <Paper>
                    <TableContainer>
                        <Table stickyHeader={false}>
                            <TableHead>
                                <SecondaryTableRow>
                                    {
                                        tableHeaders(status.id)?.map((header, index) =>
                                            <SecondaryTableCell key={'statusTable' + index} align={"center"}>{header}</SecondaryTableCell>)
                                    }
                                </SecondaryTableRow>
                            </TableHead>
                            <TableBody>
                                {boards?.map((boardMission) => {
                                    return <TableRowComponent boardMission={boardMission}/>
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