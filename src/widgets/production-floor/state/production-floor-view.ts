import {atom} from "recoil";

export enum EProductionFloorView {
    TABLE,
    KANBAN,
    GROUPS,
    DASHBOARD
}
export const productionFloorViewState = atom({
    default: EProductionFloorView.TABLE,
    key: 'productionFloorViewState'
});