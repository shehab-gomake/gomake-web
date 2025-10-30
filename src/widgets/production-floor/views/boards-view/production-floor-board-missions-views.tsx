import { useRecoilState } from "recoil";
import {
  EProductionFloorView,
  productionFloorViewState,
} from "@/widgets/production-floor/state/production-floor-view";
import { ProductionFloorTableView } from "@/widgets/production-floor/table-view/production-floor-table-view";
import { ProductionFloorKanbanBoard } from "@/widgets/production-floor/kanban-view/production-floor-kanban-board";
import { useProductionFloorData } from "@/widgets/production-floor/use-production-floor-data";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Stack from "@mui/material/Stack";
import { Skeleton } from "@mui/material";
import { productionFloorFiltersState } from "@/widgets/production-floor/state/production-floor-filters";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { useJobsTableSocketIo } from "@/hooks/socket-io/use-jobs-table-socket-io";
import {
  allColumnKeys,
  columnOrderState,
  ColumnSetting,
  columnVisibilityState,
  parseSavedColumnSettings,
} from "../../state/production-floor-coulmns-table-settings";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { getProductionFloorTableSettingsApi } from "@/services/api-service/production-floor/production-floor-table-settings";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
const ProductionFloorBoardMissionsViews = ({
  connectionId,
}: {
  connectionId: string;
}) => {
  const [view] = useRecoilState(productionFloorViewState);
  const { getData, updateStatus, getAllBoardMissions } =
    useProductionFloorData();

  const [loading, setLoading] = useState<boolean>(false);
  const [filter] = useRecoilState(productionFloorFiltersState);
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const [columnVisibility, setColumnVisibility] = useRecoilState(
    columnVisibilityState
  );
  const [columnOrder, setColumnOrder] = useRecoilState(columnOrderState);
  const { isSocketUpdateJobsTable, setIsSocketUpdateJobsTable } =
    useJobsTableSocketIo();
  const { CheckPermission } = useUserPermission();
  // Use refs to prevent infinite loops
  const hasInitializedRef = useRef(false);
  const lastConnectionIdRef = useRef<string | null>(null);
  const lastViewRef = useRef<EProductionFloorView | null>(null);

  // Memoized effect to prevent unnecessary re-renders
  const shouldFetchData = useMemo(() => {
    return !!connectionId && !isSocketUpdateJobsTable;
  }, [connectionId, isSocketUpdateJobsTable]);

  useEffect(() => {
    // Prevent multiple calls for the same view
    if (lastViewRef.current === view) {
      return;
    }
    lastViewRef.current = view;

    if (view === EProductionFloorView.DONE_JOBS) {
      // Default sort by readyDate descending
      const defaultSortOrder = [
        {
          column: 2, // ReadyDate
          dir: "desc",
        },
      ];
      getAllBoardMissions(undefined, undefined, undefined, defaultSortOrder);
    } else if (view === EProductionFloorView.TABLE) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useEffect(() => {
    if (shouldFetchData && !hasInitializedRef.current) {
      const loadColumnSettings = async () => {
        try {
          const res = await getProductionFloorTableSettingsApi(
            callApi,
            () => {}
          );
          const saved: ColumnSetting[] = res?.data;

          const filteredKeys = allColumnKeys.filter(
            (key) =>
              key !== "checkbox" ||
              CheckPermission(
                Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
              )
          );

          if (saved && saved.length > 0) {
            // Parse saved settings and preserve existing column states
            const { order, visibility } = parseSavedColumnSettings(
              saved,
              filteredKeys
            );

            // Filter the results based on permissions
            const filteredVisibility = Object.fromEntries(
              filteredKeys.map((key) => [key, visibility[key] ?? false])
            );
            const filteredOrder = order.filter((key) =>
              filteredKeys.includes(key)
            );

            setColumnOrder(filteredOrder);
            setColumnVisibility(filteredVisibility);
          } else {
            setColumnOrder(filteredKeys);
            setColumnVisibility(
              Object.fromEntries(filteredKeys.map((key) => [key, true]))
            );
          }
        } catch (e) {
          console.error("Failed to load column settings", e);
          // Use default settings on error
          const filteredKeys = allColumnKeys.filter(
            (key) =>
              key !== "checkbox" ||
              CheckPermission(
                Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
              )
          );
          setColumnOrder(filteredKeys);
          setColumnVisibility(
            Object.fromEntries(filteredKeys.map((key) => [key, false])) // Default to false (unchecked)
          );
        }
        hasInitializedRef.current = true;
        lastConnectionIdRef.current = connectionId;
        setLoading(true);
        getData(connectionId)
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching production floor data:", error);
            setLoading(false);
          });
      };

      loadColumnSettings();
    }
  }, [shouldFetchData, connectionId]);

  // Handle connection ID changes
  /*useEffect(() => {
    if (connectionId && lastConnectionIdRef.current !== connectionId) {
      lastConnectionIdRef.current = connectionId;
      setLoading(true);
      getData(connectionId)
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching production floor data:", error);
          setLoading(false);
        });
    }
  }, [connectionId]);*/

  useEffect(() => {
    if (!!isSocketUpdateJobsTable) {
      // Use a more efficient update mechanism for socket updates
      const updateData = async () => {
        try {
          await getData(connectionId);
        } catch (error) {
          console.error("Error updating data from socket:", error);
        }
      };
      updateData();
      setIsSocketUpdateJobsTable(false);
    }
  }, [connectionId, isSocketUpdateJobsTable, setIsSocketUpdateJobsTable]);

  // Render loading skeleton with optimized structure
  const renderLoadingSkeleton = useCallback(
    () => (
      <Stack gap={"10px"}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={`skeleton-${index}`}
            variant="rounded"
            width={"100%"}
            height={60}
          />
        ))}
      </Stack>
    ),
    []
  );

  // Memoized content to prevent unnecessary re-renders
  const renderContent = useMemo(() => {
    if (loading) {
      return renderLoadingSkeleton();
    }

    if (
      filter?.stations?.length === 0 &&
      view !== EProductionFloorView.DONE_JOBS
    ) {
      return (
        <span style={classes.noStationSelected}>
          {t("productionFloor.noStationsSelected")}
        </span>
      );
    }

    if (
      view === EProductionFloorView.TABLE ||
      view === EProductionFloorView.FILTER_GROUPS ||
      view === EProductionFloorView.DONE_JOBS
    ) {
      return (
        <ProductionFloorTableView
          connectionId={connectionId}
          updateStatus={updateStatus}
          getData={getData}
        />
      );
    }

    if (view === EProductionFloorView.KANBAN) {
      return <ProductionFloorKanbanBoard />;
    }

    return <div />;
  }, [
    loading,
    filter?.stations?.length,
    view,
    connectionId,
    updateStatus,
    renderLoadingSkeleton,
    classes.noStationSelected,
    t,
  ]);

  return <>{renderContent}</>;
};

export { ProductionFloorBoardMissionsViews };
