import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  getProductionFloorData,
  moveBoardMissionToDoneApi,
  updateBoardsMissionsOrderApi,
  updateBoardsMissionsStatusApi,
  tryMoveBoardMissionToDoneApi,
  updateJobDueDateApi,
  updateProductionFloorNotesApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  productionFloorAbortControllerState,
  productionFloorFiltersState,
} from "@/widgets/production-floor/state/production-floor-filters";
import {
  boardsMissionsState,
  jobsStatusesState, selectedMissionsState,
} from "@/widgets/production-floor/state/boards";
import { tagsState } from "@/widgets/production-floor/state/tags";
import { userProductionFloorGroupsState } from "@/widgets/production-floor/state/production-floor-groups-state";
import { productionFloorPathsState } from "@/widgets/production-floor/state/production-floor-paths";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { useTranslation } from "react-i18next";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { useEffect, useRef, useState } from "react";
import { getBoardMissionPDF } from "@/services/api-service/generic-doc/documents-api";
import { IFilterGroupsList } from "./interfaces/borad-missions-filter-groups";
import {
  getAllBoardMissionStationFilterGroupsApi,
  getJobsByGroups,
} from "@/services/api-service/board-missions/board-mission-station-filter-groups";
import {
  allBoardMissionsState,
  filterGroupsState,
  pageSizeState,
  pageNumberState,
  selectedGroupIdState,
  pagesCountState,
  finalPatternSearchState,
  patternSearchState,
} from "./state/filter-group";
import {
  EProductionFloorView,
  productionFloorViewState,
} from "@/widgets/production-floor/state/production-floor-view";
import { useRouter } from "next/router";
import { agentsState, currentStationOrderingState } from "@/store/agents-state";
import moment from "moment";
import { IProductionFloorFilter } from "@/widgets/production-floor/interfaces/filters";
import { CurrentStationOrderingEnum } from "@/enums";
import { getOrderSummeryPdfApi, getWorkMissionPdfApi, setBoardMissionsFiltersApi } from "@/services/api-service/board-missions/board-missions-table";
import { EWorkSource } from "../product-pricing-widget/enums";
import { useDebounce } from "@/utils/use-debounce";
import { useUserPermission } from "@/hooks/use-permission";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useDateFormat } from "@/hooks/use-date-format";
import { MoreMenuWidget } from "@/pages-components/board-missions/widgets/more-circle";
import { Permissions } from "@/components/CheckPermission/enum";

