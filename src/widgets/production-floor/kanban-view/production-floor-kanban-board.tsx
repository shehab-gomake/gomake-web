import {KanbanColumnComponent} from "@/widgets/production-floor/kanban-view/kanban-column/kaban-column-component";
import {useProductionFloorKanban} from "@/widgets/production-floor/kanban-view/use-production-floor-kanban";
import Stack from "@mui/material/Stack";

const ProductionFloorKanbanBoard = () => {
    const {data} = useProductionFloorKanban();
    return (
        <Stack direction={'row'} justifyContent={'space-between'} padding={'20px'} overflow={'hidden'} minHeight={'100%'}>
            {data.map((column) => (
                <KanbanColumnComponent key={column.boardMissionStatus.boardMissionStatus?.name}
                                       status={column.boardMissionStatus.boardMissionStatus}
                                       count={column.boardMissionStatus.count} boardsMissions={column.boardMissions}/>
            ))}
        </Stack>
    );
}

export {ProductionFloorKanbanBoard}