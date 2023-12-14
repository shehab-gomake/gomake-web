import Stack from "@mui/material/Stack";
import {Avatar, Divider} from "@mui/material";
import {useBoardMissionsHeader} from "@/widgets/board-mission-widget/hooks/use-board-missions-header";
import {TaskCategoryLabel} from "@/widgets/production-floor-widget/components/task-category-label";
import {useStyle} from "@/widgets/board-mission-widget/components/header/style";
import {HeaderDividerComponent} from "@/widgets/board-mission-widget/components/header/header-divider-component";
import {HeaderTitleComponent} from "@/widgets/board-mission-widget/components/header/header-title-component";

const BoardMissionsHeaderComponent = () => {
    const {boardMissions} = useBoardMissionsHeader();
    const {classes} = useStyle()
    return (
        <Stack gap={'14px'} direction={'row'} alignItems={'center'}>
            <Stack><Avatar style={{width: '80px', height: '80px', borderRadius: '8px'}} variant={'square'}/></Stack>
            <Stack gap={'10px'}>
                <Stack direction={'row'} alignItems={'center'} gap={'5px'}>
                    <HeaderTitleComponent title={boardMissions.productName}/>
                    <HeaderDividerComponent/>
                    <HeaderTitleComponent title={boardMissions.clientName}/>
                    <HeaderDividerComponent/>
                    <HeaderTitleComponent title={`${boardMissions.boardMissionNumber}/${boardMissions.orderNumber}`}/>
                    <TaskCategoryLabel label={boardMissions.currentActionName}/>
                </Stack>
                <Stack direction={'row'} alignItems={'center'} gap={'16px'}>
                    <span>Started on 5 May 2023</span>
                    <Divider flexItem orientation={'vertical'}/>
                    <Stack direction={'row'} gap={'5px'}>
                        <span style={classes.parameterLabel}>Status</span>
                        <span>{boardMissions.statusId}</span>
                    </Stack>
                    <Divider flexItem orientation={'vertical'}/>
                    <Stack direction={'row'} gap={'5px'}>
                        <span style={classes.parameterLabel}>Agent</span>
                        <span style={classes.parameterValue}>{boardMissions.agentName}</span>
                    </Stack>
                    <Divider flexItem orientation={'vertical'}/>
                    <Stack direction={'row'} gap={'5px'}>
                        <span style={classes.parameterLabel}>Delivered On</span>
                        <span style={classes.parameterValue}> 5 May 2023 | 11:00:00 PM</span>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}
export {BoardMissionsHeaderComponent}