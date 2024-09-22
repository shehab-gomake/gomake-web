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
import { GoMakeDeleteModal } from "@/components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps extends ICurrentStation, INextStation {
    boardMissionId: string;
    status?: any;
    textColor?: string;
}

const NextStationComponent = ({ boardMissionId, textColor, productType, status, nextStationName, nextStationId }: IProps) => {
    const { t } = useTranslation()
    const { classes } = useStyle({ textColor });
    const { onUpdateToNextStation, dir } = useStations();
    const setData = useSetRecoilState<IStatusesBoardsMissions[]>(boardsMissionsState);
    const [openModal, setOpenMpdal] = useState(false)

    const onClickOpenModal = () => {
        setOpenMpdal(true)
    }
    const onClickCloseModal = () => {
        setOpenMpdal(false)
    }

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
            <PermissionCheck userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}>
                {nextStationId && <Button
                    sx={classes.moveToBtn}
                    onClick={onClickOpenModal}
                >
                    <span style={classes.actionText}>{nextStationName}</span>
                    {dir === "ltr" ? <RightArrowIcon /> : <LeftArrowIcon />}
                </Button>}
            </PermissionCheck>
            <GoMakeDeleteModal
                hideIcon={true}
                title={t("customers.modal.nextStationModalTitle")}
                yesBtn={t("sales.quote.yesBtn")}
                cancelBtn={t("modal.no")}
                openModal={openModal}
                onClose={onClickCloseModal}
                onClickDelete={() => {
                    handleRemoveBoardMission(status?.key, boardMissionId);
                    onUpdateToNextStation(boardMissionId, productType);
                }}
            />
        </Stack>
    )
}

export { NextStationComponent }