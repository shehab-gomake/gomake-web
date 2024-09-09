import { Button, ButtonGroup, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { ICurrentStation } from "@/widgets/production-floor/interfaces/current-station";
import { useStyle } from "@/widgets/production-floor/table-view/style";
import Stack from "@mui/material/Stack";
import {
    useCurrentStation
} from "@/widgets/production-floor/table-view/status-table/current-station/use-current-station";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useRecoilState } from "recoil";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { boardsMissionsState } from "@/widgets/production-floor/state/boards";

interface IProps extends ICurrentStation {
    boardMissionId: string;
    status?: any;
}

const CurrentStationComponent = ({ boardMissionId, machineName, actionName, productType, id, status }: IProps) => {
    const { classes } = useStyle();
    const {
        handleClick,
        handleClose,
        anchorEl,
        open,
        boardMissionsStations,
        onUpdateCurrentStation,
        onUpdateToNextStation,
        canMoveStation,
        dir
    } = useCurrentStation();
    const [data, setData] = useRecoilState<IStatusesBoardsMissions[]>(boardsMissionsState);

    const handleRemoveBoardMission = (statusKey, boardMissionId) => {
        setData((prevData) => {
            return prevData.map((item) => {
                if (item.boardMissionStatus?.boardMissionStatus?.key === statusKey) {
                    const updatedBoardMissions = item.boardMissions.filter(
                        (mission) => mission.id !== boardMissionId
                    );
                    return {
                        ...item,
                        boardMissions: updatedBoardMissions,
                    };
                }
                return item;
            });
        });
    };



    return (
        <div>
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} borderRadius={'10px'}
                width={"fit-content"} display={'inline-flex'} overflow={'hidden'}>
                <ButtonGroup>
                    <Button sx={classes.currentStationBtn} variant={'contained'}
                        disabled={!canMoveStation}
                        onClick={(e) => handleClick(e, boardMissionId, productType)}>
                        <span>{machineName ? machineName : actionName}</span>
                    </Button>
                    <PermissionCheck userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}>
                        <Button sx={classes.currentStationBtn} variant={'contained'}
                            onClick={() => {
                                handleRemoveBoardMission(status?.key, boardMissionId)
                                onUpdateToNextStation(boardMissionId, productType)
                            }}>
                            {dir === "ltr" ? <KeyboardArrowDownIcon /> : <KeyboardArrowLeftIcon />}
                        </Button>
                    </PermissionCheck>
                </ButtonGroup>
            </Stack>
            <Menu anchorEl={anchorEl}
                open={open && boardMissionsStations?.length > 0}
                onClose={handleClose}>
                {
                    boardMissionsStations?.filter(s => s.id !== id)?.map(station => <MenuItem
                        onClick={() => onUpdateCurrentStation(boardMissionId, station.id, productType)}>{station.actionName}</MenuItem>)
                }
            </Menu>
        </div>
    )
}

export { CurrentStationComponent }