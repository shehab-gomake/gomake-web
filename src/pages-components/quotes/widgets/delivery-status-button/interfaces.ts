export interface ITaskCategoryLabelProps {
  id: string;
  label?: string;
  delStatusColor?: string;
  documentItem?: any;
}

export interface IUpdateDeliveryStatusModalProps {
  openModal: boolean;
  onCloseModal: () => void;
  documentItem: any;
}

export interface DeliveryStateDetails {
  deliveryDate: Date;
  recipientName: string;
  recipientNumber: string;
  recipientMail: string;
}
