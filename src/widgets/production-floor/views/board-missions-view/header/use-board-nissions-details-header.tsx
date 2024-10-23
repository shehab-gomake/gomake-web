import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import {
  boardMissionsDetailsState,
  boardsMissionsState,
  productionFloorStatusesState,
} from "@/widgets/production-floor/state/boards";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { updateBoardsMissionsStatusApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";

const useBoardMissionsDetailsHeader = () => {
  const [boardFromTable, setBoardFromTable] = useState<IBoardMissions>(
    {} as IBoardMissions
  );
  const [boardMissionsDetails, setBoardMissionsDetails] = useRecoilState(
    boardMissionsDetailsState
  );
  const boards = useRecoilValue(boardsMissionsState);
  const [data, setData] =
    useRecoilState<IStatusesBoardsMissions[]>(boardsMissionsState);
  const statuses = useRecoilValue(productionFloorStatusesState);
  const { callApi } = useGomakeAxios();
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const router = useRouter();
  const { pathname, query, push } = router;
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  const onNavigateBoardMissions = (boardId: string, productType: string) => {
    push(
      {
        pathname,
        query: { ...query, boardMissionsId: boardId, productType },
      },
      undefined,
      { shallow: true }
    ).then();
  };

  const handleStatusChange = async (id: string, newStatusId: string) => {
    setIsLoadingStatus(true);

    try {
      const boardsIds = [boardFromTable].filter(
        (b) => b.statusId !== newStatusId
      );
      const newStatus = statuses.find((status) => status.id === newStatusId);

      const callBack = (res) => {
        setIsLoadingStatus(false);
        if (res.success) {
          alertSuccessUpdate();
          setBoardMissionsDetails((prevDetails) => ({
            ...prevDetails,
            boardMissionStatus: newStatus || prevDetails?.boardMissionStatus,
          }));
          setData(
            data?.map((status) => {
              if (
                status.boardMissionStatus?.boardMissionStatus?.id ===
                newStatusId
              ) {
                return {
                  ...status,
                  boardMissions: [
                    ...status.boardMissions,
                    ...boardsIds?.map((b) => ({
                      ...b,
                      statusId: status.boardMissionStatus.boardMissionStatus.id,
                    })),
                  ],
                };
              } else {
                return {
                  ...status,
                  boardMissions: status.boardMissions.filter(
                    (b) =>
                      !!!boardsIds.find(
                        (bs) =>
                          b.id === bs.id && b.productType === bs.productType
                      )
                  ),
                };
              }
            })
          );
        } else {
          setIsLoadingStatus(false);
          alertFaultUpdate();
        }
      };

      await updateBoardsMissionsStatusApi(callApi, callBack, {
        boardsIds: boardsIds.map((b) => ({
          BoardMissionId: b.id,
          productType: b.productType,
        })),
        statusId: newStatusId,
      });
    } catch (error) {
      alertFaultUpdate();
    }
  };

  return {
    boards,
    boardFromTable,
    setBoardFromTable,
    boardMissionsDetails,
    setBoardMissionsDetails,
    onNavigateBoardMissions,
    handleStatusChange,
    isLoadingStatus,
  };
};

export { useBoardMissionsDetailsHeader };
