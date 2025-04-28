import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  getProductionFloorData,
  moveBoardMissionToDoneApi,
  updateBoardsMissionsOrderApi,
  updateBoardsMissionsStatusApi,
  tryMoveBoardMissionToDoneApi,
  updateJobDueDateApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useRecoilState, useRecoilValue,useSetRecoilState } from "recoil";
import {
  productionFloorAbortControllerState,
  productionFloorFiltersState
} from "@/widgets/production-floor/state/production-floor-filters";
import {
  boardsMissionsState,
  jobsStatusesState,
} from "@/widgets/production-floor/state/boards";
import { tagsState } from "@/widgets/production-floor/state/tags";
import { userProductionFloorGroupsState } from "@/widgets/production-floor/state/production-floor-groups-state";
import { productionFloorPathsState } from "@/widgets/production-floor/state/production-floor-paths";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { useTranslation } from "react-i18next";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { useState } from "react";
import { getBoardMissionPDF } from "@/services/api-service/generic-doc/documents-api";
import { IFilterGroupsList } from "./interfaces/borad-missions-filter-groups";
import {
  getAllBoardMissionStationFilterGroupsApi,
  getJobsByGroups,
} from "@/services/api-service/board-missions/board-mission-station-filter-groups";
import { filterGroupsState, selectedGroupIdState } from "./state/filter-group";
import {
  EProductionFloorView,
  productionFloorViewState,
} from "@/widgets/production-floor/state/production-floor-view";
import { useRouter } from "next/router";
import { formatDate } from "tough-cookie";
import moment from "moment";
import { IProductionFloorFilter } from "@/widgets/production-floor/interfaces/filters";
import { agentsState } from "@/store/agents-state";

