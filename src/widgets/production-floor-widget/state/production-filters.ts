import {atom, selector} from "recoil";
import {IProductionFloorFilter} from "@/widgets/production-floor-widget/interface";

export const productionFloorFiltersState = atom<IProductionFloorFilter>({
    key: "productionFloorFiltersState",
    default: {}
});

export const productionFilterSelectedStatusesState = selector<string[]>({
    key: 'filterSelectedStatusesState',
    get: ({get}) => {
        const filters = get(productionFloorFiltersState);
        return filters?.statusIds ? filters?.statusIds : [];
    },
});

export const productionFilterSelectedStationIdsState = selector<string[]>({
    key: 'filterSelectedStationIdsState',
    get: ({get}) => {
        const filters = get(productionFloorFiltersState);
        return filters?.stationId ? filters?.stationId : [];
    },
});