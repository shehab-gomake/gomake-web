import {IFilterGroup} from "@/widgets/production-floor/interfaces/filters";

export interface IProductionFloorPath {
    actionType: number,
    name: string;
    data: IFilterGroup;
    selected?: boolean;
}