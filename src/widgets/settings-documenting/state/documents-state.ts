import { atom } from "recoil";
import { IDocument } from "../documentNumbering/interface/document";
import { IDocumentDesign , DocumentType  } from "../documentDesign/interface";

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
export const documentTypeState = atom<DocumentType[]>({
  key: 'documentTypeState',
  default: {}  as DocumentType[],
});
export const documentDesignState = atom<IDocumentDesign>({
  key: 'documentDesignState',
  default: {} as IDocumentDesign,
});
export const documentDesignURLState = atom({
  key: 'documentDesignURLState',
  default: "" ,
});
export const documentDesignTypeTextState = atom({
  key: 'documentDesignTypeTextState',
  default: "" ,
});