const useProductionFloorData = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const { callApi } = useGomakeAxios();
  const { push } = useRouter();
  const router = useRouter();
  const setAgents = useSetRecoilState(agentsState);
  const [data, setData] =
    useRecoilState<IStatusesBoardsMissions[]>(boardsMissionsState);
  const [selectedMission, setSelectedMission] =
    useRecoilState<any>(selectedMissionsState);
  const [abortController, setAbortController] = useRecoilState(
    productionFloorAbortControllerState
  );
  const [filtersState, setFilters] = useRecoilState(
    productionFloorFiltersState
  );
  const setTags = useSetRecoilState(tagsState);
  const setUserGroups = useSetRecoilState(userProductionFloorGroupsState);
  const setPath = useSetRecoilState(productionFloorPathsState);
  const setJobsStatuses = useSetRecoilState(jobsStatusesState);
  const setStationOrdering = useSetRecoilState(currentStationOrderingState);
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

    if (view === EProductionFloorView.DONE_JOBS) {
      getAllBoardMissions();
      return;
    }

    const callBack = (res) => {
      if (res.success) {
        setData(res?.data?.boardMissionsCollections);
        setFilters(res?.data?.filter);
        let currentStationOrdering = res?.data?.filter?.currentStationOrdering;
        if (!currentStationOrdering) {
          currentStationOrdering = CurrentStationOrderingEnum.NONE;
        }
        setStationOrdering(currentStationOrdering);
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
      },
      false,
      newRequestAbortController
    );
  };

  const getDataByGroups = async (
    connectionId?: string,
    currentFilters?: IProductionFloorFilter,
    clearData?: boolean,
    isFirstLoad?: boolean
  ) => {
    if (clearData) {
      setData([]);
      setJobsStatuses([]);
    }
    if (abortController) {
      abortController.abort();
    }
    if (!currentFilters) {
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
        if (filterGroups && filterGroups.length > 0) {
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
      }
    };
    await getJobsByGroups(
      callApi,
      callBack,
      { connectionId: connectionId, filters: currentFilters },
      false,
      newRequestAbortController
    );
  };

  const { CheckPermission } = useUserPermission();
  const { getCurrencyUnitText } = useQuoteGetData();
  const { formatISODateTime } = useDateFormat();
  const setAllBoardMissions = useSetRecoilState<any[]>(allBoardMissionsState);
  const setPagesCount = useSetRecoilState<number>(pagesCountState);
  const setFinalPatternSearch = useSetRecoilState<string>(
    finalPatternSearchState
  );

  const pageNumber = useRecoilValue<number>(pageNumberState);
  const pageSize = useRecoilValue<number>(pageSizeState);
  const [patternSearch, setPatternSearch] =
    useRecoilState<any>(patternSearchState);
  const searchInputFilterRef = useRef(null);

  const debouncePatternSearch = useDebounce(patternSearch, 1000);
  useEffect(() => {
    if (router.query.targetOrderNumber) {
      setPatternSearch(router.query.targetOrderNumber);
    }
  }, []);

  useEffect(() => {
    if (debouncePatternSearch == null) return;

    const trimmedSearch = debouncePatternSearch.trim();
    setFinalPatternSearch(trimmedSearch);

    // Create a new query object
    const newQuery = { ...router.query };

    if (trimmedSearch) {
      newQuery.finalPatternSearch = trimmedSearch;
      newQuery.pageNumber = "1";
    } else {
      delete newQuery.finalPatternSearch; // Remove the parameter if empty
      newQuery.pageNumber = "1";
    }

    const hasQueryChanged =
      JSON.stringify(newQuery) !== JSON.stringify(router.query);

    if (hasQueryChanged) {
      router.push(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [debouncePatternSearch]);

  const getJobStatus = (mission) => {
    if (mission?.isReady) {
      return (
        <>
          <div>{t("boardMissions.done")}</div>
          <div>{mission?.storage ? ` ${mission.storage}` : ""}</div>
        </>
      );
    }
    return "";
  };

  const getAllBoardMissions = async (
    pageNumberInput?: number,
    pageSizeInput?: number,
    patternSearchInput?: string
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        const _data = res?.data;
        const mapData = _data.data?.map((mission: any) => {
          const itemCalculatedPrice =
            mission?.calculatedPrice &&
              mission?.calculatedPrice != mission?.price
              ? mission?.calculatedPrice
              : 0;
          return [
            <a
              href={mission?.boardMissionImage}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={mission?.boardMissionImage}
                alt=""
                style={{
                  width: "45px",
                  height: "45px",
                  objectFit: "contain",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              />
            </a>,
            formatISODateTime(mission?.createdDate),
            formatISODateTime(mission?.dueDate),
            <div style={{ cursor: "pointer" }}>{mission?.clientName}</div>,
            mission?.productType
              ? `${mission?.number} / ${mission?.productTypeName
                ? mission?.productTypeName
                : mission?.productType
              }`
              : mission?.number,
            <a href={`/order?Id=${mission?.orderID}`}>
              {mission?.orderNumber}
            </a>,
            mission?.outSourceType === null
              ? `${t("boardMissions." + EWorkSource[0])}`
              : `${t("boardMissions." + EWorkSource[mission?.outSourceType])}`,
            mission?.quantity,
            // ...(CheckPermission(Permissions.SHOW_COSTS_IN_BOARD_MISSIONS)
            //   ? [
            //       RTL
            //         ? mission?.cost +
            //           " " +
            //           getCurrencyUnitText(mission?.currency)
            //         : getCurrencyUnitText(mission?.currency) +
            //           " " +
            //           mission?.cost,
            //     ]
            //   : []),
            // ...(CheckPermission(Permissions.SHOW_COSTS_IN_BOARD_MISSIONS)
            //   ? [
            //       [
            //         RTL
            //           ? mission?.price +
            //             (itemCalculatedPrice
            //               ? ` (${itemCalculatedPrice})`
            //               : " ") +
            //             getCurrencyUnitText(mission?.currency)
            //           : getCurrencyUnitText(mission?.currency) +
            //             " " +
            //             mission?.price +
            //             (itemCalculatedPrice
            //               ? ` (${itemCalculatedPrice})`
            //               : " "),
            //       ],
            //     ]
            //   : []),
            mission?.jobName,
            // mission?.numberOfBoardMissions,
            mission?.productName,
            <div style={{ whiteSpace: "break-spaces" }}>
              {getJobStatus(mission)}
            </div>,
            <MoreMenuWidget
              mission={mission}
              isDoneJobs={true}
              // onClickDuplicate={onOpenDuplicateModal}
              // onOpenModal={onOpenModal}
              // onClickPrintPackagingSlip={onOpenPackagesModal}
              // onClickMarksAsDone={onOpenMarkReadyModal}
              // onClickMarksAsDoneForProductType={
              //   onOpenMarkReadyModalForProductType
              // }
              // onClickReturnToProduction={onOpenReturnToProdModal}
              onClickOrderSummeryPdf={onClickOrderSummeryPdf}
              onClickWorkMissionPdf={onClickWorkMissionPdf}
            />,
          ];
        });
        setAllBoardMissions(mapData);
        setPagesCount(Math.ceil(_data?.totalItems / pageSize));
      } else {
        setAllBoardMissions([]);
      }
    };

    const onClickWorkMissionPdf = async (
      boardMissionId: string,
      actionId: string
    ) => {
      const callBack = (res) => {
        if (res?.success) {
          const pdfLink = res.data;
          window.open(pdfLink, "_blank");
        } else {
          // alertFaultGetData();
        }
      };
      await getWorkMissionPdfApi(callApi, callBack, {
        boardMissionId,
        isPurchaseJobs: false,
        actionId: actionId,
      });
    };

    const onClickOrderSummeryPdf = async (boardMissionId: string) => {
      const callBack = (res) => {
        if (res?.success) {
          const pdfLink = res.data;
          window.open(pdfLink, "_blank");
        } else {
          // alertFaultGetData();
        }
      };
      await getOrderSummeryPdfApi(callApi, callBack, { boardMissionId });
    };

    const data = {
      fromDate: null,
      toDate: null,
      fromDueDate: null,
      toDueDate: null,
      fromReadyDate: null,
      toReadyDate: null,
      productsIds: [],
      productionStatus: "6",
      pageNumber: pageNumberInput ?? pageNumber,
      pageSize: pageSizeInput ?? pageSize,
      search:
        patternSearchInput !== null &&
          patternSearchInput !== undefined &&
          patternSearchInput !== "" ?
          patternSearchInput : "",
    };
    await setBoardMissionsFiltersApi(callApi, callBack, data);
  };

  const getAllData = async (
    pageNumber: number,
    pageSize: number,
    patternSearchInput?: string
  ) => {
    return await getAllBoardMissions(pageNumber, pageSize, patternSearchInput);
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
  const [openMarkReadyModalForHasJobs, setOpenMarkReadyModalForHasJobs] = useState<boolean>(false);

  const onCloseMarkReadyModal = () => {
    setSelectedMissionId(null);
    setOpenMarkReadyModal(false);
  };

  const onCloseMarkReadyModalForHasJobs = () => {
    setSelectedMissionId(null);
    setOpenMarkReadyModalForHasJobs(false);
  };

  const tryMoveBoardMissionsToDone = async (boardMission) => {
    setSelectedMission(boardMission);
    const callBack = (res) => {
      if (res.success) {
        if (boardMission.productType) {
          moveBoardMissionToDone(boardMission);
        } else {
          if (res.data) {
            onOpenMarkReadyModalForHasJobs(boardMission);
            // alertSuccessUpdate();
            // setOpenPackagesModal(true);
          } else {
            onOpenMarkReadyModal(boardMission.id);
          }
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

  const onOpenMarkReadyModalForHasJobs = (missionId) => {
    setSelectedMissionId(missionId);
    setOpenMarkReadyModalForHasJobs(true);
  };

  const onClickMarkReadyModalForHasJobs = () => {
    moveBoardMissionToDone(selectedMission);
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
        if (
          selectedMission.productType === "" ||
          !selectedMission.productType
        ) {
          setOpenPackagesModal(true);
        }
        // handleRemoveBoardMission(selectedMissionId);
      } else {
        alertFaultUpdate();
      }
    };
    await moveBoardMissionToDoneApi(callApi, callBack, {
      boardMissionId: selectedMission.id,
      sendMessage,
      productType: selectedMission.productType ?? "",
      storage: selectedMission.storage ?? "",
    });
  };

  const moveBoardMissionToDone = async (selectedMission: any) => {
    const callBack = (res) => {
      setOpenMarkReadyModal(false);
      setOpenMarkReadyModalForHasJobs(false);
      if (res?.success) {
        alertSuccessUpdate();
        if (
          selectedMission.productType === "" ||
          !selectedMission.productType
        ) {
          setOpenPackagesModal(true);
        }
      } else {
        alertFaultUpdate();

      }
    };
    await moveBoardMissionToDoneApi(callApi, callBack, {
      boardMissionId: selectedMission.id,
      sendMessage: false,
      productType: selectedMission.productType ?? "",
      storage: selectedMission.storage ?? "",
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

  const [openPackagesModal, setOpenPackagesModal] = useState<boolean>(false);

  const onOpenPrintDeliverTicketModal = (mission) => {
    setSelectedMission(mission);
    setOpenPackagesModal(true);
  };

  const onClosePrintDeliverTicketModal = () => {
    handleRemoveBoardMission(selectedMission.id);
    setSelectedMission(null);
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
    const callBack = () => { };
    updateJobDueDateApi(callApi, callBack, {
      boardMissionId: boardMisionId,
      dueDate: utcDueDate,
    }).then();
  };

  const updateNotes = (
    boardMissionId,
    productType,
    notes,
    reset,
    closeEditing
  ) => {
    const callBack = (res) => {
      if (res.success) {
        // alertSuccessUpdate();
        closeEditing();
      } else {
        alertFaultUpdate();
        reset();
      }
    };

    updateProductionFloorNotesApi(callApi, callBack, {
      boardMissionId: boardMissionId,
      productType: productType,
      note: notes,
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
    onOpenMarkReadyModalForHasJobs,
    openMarkReadyModalForHasJobs,
    onClickMarkReadyModalForHasJobs,
    onCloseMarkReadyModalForHasJobs,
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
    getAllBoardMissions,
    setSelectedGroupId,
    handleOpenQRScanner,
    updateJobDueDate,
    updateNotes,
    setSelectedMission,
    getAllData,
    searchInputFilterRef,
  };
};

export { useProductionFloorData };
