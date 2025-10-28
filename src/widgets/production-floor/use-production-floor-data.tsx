import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  getProductionFloorData,
  moveBoardMissionToDoneApi,
  updateBoardsMissionsOrderApi,
  updateBoardsMissionsStatusApi,
  tryMoveBoardMissionToDoneApi,
  updateJobDueDateApi,
  updateProductionFloorNotesApi,
  ungroupJobsApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  productionFloorAbortControllerState,
  productionFloorFiltersState,
} from "@/widgets/production-floor/state/production-floor-filters";
import {
  boardsMissionsState,
  jobsStatusesState,
  selectedMissionsState,
} from "@/widgets/production-floor/state/boards";
import { tagsState } from "@/widgets/production-floor/state/tags";
import { userProductionFloorGroupsState } from "@/widgets/production-floor/state/production-floor-groups-state";
import { productionFloorPathsState } from "@/widgets/production-floor/state/production-floor-paths";
import { IBoardMissions } from "@/widgets/production-floor/interfaces/board-missions";
import { useTranslation } from "react-i18next";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import { useEffect, useRef, useState, useCallback } from "react";
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
import {
  getOrderSummeryPdfApi,
  getWorkMissionPdfApi,
  setBoardMissionsFiltersApi,
} from "@/services/api-service/board-missions/board-missions-table";
import { EWorkSource } from "../product-pricing-widget/enums";
import { useDebounce } from "@/utils/use-debounce";
import { useUserPermission } from "@/hooks/use-permission";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useDateFormat } from "@/hooks/use-date-format";
import { MoreMenuWidget } from "@/pages-components/board-missions/widgets/more-circle";
import { Permissions } from "@/components/CheckPermission/enum";
import { useFrontDeskEmailIntegration } from "@/pages-components/quotes/hooks/use-frontdesk-email-integration";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

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
  const [selectedMission, setSelectedMission] = useRecoilState<any>(
    selectedMissionsState
  );
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

  // Flag to prevent multiple calls to getStationFilterGroups
  const [isLoadingFilterGroups, setIsLoadingFilterGroups] = useState(false);
  const getData = useCallback(
    async (connectionId?: string) => {
      if (view === EProductionFloorView.FILTER_GROUPS) {
        return await getDataByGroups(connectionId, filtersState);
      }

      if (view === EProductionFloorView.DONE_JOBS) {
        return await getAllBoardMissions();
      }

      const callBack = (res) => {
        if (res.success) {
          setData(res?.data?.boardMissionsCollections);
          setFilters(res?.data?.filter);
          let currentStationOrdering =
            res?.data?.filter?.currentStationOrdering;
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

          // Only call getStationFilterGroups once per successful data fetch
          getStationFilterGroups();
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
    },
    [
      view,
      filtersState,
      abortController,
      callApi,
      setData,
      setFilters,
      setStationOrdering,
      setSelectedGroupId,
      setTags,
      setUserGroups,
      setPath,
      setAgents,
    ]
  );

  const getDataByGroups = useCallback(
    async (
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
    },
    [
      callApi,
      setData,
      setFilters,
      setAgents,
      setJobsStatuses,
      setSelectedGroupId,
      setTags,
      setUserGroups,
      setPath,
    ]
  );

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

  const getAllBoardMissions = useCallback(
    async (
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
                : `${t(
                  "boardMissions." + EWorkSource[mission?.outSourceType]
                )}`,
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
        actionId: string,
        productType: string
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
          productType: productType ?? "",
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
            patternSearchInput !== ""
            ? patternSearchInput
            : "",
      };
      await setBoardMissionsFiltersApi(callApi, callBack, data);
    },
    [
      callApi,
      setAllBoardMissions,
      setPagesCount,
      pageNumber,
      pageSize,
      patternSearch,
      router,
      t,
      CheckPermission,
    ]
  );

  const getAllData = useCallback(
    async (
      pageNumber: number,
      pageSize: number,
      patternSearchInput?: string
    ) => {
      return await getAllBoardMissions(
        pageNumber,
        pageSize,
        patternSearchInput
      );
    },
    [getAllBoardMissions]
  );

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
        }[] = Array.isArray(res?.data) ? res?.data : [];
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
  const [openMarkReadyModalForHasJobs, setOpenMarkReadyModalForHasJobs] =
    useState<boolean>(false);

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
          // Ask whether to mark all jobs or only product type
          setOpenDoneScopeModal(true);
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

  // ===== Done scope modal (All jobs vs Product type only) =====
  const [openDoneScopeModal, setOpenDoneScopeModal] = useState<boolean>(false);

  const onCloseDoneScopeModal = () => {
    setOpenDoneScopeModal(false);
  };

  const onClickDoneScopeAllJobs = () => {
    if (selectedMission) {
      // Call move to done with empty product type to mark entire job
      moveBoardMissionToDone({ ...selectedMission, productType: "" });
      setOpenDoneScopeModal(false);
    }
  };

  const onClickDoneScopeProductType = () => {
    if (selectedMission) {
      moveBoardMissionToDone(selectedMission);
      setOpenDoneScopeModal(false);
    }
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
  const {
    isEmailComposerOpen,
    emailData,
    openEmailComposer,
    closeEmailComposer,
  } = useFrontDeskEmailIntegration({ documentType: DOCUMENT_TYPE.boardMission });

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
        if (sendMessage) {
          openEmailComposer(selectedMission.id);
        }
        // handleRemoveBoardMission(selectedMissionId);
      } else {
        alertFaultUpdate();
      }
    };
    await moveBoardMissionToDoneApi(callApi, callBack, {
      boardMissionId: selectedMission.id || selectedMission.boardMissionId,
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
      productType: boardMissionId?.productType ?? "",
    });
  };

  const onClickUnGroupJob = async (boardMissionId) => {
    const callBack = (res) => {
      if (res?.success) {
        getData();
        alertSuccessUpdate();
      }
    };
    await ungroupJobsApi(callApi, callBack, boardMissionId?.id);
  };

  const [openPackagesModal, setOpenPackagesModal] = useState<boolean>(false);

  const onOpenPrintDeliverTicketModal = (mission) => {
    setSelectedMission(mission);
    setOpenPackagesModal(true);
  };

  const onClosePrintDeliverTicketModal = () => {
    handleRemoveBoardMission(
      selectedMission.id || selectedMission.boardMissionId
    );
    setSelectedMission(null);
    setOpenPackagesModal(false);
  };

  const [filterGroups, setFilterGroups] =
    useRecoilState<IFilterGroupsList[]>(filterGroupsState);
  const getStationFilterGroups = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingFilterGroups) {
      return;
    }

    setIsLoadingFilterGroups(true);

    // Add timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      console.warn("⚠️ Filter groups loading timeout");
      setIsLoadingFilterGroups(false);
    }, 10000); // 10 seconds timeout

    const callBack = (res) => {
      clearTimeout(timeoutId);
      if (res.success) {
        const filterGroupsList: IFilterGroupsList[] = res?.data?.map(
          (group) => ({
            id: group?.id,
            name: group?.name,
            color: group?.color || "#7355de",
            stuckCount: group?.stuckCount,
            inProcessCount: group?.inProcessCount,
            inProcessTotalProductionTime: group?.inProcessTotalProductionTime,
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
        let totalProductionTimeSum = filterGroupsList.reduce(
          (accumulator, currentValue) => {
            return (
              accumulator + (currentValue.inProcessTotalProductionTime ?? 0)
            );
          },
          0
        );
        const allGroupViewFilter: IFilterGroupsList = {
          id: "all",
          name: t("productionFloor.allFilterGroupsViewName"),
          color: "#7355de",
          stuckCount: stuckSum,
          inProcessCount: inProcessSum,
          inProcessTotalProductionTime: totalProductionTimeSum,
        };

        setFilterGroups([allGroupViewFilter, ...filterGroupsList]);
      }
      setIsLoadingFilterGroups(false);
    };
    await getAllBoardMissionStationFilterGroupsApi(callApi, callBack).then();
  }, [isLoadingFilterGroups, callApi, setFilterGroups, t]);

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
    onClickUnGroupJob,
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
    // Done scope modal
    openDoneScopeModal,
    onCloseDoneScopeModal,
    onClickDoneScopeAllJobs,
    onClickDoneScopeProductType,
    isEmailComposerOpen,
    emailData,
    openEmailComposer,
    closeEmailComposer,
  };
};

export { useProductionFloorData };
