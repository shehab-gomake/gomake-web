import {IBoardMissionsTable} from "@/widgets/dashboard-widget/table/interface";
import {useStyle} from "@/widgets/dashboard-widget/table/style";
import {useTranslation} from "react-i18next";
import {IBoardMissions} from "@/widgets/dashboard-widget/interfaces";
import {IMachine} from "@/shared/interfaces";
import {StatusView} from "@/components/status-view";
import ElectricBoltSharpIcon from '@mui/icons-material/ElectricBoltSharp';
import {TYPE_MISSION_NAME_KEY} from "@/shared/constant";

const BoardMissionsTable = ({boardsMissions, usedMachines}: IBoardMissionsTable) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    return (
        boardsMissions?.length > 0 ? <div>
            <div style={classes.tableContainer}>
                <div style={classes.fixedTableWrapper}>
                    <table className={'table'} style={classes.table}>
                        <thead>
                        <tr>
                            <th style={classes.tableHead}>#</th>
                            <th style={classes.tableHead}></th>
                            <th style={classes.tableHead}>Task</th>
                            <th style={classes.tableHead}>Status</th>
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
                                                <div>{board.code}</div>
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
                <div style={classes.scrollTableWrapper}>
                    <table style={classes.table}>
                        <thead>
                        <tr>
                            {
                                usedMachines.map((machine: IMachine, index: number) => {
                                    return (
                                        <th key={index}
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
                                    <tr style={classes.tableRow} key={index}>
                                        {
                                            usedMachines.map((machine: IMachine, i: number) => {
                                                return (
                                                    <td key={i}
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
            </div>
        </div> : <div></div>
    );
}

    export {BoardMissionsTable}