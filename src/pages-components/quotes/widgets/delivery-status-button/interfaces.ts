export interface ITaskCategoryLabelProps {
  id: string;
  document: any;
}

export interface IUpdateDeliveryStatusModalProps {
  openModal: boolean;
  onCloseModal: () => void;
  document: any;
  documentItems: any;
  editableQuantities?: any;
  setEditableQuantities?: any;
  setDocumentItems?: any;
}

export interface DeliveryStateDetails {
  deliveryDate: Date;
  recipientName: string;
  recipientNumber: string;
  recipientMail: string;
}
