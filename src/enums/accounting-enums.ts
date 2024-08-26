export enum DebitLimitTypes {
    NoLimit = 1,
    Limited,
    WarningMessage
}

export enum EnumVATStatus {
    Must = 1,
    Exempt,
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
}