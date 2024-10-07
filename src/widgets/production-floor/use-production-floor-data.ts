import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  getProductionFloorData,
  moveBoardMissionToDoneApi,
  updateBoardsMissionsOrderApi,
  updateBoardsMissionsStatusApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useRecoilState } from "recoil";
import { productionFloorFiltersState } from "@/widgets/production-floor/state/production-floor-filters";
import { boardsMissionsState } from "@/widgets/production-floor/state/boards";
import { tagsState } from "@/widgets/production-floor/state/tags";
import { userProductionFloorGroupsState } from "@/widgets/production-floor/state/production-floor-groups-state";
import { productionFloorPathsState } from "@/widgets/production-floor/state/production-floor-paths";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { useTranslation } from "react-i18next";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { useState } from "react";
import { getBoardMissionPDF } from "@/services/api-service/generic-doc/documents-api";
import { IFilterGroupsList } from "./interfaces/borad-missions-filter-groups";
import { getAllBoardMissionStationFilterGroupsApi } from "@/services/api-service/board-missions/board-mission-station-filter-groups";

const useProductionFloorData = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [data, setData] =
    useRecoilState<IStatusesBoardsMissions[]>(boardsMissionsState);
  const [abortController, setAbortController] = useState(null);
  const [, setFilters] = useRecoilState(productionFloorFiltersState);
  const [, setTags] = useRecoilState(tagsState);
  const [, setUserGroups] = useRecoilState(userProductionFloorGroupsState);
  const [, setPath] = useRecoilState(productionFloorPathsState);
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();

  const getData = async (connectionId?: string) => {
    const callBack = (res) => {
      if (res.success) {
        setData(res?.data?.boardMissionsCollections);
        setFilters(res?.data?.filter);
        setTags(res?.data?.automatedTagsFilter);
        setUserGroups(res?.data?.groups);
        setPath(res?.data?.path ? res?.data?.path : []);
        //alertSuccessGetData();
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
      connectionId,
      false,
      abortController
    );
  };

  const updateStatus = async (boards: IBoardMissions[], statusId: string) => {
    const boardsIds = boards?.filter((b) => b.statusId !== statusId);

    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
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

  const [selectedMissionId, setSelectedMissionId] = useState<any>(null);
  const [openMarkReadyModal, setOpenMarkReadyModal] = useState<boolean>(false);

  const onCloseMarkReadyModal = () => {
    setSelectedMissionId(null);
    setOpenMarkReadyModal(false);
  };

  const onOpenMarkReadyModal = (missionId) => {
    setSelectedMissionId(missionId);
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
      //setOpenPackagesModal(true)
      if (res?.success) {
        alertSuccessUpdate();
        handleRemoveBoardMission(selectedMissionId);
      } else {
        alertFaultUpdate();
      }
    };
    await moveBoardMissionToDoneApi(callApi, callBack, {
      boardMissionId: selectedMissionId,
      sendMessage,
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
    await getBoardMissionPDF(callApi, callBack, { boardMissionId });
  };

  const [selectedMission, setSelectedMission] = useState<any>({});
  const [openPackagesModal, setOpenPackagesModal] = useState<boolean>(false);

  const onOpenPrintDeliverTicketModal = (mission) => {
    setSelectedMission(mission);
    setOpenPackagesModal(true);
  };

  const onClosePrintDeliverTicketModal = () => {
    setSelectedMission({});
    setOpenPackagesModal(false);
  };

  const [filterGroups, setFilterGroups] = useState<IFilterGroupsList[]>([]);
  const getStationFilterGroups = async () => {
    const callBack = (res) => {
      if (res.success) {
        const filterGroupsList: IFilterGroupsList[] = res?.data?.map(
          (group) => ({
            id: group?.id,
            name: group?.name,
            color: group?.color || "#7355de",
            stuckCount: group?.stuckCount,
            inProcessCount: 11,
          })
        );
        setFilterGroups(filterGroupsList);
      }
    };
    await getAllBoardMissionStationFilterGroupsApi(callApi, callBack).then();
  };

  return {
    t,
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
  };
};

export { useProductionFloorData };
