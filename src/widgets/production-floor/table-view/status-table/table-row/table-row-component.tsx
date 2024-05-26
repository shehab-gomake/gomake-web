import {SecondaryTableCell, SecondaryTableRow} from "@/components/tables/secondary-table";
import {SecondaryCheckBox} from "@/components/check-box/secondary-check-box";
import Link from "next/link";
import {LabelComponent} from "@/widgets/production-floor/label-component/label-component";
import {
    CurrentStationComponent
} from "@/widgets/production-floor/table-view/status-table/current-station/current-station";
import {BoardStatusComponent} from "@/widgets/production-floor/table-view/status-table/board-status/board-status";
import {DateFormatterDDMMYYYY} from "@/utils/adapter";
import {IBoardMissions} from "@/widgets/production-floor/interfaces/board-missions";
import {useDrag} from "react-dnd";
import {useRecoilState} from "recoil";
import {selectedBoardsMissionsState} from "@/widgets/production-floor/state/boards";
import {useProductionFloorData} from "@/widgets/production-floor/use-production-floor-data";
import Stack from "@mui/material/Stack";

interface IProps {
    boardMission: IBoardMissions
}

const TableRowComponent = ({boardMission}: IProps) => {
    const [selectedIds, setSelectedIds] = useRecoilState(selectedBoardsMissionsState);
    const [, drag] = useDrag(() => ({
        type: 'task',
        item: {board: boardMission, type: 'TASK', selectedIds},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [selectedIds]);
    const {updateStatus} = useProductionFloorData();
    const onSelectBoardMissions = (id: string, checked: boolean) => {
        setSelectedIds(checked ? [...selectedIds, boardMission] :
            selectedIds.filter(selectedBoard => selectedBoard.id !== id && selectedBoard.productType === boardMission.productType));
    }
    return <SecondaryTableRow ref={drag} style={{cursor: 'move'}}>
        <SecondaryTableCell align={"center"}> <SecondaryCheckBox
            checked={!!selectedIds?.find(si => si.id === boardMission.id && si.productType === boardMission.productType)}
            onChange={(a) => {
                onSelectBoardMissions(boardMission.id, a.target.checked)
            }}/>
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"}>
            <Link
                href={`/production-floor?boardMissionsId=${boardMission?.id}&productType=${boardMission?.productType}&step=stations`}>{`${boardMission?.boardMissionNumber}\\${boardMission?.orderNumber}`}</Link>
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"}>
            <LabelComponent label={boardMission?.productName}/>
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"}>
            <CurrentStationComponent {...boardMission.currentStation}
                                     boardMissionId={boardMission.id}/>
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"}>
            <BoardStatusComponent statusId={boardMission.statusId} id={boardMission.id}
                                  onChange={(id, statusId) => updateStatus([boardMission], statusId)}/>
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"}>
            {boardMission?.clientName}
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"}>
            {DateFormatterDDMMYYYY(boardMission?.actionDueDate)}
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"}>
            {DateFormatterDDMMYYYY(boardMission?.dueDate)}
        </SecondaryTableCell>
        <SecondaryTableCell align={"center"}>
            <Stack justifyContent={'center'} direction={'row'} flexWrap={'wrap'}>
                {
                    boardMission?.automatedTags?.map(tag => <LabelComponent key={tag} label={tag}/>)
                }
            </Stack>
        </SecondaryTableCell>
    </SecondaryTableRow>
}

export {TableRowComponent}