import { Button } from "@mui/material";
import { ICurrentStation } from "@/widgets/production-floor/interfaces/current-station";
import { useStyle } from "@/widgets/production-floor/table-view/style";
import Stack from "@mui/material/Stack";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useSetRecoilState } from "recoil";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { boardsMissionsState } from "@/widgets/production-floor/state/boards";
import { RightArrowIcon } from "../table-row/more-circle/icons/right-arrow";
import { LeftArrowIcon } from "../table-row/more-circle/icons/left-arrow-icon";
import { INextStation } from "@/widgets/production-floor/interfaces/next-station";
import { useStations } from "./use-stations";

interface IProps extends ICurrentStation, INextStation {
    boardMissionId: string;
    status?: any;
    textColor?: string;
}

const NextStationComponent = ({ boardMissionId, textColor, productType, status, nextStationName, nextStationId }: IProps) => {
    const { classes } = useStyle({ textColor });
    const { onUpdateToNextStation, dir } = useStations();
    const setData = useSetRecoilState<IStatusesBoardsMissions[]>(boardsMissionsState);

    // use Also for done button in more circle
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
        <Stack direction="row" justifyContent={'center'} alignItems={'center'}>
            {/* <Stack > */}
            <PermissionCheck userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}>
                {nextStationId && <Button
                    sx={classes.moveToBtn}
                    onClick={() => {
                        handleRemoveBoardMission(status?.key, boardMissionId);
                        onUpdateToNextStation(boardMissionId, productType);
                    }}>
                    <span style={classes.actionText}>{nextStationName}</span>
                    {dir === "ltr" ? <RightArrowIcon /> : <LeftArrowIcon />}
                </Button>}
            </PermissionCheck>
        </Stack>
    )
}

export { NextStationComponent }