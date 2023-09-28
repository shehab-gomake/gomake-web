import { atom } from "recoil";
import { IDocument } from "../documentNumbering/interface/document";

export const initState: IDocument = {
  docType: "",
  documentName: "",
  prefix: "",
  value: 0 ,
  nextValue: 0 ,
};

export const documentState = atom<IDocument>({
  key: "documentState",
  default: initState,
});

export const documentsArrayState = atom<[][]>({
  key: "documentsArrayState",
  default: [],
});

export const openModalState = atom<boolean>({
  key: "openModalState",
  default: false,
});

