import {atom} from "recoil";
import {IBoardMissions} from "@/widgets/board-mission-widget/interface";

export const boardMissionsState = atom<IBoardMissions>({
    key: 'boardMissionsState',
    default: {
        boardMissionId: '',
        boardMissionNumber: '',
        orderId: '',
        orderNumber: '',
        clientName: '',
        clientId: '',
        productName: '',
        productId: '',
        agentName: '',
        currentBoardMissionActionId: '',
        currentActionName: '',
        statusId: '',
        imageUrl: '',
        tags: '',
        generalDetails: '',
        missionActions: [],
        activities: '',
    }
});
