import { atom } from "recoil";
import { IDocumentDesign } from "../documentDesign/interface";
export const documentsArrayState = atom<[]>({
  key: "documentsArrayState",
  default: [],
});
export const documentTypeState = atom<[]>({
  key: 'documentTypeState',
  default: [],
});
export const documentDesignState = atom<IDocumentDesign>({
  key: 'documentDesignState',
  default: {} as IDocumentDesign,
});
