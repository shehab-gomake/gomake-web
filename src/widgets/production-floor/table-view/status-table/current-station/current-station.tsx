import {Button, ButtonGroup, Menu, MenuItem} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowRight";
import {ICurrentStation} from "@/widgets/production-floor/interfaces/current-station";
import {useStyle} from "@/widgets/production-floor/table-view/style";
import Stack from "@mui/material/Stack";
import {
    useCurrentStation
} from "@/widgets/production-floor/table-view/status-table/current-station/use-current-station";

interface IProps extends ICurrentStation {
    boardMissionId: string;
}

const CurrentStationComponent = ({boardMissionId, machineName, actionName}: IProps) => {
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
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} borderRadius={'10px'}
                   width={"fit-content"} display={'inline-flex'} overflow={'hidden'}>
                <ButtonGroup>
                    <Button sx={classes.currentStationBtn} variant={'contained'}
                            onClick={(e) => handleClick(e, boardMissionId)}>
                        <span>{machineName ? machineName : actionName}</span>
                    </Button>
                    <Button sx={classes.currentStationBtn} variant={'contained'}
                            onClick={() => onUpdateToNextStation(boardMissionId)}>
                        <KeyboardArrowDownIcon/>
                    </Button>
                </ButtonGroup>
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