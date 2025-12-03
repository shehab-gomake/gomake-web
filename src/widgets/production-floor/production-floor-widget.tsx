import { IconButton, Stack } from "@mui/material";
import { ProductionFloorHeader } from "@/widgets/production-floor/header/production-floor-header";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  EProductionFloorView,
  productionFloorViewState,
} from "@/widgets/production-floor/state/production-floor-view";
import { productionFloorFiltersState } from "@/widgets/production-floor/state/production-floor-filters";
import { useEffect, useState, useRef } from "react";
import { GroupsTable } from "@/widgets/production-floor/views/groups-view/groups-table";
import { useRouter } from "next/router";
import { ProductionFloorBoardMissionsViews } from "@/widgets/production-floor/views/boards-view/production-floor-board-missions-views";
import Drawer from "@mui/material/Drawer";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { BoardMissionsComponent } from "@/widgets/production-floor/views/board-missions-view/board-missions-component";
import { DashboardWidget } from "@/widgets/dashboard-widget";
import { FilesUploaderWidget } from "@/widgets/file-uploader-widget/files-uploader-widget";
import QrListenerWidget from "@/widgets/qr-listener/qr-listener-widget";
import { ProductionFloorFilters } from "./filters/production-floor-filters";
import { useProductionFloorData } from "./use-production-floor-data";
import { TimelineWidget } from "@/widgets/production-floor/views/gantt-view/gantt-component";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useProductionFloorSocketIO } from "@/hooks/socket-io/use-production-floor-socket-io";
import { useIsMobile, useMobileHeight } from "@/hooks/use-responsive";
import QRScannerFab from "../qr-scanner/qr-scanner-fab";
import {
  abortControllerActivitiesState,
  abortControllerFilesState,
  abortControllerStationState,
  getBoardMissionsByIdState,
} from "./views/board-missions-view/stations/state";
import {
  GoMakeDeleteModal,
  ThreeOptionsModal,
  GoMakeAutoComplate,
} from "@/components";
import { ModalType } from "@/enums/tabs-icon-enums";
import { useStorageList } from "@/hooks/use-storage-list";
import {
  updateBoardMissionCurrentStationApi,
  getBoardMissionsById,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { useTranslation } from "react-i18next";
import { QR_CODE_LISTENER_FROM } from "@/hooks/use-qr-code-listener";
import QrCodeReader from "@/components/qr-code-reader";
import { useModal } from "@/hooks/use-modal";
import { PrintPackingSlipModalWidget } from "./views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { getAllBoardMissionStatusApi } from "@/services/api-service/board-missions/board-mission-station-filter-groups";
import { statusesListState } from "./state/boards";
import { FrontDeskEmailComposerWrapper } from "@/pages-components/quotes/components/frontdesk-email-composer-wrapper";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { setBoardFiltersApi } from "@/services/api-service/production-floor/production-floor-endpoints";

const ProductionFloorWidget = () => {
  const [view, setView] = useRecoilState(productionFloorViewState);
  const [filtersState, setFiltersState] = useRecoilState(
    productionFloorFiltersState
  );
  const { query, replace, pathname, push } = useRouter();
  const { connectionId } = useProductionFloorSocketIO(view);
  const {
    groupsId,
    boardMissionsId,
    step,
    productType,
    isScanning,
    openMoveToDoneModal,
  } = query;
  const isMobile = useIsMobile();
  const mobileHeight = useMobileHeight();
  const prevViewRef = useRef<EProductionFloorView | null>(null);

  const [selectedBoardMissionId, setSelectedBoardMissionId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (boardMissionsId) {
      setSelectedBoardMissionId(boardMissionsId as string);
    } else if (!boardMissionsId) {
      setSelectedBoardMissionId(null);
    }
  }, [boardMissionsId]);

  const {
    filterGroups,
    setFilterGroups,
    getStationFilterGroups,
    setSelectedGroupId,
    onClickMoveBoardMissionToDone,
    isEmailComposerOpen,
    emailData,
    openEmailComposer,
    closeEmailComposer,
    onOpenMarkReadyModalForHasJobs,
    openMarkReadyModal,
    onOpenMarkReadyModal,
    onCloseMarkReadyModal,
    openMarkReadyModalForHasJobs,
    onCloseMarkReadyModalForHasJobs,
    onClickMarkReadyModalForHasJobs,
    openPackagesModal,
    onClosePrintDeliverTicketModal,
    selectedMission,
    openReturnToProdModal,
    onCloseReturnToProdModal,
    onClickBackToProcess,
    openPrintTypeModal,
    onClosePrintTypeModal,
    handlePrintTypeChoice,
    pendingPrintParams,
    openDoneScopeModal,
    onCloseDoneScopeModal,
    onClickDoneScopeAllJobs,
    onClickDoneScopeProductType,
    tryMoveBoardMissionsToDone,
  } = useProductionFloorData();

  // Storage functionality for mark ready modal
  const {
    storageList,
    inputValue,
    defaultValue,
    addPrintHouseJobsStorage,
    handleStorageChange,
    setInputValue,
  } = useStorageList();

  useEffect(() => {
    getStationFilterGroups();
  }, []);

  useEffect(() => {
    if (view === EProductionFloorView.FILTER_GROUPS) {
      setSelectedGroupId("all");
    }
  }, [view]);

  useEffect(() => {
    if (!!boardMissionsId && !step) {
      replace(
        { pathname: pathname, query: { ...query, step: "stations" } },
        undefined,
        { shallow: true }
      ).then();
    }
    if (!!groupsId) {
      setView(EProductionFloorView.GROUPS);
    }
  }, [groupsId, boardMissionsId, step]);

  const setAbortControllerStation = useSetRecoilState(
    abortControllerStationState
  );
  const setAbortControllerFiles = useSetRecoilState(abortControllerFilesState);
  const setAbortControllerActivities = useSetRecoilState(
    abortControllerActivitiesState
  );
  const setAbortControllerDetails = useSetRecoilState(
    getBoardMissionsByIdState
  );

  useEffect(() => {
    const { view: viewQuery } = query;
    if (viewQuery) {
      const viewEnum = (
        Object.keys(EProductionFloorView) as Array<
          keyof typeof EProductionFloorView
        >
      ).find((key) => key.toLowerCase() === viewQuery);

      if (viewEnum) {
        const newView = EProductionFloorView[viewEnum];

        // On page refresh/load, if view is Gantt, reset filters immediately
        if (newView === EProductionFloorView.GANTT) {
          setFiltersState((prev) => ({
            ...prev,
            stations: [],
            groupId: null,
          }));
          setSelectedGroupId(null);
        }

        setView(newView);
      }
    }
  }, [query, setView]);

  const onClose = () => {
    {
      setSelectedBoardMissionId(null);
      const newRequestAbortController = new AbortController();
      const currentView = EProductionFloorView[view].toLowerCase();
      push(`/production-floor?view=${currentView}`, undefined, {
        shallow: true,
      });
      setAbortControllerStation(newRequestAbortController);
      setAbortControllerFiles(newRequestAbortController);
      setAbortControllerActivities(newRequestAbortController);
      setAbortControllerDetails(newRequestAbortController);
    }
  };

  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenFirstTime, setIsOpenFirstTime] = useState(false);

  useEffect(() => {
    if (!isOpenFirstTime && isScanning) {
      setIsOpenModal(true);
    }
  }, [isScanning, isOpenFirstTime]);

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setIsOpenFirstTime(true);
  };

  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate, alertFault } = useSnackBar();

  // Handle transition FROM Gantt TO other views (Table/Kanban)
  // Always call setFilters with current filters to sync data
  useEffect(() => {
    const previousView = prevViewRef.current;

    // Detect transition FROM Gantt TO another view (except initial mount)
    if (
      previousView === EProductionFloorView.GANTT &&
      view !== EProductionFloorView.GANTT &&
      previousView !== null
    ) {
      // Always call setBoardFiltersApi with current filters from Gantt
      const callBack = (res) => {
        if (res?.success) {
          console.log("Synced data after leaving Gantt view");
        }
      };

      setBoardFiltersApi(callApi, callBack, filtersState, true);
    }

    // Update previous view ref
    prevViewRef.current = view;
  }, [view, filtersState, callApi]);

  const onUpdateToNextStation = async (
    boardMissionId: string,
    productType: string
  ) => {
    await updateBoardMissionCurrentStationApi(
      callApi,
      (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          handleCloseModal();
        } else {
          alertFaultUpdate();
        }
      },
      { boardId: boardMissionId, stationId: null, productType }
    );
  };

  const handleScan = (data: { text: string } | null) => {
    //if (!data) return;
    //setIsScanningFlag(false);
    //setScanResult(data.text || String(data));
    // handleBoardMissionsBarcodeActionsApi(data.text);
  };

  /*const handleError = (err: any) => {
    //setIsScanningFlag(true);
  };*/

  /*const handleScanAgain = () => {
    //setScanResult(null);
    //setIsScanningFlag(true);
  };*/

  const [isQRErrorModalOpen, setIsQRErrorModalOpen] = useState<boolean>(false);
  const [qrErrorMessage, setQrErrorMessage] = useState<string>("");
  const [qrErrorKey, setQrErrorKey] = useState<string>("");

  /*const handleBoardMissionsBarcodeActionsApi = async (barcode: string) => {
    barcode = barcode.replace(/½/g, "-");
    const callBack = (res) => {
      if (res?.data?.success) {
        if (res?.data?.isLastStation) {
          isOpenDoneModal.open()
        }
        alertSuccessUpdate();
      }
      else {
        if (res?.data?.errorMessage && res?.data?.errorMessage !== "") {
          setQrErrorMessage(res.data.errorMessage);
          setQrErrorKey(res.data.errorMessage);
          setIsQRErrorModalOpen(true);
        } else {
          alertFault(t("productionFloor.qrReadError"));
        }
      }
    };
    await handleBoardMissionsBarcodeActions(callApi, callBack, {
      barcode,
    });
  };*/
  const setStatusesList = useSetRecoilState(statusesListState);
  const getAllBoardMissionStatus = async () => {
    const callBack = (res) => {
      if (res.success) {
        setStatusesList(res.data);
      }
    };
    await getAllBoardMissionStatusApi(callApi, callBack).then();
  };

  useEffect(() => {
    getAllBoardMissionStatus();
  }, []);

  const isOpenDoneModal = useModal();
  const processedDeliveryRef = useRef<string | null>(null);

  // Simple handler for DELIVERY action - open move to done modal
  useEffect(() => {
    const key = `${boardMissionsId}-${openMoveToDoneModal}`;
    if (
      openMoveToDoneModal === "true" &&
      boardMissionsId &&
      processedDeliveryRef.current !== key
    ) {
      processedDeliveryRef.current = key;
      const loadMissionAndOpenModal = async () => {
        const callBack = (res: any) => {
          if (res?.success && res?.data) {
            // Ensure the mission data has an id field (use boardMissionsId if id is missing)
            const missionData = {
              ...res.data,
              id: res.data.id || res.data.boardMissionId || boardMissionsId,
            };
            tryMoveBoardMissionsToDone(missionData);
            // Remove URL parameter
            const newQuery = { ...query };
            delete newQuery.openMoveToDoneModal;
            replace({ pathname, query: newQuery }, undefined, {
              shallow: true,
            });
            processedDeliveryRef.current = null;
          }
        };
        await getBoardMissionsById(callApi, callBack, {
          id: boardMissionsId as string,
          productType: (productType as string) || "",
        });
      };
      loadMissionAndOpenModal();
    }
  }, [
    openMoveToDoneModal,
    boardMissionsId,
    callApi,
    tryMoveBoardMissionsToDone,
    query,
    pathname,
    replace,
    productType,
  ]);

  return (
    <Stack gap={"10px"} height={"100%"} maxHeight={"100%"} overflow={"hidden"}>
      <ProductionFloorHeader
        filterGroups={filterGroups}
        setFilterGroups={setFilterGroups}
        connectionId={connectionId}
      />

      {view !== EProductionFloorView.DASHBOARD && (
        <Stack paddingLeft={"20px"} paddingRight={"20px"}>
          <ProductionFloorFilters
            getStationFilterGroups={getStationFilterGroups}
            connectionId={connectionId}
            isMobile={isMobile}
            view={view}
          />
        </Stack>
      )}
      <Stack
        overflow={"auto"}
        maxHeight={"100%"}
        paddingLeft={"20px"}
        paddingRight={"20px"}
      >
        {view === EProductionFloorView.DASHBOARD ? (
          <DashboardWidget />
        ) : view === EProductionFloorView.GANTT ? (
          <PermissionCheck
            userPermission={Permissions.SHOW_PRODUCTION_TIME_LINE}
          >
            <TimelineWidget />
          </PermissionCheck>
        ) : view === EProductionFloorView.GROUPS ? (
          <GroupsTable connectionId={connectionId} />
        ) : (
          <ProductionFloorBoardMissionsViews connectionId={connectionId} />
        )}
        <QrListenerWidget listening={!boardMissionsId} />
      </Stack>
      <Drawer
        sx={{ zIndex: 999999 }}
        open={!!selectedBoardMissionId}
        anchor={"bottom"}
        onClose={() => {
          onClose();
        }}
      >
        <Stack
          paddingBottom={"10px"}
          width={"100vw"}
          height={`calc(${mobileHeight} - 50px)`}
        >
          <IconButton
            onClick={onClose}
            sx={{
              width: "fit-content",
              height: "fit-content",
              padding: 1,
              color: "white",
              position: "fixed",
              top: 10,
              right: 10,
            }}
          >
            <ClearRoundedIcon width={48} height={48} />
          </IconButton>
          {!!boardMissionsId && (
            <BoardMissionsComponent
              productType={!!productType ? productType.toString() : ""}
              boardMissionsId={boardMissionsId?.toString()}
            />
          )}
        </Stack>
        <FilesUploaderWidget />
        {/* <QrListenerWidget listening={!!boardMissionsId} /> */}
      </Drawer>
      <GoMakeDeleteModal
        hideIcon={true}
        modalType={ModalType.WARNING}
        title="Move to Next Station"
        yesBtn={t("sales.quote.yesBtn")}
        cancelBtn={t("modal.no")}
        openModal={isOpenModal}
        onClose={handleCloseModal}
        onClickDelete={() => {
          onUpdateToNextStation(
            boardMissionsId?.toString(),
            productType?.toString()
          );
        }}
      />

      <QRScannerFab />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        openModal={isOpenDoneModal.isOpen}
        onClose={() => isOpenDoneModal.close()}
        onClickDelete={() => onClickMoveBoardMissionToDone(true, true)}
        onClickNo={() => onClickMoveBoardMissionToDone(false, false)}
        style={
          isMobile
            ? {
                width: "95vw",
                maxWidth: 600,
                minWidth: "unset",
              }
            : undefined
        }
      />
      <PrintPackingSlipModalWidget
        openModal={openPackagesModal}
        onClose={onClosePrintDeliverTicketModal}
        boardMissionId={selectedMission?.id || selectedMission?.boardMissionId}
        quantity={selectedMission?.quantity}
      />
      <QrCodeReader
        qrCodeListenerFrom={QR_CODE_LISTENER_FROM.PRODUCTION_FLOOR}
        onIsLastStationDetect={() => isOpenDoneModal.open()}
      />
      {isEmailComposerOpen && (
        <FrontDeskEmailComposerWrapper
          open={isEmailComposerOpen}
          onClose={closeEmailComposer}
          emailData={emailData}
          documentId={selectedMission?.id}
          documentType={DOCUMENT_TYPE.boardMission}
        />
      )}
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.unReadyModalTitle")}
        subTitle={" "}
        yesBtn={t("modal.confirm")}
        cancelBtn={t("modal.cancel")}
        openModal={openReturnToProdModal}
        onClose={onCloseReturnToProdModal}
        onClickDelete={onClickBackToProcess}
      />
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.selectPrintContent")}
        subTitle={
          pendingPrintParams?.productType
            ? t("boardMissions.askPrintType", {
                productType:
                  pendingPrintParams?.productTypeName ||
                  pendingPrintParams?.productName ||
                  pendingPrintParams?.productType,
              })
            : ""
        }
        yesBtn={"boardMissions.printAllJobs"}
        noBtn={t("boardMissions.printProductTypeOnly", {
          productType:
            pendingPrintParams?.productTypeName ||
            pendingPrintParams?.productType,
        })}
        openModal={openPrintTypeModal}
        onClose={onClosePrintTypeModal}
        onClickYes={() => handlePrintTypeChoice(true)}
        onClickNo={() => handlePrintTypeChoice(false)}
      />
      {/* Mark Ready Modal - Simple version (no jobs) */}
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        openModal={openMarkReadyModal}
        onClose={onCloseMarkReadyModal}
        onClickYes={() => onClickMoveBoardMissionToDone(true, true)}
        onClickNo={() => onClickMoveBoardMissionToDone(false, false)}
        yesBtn={t("boardMissions.markDoneModalYes")}
        noBtn={t("boardMissions.markDoneModalNo")}
      >
        <div style={{ width: "100%", minWidth: 300 }}>
          <GoMakeAutoComplate
            options={
              storageList?.find(
                (option: any) => option.storage === inputValue
              ) || inputValue === ""
                ? storageList
                : [
                    {
                      storage: `Add "${inputValue}" as a new storage`,
                      id: "new",
                    },
                    ...storageList,
                  ]
            }
            placeholder={t("boardMissions.selectStorage")}
            key={defaultValue}
            style={{
              width: "100%",
              border: "none",
              height: 45,
            }}
            getOptionLabel={(option: any) => option?.storage}
            value={defaultValue}
            onChange={(e: any, value: any) => {
              if (value?.id === "new") {
                addPrintHouseJobsStorage(inputValue);
                setInputValue("");
              } else {
                handleStorageChange(e, value);
                setInputValue("");
              }
            }}
            onInputChange={(event: any, newInputValue: string) => {
              setInputValue(newInputValue);
            }}
          />
        </div>
      </ThreeOptionsModal>

      {/* Mark Ready Modal - With jobs (requires storage selection) */}
      <GoMakeDeleteModal
        title={t("boardMissions.markAsReadyJobsModalTitle")}
        yesBtn={t("modal.yes")}
        modalType={ModalType.WARNING}
        subTitle={" "}
        openModal={openMarkReadyModalForHasJobs}
        onClose={onCloseMarkReadyModalForHasJobs}
        onClickDelete={() => onClickMarkReadyModalForHasJobs(true)}
        // onClickCancel={() => onClickMarkReadyModalForHasJobs(false)}
      >
        <div style={{ width: "100%", minWidth: 300 }}>
          <GoMakeAutoComplate
            options={
              storageList?.find(
                (option: any) => option.storage === inputValue
              ) || inputValue === ""
                ? storageList
                : [
                    {
                      storage: `Add "${inputValue}" as a new storage`,
                      id: "new",
                    },
                    ...storageList,
                  ]
            }
            placeholder={t("boardMissions.selectStorage")}
            key={defaultValue}
            style={{
              width: "100%",
              border: "none",
              height: 45,
            }}
            getOptionLabel={(option: any) => option?.storage}
            value={defaultValue}
            onChange={(e: any, value: any) => {
              if (value?.id === "new") {
                addPrintHouseJobsStorage(inputValue);
                setInputValue("");
              } else {
                handleStorageChange(e, value);
                setInputValue("");
              }
            }}
            onInputChange={(event: any, newInputValue: string) => {
              setInputValue(newInputValue);
            }}
          />
        </div>
      </GoMakeDeleteModal>

      {/* Done Scope Modal (All jobs vs Product type only) */}
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={"Select Jobs to Mark as Ready"}
        subTitle={
          selectedMission?.productType
            ? t("boardMissions.askDoneScope", {
                productType:
                  selectedMission?.productTypeName ||
                  selectedMission?.productType,
              })
            : ""
        }
        yesBtn={t("boardMissions.markAllJobsReady", {
          defaultValue: "Mark All Jobs Ready",
        })}
        noBtn={
          selectedMission?.productType
            ? t("boardMissions.markProductTypeOnly", {
                productType:
                  selectedMission?.productTypeName ||
                  selectedMission?.productType,
                defaultValue: `Mark ${
                  selectedMission?.productType || "Product Type"
                } Only`,
              })
            : undefined
        }
        openModal={openDoneScopeModal}
        onClose={onCloseDoneScopeModal}
        onClickYes={() => onClickDoneScopeAllJobs(true)}
        onClickNo={() => onClickDoneScopeProductType(true)}
      />
    </Stack>
  );
};

export { ProductionFloorWidget };
