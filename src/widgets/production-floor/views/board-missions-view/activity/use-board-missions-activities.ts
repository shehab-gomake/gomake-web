import {useGomakeAxios} from "@/hooks";
import {
    addBoardMissionsComment,
    getAllBoardMissionsActivities
} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useRouter} from "next/router";
import {useRecoilState} from "recoil";
import {boardMissionsActivitiesState} from "@/widgets/production-floor/state/board-missions-activities";
import { useMemo, useState} from "react";
import {EActivityType} from "@/widgets/production-floor/enums/activity-type";
import {IBoardMissionsActivity} from "@/widgets/production-floor/interfaces/board-missions-activity";

enum EActivitiesFilter {
    ALL = 1,
    COMMENTS,
    LOGS
}
const useBoardMissionsActivities = () => {
    const [activitiesState, setActivities] = useRecoilState(boardMissionsActivitiesState);
    const [filter, setFilter] = useState<EActivitiesFilter>(EActivitiesFilter.ALL);
    const [addActivityLoader, setAddActivityLoader] = useState<boolean>(false);
    const {callApi} = useGomakeAxios();
    const {query} = useRouter();
    const {boardMissionsId, step, productType} = query;
    const getAllActivities = async () => {
        const callBack = (res) => {
            if (res.success) {
                setActivities(res.data);
            }
        }
        await getAllBoardMissionsActivities(callApi, callBack, boardMissionsId)
    }

    const addComment = (comment: string) => {
        setAddActivityLoader(true)
        const callBack = res => {
            setAddActivityLoader(false);
            if (!res.success) {
            }
        }
        addBoardMissionsComment(callApi, callBack, {comment, boardMissionId: boardMissionsId, productType}).then();
    }

    const filtersButtonsArray = useMemo(() => [
        {
            name: 'productionFloor.all',
            onClick: () => setFilter(EActivitiesFilter.ALL),
            selected: filter === EActivitiesFilter.ALL
        },
        {
            name: 'productionFloor.comments',
            onClick: () => setFilter(EActivitiesFilter.COMMENTS),
            selected: filter === EActivitiesFilter.COMMENTS
        },
        {
            name: 'productionFloor.logs',
            onClick: () => setFilter(EActivitiesFilter.LOGS),
            selected: filter === EActivitiesFilter.LOGS
        },
    ], [filter]);

    const activitiesList: IBoardMissionsActivity[] = useMemo(() => {
        switch (filter) {
            case EActivitiesFilter.COMMENTS:
                return activitiesState?.filter(activity => activity.activityType === EActivityType.COMMENT);
            case EActivitiesFilter.LOGS:
                return activitiesState?.filter(activity => activity.activityType === EActivityType.LOG);
            default:
                return activitiesState;
        }
    }, [filter, activitiesState]);


    return {
        getAllActivities,
        addComment,
        step,
        boardMissionsId,
        filtersButtonsArray,
        activitiesList,
        addActivityLoader
    }
}

export {useBoardMissionsActivities}