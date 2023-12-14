import {useRecoilValue, useResetRecoilState, useSetRecoilState} from "recoil";
import {boardMissionsState} from "@/widgets/board-mission-widget/state/board-missions-state";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {useGomakeAxios} from "@/hooks";
import {getBoardMissionsById} from "@/services/api-service/production-floor/production-floor-endpoints";
import {boarMissionsCurViewState} from "@/widgets/board-mission-widget/state/boar-missions-cur-view-state";
import {ICallBack} from "@/services/api-service/interface";
import {IBoardMissions} from "@/widgets/board-mission-widget/interface";

const useBoardMissionsData = () => {
    const {query} = useRouter();
    const boardMissionId = query?.boardMissionId;
    const {callApi} = useGomakeAxios();
    const setBoardMissions = useSetRecoilState(boardMissionsState);
    const boardMissions = useRecoilValue(boardMissionsState);
    const initBoardMissionState = useResetRecoilState(boardMissionsState);
    const initBoardMissionCueView = useResetRecoilState(boarMissionsCurViewState)

    const getBoardMissions = async () => {
        const callBack: ICallBack<IBoardMissions> = (res) => {
            if (res.success) {
                setBoardMissions(res.data)
            }
        }
        await getBoardMissionsById(callApi, callBack, boardMissionId?.toString());
    }
    useEffect(() => {
        if (boardMissionId) {
            getBoardMissions().then();
        }
        return () => {
            initBoardMissionState();
            initBoardMissionCueView();
        };
    }, [boardMissionId])

    useEffect(() => {
        console.log('bord', boardMissions);
    }, [boardMissions])

    return {}
}

export {useBoardMissionsData}