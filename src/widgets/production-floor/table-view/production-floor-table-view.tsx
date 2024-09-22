import { StatusTableComponent } from "@/widgets/production-floor/table-view/status-table/status-table-component";
import { useProductionFloorTable } from "@/widgets/production-floor/table-view/use-production-floor-table";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { selectedChipIdState } from "../state/text-search";

const ProductionFloorTableView = () => {
    const { data } = useProductionFloorTable();
    const selectedChipId = useRecoilValue(selectedChipIdState);

    const filteredDataByMachine = useMemo(() => {
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
        <Stack gap={'20px'}>
            {
                filteredDataByMachine?.map(statusBoards =>
                    <StatusTableComponent
                        count={statusBoards.boardMissionStatus.count}
                        status={statusBoards.boardMissionStatus.boardMissionStatus}
                        boards={statusBoards.boardMissions} />
                )
            }
        </Stack>
    )
}

export { ProductionFloorTableView }