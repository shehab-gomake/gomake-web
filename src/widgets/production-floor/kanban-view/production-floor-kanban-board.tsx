import {KanbanColumnComponent} from "@/widgets/production-floor/kanban-view/kanban-column/kaban-column-component";
import {useProductionFloorKanban} from "@/widgets/production-floor/kanban-view/use-production-floor-kanban";
import Stack from "@mui/material/Stack";
import { useRecoilValue } from "recoil";
import { selectedChipIdState } from "../state/text-search";
import { useMemo } from "react";

const ProductionFloorKanbanBoard = () => {
    const {data} = useProductionFloorKanban();
    const selectedChipId = useRecoilValue(selectedChipIdState); 

    const filteredDataByMachine= useMemo(() => {
        return !selectedChipId ? data : data.map((item) => {
            const filteredBoardMissions = item.boardMissions.filter(
                (mission) =>
                    mission?.currentStation?.machineId === selectedChipId ||
                    mission?.currentStation?.employeeId === selectedChipId
            );
            return {
                ...item,
                boardMissions: filteredBoardMissions,
            };
        });

    }, [data, selectedChipId])

    return (
        <Stack direction={'row'} justifyContent={'space-between'} padding={'20px'} overflow={'hidden'} minHeight={'100%'}>
            {filteredDataByMachine.map((column) => (
                <KanbanColumnComponent key={column.boardMissionStatus.boardMissionStatus?.name}
                                       status={column.boardMissionStatus.boardMissionStatus}
                                       count={column.boardMissionStatus.count} boardsMissions={column.boardMissions}/>
            ))}
        </Stack>
    );
}

export {ProductionFloorKanbanBoard}