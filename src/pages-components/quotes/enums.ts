
export enum DOCUMENT_TYPE{
    quote = 0,
    order = 1,
    deliveryNote = 2,
    invoice = 3,
    receipt = 4
}

export enum QUOTE_STATUSES{
    Create = 1,
    Open= 2,
    Closed= 3,
    Canceled= 4,
    Waiting= 5,
    Approved= 6,
    CanceledIrrelvant= 7,
    CanceledPrice= 8,
    CanceledDeliveryTime= 9,
    CanceledOther= 10,
    ApprovedByManager=11,
    RejectedByManager=12,
    PartialClosed=13,
    WaitForPrintHouseConfirm=14,
}

export enum EStatisticsLabels {
    SUCCESS_RATE="successRate",
    MONTHLY_PERFORMANCE="Monthly Performance",
    APPROVED= "approved",
    WAITING= "waiting",
    PENDING="Pending",
    ORDERS="Orders",
    CANCELED= "canceled"
  }
  