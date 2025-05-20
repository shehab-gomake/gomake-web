import { atom } from "recoil";

export enum EProductionFloorView {
  TABLE,
  KANBAN,
  GROUPS,
  DASHBOARD,
  GANTT,
  FILTER_GROUPS,
  DONE_JOBS
}

export const productionFloorViewState = atom({
  default: EProductionFloorView.TABLE,
  key: "productionFloorViewState",
});
