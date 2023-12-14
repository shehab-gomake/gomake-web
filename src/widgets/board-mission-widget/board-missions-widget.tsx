import Stack from "@mui/material/Stack";
import {useBoardMissionsData} from "@/widgets/board-mission-widget/hooks/use-board-missions-data";
import {
    BoardMissionsHeaderComponent
} from "@/widgets/board-mission-widget/components/header/board-missions-header-component";
import {
    NavigationButtonsComponent
} from "@/widgets/board-mission-widget/components/navigation-buttons/navigation-buttons-component";
import {
    BoardMissionsViewsComponent
} from "@/widgets/board-mission-widget/components/board-missions-views/board-missions-views-component";
import {convertHeightToVH} from "@/utils/adapter";
import {PRODUCTION_FLOOR_DRAWER_HEADER_HEIGHT, SCREEN_HEIGHT} from "@/utils/layout-config";
import {Divider} from "@mui/material";

const BoardMissionsWidget = () => {
    const {} = useBoardMissionsData();
    return (
        <Stack overflow={'hidden'} maxHeight={convertHeightToVH(SCREEN_HEIGHT - PRODUCTION_FLOOR_DRAWER_HEADER_HEIGHT)} gap={'16px'}
               padding={'36px 24px'}>
            <BoardMissionsHeaderComponent/>
            <Divider orientation={'horizontal'} flexItem/>
            <NavigationButtonsComponent/>
            <Stack overflow={"auto"}>
                <BoardMissionsViewsComponent/>
            </Stack>
        </Stack>
    );
}

export {BoardMissionsWidget}