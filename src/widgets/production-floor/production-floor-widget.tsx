import {IconButton, Stack} from "@mui/material";
import {ProductionFloorFilters} from "@/widgets/production-floor/filters/production-floor-filters";
import {ProductionFloorHeader} from "@/widgets/production-floor/header/production-floor-header";
import {useRecoilState} from "recoil";
import {EProductionFloorView, productionFloorViewState} from "@/widgets/production-floor/state/production-floor-view";
import {useEffect, useState} from "react";
import {GroupsTable} from "@/widgets/production-floor/views/groups-view/groups-table";
import {useRouter} from "next/router";
import {
    ProductionFloorBoardMissionsViews
} from "@/widgets/production-floor/views/boards-view/production-floor-board-missions-views";
import Drawer from "@mui/material/Drawer";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import {BoardMissionsComponent} from "@/widgets/production-floor/views/board-missions-view/board-missions-component";
import {DashboardWidget} from "@/widgets/dashboard-widget";
import {FilesUploaderWidget} from "@/widgets/file-uploader-widget/files-uploader-widget";

const ProductionFloorWidget = () => {
    const [view, setView] = useRecoilState(productionFloorViewState);
    const [openBoardMissionsDrawer, setOpenBoardMissionsDarawer] = useState<boolean>(false);
    const {query, replace, pathname} = useRouter();
    const {groupsId, boardMissionsId, step, productType} = query;

    useEffect(() => {
        setOpenBoardMissionsDarawer(!!boardMissionsId)
        if (!!boardMissionsId && !step) {
            replace({ pathname: pathname, query: {...query, step: 'stations'}}, undefined, { shallow: true }).then();
        }
        if (!!groupsId) {
            setView(EProductionFloorView.GROUPS);
        }

    }, [groupsId, boardMissionsId, step]);

    return <Stack padding={'0 20px'} gap={'10px'} height={'100%'} maxHeight={'100%'} overflow={'hidden'}>
        <ProductionFloorHeader/>
        {view !== EProductionFloorView.DASHBOARD && <ProductionFloorFilters/>}
        <Stack overflow={'auto'} maxHeight={'100%'}>

            {
                view === EProductionFloorView.DASHBOARD ? <DashboardWidget/> : view === EProductionFloorView.GROUPS ? <GroupsTable/> : <ProductionFloorBoardMissionsViews/>
            }
        </Stack>
        <Drawer sx={{zIndex: 999999}} open={openBoardMissionsDrawer} anchor={'bottom'}>
            <Stack paddingBottom={'10px'} width={'100vw'} height={'calc(100vh - 50px)'}>
                <IconButton onClick={() => {
                    replace('/production-floor', undefined, {shallow: true}).then();
                }} sx={{width: 'fit-content', height: 'fit-content', padding: 1, color: 'white', position: 'fixed', top: 10, right: 10}}>
                    <ClearRoundedIcon width={48} height={48}/>
                </IconButton>
                {openBoardMissionsDrawer && <BoardMissionsComponent productType={!!productType ? productType.toString() : ''} step={step?.toString()} boardMissionsId={boardMissionsId?.toString()}/>}
            </Stack>
            <FilesUploaderWidget/>

        </Drawer>
    </Stack>
}

export {ProductionFloorWidget}