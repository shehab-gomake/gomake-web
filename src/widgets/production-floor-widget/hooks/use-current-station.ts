import {useGomakeAxios} from "@/hooks";
import {
    getBoardMissionsActions,
    updateBoardMissionCurrentStationApi
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useState} from "react";
import {IBoardMissionStation} from "@/widgets/production-floor-widget/interface";
import {useTranslation} from "react-i18next";

const useCurrentStation = () => {
    const {callApi} = useGomakeAxios();
    const [boardMissionsStations, setBoardMissionsStations] = useState<IBoardMissionStation[]>([])
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const {t} = useTranslation();
    const getActions = async (boardMissionId: string) => {const callBack = (res) => {
            if (res.success) {
                setBoardMissionsStations(res?.data);
            }
        }
        await getBoardMissionsActions(callApi, callBack, boardMissionId);
    }
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>, boardId: string) => {
        setAnchorEl(event.currentTarget);
        await getActions(boardId)
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onUpdateCurrentStation = async (boardMissionId: string, stationId: string) => {
        await updateBoardMissionCurrentStationApi(callApi, () => {}, {boardId: boardMissionId, stationId: stationId});
    }

    const onUpdateToNextStation = async (boardMissionId: string) => {
        await updateBoardMissionCurrentStationApi(callApi, () => {}, {boardId: boardMissionId, stationId: null});
    }

    return {
        anchorEl,
        open,
        handleClose,
        handleClick,
        t,
        boardMissionsStations,
        onUpdateCurrentStation,
        onUpdateToNextStation
    }
}
export {useCurrentStation}