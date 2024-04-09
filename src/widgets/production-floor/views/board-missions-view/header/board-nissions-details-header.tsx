import Stack from "@mui/material/Stack";
import {useRecoilValue} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {Avatar, Divider} from "@mui/material";
import {useStyle} from "@/widgets/production-floor/views/board-missions-view/header/style"
import {LabelComponent} from "@/widgets/production-floor/label-component/label-component";
import {DateFormatterDDMMYYYY} from "@/utils/adapter";
import TocIcon from '@mui/icons-material/Toc';
const HeaderTitleComponent = ({title}: { title?: string }) => {
    const {classes} = useStyle();
    return <span style={classes.title}>{title}</span>
}

const HeaderDividerComponent = () => {
    const {classes} = useStyle()
    return <Divider orientation={'vertical'} style={classes.divider} flexItem/>
}
const BoardMissionsDetailsHeader = () => {
    const {classes} = useStyle();
    const boardMissionsDetails = useRecoilValue(boardMissionsDetailsState);
    return (
        <Stack gap={'14px'} direction={'row'} alignItems={'center'}>
            <Stack>
                <Avatar src={boardMissionsDetails?.boardMissionImage} style={{width: '80px', height: '80px', borderRadius: '8px'}} variant={'square'}>
                <TocIcon style={{width: '60px', height: '60px'}}/>
            </Avatar>
            </Stack>
            <Stack gap={'10px'}>
                <Stack direction={'row'} alignItems={'center'} gap={'5px'}>
                    <HeaderTitleComponent title={boardMissionsDetails?.productName}/>
                    <HeaderDividerComponent/>
                    <HeaderTitleComponent title={boardMissionsDetails.clientName}/>
                    <HeaderDividerComponent/>
                    <HeaderTitleComponent
                        title={`${boardMissionsDetails.boardMissionNumber}/${boardMissionsDetails.orderNumber}`}/>
                    <LabelComponent label={'Test text'}/>
                </Stack>
                <Stack direction={'row'} alignItems={'center'} gap={'16px'}>
                    <span>Started on 5 May 2023</span>
                    <Divider flexItem orientation={'vertical'}/>
                    <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
                        <span style={classes.parameterLabel}>Status:</span>
                        <Stack style={{backgroundColor: boardMissionsDetails?.boardMissionStatus?.backgroundColor}} padding={'0 5px'} direction={'row'} gap={'5px'} color={boardMissionsDetails?.boardMissionStatus?.textColor}>
                            <span>{boardMissionsDetails.boardMissionStatus?.name}</span>
                            <span>/</span>
                            <span>{boardMissionsDetails.currentActionName}</span>
                        </Stack>
                    </Stack>
                    <Divider flexItem orientation={'vertical'}/>
                    <Stack direction={'row'} gap={'5px'}>
                        <span style={classes.parameterLabel}>Agent:</span>
                        <span style={classes.parameterValue}>{boardMissionsDetails.agentName}</span>
                    </Stack>
                    <Divider flexItem orientation={'vertical'}/>
                    <Stack direction={'row'} gap={'5px'}>
                        <span style={classes.parameterLabel}>Delivered On</span>
                        <span style={classes.parameterValue}>{DateFormatterDDMMYYYY(boardMissionsDetails.dueDate)}</span>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

export {BoardMissionsDetailsHeader}