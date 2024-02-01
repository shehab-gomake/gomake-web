import { atom } from "recoil";

export const printHouseProfile = atom<IPrintHouseProfile>({
    key: "printHouseProfile",
    default: {} as IPrintHouseProfile,
});

export interface IPrintHouseProfile {
    id: string,
    name: string,
    logo: string | null;
    pdfLogo: string | null;
    loginLogo: string | null;
    country: string,
}