import { IStation } from "./filters";

export interface IFilterGroupsList {
  id: string;
  name: string;
  inProcessCount?: number;
  stuckCount?: number;
  color?: string | null;
  inProcessTotalProductionTime?: number;
}

export interface IStationFilterGroup {
  name: string;
  stations: IStation[];
  color?: string;
}
