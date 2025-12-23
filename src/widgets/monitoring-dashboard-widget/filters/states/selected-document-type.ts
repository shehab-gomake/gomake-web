import { atom } from "recoil";
import { DocumentTypeEnums } from "@/enums/document-type-enum";

const selectedDocumentTypeState = atom<DocumentTypeEnums | number>({
  key: "selectedDocumentTypeState",
  default: DocumentTypeEnums.Order,
});

export { selectedDocumentTypeState };
