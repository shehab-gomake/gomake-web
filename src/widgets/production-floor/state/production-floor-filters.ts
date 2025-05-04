import { atom, selector } from "recoil";
import { IProductionFloorFilter } from "../interfaces/filters";
import { CurrentStationOrderingEnum } from "@/enums";

export const productionFloorFiltersState = atom<IProductionFloorFilter>({
  key: "productionFloorFiltersState",
  default: {
    automatedTags: [],
    stations: [],
    stationOrdering: CurrentStationOrderingEnum.ASC
  } as IProductionFloorFilter,
});

export const productionFilterSelectedStatusesState = selector<string[]>({
  key: "filterSelectedStatusesState",
  get: ({ get }) => {
    const filters = get(productionFloorFiltersState);
    return filters?.statusIds ? filters?.statusIds : [];
  },
});
