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
import { RightArrowIcon } from "../table-row/more-circle/icons/right-arrow";
import { LeftArrowIcon } from "../table-row/more-circle/icons/left-arrow-icon";
import { DownArrowIcon } from "../table-row/more-circle/icons/down-arrow";
import { UpArrowIcon } from "../table-row/more-circle/icons/up-arrow";
import { INextStation } from "@/widgets/production-floor/interfaces/next-station";
import { FONT_FAMILY } from "@/utils/font-family";

interface IProps extends ICurrentStation , INextStation {
    boardMissionId: string;
    status?: any;
}
// here...
const CurrentStationComponent = ({ boardMissionId, machineName, actionName, productType, id, status , nextStationName , nextStationId}: IProps) => {
    const { classes } = useStyle();
    const {
        t,
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
            <Stack direction="row" spacing={1} justifyContent={'center'} alignItems={'center'} width={"fit-content"} display={'inline-flex'} overflow={'hidden'}>
                <Button sx={classes.currentStationBtn} variant={'contained'}
                    disabled={!canMoveStation}
                    onClick={(e) => handleClick(e, boardMissionId, productType)}>
                    <span>{machineName ? machineName : actionName}</span>
                    {anchorEl ? <UpArrowIcon /> :  <DownArrowIcon /> }
                </Button>
                <PermissionCheck userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}>
                    {nextStationId && <Button
                        sx={classes.moveToBtn}
                        onClick={() => {
                            handleRemoveBoardMission(status?.key, boardMissionId);
                            onUpdateToNextStation(boardMissionId, productType);
                        }}>
                        <span style={classes.moveToText}>{t("productionFloor.moveTo")}</span>
                        <span style={classes.actionText}>{nextStationName}</span>
                        {dir === "ltr" ? <RightArrowIcon /> : <LeftArrowIcon />}
                    </Button>}
                </PermissionCheck>
            </Stack>
            <Menu
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                PaperProps={{
                    style: {
                        borderRadius: "8px",
                        border: "1px solid #EAECF0",
                        boxShadow: "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
                        color:"black",
                        ...FONT_FAMILY.Inter(600,14)
                    },
                }}
                anchorEl={anchorEl}
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