import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  addBoardMissionsComment,
  getAllBoardMissionsActivities,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { boardMissionsActivitiesState } from "@/widgets/production-floor/state/board-missions-activities";
import { useMemo, useState } from "react";
import { EActivityType } from "@/widgets/production-floor/enums/activity-type";
import { IBoardMissionsActivity } from "@/widgets/production-floor/interfaces/board-missions-activity";

enum EActivitiesFilter {
  ALL = 1,
  COMMENTS,
  LOGS,
  REPORTS,
}
const useBoardMissionsActivities = () => {
  const [activitiesState, setActivities] = useRecoilState(
    boardMissionsActivitiesState
  );
  const [filter, setFilter] = useState<EActivitiesFilter>(
    EActivitiesFilter.ALL
  );
  const [addActivityLoader, setAddActivityLoader] = useState<boolean>(false);
  const { callApi } = useGomakeAxios();
  const { query } = useRouter();
  const {
    alertSuccessAdded,
    alertFaultAdded,
    alertSuccessGetData,
    alertFaultGetData,
  } = useSnackBar();
  const [abortController, setAbortController] = useState(null);
  const { boardMissionsId, step, productType } = query;
  const getAllActivities = async () => {
    if (abortController) {
      abortController.abort();
    }
    const newRequestAbortController = new AbortController();
    setAbortController(newRequestAbortController);
    const callBack = (res) => {
      if (res.success) {
        if(res?.data&& (res?.data[0]?.boardMissionId !== boardMissionsId)){
          return;
        }
        alertSuccessGetData();
        setActivities(res.data);
      } else {
        alertFaultGetData();
      }
    };
    await getAllBoardMissionsActivities(callApi, callBack, boardMissionsId, false, newRequestAbortController);
  };

  const addComment = (comment: string) => {
    setAddActivityLoader(true);
    const callBack = (res) => {
      setAddActivityLoader(false);
      if (res.success) {
        alertSuccessAdded();
      } else {
        alertFaultAdded();
      }
    };
    addBoardMissionsComment(callApi, callBack, {
      comment,
      boardMissionId: boardMissionsId,
      productType,
    }).then();
  };

  const filtersButtonsArray = useMemo(
    () => [
      {
        name: "productionFloor.all",
        onClick: () => setFilter(EActivitiesFilter.ALL),
        selected: filter === EActivitiesFilter.ALL,
        borderColor: "#2E3092",
        textColor: "#2E3092",
      },
      {
        name: "productionFloor.comments",
        onClick: () => setFilter(EActivitiesFilter.COMMENTS),
        selected: filter === EActivitiesFilter.COMMENTS,
        borderColor: "#B2DDFF",
        textColor: "#175CD3",
      },
      {
        name: "productionFloor.logs",
        onClick: () => setFilter(EActivitiesFilter.LOGS),
        selected: filter === EActivitiesFilter.LOGS,
        borderColor: "#F9DBAF",
        textColor: "#B93815",
        bgColor: "#FEF6EE",
      },
      // {
      //   name: "Reports",
      //   onClick: () => setFilter(EActivitiesFilter.REPORTS),
      //   selected: filter === EActivitiesFilter.REPORTS,
      //   borderColor: "#FCCEEE",
      //   textColor: "#C11574",
      // },
    ],
    [filter]
  );

  const activitiesList: IBoardMissionsActivity[] = useMemo(() => {
    switch (filter) {
      case EActivitiesFilter.COMMENTS:
        return activitiesState?.filter(
          (activity) => activity.activityType === EActivityType.COMMENT
        );
      case EActivitiesFilter.LOGS:
        return activitiesState?.filter(
          (activity) => activity.activityType === EActivityType.LOG
        );
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
    addActivityLoader,
  };
};

export { useBoardMissionsActivities };
