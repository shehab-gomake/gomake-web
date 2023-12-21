import { atom } from "recoil";

export interface IContactData {
  id: string;
  clientId: string;
  mail: string | null;
  name: string;
  phone: string | null;
}

export const clientContactsState = atom<IContactData[]>({
  key: "clientContactsState",
  default: [],
});
