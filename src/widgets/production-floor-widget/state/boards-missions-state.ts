import {atom} from "recoil";
import {IBoard} from "@/widgets/production-floor-widget/interface";

export const boardsMissionsState = atom<IBoard[]>({
    key: "boardsMissionsState",
    default: [],
});

export const boardsMissionsSelectedIdsState = atom<string[]>({
    key: "boardsMissionsSelectedIdsState",
    default: [],
});

export const isLoadingMoreBoardsState =  atom<boolean>({
    key: 'isLoadingMoreBoardsState',
    default: false
})