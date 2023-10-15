import {IBoardMissionsTable} from "@/widgets/dashboard-widget/table/interface";
import {useStyle} from "@/widgets/dashboard-widget/table/style";
import {useTranslation} from "react-i18next";
import {IBoardMissions} from "@/widgets/dashboard-widget/interfaces";
import {IMachine} from "@/shared/interfaces";
import {StatusView} from "@/components/status-view";
import ElectricBoltSharpIcon from '@mui/icons-material/ElectricBoltSharp';
import {TYPE_MISSION_NAME_KEY} from "@/shared/constant";
import {Link} from "@mui/material";
import {useCallback, useState} from "react";
import {EStatus} from "@/shared";
import {getPrintHouseHost} from "@/services/storage-data";
import {useRecoilValue} from "recoil";
import {boardsMissionsStatusFilterState} from "@/store/boards-missions-status-filter";

const BoardMissionsTable = ({boardsMissions, usedMachines}: IBoardMissionsTable) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const [orderByMachine, setOrderByMachine] = useState<string>('');
    const selectedStatusFilter = useRecoilValue(boardsMissionsStatusFilterState);
    const boardLink = (boardMissions: IBoardMissions): string => {
        const host = getPrintHouseHost();
        return `https://${host}/Kanban/Board/${boardMissions.boardId}?missionId=${boardMissions.id}`;
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
    const getFilteredBoardMissions = (selectedStatusFilter:EStatus | null)=>{
        var data = [...boardsMissions];
        if(selectedStatusFilter){
            data.forEach(x=>{
                x.splittedBoards = x.splittedBoards.filter(y=>y.status == selectedStatusFilter)
            })
            data = data.filter(board => board.status === selectedStatusFilter);
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
        return boards;
    }, [orderByMachine, boardsMissions, selectedStatusFilter]);

    const handleMachineClicked = (machineId: string) => {
        setOrderByMachine(machineId === orderByMachine ? '' : machineId);
    };

    return (
        boardsMissions.length > 0 ?
            <div style={classes.tableWrapper} id={'dashboard-table'}>
                <table style={classes.table}>
                    <thead>
                    <tr>
                        <th style={{...classes.tableHead, ...classes.firstColHead}}>
                            <div style={classes.firstColHeadContent}>

                                <div style={{width: '5%'}}>#</div>
                                <div style={{width: '5%'}}></div>
                                <div style={{width: '30%'}}>{t('dashboard-widget.client')}</div>
                                <div style={{width: '25%'}}>{t('dashboard-widget.task')}</div>
                                <div style={{width: '20%'}}>{t('dashboard-widget.product')}</div>
                                <div style={{width: '35%'}}>{t('dashboard-widget.status')}</div>
                            </div>
                        </th>
                        {
                            usedMachines.map((machine: IMachine) => {
                                return (
                                    <th key={machine.id}
                                        style={orderByMachine === machine.id ? {...classes.tableHead, ...classes.selectedMachine} : classes.tableHead}
                                        onClick={() => handleMachineClicked(machine.id)}>
                                        <div style={classes.tdRows}>
                                            <div>{machine.name}</div>
                                            <div>{machine.progress?.done}/{machine.progress?.total}</div>
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
                                board.splittedBoards.length > 0 ?
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
                                                            <div style={{width: '5%'}}>{index + 1}</div>
                                                            <div style={{width: '5%'}}>{board.isUrgent ?
                                                                <ElectricBoltSharpIcon color={"error"}/> : ''}
                                                            </div>
                                                            <div style={{width: '30%'}}>
                                                                <span>{board?.clientName && board?.clientName?.length > 10 ? board.clientName?.slice(0, 9) + '..' : board?.clientName}</span>
                                                            </div>
                                                            <div style={{width: '25%', height: '100%'}}>
                                                                <div style={classes.tdRows}>
                                                                    <div><span>{board.code}</span></div>
                                                                </div>
                                                            </div>
                                                            <div style={{width: '20%', height: '100%'}}>
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
                                                                        <Link href={boardLink(sBoard)} target="_blank"
                                                                              rel="noopener">{t(TYPE_MISSION_NAME_KEY[sBoard.missionType])}</Link>
                                                                        <StatusView status={sBoard.status}
                                                                                    label={sBoard.currentStation.rowName}/>
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
                                                                <StatusView style={{margin: 'auto'}}
                                                                            status={splitBoard.machinesStatuses[machine.id]}/>
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
                                                <div style={{width: '5%'}}>{index + 1}</div>
                                                <div style={{width: '5%'}}>{board.isUrgent ?
                                                    <ElectricBoltSharpIcon color={"error"}/> : ''}
                                                </div>
                                                <div style={{width: '30%'}}>
                                                    <span>{board?.clientName && board?.clientName?.length > 10 ? board.clientName?.slice(0, 9) + '..' : board?.clientName}</span>
                                                </div>
                                                <div style={{width: '25%', height: '100%'}}>
                                                    <div style={classes.tdRows}>
                                                        <div><Link href={boardLink(board)} target="_blank"
                                                                   rel="noopener">{board.code}</Link></div>
                                                    </div>
                                                </div>
                                                <div style={{width: '20%', height: '100%'}}>
                                                    <div style={classes.tdRows}>
                                                        <span>{board?.productName && board?.productName?.length > 8 ? board.productName?.slice(0, 7) + '..' : board?.productName}</span>
                                                    </div>
                                                </div>
                                                <div style={{width: '35%'}}>
                                                    <StatusView status={board.status}
                                                                style={{margin: 'auto', marginLeft: 0}}
                                                                label={board.currentStation.rowName}/>
                                                </div>
                                            </div>
                                        </td>
                                        {
                                            usedMachines.map((machine: IMachine, i: number) => {
                                                return (
                                                    <td key={machine.id + i}
                                                        style={classes.tableCell}>
                                                        <StatusView style={{margin: 'auto'}}
                                                                    status={board.machinesStatuses[machine.id]}/>
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