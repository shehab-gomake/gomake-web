export enum DebitLimitTypes {
  NoLimit = 1,
  Limited,
  WarningMessage,
}

export enum EnumVATStatus {
  //  Must18Percents = 0,
  MustXPercents = 0,
  Must17Percents,
  Must16Percents,
  Exempt
}

export enum EnumInvoiceClosureMethod {
  accounting = 0,
  internalAndAccounting,
}

export enum EnumTermsPayment {
  BasicCash = 1,
  SpreadPayments,
  Net30EomSuppliers,
  Net30Eom,
  Net45EomSuppliers,
  Net45Eom,
  Net60EomSuppliers,
  Net60Eom,
  Prepayment,
  Net90Eom,
  Net120Eom,
  Net70Eom,
}

export enum BodyTypeEnum {
  Mail,
  SMS,
  Whatsapp,
}
