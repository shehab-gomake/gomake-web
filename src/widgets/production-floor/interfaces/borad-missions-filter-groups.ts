import { IStation } from "./filters";

export interface IFilterGroupsList {
  id: string;
  name: string;
}

export interface IStationFilterGroup {
  name: string;
  stations: IStation[];
}
