import Stack from "@mui/material/Stack";
import {IconButton} from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import {useBoardMissionDrawer} from "@/widgets/production-floor-widget/hooks/use-board-mission-drawer";
import {PRODUCTION_FLOOR_DRAWER_HEADER_HEIGHT} from "@/utils/layout-config";

const DrawerCloseHeader = () => {
    const {handleClose} = useBoardMissionDrawer();
    return (
        <Stack style={{backgroundColor: 'hsla(0, 0%, 0%, 0.6)', opacity: 0.5}}  height={PRODUCTION_FLOOR_DRAWER_HEADER_HEIGHT} direction={"row"} justifyContent={"flex-end"} alignItems={'center'}>
            <IconButton onClick={handleClose} sx={{width: 'fit-content', height: 'fit-content', padding: 1, color: 'white'}}>
                <ClearRoundedIcon width={48} height={48}/>
            </IconButton>
        </Stack>
    );
}
export {DrawerCloseHeader};