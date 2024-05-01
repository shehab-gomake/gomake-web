import {useState} from "react";
import {useStyle} from "@/widgets/product-pricing-widget/style";
import {Collapse, Fade, IconButton} from "@mui/material";
import Stack from "@mui/material/Stack";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Divider from "@mui/material/Divider";

import {BoardMissionsStationAction} from "@/widgets/production-floor/views/board-missions-view/stations/station-action";
import {IBoardMissionsSubWorkFlow} from "@/widgets/production-floor/views/board-missions-view/stations/interface";

interface IProps extends IBoardMissionsSubWorkFlow{
    currentBoardMissionsActionId: string;
}
const BoardMissionsSubWorkFlowComponent = ({actions, productType, currentBoardMissionsActionId}: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {classes} = useStyle();

    return (
        <div>
            <Fade in={true}>
                <Stack onClick={() => setIsOpen(!isOpen)} alignItems={"center"} direction={"row"}
                       justifyContent={'space-between'} style={{
                    ...classes.subWorkFlowContainer,
                }}>
                    <Stack direction={'row'} gap={'10px'} alignItems={'center'} flexWrap={'wrap'}>
                        <span>{productType}</span>
                    </Stack>
                    <Stack direction={'row'} gap={'12px'} flexWrap={'nowrap'} minWidth={'fit-content'}>
                        <IconButton onClick={() => setIsOpen(!isOpen)} style={classes.toggleSubWorkFlowActionButton}>
                            {isOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                    </Stack>
                </Stack>
            </Fade>
            <Collapse in={isOpen} collapsedSize={0} orientation={'vertical'}>
                <Stack padding={'10px 0'} gap={'10px'}>
                    {
                        actions?.map((action, i) =>
                            <Stack direction={'row'} alignItems={'center'} position={'relative'} padding={'0 5px'}>
                                {
                                    i + 1 < actions?.length ? <Divider orientation={'vertical'} style={{
                                            width: '2px',
                                            backgroundColor: '#667085',
                                            margin: i === 0 ? '-20px 0 -10px 0' : '-10px 0'
                                        }} flexItem/> :
                                        <Divider style={classes.subWorkFlowDividerVertical} absolute orientation={"vertical"} />
                                }
                                <Divider orientation={'horizontal'}
                                         style={{width: '30px', height: '2px', backgroundColor: '#667085'}}/>
                                <BoardMissionsStationAction delay={i * 300} selected={currentBoardMissionsActionId === action.boardMissionActionId} {...action}/>
                            </Stack>)
                    }
                </Stack>
            </Collapse>
        </div>
    )
};

export {BoardMissionsSubWorkFlowComponent}