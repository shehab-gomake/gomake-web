import {useGomakeAxios} from "@/hooks";
import {
    addBoardMissionsComment,
    getAllBoardMissionsActivities
} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useRouter} from "next/router";
import {useRecoilState} from "recoil";
import {boardMissionsActivitiesState} from "@/widgets/production-floor/state/board-missions-activities";
import {useMemo, useState} from "react";
import {EActivityType} from "@/widgets/production-floor/enums/activity-type";

enum EActivitiesFilter {
    ALL = 1,
    COMMENTS,
    LOGS
}
const useBoardMissionsActivities = () => {
    const [activities, setActivities] = useRecoilState(boardMissionsActivitiesState);
    const [filter, setFilter] = useState<EActivitiesFilter>(EActivitiesFilter.ALL);
    const {callApi} = useGomakeAxios();
    const {query} = useRouter();
    const {boardMissionsId, step} = query;
    const getAllActivities = async () => {
        const callBack = (res) => {
            if (res.success) {
                setActivities(res.data);
            }
        }
        await getAllBoardMissionsActivities(callApi, callBack, boardMissionsId)
    }

    const addComment = (comment: string) => {
        const callBack = res => {
            if (!res.success) {

            }
        }
        addBoardMissionsComment(callApi, callBack, {comment, boardMissionId: boardMissionsId}).then();
    }

    const filtersButtonsArray = useMemo(() => [
        {
            name: 'all',
            onClick: () => setFilter(EActivitiesFilter.ALL),
            selected: filter === EActivitiesFilter.ALL
        },
        {
            name: 'comments',
            onClick: () => setFilter(EActivitiesFilter.COMMENTS),
            selected: filter === EActivitiesFilter.COMMENTS
        },
        {
            name: 'logs',
            onClick: () => setFilter(EActivitiesFilter.LOGS),
            selected: filter === EActivitiesFilter.LOGS
        },
    ], [filter]);

    const activitiesList = useMemo(() => {
        switch (filter) {
            case EActivitiesFilter.ALL:
                return activities;
            case EActivitiesFilter.COMMENTS:
                return activities?.filter(activity => activity.activityType === EActivityType.COMMENT);
            case EActivitiesFilter.LOGS:
                return activities?.filter(activity => activity.activityType === EActivityType.LOG);
        }
    }, [filter, activities]);

    return {
        getAllActivities,
        activities,
        addComment,
        step,
        boardMissionsId,
        filtersButtonsArray,
        activitiesList
    }
}

export {useBoardMissionsActivities}