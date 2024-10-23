export interface IPayment {
    dueDate: string;
    paymentDate: string;
    amount: number;
    manualTransaction: boolean;
    invoiceNumber: string;
    receiptNumber: string;
}