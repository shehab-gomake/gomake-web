import {IBoardMissionsTable} from "@/widgets/dashboard-widget/table/interface";
import {useStyle} from "@/widgets/dashboard-widget/table/style";
import {useTranslation} from "react-i18next";
import {IBoardMissions} from "@/widgets/dashboard-widget/interfaces";
import {IMachine} from "@/shared/interfaces";
import {StatusView} from "@/components/status-view";
import ElectricBoltSharpIcon from '@mui/icons-material/ElectricBoltSharp';
import {TYPE_MISSION_NAME_KEY} from "@/shared/constant";
import {Link} from "@mui/material";

const BoardMissionsTable = ({boardsMissions, usedMachines}: IBoardMissionsTable) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const boardLink = (boardMissions: IBoardMissions): string => {
       // const hostName = window.location.hostname;
       // const testHostName = 'https://tests.gomake.co.il';
        return `/Kanban/Board/${boardMissions.boardId}?missionId=${boardMissions.id}`;
    }

    return (
        boardsMissions.length > 0 ?
        <div style={classes.tableWrapper} id={'dashboard-table'}>
            <table style={classes.table}>
                <thead>
                <tr>
                    <th style={{...classes.tableHead, ...classes.firstColHead}}>
                        <div style={classes.firstColHeadContent}>

                            <div style={{width: '15%'}}>#</div>
                            <div style={{width: '10%'}}></div>
                            <div style={{width: '40%'}}>{t('dashboard-widget.task')}</div>
                            <div style={{width: '35%'}}>{t('dashboard-widget.status')}</div>
                        </div>
                    </th>
                    {
                        usedMachines.map((machine: IMachine) => {
                            return (
                                <th key={machine.id} style={classes.tableHead}>
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
                    boardsMissions && boardsMissions.map((board: IBoardMissions, index: number) => {
                        return (
                            <tr key={index}>
                                <td style={{...classes.tableCell, ...classes.firstColCell}}>
                                    <div style={{width: '15%'}}>{index + 1}</div>
                                    <div style={{width: '10%'}}>{board.isUrgent ?
                                        <ElectricBoltSharpIcon color={"error"}/> : ''}
                                    </div>
                                    <div style={{width: '40%', height: '100%'}}>
                                        <div style={classes.tdRows}>
                                            <div><Link href={boardLink(board)} target="_blank"
                                                       rel="noopener">{board.code}</Link></div>
                                            {board.missionType !== null &&
                                                <div>{t(TYPE_MISSION_NAME_KEY[board.missionType])}</div>}
                                        </div>
                                    </div>
                                    <div style={{width: '35%'}}>
                                        <StatusView status={board.status}
                                                    label={board.currentStation.rowName}/>
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
            :<div></div>
    );
}

export {BoardMissionsTable}