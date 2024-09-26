import { StatusTableComponent } from "@/widgets/production-floor/table-view/status-table/status-table-component";
import { useProductionFloorTable } from "@/widgets/production-floor/table-view/use-production-floor-table";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { selectedChipIdsState } from "../state/text-search";

const ProductionFloorTableView = () => {
    const { data } = useProductionFloorTable();
    const selectedChipId = useRecoilValue(selectedChipIdsState);
    const filteredDataByMachine = useMemo(() => {

        if (!selectedChipId.length) return data;
        return data.map((item) => {
            const filteredBoardMissions = item.boardMissions.filter((mission) =>
                selectedChipId.some((chipId) =>
                    mission?.currentStation?.machineId === chipId ||
                    mission?.currentStation?.employeeId === chipId
                )
            );
            return {
                ...item,
                boardMissions: filteredBoardMissions,
            };
        });
    }, [data, selectedChipId]);

    return (
        <Stack gap={'20px'}>
            {filteredDataByMachine.map((statusBoards, index) => (
                <StatusTableComponent
                    key={index}
                    count={statusBoards.boardMissionStatus.count}
                    status={statusBoards.boardMissionStatus.boardMissionStatus}
                    boards={statusBoards.boardMissions}
                />
            ))}
        </Stack>
    )
}

export { ProductionFloorTableView }