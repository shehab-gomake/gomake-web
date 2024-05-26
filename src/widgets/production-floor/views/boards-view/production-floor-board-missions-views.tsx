import {useRecoilState} from "recoil";
import {EProductionFloorView, productionFloorViewState} from "@/widgets/production-floor/state/production-floor-view";
import {ProductionFloorTableView} from "@/widgets/production-floor/table-view/production-floor-table-view";
import {ProductionFloorKanbanBoard} from "@/widgets/production-floor/kanban-view/production-floor-kanban-board";
import {useProductionFloorData} from "@/widgets/production-floor/use-production-floor-data";
import {useEffect, useState} from "react";
import {useBoardMissionsSignalr} from "@/hooks/signalr/use-board-missions-signalr";
import Stack from "@mui/material/Stack";
import {Skeleton} from "@mui/material";

const ProductionFloorBoardMissionsViews = () => {
    const [view] = useRecoilState(productionFloorViewState);
    const {getData} = useProductionFloorData();
    const {connectionId} = useBoardMissionsSignalr();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!!connectionId) {
            setLoading(true);
            getData(connectionId).then(() => setLoading(false));
        }
    }, [connectionId])
    return (
        <>
            {
                loading ? <Stack gap={'10px'}>
                        {
                            [...new Array(5)].map(_ => <Skeleton variant="rounded" width={'100%'} height={60}/>)
                        }

                    </Stack> :
                    view === EProductionFloorView.TABLE ? <ProductionFloorTableView/> :
                        view === EProductionFloorView.KANBAN ? <ProductionFloorKanbanBoard/> :
                            <div/>

            }
        </>
    )
};

export {ProductionFloorBoardMissionsViews}