import {useGomakeAxios, useSnackBar} from "@/hooks";
import {
    getProductionFloorData,
    moveBoardMissionToDoneApi,
    updateBoardsMissionsOrderApi,
    updateBoardsMissionsStatusApi, tryMoveBoardMissionToDoneApi
} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {productionFloorFiltersState} from "@/widgets/production-floor/state/production-floor-filters";
import {boardsMissionsState, jobsStatusesState} from "@/widgets/production-floor/state/boards";
import {tagsState} from "@/widgets/production-floor/state/tags";
import {userProductionFloorGroupsState} from "@/widgets/production-floor/state/production-floor-groups-state";
import {productionFloorPathsState} from "@/widgets/production-floor/state/production-floor-paths";
import {IBoardMissions} from "@/widgets/production-floor/interfaces/board-missions";
import {useTranslation} from "react-i18next";
import {IStatusesBoardsMissions} from "@/widgets/production-floor/interfaces/production-floor-data-response";
import {useState} from "react";
import {getBoardMissionPDF} from "@/services/api-service/generic-doc/documents-api";
import {IFilterGroupsList} from "./interfaces/borad-missions-filter-groups";
import {
    getAllBoardMissionStationFilterGroupsApi, getJobsByGroups
} from "@/services/api-service/board-missions/board-mission-station-filter-groups";
import {selectedGroupIdState} from "./state/filter-group";
import {EProductionFloorView, productionFloorViewState} from "@/widgets/production-floor/state/production-floor-view";

const useProductionFloorData = () => {
    const {t} = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const RTL = dir === "rtl";
    const {callApi} = useGomakeAxios();
    const [data, setData] =
        useRecoilState<IStatusesBoardsMissions[]>(boardsMissionsState);
    const [abortController, setAbortController] = useState(null);
    const [, setFilters] = useRecoilState(productionFloorFiltersState);
    const [, setTags] = useRecoilState(tagsState);
    const [, setUserGroups] = useRecoilState(userProductionFloorGroupsState);
    const [, setPath] = useRecoilState(productionFloorPathsState);
    const [jobsStatuses, setJobsStatuses] = useRecoilState(jobsStatusesState);

    const {alertFaultUpdate, alertSuccessUpdate} = useSnackBar();
    const [selectedGroupId, setSelectedGroupId] = useRecoilState<string | null>(
        selectedGroupIdState
    );
    const view = useRecoilValue(productionFloorViewState);
    const getData = async (connectionId?: string) => {
        if(view === EProductionFloorView.FILTER_GROUPS){
            getDataByGroups(connectionId).then();
            return ;
        }
        const callBack = (res) => {
            if (res.success) {
                setData(res?.data?.boardMissionsCollections);
                setFilters(res?.data?.filter);
                setSelectedGroupId(res?.data?.filter?.groupId);
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
    const getDataByGroups = async (connectionId?: string,clearData?:boolean) => {
        if(clearData){
            setData([])
            setJobsStatuses([])
        }
        
        const callBack = (res) => {
            if (res.success) {
                setData(res?.data?.boardMissionsCollections);
                setFilters(res?.data?.filter);
                setJobsStatuses(res?.data?.boardMissionStatuses);
                setSelectedGroupId("all");
                setTags(res?.data?.automatedTagsFilter);
                setUserGroups(res?.data?.groups);
                setPath(res?.data?.path ? res?.data?.path : []);
                //alertSuccessGetData();
            }
        }
        await getJobsByGroups(
            callApi,
            callBack,
            connectionId,
            false,
            null)
    };
    const updateStatus = async (boards: IBoardMissions[], statusId: string) => {
        const boardsIds = boards?.filter((b) => b.statusId !== statusId);

        const callBack = (res) => {
            if (res.success) {
                alertSuccessUpdate();
                if(selectedGroupId === "all"){
                    setData(
                        data?.map((status) => {
                            const statusJobs = status.boardMissions.filter(
                                (b) =>
                                    !!!boardsIds.find(
                                        (bs) => b.id === bs.id && b.productType === bs.productType
                                    ));
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

    const [selectedMissionId, setSelectedMissionId] = useState<any>(null);
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
                    setOpenPackagesModal(true)
                } else {
                    onOpenMarkReadyModal(boardMission.id);
                }
            } else {
                alertFaultUpdate();
            }
        }

        await tryMoveBoardMissionToDoneApi(callApi, callBack, {boardMissionId: boardMission.id})
    }

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
                setOpenPackagesModal(true)
                // handleRemoveBoardMission(selectedMissionId);
            } else {
                alertFaultUpdate();
            }
        };
        await moveBoardMissionToDoneApi(callApi, callBack, {
            boardMissionId: selectedMission.id,
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
        await getBoardMissionPDF(callApi, callBack, {boardMissionId: boardMissionId?.id});
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
                        inProcessCount: group?.inProcessCount,
                    })
                );
                const allGroupViewFilter:IFilterGroupsList = {
                    id:"all",
                    name:"all"
                }
                setFilterGroups([allGroupViewFilter,...filterGroupsList]);
            }
        };
        await getAllBoardMissionStationFilterGroupsApi(callApi, callBack).then();
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
        setSelectedGroupId
    };
};

export {useProductionFloorData};
