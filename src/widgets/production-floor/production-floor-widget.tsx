import { Fab, IconButton, Stack } from "@mui/material";
import { ProductionFloorHeader } from "@/widgets/production-floor/header/production-floor-header";
import { useRecoilState } from "recoil";
import {
  EProductionFloorView,
  productionFloorViewState,
} from "@/widgets/production-floor/state/production-floor-view";
import { useEffect } from "react";
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
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useIsMobile } from "@/hooks/use-responsive";

const ProductionFloorWidget = () => {
  const [view, setView] = useRecoilState(productionFloorViewState);
  const { query, replace, pathname, push } = useRouter();
  const { connectionId } = useProductionFloorSocketIO(view);
  const { groupsId, boardMissionsId, step, productType } = query;
  const isMobile = useIsMobile();

  const {
    filterGroups,
    setFilterGroups,
    getStationFilterGroups,
    updateStatus,
    setSelectedGroupId,
    handleOpenQRScanner,
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
        onClose={() => {
          const currentView = EProductionFloorView[view].toLowerCase();
          push(`/production-floor?view=${currentView}`, undefined, {
            shallow: true,
          });
        }}
      >
        <Stack
          paddingBottom={"10px"}
          width={"100vw"}
          height={"calc(100vh - 50px)"}
        >
          <IconButton
            onClick={() => {
              const currentView = EProductionFloorView[view].toLowerCase();
              push(`/production-floor?view=${currentView}`, undefined, {
                shallow: true,
              });
            }}
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
            <ClearRoundedIcon
              width={48}
              height={48}
              stroke={isMobile ? "black" : ""}
            />
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
      </Drawer>
      {/* QR scanner */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "#2e3092",
            color: "white",
            "&:hover": { backgroundColor: "#115293" },
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
          onClick={handleOpenQRScanner}
        >
          <QrCodeScannerIcon sx={{ fontSize: 28 }} />
        </Fab>
      )}
    </Stack>
  );
};

export { ProductionFloorWidget };
