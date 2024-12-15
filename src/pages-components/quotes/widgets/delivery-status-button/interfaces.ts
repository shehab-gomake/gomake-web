export interface ITaskCategoryLabelProps {
  id: string;
  document: any;
}

export interface IUpdateDeliveryStatusModalProps {
  openModal: boolean;
  onCloseModal: () => void;
  document: any;
  documentItems: any;
}

export interface DeliveryStateDetails {
  deliveryDate: Date;
  recipientName: string;
  recipientNumber: string;
  recipientMail: string;
}
