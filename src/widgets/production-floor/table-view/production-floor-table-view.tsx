import {StatusTableComponent} from "@/widgets/production-floor/table-view/status-table/status-table-component";
import {useProductionFloorTable} from "@/widgets/production-floor/table-view/use-production-floor-table";
import Stack from "@mui/material/Stack";

const ProductionFloorTableView = () => {
    const {data} = useProductionFloorTable()
    return (
        <Stack gap={'20px'}>
            {
                data?.map(statusBoards =>
                    <StatusTableComponent
                        count={statusBoards.boardMissionStatus.count}
                        status={statusBoards.boardMissionStatus.boardMissionStatus}
                        boards={statusBoards.boardMissions}/>
                )
            }
        </Stack>
    )
}
export {ProductionFloorTableView}