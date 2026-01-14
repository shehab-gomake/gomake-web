import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

export interface ITaskCategoryLabelProps {
  id: string;
  document: any;
  documentType: DOCUMENT_TYPE;
  openModalOnClick?: boolean;
  onClickOpenMoveOrderToReadyModal: any;
  getAllQuotes?: () => Promise<void>;
}

export interface IUpdateDeliveryStatusModalProps {
  openModal: boolean;
  onCloseModal: () => void;
  document: any;
  documentItems: any;
  documentId: string;
  documentNumber?: string;
  editableQuantities?: any;
  setEditableQuantities?: any;
  setDocumentItems?: any;
  clientContacts?: any;
  documentType: DOCUMENT_TYPE;
  onClickOpenMoveOrderToReadyModal: any;
  getAllQuotes?: () => Promise<void>;
}

export interface DeliveryStateDetails {
  //  deliveryDate?: Date;
  contactEmail: string;
  contactPhone: string;
  contactName: string;
}
