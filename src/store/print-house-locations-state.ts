import {atom} from "recoil";
export interface IPrintHouseLocation {
    name: string;
    id: string;
    country : string;
    city: string;
    street: string;
    streetNumber: string;
    zipCode: string;
    po: string;
}
export const printHouseLocationsState = atom<IPrintHouseLocation[]>({
    default: [],
    key: 'printHouseLocationsState'
})