import { CustomerAuthLayout } from "@/layouts";
import { CreditCardTransactionsWidget } from "@/pages-components/credit-card-transactions/credit-card-transactions";

export default function CreditCardTransactions() {
  return (
    <CustomerAuthLayout >
        <CreditCardTransactionsWidget/>
    </CustomerAuthLayout>
  );
}
