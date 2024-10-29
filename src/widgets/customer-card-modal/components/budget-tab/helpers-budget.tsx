export enum BudgetStatus {
  Active,
  InActive
}

export enum PaymentStatus {
  FullyPaid,
  PayWhenOrderCreation,
  PayWhenOrderFinished,
  ByClientPaymentTerms
}

export const getBudgetStatusText = (status) => {
  switch (status) {
    case BudgetStatus.Active:
      return "Active";
    case BudgetStatus.InActive:
      return "Inactive";
    default:
      return "Unknown Status";
  }
};
export const getPaymentStatusText = (status) => {
  switch (status) {
    case PaymentStatus.FullyPaid:
      return "Fully Paid";
    case PaymentStatus.PayWhenOrderCreation:
      return "Pay When Order Creation";
    case PaymentStatus.PayWhenOrderFinished:
      return "Pay When Order Finished";
    case PaymentStatus.ByClientPaymentTerms:
      return "By Client Payment Terms";
    default:
      return "Unknown Payment Status";
  }
};

