import { useRecoilState } from "recoil";
import {
  EProductionFloorView,
  productionFloorViewState,
} from "@/widgets/production-floor/state/production-floor-view";
import { ProductionFloorTableView } from "@/widgets/production-floor/table-view/production-floor-table-view";
import { ProductionFloorKanbanBoard } from "@/widgets/production-floor/kanban-view/production-floor-kanban-board";
import { useProductionFloorData } from "@/widgets/production-floor/use-production-floor-data";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!!connectionId && !isSocketUpdateJobsTable) {
      setLoading(true);
      getData(connectionId).then(() => setLoading(false));
    }
  }, [connectionId]);

  useEffect(() => {
    if (!!isSocketUpdateJobsTable) {
      // setLoading(true);
      getData(connectionId);
      setIsSocketUpdateJobsTable(false)
    }
  }, [connectionId, isSocketUpdateJobsTable]);

  return (
    <>
      {loading ? (
        <Stack gap={"10px"}>
          {[...new Array(5)].map((_) => (
            <Skeleton variant="rounded" width={"100%"} height={60} />
          ))}
        </Stack>
      ) : filter?.stations?.length === 0 &&
        view !== EProductionFloorView.DONE_JOBS ? (
        <span style={classes.noStationSelected}>
          {t("productionFloor.noStationsSelected")}
        </span>
      ) : view === EProductionFloorView.TABLE ||
        view === EProductionFloorView.FILTER_GROUPS ||
        view === EProductionFloorView.DONE_JOBS ? (
        <ProductionFloorTableView connectionId={connectionId} updateStatus={updateStatus} getData={getData} />
      ) : view === EProductionFloorView.KANBAN ? (
        <ProductionFloorKanbanBoard />
      ) : (
        <div />
      )}
    </>
  );
};

export { ProductionFloorBoardMissionsViews };
