import { KanbanColumnComponent } from "@/widgets/production-floor/kanban-view/kanban-column/kaban-column-component";
import { useProductionFloorKanban } from "@/widgets/production-floor/kanban-view/use-production-floor-kanban";
import Stack from "@mui/material/Stack";
import { useRecoilValue } from "recoil";
import { useMemo } from "react";
// import { selectedChipIdState } from "../state/text-search";
import { selectedChipIdsState } from "../state/text-search";

const ProductionFloorKanbanBoard = () => {
    const { data } = useProductionFloorKanban();

    const selectedChipId = useRecoilValue(selectedChipIdsState);
    // const selectedChipId = useRecoilValue(selectedChipIdState);

    const filteredDataByMachine = useMemo(() => {
        if (selectedChipId.length === 0) return data;

        return data.map((item) => {
            const filteredBoardMissions = item.boardMissions.filter((mission) => {
                return selectedChipId.some((chipId) =>
                    mission?.currentStation?.machineId === chipId ||
                    mission?.currentStation?.employeeId === chipId
                );
            });

            return {
                ...item,
                boardMissions: filteredBoardMissions,
            };
        });
    }, [data, selectedChipId]);


    return (
        <Stack direction={'row'} justifyContent={'space-between'} padding={'20px'} overflow={'hidden'} minHeight={'100%'}>
            {filteredDataByMachine.map((column) => (
                <KanbanColumnComponent
                    key={column.boardMissionStatus.boardMissionStatus?.name}
                    status={column.boardMissionStatus.boardMissionStatus}
                    count={column.boardMissionStatus.count}
                    boardsMissions={column.boardMissions} />
            ))}
        </Stack>
    );
}

export { ProductionFloorKanbanBoard }