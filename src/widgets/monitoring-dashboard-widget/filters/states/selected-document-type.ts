import { atom } from "recoil";
import { DocumentTypeEnums } from "@/enums/document-type-enum";

const selectedDocumentTypeState = atom<DocumentTypeEnums>({
  key: "selectedDocumentTypeState",
  default: DocumentTypeEnums.Order,
});

export { selectedDocumentTypeState };
