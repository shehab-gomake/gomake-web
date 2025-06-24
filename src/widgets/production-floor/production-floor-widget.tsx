import { Box, IconButton, Stack } from "@mui/material";
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
import { abortControllerActivitiesState, abortControllerFilesState, abortControllerStationState, getBoardMissionsByIdState } from "./views/board-missions-view/stations/state";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums/tabs-icon-enums";
import { getBoardMissionsIdByQrCodeApi, updateBoardMissionCurrentStationApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { useTranslation } from "react-i18next";
import QrReader from "react-qr-scanner";
import { useGomakeRouter } from "@/hooks";

const ProductionFloorWidget = () => {
  const [view, setView] = useRecoilState(productionFloorViewState);
  const { query, replace, pathname, push } = useRouter();
  const { connectionId } = useProductionFloorSocketIO(view);
  const { groupsId, boardMissionsId, step, productType, isScanning } = query;
  const isMobile = useIsMobile();
  const mobileHeight = useMobileHeight();

  // const setFiles = useSetRecoilState(boardMissionsFilesState);
  // const setStations = useSetRecoilState(boardMissionsStationsState);
  // const setBoardMissionsDetails = useSetRecoilState(boardMissionsDetailsState);
  // const setActivities = useSetRecoilState(boardMissionsActivitiesState);

  const {
    filterGroups,
    setFilterGroups,
    getStationFilterGroups,
    setSelectedGroupId,
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

  /*useEffect(() => {
    return () => {
      closeConnection();
    };
  }, []);*/
  const setAbortControllerStation = useSetRecoilState(abortControllerStationState);
  const setAbortControllerFiles = useSetRecoilState(abortControllerFilesState);
  const setAbortControllerActivities = useSetRecoilState(abortControllerActivitiesState);
  const setAbortControllerDetails = useSetRecoilState(getBoardMissionsByIdState);

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
    };
  };

  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenFirstTime, setIsOpenFirstTime] = useState(false);

  useEffect(() => {
    if (isScanning && !isOpenFirstTime) {
      setIsOpenModal(true);
    }
  }, [isScanning, isOpenFirstTime]);

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setIsOpenFirstTime(true);
  }

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

  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanningFlag, setIsScanningFlag] = useState(false);
  useEffect(() => {
    if (!isScanningFlag) {
      handleScanAgain();
    }
  }, [isScanningFlag]);

  const handleScan = async (data: { text: string } | null) => {
    if (!data) return;
    try {
      await getBoardMissionsIdByQrCodeApi(
        callApi,
        (res) => {
          if (res?.success) {
            setIsOpenModal(true);
          } else {
            setScanResult("Invalid QR Code or No Board Mission Found");
          }
        },
        data.text
      );

    } catch (error) {
      console.error("QR Scan error:", error);
    }
  };
  const handleError = (err: any) => {
    console.error("QR Scan error:", err);
  };

  const handleScanAgain = () => {
    setScanResult(null);
    setIsScanningFlag(true); // Show the scanner again
  };

  return (
    <Stack
      padding={"0 20px"}
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
        <ProductionFloorFilters
          getStationFilterGroups={getStationFilterGroups}
          connectionId={connectionId}
          isMobile={isMobile}
          view={view}
        />
      )}
      <Stack overflow={"auto"} maxHeight={"100%"}>
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
        {isScanning && isScanningFlag && isMobile && !!boardMissionsId && (
          <Box display="flex" justifyContent="center" >
            <QrReader
              delay={300}
              facingMode="environment"
              constraints={{
                video: { facingMode: { exact: "environment" } },
              }}
              style={{
                width: "100%",
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
      </Drawer>
      <GoMakeDeleteModal
        hideIcon={true}
        modalType={ModalType.WARNING}
        title={t("customers.modal.nextStationModalTitle")}
        yesBtn={t("sales.quote.yesBtn")}
        cancelBtn={t("modal.no")}
        openModal={isOpenModal}
        onClose={handleCloseModal}
        onClickDelete={() => {
          onUpdateToNextStation(boardMissionsId?.toString(), productType?.toString());
        }}
      />

      <QRScannerFab />

    </Stack>
  );
};

export { ProductionFloorWidget };
