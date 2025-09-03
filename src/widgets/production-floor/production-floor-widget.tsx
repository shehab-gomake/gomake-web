import {
  Box,
  IconButton,
  Stack,
  Typography,
  Button,
  CardContent,
  Card,
} from "@mui/material";
import { ProductionFloorHeader } from "@/widgets/production-floor/header/production-floor-header";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  EProductionFloorView,
  productionFloorViewState,
} from "@/widgets/production-floor/state/production-floor-view";
import { useEffect, useState } from "react";
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
import { GoMakeDeleteModal, ThreeOptionsModal } from "@/components";
import { ModalType } from "@/enums/tabs-icon-enums";
import {
  handleBoardMissionsBarcodeActions,
  updateBoardMissionCurrentStationApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { useTranslation } from "react-i18next";
import QrReader from "react-qr-scanner";
import {
  QR_CODE_LISTENER_FROM,
  useQrCodeListener,
} from "@/hooks/use-qr-code-listener";
import QrCodeReader from "@/components/qr-code-reader";
import { useModal } from "@/hooks/use-modal";
import { PrintPackingSlipModalWidget } from "./views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { getAllBoardMissionStatusApi } from "@/services/api-service/board-missions/board-mission-station-filter-groups";
import { statusesListState } from "./state/boards";
import { ZoomProvider } from "@/widgets/production-floor/context/zoom-context";

const ProductionFloorWidget = () => {
  const [view, setView] = useRecoilState(productionFloorViewState);
  const { query, replace, pathname, push } = useRouter();
  const { connectionId } = useProductionFloorSocketIO(view);
  const { groupsId, boardMissionsId, step, productType, isScanning } = query;
  const isMobile = useIsMobile();
  const mobileHeight = useMobileHeight();

  const {
    filterGroups,
    setFilterGroups,
    getStationFilterGroups,
    setSelectedGroupId,
    onClickMoveBoardMissionToDone,
    onOpenMarkReadyModalForHasJobs,
    openPackagesModal,
    onClosePrintDeliverTicketModal,
    selectedMission,
  } = useProductionFloorData();

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
        setView(EProductionFloorView[viewEnum]);
      }
    }
  }, [query, setView]);

  const onClose = () => {
    {
      const newRequestAbortController = new AbortController();
      const currentView = EProductionFloorView[view].toLowerCase();
      push(`/production-floor?view=${currentView}`, undefined, {
        shallow: true,
      });
      setAbortControllerStation(newRequestAbortController);
      setAbortControllerFiles(newRequestAbortController);
      setAbortControllerActivities(newRequestAbortController);
      setAbortControllerDetails(newRequestAbortController);
      // setFiles([]);
      // setStations([]);
      // setBoardMissionsDetails(null);
      // setActivities([]);
    }
  };

  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenFirstTime, setIsOpenFirstTime] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanningFlag, setIsScanningFlag] = useState(true);

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
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

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
    if (!data) return;
    setIsScanningFlag(false);
    setScanResult(data.text || String(data));
    handleBoardMissionsBarcodeActionsApi(data.text);
  };

  const handleError = (err: any) => {
    setIsScanningFlag(true);
  };

  const handleScanAgain = () => {
    setScanResult(null);
    setIsScanningFlag(true);
  };

  const handleBoardMissionsBarcodeActionsApi = async (barcode: string) => {
    barcode = barcode.replace(/½/g, "-");
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        setIsScanningFlag(true);
      } else {
        alertFaultUpdate();
      }
    };
    await handleBoardMissionsBarcodeActions(callApi, callBack, {
      barcode,
    });
  };

  //!here
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

  //const { isOpenDoneModal } = useQrCodeListener({ qrCodeListenerFrom: QR_CODE_LISTENER_FROM.PRODUCTION_FLOOR })
  const isOpenDoneModal = useModal();

  return (
    // <ZoomProvider>
    <Stack
      // padding={"0 20px"}
      gap={"10px"}
      height={"100%"}
      maxHeight={"100%"}
      overflow={"hidden"}
    >
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
        open={!!boardMissionsId}
        anchor={"bottom"}
        onClose={onClose}
      >
        <Stack
          paddingBottom={"10px"}
          width={"100vw"}
          // height={"calc(100vh - 50px)"}
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
        <QrListenerWidget listening={!!boardMissionsId} />
        {isScanning && isScanningFlag && !!boardMissionsId && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgcolor="#f7f7f7"
            p={3}
          >
            <Card
              sx={{
                width: "100%",
                maxWidth: 400,
                borderRadius: "15px",
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  align="center"
                  sx={{ mb: 2, fontWeight: "bold", color: "#2e3092" }}
                >
                  {t("productionFloor.QRScanner")}
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="textSecondary"
                  sx={{ mb: 3, fontWeight: "500" }}
                >
                  {t("productionFloor.scanQRCodeToProceed")}
                </Typography>
                {/* Conditionally render the QR scanner */}
                {isScanning && (
                  <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
                    <QrReader
                      delay={300}
                      facingMode="environment"
                      constraints={{
                        video: {
                          facingMode: "environment",
                          width: { ideal: 1280 },
                          height: { ideal: 720 },
                        },
                      }}
                      style={{
                        width: "100%",
                        maxWidth: "400px",
                        borderRadius: "20px",
                        border: "4px solid #2e3092",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                        padding: "10px",
                        height: "auto",
                        objectFit: "contain",
                      }}
                      onScan={handleScan}
                      onError={handleError}
                    />
                  </Box>
                )}
                {scanResult && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mt={2}
                  >
                    <Typography variant="body1" color="primary">
                      Scanned QR Code: {scanResult}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleScanAgain}
                      sx={{ mt: 2 }}
                    >
                      Scan Again
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
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
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        yesBtn={"boardMissions.markDoneModalYes"}
        noBtn={"boardMissions.markDoneModalNo"}
        openModal={isOpenDoneModal.isOpen}
        onClose={() => isOpenDoneModal.close()}
        onClickYes={() => onClickMoveBoardMissionToDone(true,true)}
        onClickNo={() => onClickMoveBoardMissionToDone(false,true)}
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
    </Stack>
    // </ZoomProvider>
  );
};

export { ProductionFloorWidget };
