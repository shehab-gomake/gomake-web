import {atom, selector} from "recoil";
import {IProductionFloorFilter} from "@/widgets/production-floor/interfaces/filters";

export const productionFloorFiltersState = atom<IProductionFloorFilter>({
    key: 'productionFloorFiltersState',
    default: {
        automatedTags: [],
        stations: [],
    } as IProductionFloorFilter
});

export const productionFilterSelectedStatusesState = selector<string[]>({
    key: 'filterSelectedStatusesState',
    get: ({get}) => {
        const filters = get(productionFloorFiltersState);
        return filters?.statusIds ? filters?.statusIds : [];
    },
});

