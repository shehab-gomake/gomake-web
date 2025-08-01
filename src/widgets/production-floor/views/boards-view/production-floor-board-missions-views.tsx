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

const ProductionFloorBoardMissionsViews = ({
  connectionId,
}: {
  connectionId: string;
}) => {
  const [view] = useRecoilState(productionFloorViewState);
  const { getData, updateStatus } = useProductionFloorData();
  const [loading, setLoading] = useState<boolean>(false);
  const [filter] = useRecoilState(productionFloorFiltersState);
  const { t } = useTranslation();
  const { classes } = useStyle();

  const { isSocketUpdateJobsTable, setIsSocketUpdateJobsTable } = useJobsTableSocketIo();

  // Use refs to prevent infinite loops
  const hasInitializedRef = useRef(false);
  const lastConnectionIdRef = useRef<string | null>(null);

  // Memoized effect to prevent unnecessary re-renders
  const shouldFetchData = useMemo(() => {
    return !!connectionId && !isSocketUpdateJobsTable;
  }, [connectionId, isSocketUpdateJobsTable]);

  useEffect(() => {
    if (shouldFetchData && !hasInitializedRef.current) {
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
    }
  }, [shouldFetchData, connectionId]);

  // Handle connection ID changes
  useEffect(() => {
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
  }, [connectionId]);

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
  const renderLoadingSkeleton = useCallback(() => (
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
  ), []);

  // Memoized content to prevent unnecessary re-renders
  const renderContent = useMemo(() => {
    if (loading) {
      return renderLoadingSkeleton();
    }

    if (filter?.stations?.length === 0 && view !== EProductionFloorView.DONE_JOBS) {
      return (
        <span style={classes.noStationSelected}>
          {t("productionFloor.noStationsSelected")}
        </span>
      );
    }

    if (view === EProductionFloorView.TABLE ||
        view === EProductionFloorView.FILTER_GROUPS ||
        view === EProductionFloorView.DONE_JOBS) {
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
  }, [loading, filter?.stations?.length, view, connectionId, updateStatus, renderLoadingSkeleton, classes.noStationSelected, t]);

  return <>{renderContent}</>;
};

export { ProductionFloorBoardMissionsViews };
