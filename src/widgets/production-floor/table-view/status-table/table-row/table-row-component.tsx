import {SecondaryTableCell} from "@/components/tables/secondary-table";
import {SecondaryCheckBox} from "@/components/check-box/secondary-check-box";
import Link from "next/link";
import {LabelComponent} from "@/widgets/production-floor/label-component/label-component";
import {
    CurrentStationComponent
} from "@/widgets/production-floor/table-view/status-table/current-station/current-station";
import {BoardStatusComponent} from "@/widgets/production-floor/table-view/status-table/board-status/board-status";
import {DateFormatterDDMMYYYY} from "@/utils/adapter";
import {IBoardMissions} from "@/widgets/production-floor/interfaces/board-missions";
import {useDrag, useDrop} from "react-dnd";
import {useRecoilState} from "recoil";
import {selectedBoardsMissionsState} from "@/widgets/production-floor/state/boards";
import {useProductionFloorData} from "@/widgets/production-floor/use-production-floor-data";
import Stack from "@mui/material/Stack";
import {useUserPermission} from '@/hooks/use-permission';
import {Permissions} from "@/components/CheckPermission/enum";
import {PermissionCheck} from "@/components/CheckPermission/check-permission";
import {useRef, useState} from "react";
import {Collapse, Skeleton, TableCell, TableRow} from "@mui/material";

interface IProps {
    boardMission: IBoardMissions
}

enum EDropArea {
    BEFORE,
    AFTER,
    DISABLED
}

const TableRowComponent = ({boardMission}: IProps) => {
    const [selectedIds, setSelectedIds] = useRecoilState(selectedBoardsMissionsState);
    const {CheckPermission} = useUserPermission();
    const canDrag = CheckPermission(Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR);
    const [dropArea, setDropArea] = useState<EDropArea>();
    const ref = useRef(null);
    const [, drag] = useDrag(() => ({
        type: 'task',
        item: {board: boardMission, type: 'TASK', selectedIds},
        canDrag: () => canDrag,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [selectedIds, canDrag]);

    const [{isOver}, drop] = useDrop(() => ({
        accept: 'task',
        drop: (item: { board: IBoardMissions, selectedIds: IBoardMissions[] }, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) {
                return;
            }
            updateBoardMissionsOrder({
                source: {
                    boardMissionId: item.board.id,
                    productType: item.board.productType,
                    priority: item.board.priority
                },
                destination: {
                    boardMissionId: boardMission.id,
                    productType: boardMission.productType,
                    priority: boardMission.priority
                },
                statusId: boardMission.statusId
            }).then();

        },
        hover: (item: { board: IBoardMissions, selectedIds: IBoardMissions[] }) => {
            if (item.board.id === boardMission.id || item.board.statusId !== boardMission.statusId) {
                setDropArea(EDropArea.DISABLED);
            } else {
                if (boardMission.priority < item.board.priority) {
                    setDropArea(EDropArea.BEFORE);
                } else {
                    setDropArea(EDropArea.AFTER)
                }
            }

        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [boardMission]);


    const {updateStatus, updateBoardMissionsOrder} = useProductionFloorData();
    const onSelectBoardMissions = (id: string, checked: boolean) => {
        setSelectedIds(checked ? [...selectedIds, boardMission] :
            selectedIds.filter(selectedBoard => selectedBoard.id !== id && selectedBoard.productType === boardMission.productType));
    }
    drag(drop(ref));
    return (
        <>
            <TableRow>
                <TableCell colSpan={9} style={{padding: 0, transition: 'padding 1s'}}>
                    {
                        <Collapse in={selectedIds.length === 0 && isOver && dropArea === EDropArea.BEFORE}>
                            <Skeleton height={'50px'}/>
                        </Collapse>
                    }
                </TableCell>
            </TableRow>
            <TableRow ref={ref}
                      style={{cursor: canDrag ? 'move' : 'default', marginBottom: '100px'}}>
                <PermissionCheck userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}>
                    <SecondaryTableCell align={"center"}> <SecondaryCheckBox
                        checked={!!selectedIds?.find(si => si.id === boardMission.id && si.productType === boardMission.productType)}
                        onChange={(a) => {
                            onSelectBoardMissions(boardMission.id, a.target.checked)
                        }}/>
                    </SecondaryTableCell>
                </PermissionCheck>
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
            </TableRow>
            <TableRow>
                <TableCell colSpan={9} style={{padding: 0, transition: 'padding 1s'}}>
                    {
                        <Collapse in={selectedIds.length === 0 && isOver && dropArea === EDropArea.AFTER}>
                            <Skeleton height={'50px'}/>
                        </Collapse>
                    }
                </TableCell>
            </TableRow>
        </>
    )
}

export {TableRowComponent}