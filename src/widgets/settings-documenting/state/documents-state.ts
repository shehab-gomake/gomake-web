import { atom } from "recoil";
import { IDocumentDesign , DocumentType  } from "../documentDesign/interface";
export const documentsArrayState = atom<[]>({
  key: "documentsArrayState",
  default: [],
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
