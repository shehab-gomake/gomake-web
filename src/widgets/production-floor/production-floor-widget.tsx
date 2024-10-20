import { IconButton, Stack } from "@mui/material";
import { ProductionFloorHeader } from "@/widgets/production-floor/header/production-floor-header";
import { useRecoilState } from "recoil";
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
import { useProductionFloorSignalr } from "@/hooks/signalr/use-production-floor-signalr";
import { ProductionFloorFilters } from "./filters/production-floor-filters";
import { useProductionFloorData } from "./use-production-floor-data";

const ProductionFloorWidget = () => {
  const [view, setView] = useRecoilState(productionFloorViewState);
  const [openBoardMissionsDrawer, setOpenBoardMissionsDarawer] =
    useState<boolean>(false);
  const { query, replace, pathname, } = useRouter();
  const router = useRouter()
  const { connectionId, closeConnection } = useProductionFloorSignalr();
  const { groupsId, boardMissionsId, step, productType } = query;

  const {
    filterGroups,
    setFilterGroups,
    getStationFilterGroups,
    updateStatus,
  } = useProductionFloorData();

  useEffect(() => {
    getStationFilterGroups();
  }, []);

  useEffect(() => {
    setOpenBoardMissionsDarawer(!!boardMissionsId);
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

  useEffect(() => {
    return () => {
      closeConnection();
    };
  }, []);

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
      />
      {view !== EProductionFloorView.DASHBOARD && (
        <ProductionFloorFilters
          filterGroups={filterGroups}
          getStationFilterGroups={getStationFilterGroups}
        />
      )}
      <Stack overflow={"auto"} maxHeight={"100%"}>
        {view === EProductionFloorView.DASHBOARD ? (
          <DashboardWidget />
        ) : view === EProductionFloorView.GROUPS ? (
          <GroupsTable />
        ) : (
          <ProductionFloorBoardMissionsViews connectionId={connectionId} />
        )}
        <QrListenerWidget listening={!boardMissionsId} />
      </Stack>
      {/* here */}
      <Drawer
        sx={{ zIndex: 999999 }}
        open={openBoardMissionsDrawer}
        anchor={"bottom"}
        onClose={() => {
          setOpenBoardMissionsDarawer(false);
          // router.push('/production-floor');
          // replace("/production-floor", undefined, { shallow: true });
        }}
      >
        <Stack
          paddingBottom={"10px"}
          width={"100vw"}
          height={"calc(100vh - 50px)"}
        >
          <IconButton
            onClick={() => {
              setOpenBoardMissionsDarawer(false);
              // router.push('/production-floor');
              // replace("/production-floor", undefined, { shallow: true });
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
            <ClearRoundedIcon width={48} height={48} />
          </IconButton>
          {openBoardMissionsDrawer && (
            <BoardMissionsComponent
              updateStatus={updateStatus}
              connectionId={connectionId}
              productType={!!productType ? productType.toString() : ""}
              step={step?.toString()}
              boardMissionsId={boardMissionsId?.toString()}
            />
          )}
        </Stack>
        <FilesUploaderWidget />
        <QrListenerWidget listening={!!boardMissionsId} />
      </Drawer>
    </Stack>
  );
};

export { ProductionFloorWidget };
