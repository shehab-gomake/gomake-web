import { useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import {
  boardMissionsDetailsState,
  boardsMissionsState,
  productionFloorStatusesState,
} from "@/widgets/production-floor/state/boards";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  toggleBoardMissionsActionTimer,
  updateBoardMissionStuckReasonApi,
  updateBoardsMissionsStatusApi,
  sendJobExampleConfirmationToClientApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { boardMissionsStationsState } from "../stations/state";
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";
import { useFrontDeskEmailIntegration } from "@/pages-components/quotes/hooks/use-frontdesk-email-integration";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

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
  const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);
  const {
    isEmailComposerOpen: isEmailComposerOpenApproval,
    emailData: emailDataApproval,
    openEmailComposer: openEmailComposerApproval,
    closeEmailComposer: closeEmailComposerApproval,
    isLoadingEmailData: isLoadingEmailDataApproval,
  } = useFrontDeskEmailIntegration({
    documentType: 21 as DOCUMENT_TYPE,
  });
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [openSimpleApproveModal, setOpenSimpleApproveModal] = useState<boolean>(false);
  const [openSimpleStuckModal, setOpenStuckModal] = useState<boolean>(false);
  const [stuckReason, setStuckReason] = useState<string>("");
  const handleCloseStuckModal = () => {
    setOpenStuckModal(false);
    setStuckReason("");
  }
  const handleCloseApproveModal = () => {
    setOpenSimpleApproveModal(false);
  }
  const handleConfirmApprove = async () => {
    const boardMissionId = boardMissionsDetails?.boardMissionId;
    if (!boardMissionId) {
      setOpenSimpleApproveModal(false);
      return;
    }

    // If FrontDesk feature is enabled, open email composer instead of sending directly
    if (hasFrontDeskFeature) {
      openEmailComposerApproval(boardMissionId);
      setOpenSimpleApproveModal(false);
    } else {
      // Fallback to direct API call if FrontDesk is not enabled
      const callBack = (res) => {
        if (res.success) {
          alertSuccessUpdate();
        } else {
          alertFaultUpdate();
        }
        setOpenSimpleApproveModal(false);
      };
      await sendJobExampleConfirmationToClientApi(callApi, callBack, {
        boardMissionId,
        productType: boardMissionsDetails?.productType || "",
      });
    }
  }
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

  // This condition ( boardsIds?.length && !boardsIds ) ensures that if we open the Board Mission from the Job or from the Search,
  // the `boardsIds` array will be undefined. To handle this scenario, we provide a fallback
  const handleStatusChange = async (id: string, newStatusId: string, productType: string) => {
    setIsLoadingStatus(true);
    try {
      const newStatus = statuses.find((status) => status.id === newStatusId);
      const boardsIds = [boardFromTable].filter(
        (b) => b?.statusId !== newStatusId
      );
      const callBack = (res) => {
        setIsLoadingStatus(false);
        if (res.success) {
          alertSuccessUpdate();
          setBoardMissionsDetails((prevDetails) => ({
            ...prevDetails,
            boardMissionStatus: newStatus || prevDetails?.boardMissionStatus,
          }));

          if (boardsIds?.length && !boardsIds) {
            setData(
              data?.map((status) => {
                if (
                  status?.boardMissionStatus?.boardMissionStatus?.id ===
                  newStatusId
                ) {
                  return {
                    ...status,
                    boardMissions: [
                      ...status?.boardMissions,
                      ...boardsIds?.map((b) => ({
                        ...b,
                        statusId:
                          status?.boardMissionStatus?.boardMissionStatus?.id,
                      })),
                    ],
                  };
                } else {
                  return {
                    ...status,
                    boardMissions: status?.boardMissions?.filter(
                      (b) =>
                        !!!boardsIds?.find(
                          (bs) =>
                            b?.id === bs?.id &&
                            b?.productType === bs?.productType
                        )
                    ),
                  };
                }
              })
            );
          }
          if (newStatusId === "79251980-1c2d-4b4f-9ab4-9ccb9cb9fb63" && (boardMissionsDetails.isNeedExample || boardMissionsDetails.exampleType >= 0)) {
            setOpenSimpleApproveModal(true);
          }
          else if (newStatusId === "56dd1e80-7436-462c-82e9-cf8a90afd614") {
            setOpenStuckModal(true);
          }
        } else {
          setIsLoadingStatus(false);
          alertFaultUpdate();
        }
      };

      await updateBoardsMissionsStatusApi(callApi, callBack, {
        boardsIds:
          boardsIds?.length && !boardsIds
            ? boardsIds.map((b) => {
              return ({
                BoardMissionId: b?.id,
                productType: b?.productType,
              })
            })
            : [{ BoardMissionId: id, productType: productType ?? "" }],
        statusId: newStatusId,
      });
    } catch (error) {
      // alertFaultUpdate();
    }
  };

  const [stations, setStations] = useRecoilState(boardMissionsStationsState);

  const [timerLoading, setTimerLoading] = useState<boolean>(false);
  const onToggleTimer = async (seconds: number) => {
    setTimerLoading(true);
    const callBack = (res) => {
      setTimerLoading(false);
      setStations(
        stations.map((station) => {
          if (
            station.boardMissionActionId ==
            boardMissionsDetails?.currentBoardMissionActionId
          ) {
            const isTimerRunning = station.boardMissionActionTimer
              ? !station.boardMissionActionTimer.isTimerRunning
              : true;
            return {
              ...station,
              boardMissionActionTimer: {
                ...station.boardMissionActionTimer,
                isTimerRunning: isTimerRunning,
                totalRunningTime: seconds,
              },
            };
          }
          return { ...station };
        })
      );
      if (res.success) {
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    await toggleBoardMissionsActionTimer(callApi, callBack, {
      boardMissionsActionId: boardMissionsDetails?.currentBoardMissionActionId,
      productType: boardMissionsDetails.productType,
    });
  };

  const sortedStations = useMemo(
    () =>
      [...stations]
        ?.sort((a, b) => b?.index - a?.index)
        ?.sort((a, b) => (b?.isDone && a?.isDone ? 0 : a.isDone ? 1 : -1)),
    [stations]
  );

  const onUpdateStuckReason = async (
    stuckReason: string,
    boardMissionId: string,
    productType: string,
  ) => {
    await updateBoardMissionStuckReasonApi(
      callApi,
      (res) => {
        if (res?.success) {
        }
      },
      { boardMissionId, stuckReason, productType }
    );
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
    timerLoading,
    onToggleTimer,
    stations,
    setStations,
    sortedStations,
    openSimpleApproveModal,
    openSimpleStuckModal,
    stuckReason,
    setStuckReason,
    handleCloseStuckModal,
    handleCloseApproveModal,
    handleConfirmApprove,
    onUpdateStuckReason,
    isEmailComposerOpenApproval,
    emailDataApproval,
    closeEmailComposerApproval,
    isLoadingEmailDataApproval,
  };
};

export { useBoardMissionsDetailsHeader };
