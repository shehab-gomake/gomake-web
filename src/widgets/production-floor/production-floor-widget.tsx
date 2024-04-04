import {Stack} from "@mui/material";
import {ProductionFloorFilters} from "@/widgets/production-floor/filters/production-floor-filters";
import {ProductionFloorHeader} from "@/widgets/production-floor/header/production-floor-header";
import {useRecoilState} from "recoil";
import {EProductionFloorView, productionFloorViewState} from "@/widgets/production-floor/state/production-floor-view";
import {useEffect} from "react";
import {GroupsTable} from "@/widgets/production-floor/views/groups-view/groups-table";
import {useRouter} from "next/router";
import {ProductionFloorBoardMissionsViews} from "@/widgets/production-floor/views/boards-view/production-floor-board-missions-views";

const ProductionFloorWidget = () => {
    const [view, setView] = useRecoilState(productionFloorViewState);
    const {query} = useRouter();
    const {groupsId} = query;

    useEffect(() => {
        if (!!groupsId) {
            setView(EProductionFloorView.GROUPS);
        }
    }, [groupsId]);

    return <Stack padding={'0 20px'} gap={'10px'} height={'100%'} maxHeight={'100%'} overflow={'hidden'}>
        <ProductionFloorHeader/>
        <ProductionFloorFilters/>
        <Stack overflow={'auto'} maxHeight={'100%'}>

            {
                view === EProductionFloorView.GROUPS ?  <GroupsTable/> : <ProductionFloorBoardMissionsViews/>
            }
        </Stack>
    </Stack>
}

export {ProductionFloorWidget}