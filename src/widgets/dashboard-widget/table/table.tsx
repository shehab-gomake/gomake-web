import {IBoardMissionsTable} from "@/widgets/dashboard-widget/table/interface";
import {useStyle} from "@/widgets/dashboard-widget/table/style";
import {useTranslation} from "react-i18next";
import {IBoardMissions} from "@/widgets/dashboard-widget/interfaces";
import {IMachine} from "@/shared/interfaces";
import {StatusView} from "@/components/status-view";
import ElectricBoltSharpIcon from '@mui/icons-material/ElectricBoltSharp';
import React, {useCallback, useState} from "react";
import {EStatus} from "@/shared";
import {useRecoilValue} from "recoil";
import {boardsMissionsStatusFilterState} from "@/store/boards-missions-status-filter";
import moment from "moment-timezone";
import Button from "@mui/material/Button";
import {useRouter} from "next/router";

const BoardMissionsTable = ({ boardsMissions, usedMachines }: IBoardMissionsTable) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const [orderByMachine, setOrderByMachine] = useState<string>('');
    const selectedStatusFilter = useRecoilValue(boardsMissionsStatusFilterState);
    const [isOrderByCreationDate, SetIsOrderByCreationDate] = useState<boolean>(false);
    const {replace} = useRouter();
    const boardLink = (boardMissions: IBoardMissions) => {
        replace(`/production-floor/?boardMissionsId=${boardMissions.id}&step=stations&productType=${!!boardMissions.productType ? boardMissions.productType : ''}`).then();
    }
    const hasMachine = (board: IBoardMissions) => {
        switch (board.machinesStatuses[orderByMachine]) {
            case EStatus.IN_PROCESS:
                return 0;
            case EStatus.WAITING:
                return 1;
            case EStatus.FAULT:
                return 2;
            case EStatus.NOT_YET:
                return 3;
            case EStatus.DONE:
                return 4;
            default:
                return 5;
        }
    }
    const getFilteredBoardMissions = (selectedStatusFilter: EStatus | null) => {
        var data = [...boardsMissions];
        if (selectedStatusFilter) {
            data.forEach(x => {
                if (x.splittedBoards) {
                    x.splittedBoards = x.splittedBoards.filter(y => selectedStatusFilter === EStatus.IN_PROCESS ? (y.status === EStatus.IN_PROCESS || y.status === EStatus.NOT_YET) :  y.status === selectedStatusFilter)
                }
            })
            data = data.filter(board => selectedStatusFilter === EStatus.IN_PROCESS ? (board.status === selectedStatusFilter || board.status === EStatus.NOT_YET) || (board.splittedBoards && board.splittedBoards.length > 0) : board.status === selectedStatusFilter || (board.splittedBoards && board.splittedBoards.length > 0));
        }

        return data;
    }
    const boards = useCallback(() => {
        let boards = getFilteredBoardMissions(selectedStatusFilter) //littedBoards = x.splittedBoards.filter(y=>y.status == selectedStatusFilter) ).filter()] : [...boardsMissions];
        if (orderByMachine) {
            boards = boards.sort((board1: IBoardMissions, board2: IBoardMissions) => {
                return hasMachine(board1) - hasMachine(board2)
            });
            return boards
        }
        if (isOrderByCreationDate) {
            boards = boards.sort((board1: IBoardMissions, board2: IBoardMissions) => {
                return board2.creationDate < board1.creationDate ? -1 : board2.creationDate > board1.creationDate ? 1 : 0
            });
            return boards
        }
        return boards;
    }, [orderByMachine, boardsMissions, selectedStatusFilter, isOrderByCreationDate]);
    const sortByCreationDate = () => {
        SetIsOrderByCreationDate(!isOrderByCreationDate);
        setOrderByMachine('');
    }
    const getDateString = (date: Date) => {
        const utcDate = moment(date);//2023-10-23T06:50:53.243Z
        let format = "DD-MM-YYYY"
        return utcDate.format(format);
        // return ""
    }
    const handleMachineClicked = (machineId: string) => {
        setOrderByMachine(machineId === orderByMachine ? '' : machineId);
        SetIsOrderByCreationDate(false);
    };

    return (
        boardsMissions.length > 0 ?
            <div style={classes.tableWrapper} id={'dashboard-table'}>
                <table style={classes.table}>
                    <thead>
                        <tr>
                            <th style={{ ...classes.tableHead, ...classes.firstColHead }}>
                                <div style={classes.firstColHeadContent}>

                                    <div style={{ width: '5%' }}>#</div>
                                    <div style={{ width: '5%' }}></div>
                                    <div style={{ width: '35%' }}>{t('dashboard-widget.client')}</div>
                                    <div style={{ width: '25%' }}>{t('dashboard-widget.task')}</div>
                                    <div style={isOrderByCreationDate ? { ...classes.tableHead, ...classes.selectedMachine, width: '30%', paddingTop: '29px' } : { ...classes.tableHead, width: '30%', paddingTop: '29px' }} onClick={() => sortByCreationDate()}>
                                        {t('dashboard-widget.creationDate')}
                                    </div>
                                    <div style={{ width: '20%' }}>{t('dashboard-widget.product')}</div>
                                    <div style={{ width: '35%' }}>{t('dashboard-widget.status')}</div>
                                </div>
                            </th>
                            {
                                usedMachines.map((machine: IMachine) => {
                                    return (
                                        <th key={machine.id}
                                            style={orderByMachine === machine.id ? { ...classes.tableHead, ...classes.selectedMachine } : classes.tableHead}
                                            onClick={() => handleMachineClicked(machine.id)}>
                                            <div style={classes.tdRows}>
                                                <div>{machine.name}</div>
                                                <div>{machine.progress?.done}/{machine.progress?.total} <small>{t('measurementUnits.minute')}</small></div>
                                            </div>
                                        </th>
                                    );
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            boards() && boards().map((board: IBoardMissions, index: number) => {
                                return (
                                    board?.splittedBoards?.length > 0 ?
                                        board.splittedBoards.map((splitBoard, k) => {
                                            return (
                                                <tr style={board.isLate ? classes.lateMission : {}}>
                                                    {k === 0 &&
                                                        <td rowSpan={board.splittedBoards.length}
                                                            style={{
                                                                ...classes.tableCell,
                                                                position: 'sticky',
                                                                right: 0,
                                                                backgroundColor: board.isLate ? classes.lateMission.backgroundColor : '#FFFFFF',
                                                            }}>
                                                            <div style={classes.firstColCellSplitBoards}>
                                                                <div style={{ width: '5%' }}>{index + 1}</div>
                                                                <div style={{ width: '5%' }}>{board.isUrgent ?
                                                                    <ElectricBoltSharpIcon color={"error"} /> : ''}
                                                                </div>
                                                                <div style={{ width: '35%' }}>
                                                                    <span>{board?.clientName && board?.clientName?.length > 10 ? board.clientName?.slice(0, 9) + '..' : board?.clientName}</span>
                                                                </div>
                                                                <div style={{ width: '25%', height: '100%' }}>
                                                                    <div style={classes.tdRows}>
                                                                        <div><span>{board.code}</span></div>
                                                                    </div>
                                                                </div>
                                                                <div style={{ width: '30%', height: '100%' }}>
                                                                    <div style={classes.tdRows}>
                                                                        <div><span>{getDateString(board.creationDate)}</span></div>
                                                                    </div>
                                                                </div>
                                                                <div style={{ width: '20%', height: '100%' }}>
                                                                    <div style={classes.tdRows}>
                                                                        <span>{board?.productName && board?.productName?.length > 8 ? board.productName?.slice(0, 7) + '..' : board?.productName}</span>
                                                                    </div>
                                                                </div>
                                                                <div style={classes.splitBoardsStatuses}>
                                                                    {
                                                                        board.splittedBoards.map((sBoard, cellNumber) => <div
                                                                            style={
                                                                                cellNumber + 1 === board.splittedBoards.length ?
                                                                                    {
                                                                                        ...classes.splitBoardsStatusesRow,
                                                                                        borderBottom: 0
                                                                                    } :
                                                                                    classes.splitBoardsStatusesRow
                                                                            }>
                                                                            <Button onClick={() => boardLink(sBoard)}>{sBoard.productTypeName}</Button>
                                                                            <StatusView status={sBoard.status}
                                                                                label={sBoard.currentStation.rowName} />
                                                                        </div>)
                                                                    }
                                                                </div>
                                                            </div>
                                                        </td>
                                                    }
                                                    {
                                                        usedMachines.map((machine: IMachine, i: number) => {
                                                            return (
                                                                <td key={machine.id + i}
                                                                    style={k + 1 === board.splittedBoards.length ? classes.tableCell : {
                                                                        ...classes.tableCell,
                                                                        borderBottom: 0
                                                                    }}>
                                                                    <StatusView style={{ margin: 'auto' }}
                                                                        status={splitBoard.machinesStatuses[machine.id]} />
                                                                </td>
                                                            );
                                                        })
                                                    }
                                                </tr>
                                            )
                                        }) :
                                        <tr key={index} style={board.isLate ? classes.lateMission : {}}>
                                            <td style={{
                                                ...classes.tableCell, position: 'sticky', right: 0,
                                                backgroundColor: board.isLate ? classes.lateMission.backgroundColor : '#FFFFFF',
                                            }}>
                                                <div style={classes.firstColCell}>
                                                    <div style={{ width: '5%' }}>{index + 1}</div>
                                                    <div style={{ width: '5%' }}>{board.isUrgent ?
                                                        <ElectricBoltSharpIcon color={"error"} /> : ''}
                                                    </div>
                                                    <div style={{ width: '35%' }}>
                                                        <span>{board?.clientName && board?.clientName?.length > 10 ? board.clientName?.slice(0, 9) + '..' : board?.clientName}</span>
                                                    </div>
                                                    <div style={{ width: '25%', height: '100%' }}>
                                                        <div style={classes.tdRows}>
                                                            <div><Button onClick={() => boardLink(board)}>{board.code}</Button></div>
                                                        </div>
                                                    </div>
                                                    <div style={{ width: '30%', height: '100%' }}>
                                                        <div style={classes.tdRows}>
                                                            <div><span>{getDateString(board.creationDate)}</span></div>
                                                        </div>
                                                    </div>
                                                    <div style={{ width: '20%', height: '100%' }}>
                                                        <div style={classes.tdRows}>
                                                            <span>{board?.productName && board?.productName?.length > 8 ? board.productName?.slice(0, 7) + '..' : board?.productName}</span>
                                                        </div>
                                                    </div>
                                                    <div style={{ width: '35%' }}>
                                                        <StatusView status={board.status}
                                                            style={{ margin: 'auto', marginLeft: 0 }}
                                                            label={board.currentStation.rowName} />
                                                    </div>
                                                </div>
                                            </td>
                                            {
                                                usedMachines.map((machine: IMachine, i: number) => {
                                                    return (
                                                        <td key={machine.id + i}
                                                            style={classes.tableCell}>
                                                            <StatusView style={{ margin: 'auto' }}
                                                                status={board.machinesStatuses[machine.id]} />
                                                        </td>
                                                    );
                                                })
                                            }

                                        </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
            : <div></div>
    );
}

export {
    BoardMissionsTable
}