import {atom} from "recoil";
import {EStatus} from "@/shared";

export const boardsMissionsStatusFilterState = atom<EStatus | null>({
    key: 'boards-filter', // unique ID (with respect to other atoms/selectors)
    default: null, // default value (aka initial value)
});
