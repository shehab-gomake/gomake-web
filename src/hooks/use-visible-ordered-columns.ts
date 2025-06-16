import {
  columnOrderState,
  columnVisibilityState,
} from "@/widgets/production-floor/state/production-floor-coulmns-table-settings";
import { useRecoilValue } from "recoil";

export const useVisibleOrderedColumns = () => {
  const columnOrder = useRecoilValue(columnOrderState);
  const columnVisibility = useRecoilValue(columnVisibilityState);

  return columnOrder.filter((key) => columnVisibility[key]);
};
