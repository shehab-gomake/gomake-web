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
  backToProcessApi,
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
  openReturnToProdModalState,
  openPrintTypeModalState,
  pendingPrintParamsState,
  openMarkReadyModalState,
  openMarkReadyModalForHasJobsState,
  openDoneScopeModalState,
} from "@/widgets/production-floor/state/boards";
import {
  doneJobsCustomerState,
  doneJobsAgentState,
  doneJobsProductionStatusState,
  doneJobsOrderStatusState,
  doneJobsProofTypesState,
  doneJobsIsPrintedState,
  doneJobsProductIdsState,
  doneJobsFromDateState,
  doneJobsToDateState,
  doneJobsFromDueDateState,
  doneJobsToDueDateState,
  doneJobsFromReadyDateState,
  doneJobsToReadyDateState,
} from "@/widgets/production-floor/state/done-jobs-filters";
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
import {
  agentsState,
  currentStationOrderingState,
  deliveryTimeOrderingState,
  createDateOrderingState,
} from "@/store/agents-state";
import moment from "moment";
import { IProductionFloorFilter } from "@/widgets/production-floor/interfaces/filters";
import { CurrentStationOrderingEnum } from "@/enums";
import {
  getOrderSummeryPdfApi,
  getWorkMissionPdfApi,
  printJobUsingPrintNodeApi,
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
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";
import { getDocumentMailDataApi } from "@/services/api-service/generic-doc/documents-api";
import {
  contactResolutionService,
  conversationComposerService,
} from "@/services/frontdesk";
import {
  chatwootSelectedAccountAtom,
  chatwootProfileAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useChatwootProfile } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-profile";
import { useChatwootInboxes } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-inboxes";
import { ChannelType } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import type { ContactCreatePayload } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import { getCapitalizedNameFromEmail } from "@/widgets/frontdesk/providers/chatwoot/utils/contact-utils";
import { convertAttachmentsToFiles } from "@/widgets/frontdesk/providers/chatwoot/utils/attachment.utils";
import type { AttachmentSource } from "@/widgets/frontdesk/providers/chatwoot/types/attachment.types";
import { EmailAttachment } from "@/widgets/frontdesk/providers/email/types/email.types";
import {
  getFileExtension,
  getMimeTypeFromExtension,
} from "@/widgets/frontdesk/providers/chatwoot/utils/attachment.utils";

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
  const [openReturnToProdModal, setOpenReturnToProdModalModal] =
    useRecoilState<boolean>(openReturnToProdModalState);
  const [openPrintTypeModal, setOpenPrintTypeModal] = useRecoilState<boolean>(
    openPrintTypeModalState
  );
  const [pendingPrintParams, setPendingPrintParams] = useRecoilState<any>(
    pendingPrintParamsState
  );
  const [abortController, setAbortController] = useRecoilState(
    productionFloorAbortControllerState
  );
  const [filtersState, setFilters] = useRecoilState(
    productionFloorFiltersState
  );
  const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);
  const setTags = useSetRecoilState(tagsState);
  const setUserGroups = useSetRecoilState(userProductionFloorGroupsState);
  const setPath = useSetRecoilState(productionFloorPathsState);
  const setJobsStatuses = useSetRecoilState(jobsStatusesState);
  const setStationOrdering = useSetRecoilState(currentStationOrderingState);
  const setDeliveryTimeOrdering = useSetRecoilState(deliveryTimeOrderingState);
  const setCreateDateOrdering = useSetRecoilState(createDateOrderingState);
  const { alertFaultUpdate, alertSuccessUpdate, alertFault } = useSnackBar();
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
        // Default sort by readyDate descending
        const defaultSortOrder = [
          {
            column: 2, // ReadyDate
            dir: "desc",
          },
        ];
        return await getAllBoardMissions(
          undefined,
          undefined,
          undefined,
          defaultSortOrder
        );
      }

      const callBack = (res) => {
        if (res.success) {
          setData(res?.data?.boardMissionsCollections);

          // Don't restore filters from API when in Gantt view
          // Gantt view manages its own filters (stations=[], groupId=null)
          // Check router query directly to avoid stale closure value
          const currentViewQuery = router.query.view as string;
          const isGanttView = currentViewQuery?.toLowerCase() === "gantt";

          if (!isGanttView) {
            setFilters(res?.data?.filter);
            setSelectedGroupId(res?.data?.filter?.groupId);
          }

          let currentStationOrdering =
            res?.data?.filter?.currentStationOrdering;
          if (!currentStationOrdering) {
            currentStationOrdering = CurrentStationOrderingEnum.NONE;
          }
          setStationOrdering(currentStationOrdering);

          let deliveryTimeOrdering = res?.data?.filter?.deliveryTimeOrdering;
          if (!deliveryTimeOrdering) {
            deliveryTimeOrdering = CurrentStationOrderingEnum.NONE;
          }
          setDeliveryTimeOrdering(deliveryTimeOrdering);

          let createDateOrdering = res?.data?.filter?.createDateOrdering;
          if (!createDateOrdering) {
            createDateOrdering = CurrentStationOrderingEnum.NONE;
          }
          setCreateDateOrdering(createDateOrdering);
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
      setDeliveryTimeOrdering,
      setCreateDateOrdering,
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

  const onOpenReturnToProdModal = (mission) => {
    setSelectedMission(mission);
    setOpenReturnToProdModalModal(true);
  };

  const onCloseReturnToProdModal = () => {
    setSelectedMission(null);
    setOpenReturnToProdModalModal(false);
  };

  const processPrintNodeRequest = async (
    jobId: string,
    productType: string
  ) => {
    const callBack = (res) => {
      if (res.success) {
        // Handle success
      }
    };

    let data = jobId;
    if (productType) {
      data = data + "?productType=" + productType;
    }

    await printJobUsingPrintNodeApi(callApi, callBack, data);
  };

  const printJobUsingPrintNode = async (
    jobId: string,
    productType?: string,
    productTypeName?: string
  ) => {
    if (productType) {
      // Has productType - show modal
      setPendingPrintParams({
        type: "printNode",
        jobId,
        productType,
        productTypeName,
      });
      setOpenPrintTypeModal(true);
    } else {
      // No productType - print full job directly
      await processPrintNodeRequest(jobId, "");
    }
  };

  const onClosePrintTypeModal = () => {
    setOpenPrintTypeModal(false);
    setPendingPrintParams(null);
  };

  const handlePrintTypeChoice = async (printAllJobs: boolean) => {
    if (!pendingPrintParams) return;

    const { jobId, productType } = pendingPrintParams;

    if (printAllJobs) {
      // Print all jobs - don't pass productType
      await processPrintNodeRequest(jobId, "");
    } else {
      // Print product type only
      await processPrintNodeRequest(jobId, productType);
    }

    onClosePrintTypeModal();
  };

  const onClickBackToProcess = async () => {
    const callBack = async (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        await getAllData(pageNumber, pageSize, patternSearch);
      } else {
        alertFaultUpdate();
      }
    };
    await backToProcessApi(callApi, callBack, {
      boardMissionId: selectedMission?.id,
      sendMessage: false,
      productType: selectedMission?.productType ?? "",
    });
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

  // Done jobs filters
  const doneJobsCustomer = useRecoilValue(doneJobsCustomerState);
  const doneJobsAgent = useRecoilValue(doneJobsAgentState);
  const doneJobsProductIds = useRecoilValue(doneJobsProductIdsState);
  const doneJobsFromDate = useRecoilValue(doneJobsFromDateState);
  const doneJobsToDate = useRecoilValue(doneJobsToDateState);
  const doneJobsFromDueDate = useRecoilValue(doneJobsFromDueDateState);
  const doneJobsToDueDate = useRecoilValue(doneJobsToDueDateState);
  const doneJobsFromReadyDate = useRecoilValue(doneJobsFromReadyDateState);
  const doneJobsToReadyDate = useRecoilValue(doneJobsToReadyDateState);
  const doneJobsProofTypes = useRecoilValue(doneJobsProofTypesState);
  const doneJobsIsPrinted = useRecoilValue(doneJobsIsPrintedState);
  const doneJobsOrderStatus = useRecoilValue(doneJobsOrderStatusState);
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
      patternSearchInput?: string,
      sortOrderInput?: any
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
              formatISODateTime(mission?.readyDate),
              <div style={{ cursor: "pointer" }}>{mission?.clientName}</div>,
              mission?.productType
                ? `${mission?.number} / ${
                    mission?.productTypeName
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
                onClickReturnToProduction={onOpenReturnToProdModal}
                printJobUsingPrintNode={printJobUsingPrintNode}
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
        fromDate: doneJobsFromDate,
        toDate: doneJobsToDate,
        fromDueDate: doneJobsFromDueDate,
        toDueDate: doneJobsToDueDate,
        fromReadyDate: doneJobsFromReadyDate,
        toReadyDate: doneJobsToReadyDate,
        productsIds: doneJobsProductIds,
        productionStatus: "6", // Always "Done" for done jobs view
        pageNumber: pageNumberInput ?? pageNumber,
        pageSize: pageSizeInput ?? pageSize,
        search:
          patternSearchInput !== null &&
          patternSearchInput !== undefined &&
          patternSearchInput !== ""
            ? patternSearchInput
            : "",
        customerId: doneJobsCustomer?.id || null,
        agentId: doneJobsAgent?.id || null,
        proofTypes: doneJobsProofTypes?.map((pt) => pt.value) || [],
        isPrinted: doneJobsIsPrinted,
        orderStatus: doneJobsOrderStatus?.value || null,
        ...(sortOrderInput && { order: sortOrderInput }),
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
      doneJobsCustomer,
      doneJobsAgent,
      doneJobsProductIds,
      doneJobsFromDate,
      doneJobsToDate,
      doneJobsFromDueDate,
      doneJobsToDueDate,
      doneJobsFromReadyDate,
      doneJobsToReadyDate,
      doneJobsProofTypes,
      doneJobsIsPrinted,
      doneJobsOrderStatus,
    ]
  );

  const getAllData = useCallback(
    async (
      pageNumber: number,
      pageSize: number,
      patternSearchInput?: string,
      sortOrderInput?: any
    ) => {
      return await getAllBoardMissions(
        pageNumber,
        pageSize,
        patternSearchInput,
        sortOrderInput
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

  const [openMarkReadyModal, setOpenMarkReadyModal] = useRecoilState<boolean>(
    openMarkReadyModalState
  );
  const [openMarkReadyModalForHasJobs, setOpenMarkReadyModalForHasJobs] =
    useRecoilState<boolean>(openMarkReadyModalForHasJobsState);

  const onCloseMarkReadyModal = () => {
    setOpenMarkReadyModal(false);
  };

  const onCloseMarkReadyModalForHasJobs = () => {
    setOpenMarkReadyModalForHasJobs(false);
    // setSelectedMission(null);
  };

  const tryMoveBoardMissionsToDone = async (boardMission) => {
    setSelectedMission(boardMission);
    const callBack = (res) => {
      if (res.success) {
        if (boardMission.productType) {
          // Ask whether to mark all jobs or only product type
          setOpenDoneScopeModal(true);
          // moveBoardMissionToDone(boardMission);
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
  const [openDoneScopeModal, setOpenDoneScopeModal] = useRecoilState<boolean>(
    openDoneScopeModalState
  );

  const onCloseDoneScopeModal = () => {
    setOpenDoneScopeModal(false);
  };

  const onClickDoneScopeAllJobs = (isSendMessage: boolean = false) => {
    if (selectedMission) {
      // Call move to done with empty product type to mark entire job
      moveBoardMissionToDone(
        { ...selectedMission, productType: "" },
        isSendMessage
      );
      setOpenDoneScopeModal(false);
    }
  };

  const onClickDoneScopeProductType = (isSendMessage: boolean = false) => {
    if (selectedMission) {
      moveBoardMissionToDone(selectedMission, isSendMessage);
      setOpenDoneScopeModal(false);
    }
  };

  const onOpenMarkReadyModal = (missionId) => {
    setOpenMarkReadyModal(true);
  };

  const onOpenMarkReadyModalForHasJobs = (missionId) => {
    setOpenMarkReadyModalForHasJobs(true);
  };

  const onClickMarkReadyModalForHasJobs = (isSendMessage: boolean = false) => {
    moveBoardMissionToDone(selectedMission, isSendMessage);
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

  //!here
  const {
    isEmailComposerOpen,
    emailData,
    openEmailComposer,
    closeEmailComposer,
  } = useFrontDeskEmailIntegration({
    documentType: DOCUMENT_TYPE.boardMission,
  });

  // FrontDesk email sending setup for programmatic sending
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const setSelectedAccountId = useSetRecoilState(chatwootSelectedAccountAtom);
  const currentUser = useRecoilValue(chatwootProfileAtom);
  const { profile: profileUser, fetchProfile } = useChatwootProfile();
  const { inboxes } = useChatwootInboxes();

  // Helper function to send email programmatically without opening modal
  const sendEmailProgrammatically = useCallback(
    async (
      boardMissionId: string | number,
      contactEmail?: string,
      contactPhone?: string,
      contactName?: string,
      customerId?: string | number,
      customerName?: string
    ): Promise<boolean> => {
      if (!hasFrontDeskFeature) {
        console.log("FrontDesk feature not enabled, skipping email send");
        return false;
      }

      try {
        // 1. Get email data from API
        let emailData: any = null;
        await new Promise<void>((resolve) => {
          getDocumentMailDataApi(
            callApi,
            (res) => {
              if (res?.success && res?.data) {
                emailData = res.data;
                console.log(
                  "[sendEmailProgrammatically] Email data received:",
                  {
                    tos: emailData.tos,
                    subject: emailData.subject,
                    hasBody: !!emailData.body,
                    hasAttachments: !!emailData.attachments,
                  }
                );
              } else {
                console.error(
                  "[sendEmailProgrammatically] API response error:",
                  res
                );
              }
              resolve();
            },
            {
              documentType: DOCUMENT_TYPE.boardMission,
              document: {
                boardMissionId,
                ...(contactEmail && { contactEmail }),
                ...(contactPhone && { contactPhone }),
                messageType: 0,
                sendMailIfNotVerifiedAgent: true,
                sendWithInvoices: false,
                ...(customerId && { customerId }),
                ...(customerName && { customerName }),
                ...(contactName && { contactName }),
              },
            }
          );
        });

        if (!emailData) {
          console.error(
            "[sendEmailProgrammatically] Failed to load email data - emailData is null"
          );
          return false;
        }

        console.log(
          "[sendEmailProgrammatically] Processing email data:",
          emailData
        );

        // 2. Resolve account ID
        const extractAccountId = (profile: any) => {
          if (!profile) return null;
          return (
            profile.account_id ||
            profile.accountId ||
            (profile.meta &&
              (profile.meta.account_id || profile.meta.accountId)) ||
            null
          );
        };

        let resolvedAccountId =
          typeof selectedAccountId === "number" ? selectedAccountId : null;
        if (!resolvedAccountId) {
          resolvedAccountId =
            extractAccountId(currentUser) ?? extractAccountId(profileUser);
        }
        if (!resolvedAccountId) {
          const refreshedProfile = await fetchProfile();
          resolvedAccountId = extractAccountId(refreshedProfile);
        }
        if (resolvedAccountId) {
          setSelectedAccountId(resolvedAccountId);
        }

        if (!resolvedAccountId) {
          console.error("Unable to resolve Chatwoot account");
          return false;
        }

        const accountId = Number(resolvedAccountId);
        if (Number.isNaN(accountId)) {
          console.error("Resolved account ID is not a number");
          return false;
        }

        // 3. Get sender inbox (use first email inbox)
        const emailInboxes =
          inboxes?.filter(
            (inbox) => inbox.channel_type === ChannelType.EMAIL
          ) || [];
        if (emailInboxes.length === 0) {
          console.error("No email inboxes found");
          return false;
        }
        const senderInbox = emailInboxes[0];

        // 4. Prepare email data from API response
        // Handle tos array - ensure it's always an array
        const toEmails = Array.isArray(emailData.tos)
          ? emailData.tos.filter((email: string) => email && email.trim())
          : emailData.tos && typeof emailData.tos === "string"
          ? [emailData.tos.trim()].filter(Boolean)
          : [];

        // Handle cc - can be null, array, or string
        const ccEmails =
          emailData.cc === null || emailData.cc === undefined
            ? []
            : Array.isArray(emailData.cc)
            ? emailData.cc.filter((email: string) => email && email.trim())
            : typeof emailData.cc === "string"
            ? [emailData.cc.trim()].filter(Boolean)
            : [];

        // Handle bcc - can be null, array, or string
        const bccEmails =
          emailData.bcc === null || emailData.bcc === undefined
            ? []
            : Array.isArray(emailData.bcc)
            ? emailData.bcc.filter((email: string) => email && email.trim())
            : typeof emailData.bcc === "string"
            ? [emailData.bcc.trim()].filter(Boolean)
            : [];
        const messageContent =
          emailData.body || emailData.html || emailData.text || "";
        const subject = emailData.subject || "";

        console.log("[sendEmailProgrammatically] Prepared email data:", {
          toEmails,
          ccEmails,
          bccEmails,
          subject,
          messageLength: messageContent.length,
        });

        if (toEmails.length === 0) {
          console.error(
            "[sendEmailProgrammatically] No recipients found in tos array"
          );
          return false;
        }

        // 5. Convert attachments
        const mapToAttachmentSource = (
          attachment: EmailAttachment
        ): AttachmentSource => ({
          content: attachment.content,
          data: attachment.data,
          url: attachment.url,
          filename: attachment.filename,
          mimeType: attachment.mimeType,
          contentType: attachment.contentType,
          size: attachment.size,
        });

        const normalizedAttachments = Array.isArray(emailData.attachments)
          ? emailData.attachments.map((attachment: EmailAttachment) => {
              let filename = attachment.filename || "document";
              const extension = getFileExtension(attachment.url || "", null);
              if (extension && !filename.includes(".")) {
                filename = `${filename}.${extension}`;
              }
              const mimeType =
                attachment.mimeType ||
                attachment.contentType ||
                (extension
                  ? getMimeTypeFromExtension(extension)
                  : "application/octet-stream");
              return {
                id: attachment.id,
                filename,
                mimeType,
                contentType: mimeType,
                size: attachment.size,
                url: attachment.url,
                content: attachment.content ?? attachment.data,
              };
            })
          : [];

        const attachmentSources = normalizedAttachments.map(
          mapToAttachmentSource
        );
        const attachments = await convertAttachmentsToFiles(attachmentSources);

        // 6. Send email to each recipient via Chatwoot
        console.log(
          `[sendEmailProgrammatically] Sending email to ${toEmails.length} recipient(s)`
        );
        const results = await Promise.allSettled(
          toEmails.map(async (recipientEmail: string) => {
            try {
              console.log(
                `[sendEmailProgrammatically] Processing recipient: ${recipientEmail}`
              );
              const contactNameForEmail =
                contactName || getCapitalizedNameFromEmail(recipientEmail);
              const contactPayload: ContactCreatePayload = {
                name: contactNameForEmail,
                email: recipientEmail,
              };

              const contact =
                await contactResolutionService.findOrCreateContact(
                  accountId,
                  contactPayload
                );

              if (!contact?.id) {
                throw new Error(
                  `Failed to find or create contact for ${recipientEmail}`
                );
              }

              console.log(
                `[sendEmailProgrammatically] Contact created/found: ${contact.id} for ${recipientEmail}`
              );

              const conversationId =
                await conversationComposerService.composeAndCreate(accountId, {
                  inboxId: senderInbox.id,
                  contactId: contact.id,
                  sourceId: recipientEmail,
                  message: messageContent,
                  subject: subject,
                  ccEmails,
                  bccEmails,
                  toEmails: [recipientEmail],
                  attachments,
                  channelType: ChannelType.EMAIL,
                  additionalAttributes: {
                    gomake_document: {
                      id: boardMissionId,
                      type: DOCUMENT_TYPE.boardMission,
                    },
                  },
                });

              if (!conversationId) {
                throw new Error(
                  `Failed to create conversation for ${recipientEmail}`
                );
              }

              console.log(
                `[sendEmailProgrammatically] Email sent successfully to ${recipientEmail}, conversationId: ${conversationId}`
              );
              return { recipientEmail, success: true, conversationId };
            } catch (error) {
              console.error(
                `[sendEmailProgrammatically] Error sending email to ${recipientEmail}:`,
                error
              );
              return {
                recipientEmail,
                success: false,
                error: error instanceof Error ? error.message : String(error),
              };
            }
          })
        );

        const successfulSends = results.filter(
          (result) => result.status === "fulfilled" && result.value.success
        );
        const failedSends = results.filter(
          (result) =>
            result.status === "rejected" ||
            (result.status === "fulfilled" && !result.value.success)
        );

        console.log(
          `[sendEmailProgrammatically] Email sending results: ${successfulSends.length} successful, ${failedSends.length} failed`
        );
        if (failedSends.length > 0) {
          console.error(
            "[sendEmailProgrammatically] Failed sends:",
            failedSends
          );
        }

        return successfulSends.length > 0;
      } catch (error) {
        console.error("Error sending email programmatically:", error);
        return false;
      }
    },
    [
      callApi,
      hasFrontDeskFeature,
      selectedAccountId,
      setSelectedAccountId,
      currentUser,
      profileUser,
      fetchProfile,
      inboxes,
    ]
  );

  const onClickMoveBoardMissionToDone = async (
    ignoreProductType: boolean = false,
    isSendMessage: boolean = false
  ) => {
    const callBack = async (res) => {
      setOpenMarkReadyModal(false);
      if (res?.success) {
        alertSuccessUpdate();

        // If isSendMessage is true, send email programmatically without opening modal
        if (isSendMessage && hasFrontDeskFeature) {
          try {
            const success = await sendEmailProgrammatically(
              selectedMission.id || selectedMission.boardMissionId,
              selectedMission.contactEmail,
              selectedMission?.contactPhone,
              selectedMission?.contactName,
              selectedMission?.customerId,
              selectedMission?.customerName
            );
            if (!success) {
              console.warn(
                "Failed to send email programmatically, but mission was marked as done"
              );
            }
          } catch (error) {
            console.error("Error sending email programmatically:", error);
          }
        }

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
    // Mark as ready - send email programmatically if isSendMessage is true
    await moveBoardMissionToDoneApi(callApi, callBack, {
      boardMissionId: selectedMission.id || selectedMission.boardMissionId,
      sendMessage: hasFrontDeskFeature ? false : isSendMessage, // Always false - we handle email sending programmatically via FrontDesk
      productType: ignoreProductType ? "" : selectedMission.productType ?? "",
      storage: selectedMission.storage ?? "",
    });
  };

  const moveBoardMissionToDone = async (
    selectedMission: any,
    isSendMessage: boolean = false
  ) => {
    const callBack = async (res) => {
      setOpenMarkReadyModal(false);
      setOpenMarkReadyModalForHasJobs(false);
      if (res?.success) {
        alertSuccessUpdate();

        // If isSendMessage is true, send email programmatically without opening modal
        if (isSendMessage && hasFrontDeskFeature) {
          try {
            const success = await sendEmailProgrammatically(
              selectedMission.id || selectedMission.boardMissionId,
              selectedMission.contactEmail,
              selectedMission.contactPhone,
              selectedMission?.contactName,
              selectedMission?.customerId,
              selectedMission?.customerName
            );
            if (!success) {
              console.warn(
                "Failed to send email programmatically, but mission was marked as done"
              );
            }
          } catch (error) {
            console.error("Error sending email programmatically:", error);
          }
        }

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
      sendMessage: hasFrontDeskFeature ? false : isSendMessage, // Always false - we handle email sending programmatically via FrontDesk
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
      selectedMission?.id || selectedMission?.boardMissionId
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
    // Store the old date value before making the API call
    const oldDueDate = data
      .flatMap((status) => status.boardMissions)
      .find((bm) => bm.id === boardMisionId)?.dueDate;

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
    const callBack = (res) => {
      if (!res?.success) {
        // Check for specific error: delivery date less than estimated
        if (
          res?.errors?.message === "delivrey_date_less_than_est" ||
          res?.statusCode === 116 ||
          res?.statusCode === 100 ||
          res?.errors?.message === "date_not_valid"
        ) {
          const errorMessage = t(`alerts.${res?.errors?.message}`);
          alertFault(errorMessage);
        }
        // Reset to the old date value that was stored before the API call
        if (oldDueDate) {
          setData(
            data.map((status) =>
              status.boardMissions.find((b) => b.id === boardMisionId)
                ? {
                    ...status,
                    boardMissions: status.boardMissions.map((bm) =>
                      bm.id === boardMisionId
                        ? { ...bm, dueDate: oldDueDate }
                        : bm
                    ),
                  }
                : status
            )
          );
        }
      }
    };
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
    sendEmailProgrammatically,
    openReturnToProdModal,
    onOpenReturnToProdModal,
    onCloseReturnToProdModal,
    onClickBackToProcess,
    openPrintTypeModal,
    onClosePrintTypeModal,
    handlePrintTypeChoice,
    pendingPrintParams,
    printJobUsingPrintNode,
  };
};

export { useProductionFloorData };
