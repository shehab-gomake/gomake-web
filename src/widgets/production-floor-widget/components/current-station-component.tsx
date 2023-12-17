import {Button, Menu, MenuItem} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowRight";
import {ICurrentStation} from "@/widgets/production-floor-widget/interface";
import {useCurrentStation} from "@/widgets/production-floor-widget/hooks/use-current-station";
import {useStyle} from "@/widgets/production-floor-widget/components/style";
import Stack from "@mui/material/Stack";

interface IProps extends ICurrentStation {
    boardMissionId: string;
}

const CurrentStationComponent = ({boardMissionId, actionName, machineName}: IProps) => {
    const {
        handleClick,
        handleClose,
        anchorEl,
        open,
        boardMissionsStations,
        onUpdateCurrentStation,
        onUpdateToNextStation
    } = useCurrentStation();
    const {classes} = useStyle();
    return (
        <div>
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} borderRadius={'10px'} width={"fit-content"} display={'inline-flex'} overflow={'hidden'}>
                <Button sx={classes.currentStationBtn} variant={'contained'}
                        onClick={(e) => handleClick(e, boardMissionId)}>
                    <span>{actionName ? actionName : machineName}</span>
                </Button>
                <Button sx={classes.currentStationBtn} variant={'contained'}
                        onClick={() => onUpdateToNextStation(boardMissionId)}>
                    <KeyboardArrowDownIcon/>
                </Button>
            </Stack>
            <Menu anchorEl={anchorEl}
                  open={open && boardMissionsStations?.length > 0}
                  onClose={handleClose}>
                {
                    boardMissionsStations?.map(station => <MenuItem
                        onClick={() => onUpdateCurrentStation(boardMissionId, station.id)}>{station.actionName}</MenuItem>)
                }
            </Menu>
        </div>
    )
}

export {CurrentStationComponent}