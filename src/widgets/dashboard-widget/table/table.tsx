import {IBoardMissionsTable} from "@/widgets/dashboard-widget/table/interface";
import {useStyle} from "@/widgets/dashboard-widget/table/style";
import {useTranslation} from "react-i18next";
import {IBoardMissions} from "@/widgets/dashboard-widget/interfaces";
import {IMachine} from "@/shared/interfaces";
import {StatusView} from "@/components/status-view";
import ElectricBoltSharpIcon from '@mui/icons-material/ElectricBoltSharp';
import {TYPE_MISSION_NAME_KEY} from "@/shared/constant";
import React from "react";
import {Link} from "@mui/material";

const BoardMissionsTable = ({boardsMissions, usedMachines}: IBoardMissionsTable) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const dir: 'ltr' | 'rtl' = t('direction');
    const fixedTableId = 'fixedTable';
    const scrollTableId = 'scrollTable';
    const boardLink = (boardMissions: IBoardMissions): string => {
        const hostName = window.location.hostname;
        const testHostName = 'https://tests.gomake.co.il';
        return `${hostName}/Kanban/Board/${boardMissions.boardId}?missionId=${boardMissions.id}`;
    }
    const tableScrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
        const elID = event.currentTarget.id === fixedTableId ? scrollTableId : fixedTableId
        const scrollTop = event?.currentTarget?.scrollTop;
        const el = document.getElementById(elID);
        if (el) {
            el.scrollTop = scrollTop;
        }
    }
    return (
        boardsMissions?.length > 0 ? <div>
            <div id={'dashboard-table'} style={classes.tableContainer}>
                <div id={fixedTableId} style={classes[dir].fixedTableWrapper} onScroll={tableScrollHandler}>
                    <table  className={'table'} style={classes.table}>
                        <thead >
                        <tr>
                            <th style={classes.tableHead}>#</th>
                            <th style={classes.tableHead}></th>
                            <th style={classes.tableHead}>{t('dashboard-widget.task')}</th>
                            <th style={classes.tableHead}>{t('dashboard-widget.status')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            boardsMissions && boardsMissions.map((board: IBoardMissions, index: number) => {
                                return (
                                    <tr style={classes.fixedTableRow} key={index}>
                                        <td style={classes.fixedTableCell}>{index + 1}</td>
                                        <td style={classes.fixedTableCell}>{board.isUrgent ?
                                            <ElectricBoltSharpIcon color={"error"}/> : ''}</td>
                                        <td style={classes.fixedTableCell}>
                                            <div style={classes.tdRows}>
                                                <div><Link href={boardLink(board)} target="_blank" rel="noopener">{board.code}</Link></div>
                                                { board.missionType !== null && <div>{TYPE_MISSION_NAME_KEY[board.missionType]}</div>}
                                            </div>
                                        </td>
                                        <td style={classes.fixedTableCell}>
                                            <StatusView status={board.status}
                                                        style={{margin: 'auto'}}
                                                        label={board.currentStation.rowName}/>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </table>
                </div>
                <div style={classes[dir].scrollTableWrapper} id={scrollTableId} onScroll={tableScrollHandler}>
                    <table style={classes.table}>
                        <thead>
                        <tr>
                            {
                                usedMachines.map((machine: IMachine) => {
                                    return (
                                        <th key={machine.id}
                                            style={classes.tableHead}>
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
                            boardsMissions?.map((board: IBoardMissions, index: number) => {
                                return (
                                    <tr style={classes.tableRow} key={board.id + index}>
                                        {
                                            usedMachines.map((machine: IMachine, i: number) => {
                                                return (
                                                    <td key={machine.id + i}
                                                        style={classes[dir].tableCell}>
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
            </div>
        </div> : <div></div>
    );
}

    export {BoardMissionsTable}