const useProductionFloorData = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const { callApi } = useGomakeAxios();
  const { push } = useRouter();
  const setAgents = useSetRecoilState(agentsState);
  const [data, setData] =
    useRecoilState<IStatusesBoardsMissions[]>(boardsMissionsState);
  const [abortController, setAbortController] = useRecoilState(productionFloorAbortControllerState);
  const [filtersState, setFilters] = useRecoilState(productionFloorFiltersState);
  const [, setTags] = useRecoilState(tagsState);
  const [, setUserGroups] = useRecoilState(userProductionFloorGroupsState);
  const [, setPath] = useRecoilState(productionFloorPathsState);
  const [, setJobsStatuses] = useRecoilState(jobsStatusesState);
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const [selectedGroupId, setSelectedGroupId] = useRecoilState<string | null>(
    selectedGroupIdState
  );

  const view = useRecoilValue(productionFloorViewState);

  const getData = async (connectionId?: string) => {
    if (view === EProductionFloorView.FILTER_GROUPS) {
      getDataByGroups(connectionId, filtersState).then();
      return;
    }
    const callBack = (res) => {
      if (res.success) {
        setData(res?.data?.boardMissionsCollections);
        setFilters(res?.data?.filter);
        setSelectedGroupId(res?.data?.filter?.groupId);
        setTags(res?.data?.automatedTagsFilter);
        setUserGroups(res?.data?.groups);
        setPath(res?.data?.path ? res?.data?.path : []);

        const agentIdsFromServer = res?.data?.filter?.agentIds || [];
        setAgents((prevAgents) =>
          prevAgents.map((agent) => ({
            ...agent,
            checked: agentIdsFromServer.includes(agent.id),
          }))
        );
      }
    };
    if (abortController) {
      abortController.abort();
    }
    const newRequestAbortController = new AbortController();
    setAbortController(newRequestAbortController);
    return await getProductionFloorData(
      callApi,
      callBack,
      {
        connectionId: connectionId,
        // filters:filtersState,
      },
      false, 
      newRequestAbortController
    );
  };

  const getDataByGroups = async (
    connectionId?: string,
    currentFilters?: IProductionFloorFilter,
    clearData?: boolean,
    isFirstLoad?:boolean
  ) => {
    if (clearData) {
      setData([]);
      setJobsStatuses([]);
    }
    if (abortController) {
      abortController.abort();
    }
    if(!currentFilters){
      currentFilters = filtersState;
    }
    const newRequestAbortController = new AbortController();
    setAbortController(newRequestAbortController);
    const callBack = (res) => {
      if (res.success) {
        setData(res?.data?.boardMissionsCollections);
        setFilters(res?.data?.filter);
        const agentIdsFromServer = res?.data?.filter?.agentIds || [];
        setAgents((prevAgents) =>
            prevAgents.map((agent) => ({
              ...agent,
              checked: agentIdsFromServer.includes(agent.id),
            }))
        );
        setJobsStatuses(res?.data?.boardMissionStatuses);
        setSelectedGroupId("all");
        setTags(res?.data?.automatedTagsFilter);
        setUserGroups(res?.data?.groups);
        setPath(res?.data?.path ? res?.data?.path : []);
        if(filterGroups && filterGroups.length > 0) {
          setFilterGroups(
              filterGroups.map((x) =>
                  x.id === "all"
                      ? {
                        ...x,
                        stuckCount: res?.data?.boradMisstionsStuckCount,
                        inProcessCount: res?.data?.boradMisstionsNotStuckCount,
                      }
                      : x
              )
          );
        }
        
        //alertSuccessGetData();
      }
    };
    await getJobsByGroups(callApi, callBack, {connectionId:connectionId,filters:currentFilters}, false, newRequestAbortController);
  };
  const updateStatus = async (boards: IBoardMissions[], statusId: string) => {
    const boardsIds = boards?.filter((b) => b.statusId !== statusId);

    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        if (selectedGroupId === "all") {
          setData(
            data?.map((status) => {
              const statusJobs = status.boardMissions.filter(
                (b) =>
                  !!!boardsIds.find(
                    (bs) => b.id === bs.id && b.productType === bs.productType
                  )
              );
              return {
                ...status,
                boardMissions: [
                  ...statusJobs,
                  ...boardsIds?.map((b) => ({
                    ...b,
                    statusId: statusId,
                  })),
                ],
              };
            })
          );
          return;
        }
        setData(
          data?.map((status) => {
            if (
              status.boardMissionStatus?.boardMissionStatus?.id === statusId
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
                      (bs) => b.id === bs.id && b.productType === bs.productType
                    )
                ),
              };
            }
          })
        );
      } else {
        alertFaultUpdate();
      }
    };
    await updateBoardsMissionsStatusApi(callApi, callBack, {
      boardsIds: boardsIds?.map((b) => ({
        BoardMissionId: b.id,
        productType: b.productType,
      })),
      statusId,
    });
  };

  const updateBoardMissionsOrder = async (payload) => {
    const callBack = (res) => {
      if (res.success) {
        const updatedBoards: {
          id: string;
          productType: string;
          priority: number;
        }[] = res?.data;
        alertSuccessUpdate();
        setData(
          data.map((s) =>
            s.boardMissionStatus.boardMissionStatus.id === payload.statusId
              ? {
                  ...s,
                  boardMissions: s.boardMissions?.map((board) => {
                    const match = updatedBoards?.find(
                      (updatedBoard) => updatedBoard.id === board.id
                    );
                    if (match) {
                      return {
                        ...board,
                        priority: match.priority,
                      };
                    }
                    return board;
                  }),
                }
              : s
          )
        );
      } else {
        alertFaultUpdate();
      }
    };
    await updateBoardsMissionsOrderApi(callApi, callBack, payload);
  };

  const [, setSelectedMissionId] = useState<any>(null);
  const [openMarkReadyModal, setOpenMarkReadyModal] = useState<boolean>(false);

  const onCloseMarkReadyModal = () => {
    setSelectedMissionId(null);
    setOpenMarkReadyModal(false);
  };

  const tryMoveBoardMissionsToDone = async (boardMission) => {
    setSelectedMission(boardMission);
    const callBack = (res) => {
      if (res.success) {
        if (res.data) {
          alertSuccessUpdate();
          setOpenPackagesModal(true);
        } else {
          onOpenMarkReadyModal(boardMission.id);
        }
      } else {
        alertFaultUpdate();
      }
    };

    await tryMoveBoardMissionToDoneApi(callApi, callBack, {
      boardMissionId: boardMission.id,
    });
  };

  const onOpenMarkReadyModal = (missionId) => {
    setOpenMarkReadyModal(true);
  };

  const handleRemoveBoardMission = (boardMissionId) => {
    setData((prevData) => {
      return prevData.map((item) => {
        if (Array.isArray(item.boardMissions)) {
          const updatedBoardMissions = item.boardMissions?.filter(
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

  const onClickMoveBoardMissionToDone = async (sendMessage: boolean) => {
    const callBack = (res) => {
      setOpenMarkReadyModal(false);
      if (res?.success) {
        alertSuccessUpdate();
        setOpenPackagesModal(true);
        // handleRemoveBoardMission(selectedMissionId);
      } else {
        alertFaultUpdate();
      }
    };
    await moveBoardMissionToDoneApi(callApi, callBack, {
      boardMissionId: selectedMission.id,
      sendMessage,
      productType: selectedMission.productType ?? "",
    });
  };

  const downloadPdf = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.addEventListener("click", () => {
      setTimeout(() => {
        anchor.remove();
      }, 100);
    });
    anchor.click();
  };

  const onClickPrintJob = async (boardMissionId) => {
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
      } else {
      }
    };
    await getBoardMissionPDF(callApi, callBack, {
      boardMissionId: boardMissionId?.id,
    });
  };

  const [selectedMission, setSelectedMission] = useState<any>({});
  const [openPackagesModal, setOpenPackagesModal] = useState<boolean>(false);

  const onOpenPrintDeliverTicketModal = (mission) => {
    setSelectedMission(mission);
    setOpenPackagesModal(true);
  };

  const onClosePrintDeliverTicketModal = () => {
    handleRemoveBoardMission(selectedMission.id);
    setSelectedMission({});
    setOpenPackagesModal(false);
  };

  const [filterGroups, setFilterGroups] =
    useRecoilState<IFilterGroupsList[]>(filterGroupsState);
  const getStationFilterGroups = async () => {
    const callBack = (res) => {
      if (res.success) {
        const filterGroupsList: IFilterGroupsList[] = res?.data?.map(
          (group) => ({
            id: group?.id,
            name: group?.name,
            color: group?.color || "#7355de",
            stuckCount: group?.stuckCount,
            inProcessCount: group?.inProcessCount,
          })
        );
        let inProcessSum = filterGroupsList.reduce(
          (accumulator, currentValue) => {
            return accumulator + (currentValue.inProcessCount ?? 0);
          },
          0
        );
        let stuckSum = filterGroupsList.reduce((accumulator, currentValue) => {
          return accumulator + (currentValue.stuckCount ?? 0);
        }, 0);
        const allGroupViewFilter: IFilterGroupsList = {
          id: "all",
          name: t("productionFloor.allFilterGroupsViewName"),
          color: "#7355de",
          stuckCount: stuckSum,
          inProcessCount: inProcessSum,
        };
        setFilterGroups([allGroupViewFilter, ...filterGroupsList]);
      }
    };
    await getAllBoardMissionStationFilterGroupsApi(callApi, callBack).then();
  };

  const handleOpenQRScanner = () => {
    push(`/qr-scanner`);
  };
  const updateJobDueDate = (boardMisionId, dueDate) => {
    let utcDueDate = new Date(dueDate).toUTCString();
    let mom = moment(dueDate);
    let formattedDueDate = mom.utc().format("YYYY-MM-DD HH:mm:ss");
    setData(
      data.map((status) =>
        status.boardMissions.find((b) => b.id === boardMisionId)
          ? {
              ...status,
              boardMissions: status.boardMissions.map((bm) =>
                bm.id === boardMisionId
                  ? { ...bm, dueDate: formattedDueDate }
                  : bm
              ),
            }
          : status
      )
    );
    const callBack = () => {};
    updateJobDueDateApi(callApi, callBack, {
      boardMissionId: boardMisionId,
      dueDate: utcDueDate,
    }).then();
  };
  return {
    t,
    RTL,
    getData,
    updateStatus,
    setData,
    updateBoardMissionsOrder,
    onCloseMarkReadyModal,
    onOpenMarkReadyModal,
    openMarkReadyModal,
    setOpenMarkReadyModal,
    onClickMoveBoardMissionToDone,
    onClickPrintJob,
    openPackagesModal,
    onClosePrintDeliverTicketModal,
    onOpenPrintDeliverTicketModal,
    selectedMission,
    filterGroups,
    setFilterGroups,
    getStationFilterGroups,
    tryMoveBoardMissionsToDone,
    getDataByGroups,
    setSelectedGroupId,
    handleOpenQRScanner,
    updateJobDueDate,
  };
};

export { useProductionFloorData };
