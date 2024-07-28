import { useGomakeAxios } from "@/hooks";
import {
    getBoardMissionsActions,
    updateBoardMissionCurrentStationApi
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IBoardMissionStation } from "@/widgets/production-floor/interfaces/board-missions-station";
import { useProductionFloorData } from "@/widgets/production-floor/use-production-floor-data";
import { useUserPermission } from '@/hooks/use-permission';
import { Permissions } from "@/components/CheckPermission/enum";

const useCurrentStation = () => {
    const { callApi } = useGomakeAxios();
    const [boardMissionsStations, setBoardMissionsStations] = useState<IBoardMissionStation[]>([])
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const { getData } = useProductionFloorData();
    const { CheckPermission } = useUserPermission();
    const canMoveStation = CheckPermission(Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR);

    const getActions = async (boardMissionId: string, productType) => {
        const callBack = (res) => {
            if (res.success) {
                setBoardMissionsStations(res?.data);
            }
        }
        await getBoardMissionsActions(callApi, callBack, { boardMissionId, productType: productType });
    }
    
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>, boardId: string, productType: string) => {
        if (canMoveStation) {
            setAnchorEl(event.currentTarget);
            await getActions(boardId, productType)
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onUpdateCurrentStation = async (boardMissionId: string, stationId: string, productType: string) => {
        await updateBoardMissionCurrentStationApi(callApi, (res) => {
            res.success && getData().then();
        }, { boardId: boardMissionId, stationId: stationId, productType });
    }

    const onUpdateToNextStation = async (boardMissionId: string, productType: string) => {
        await updateBoardMissionCurrentStationApi(callApi, (res) => {
            res.success && getData().then()
        }, { boardId: boardMissionId, stationId: null, productType });
    }

    return {
        anchorEl,
        open,
        handleClose,
        handleClick,
        t,
        dir,
        boardMissionsStations,
        onUpdateCurrentStation,
        onUpdateToNextStation,
        canMoveStation
    }
}
export { useCurrentStation }