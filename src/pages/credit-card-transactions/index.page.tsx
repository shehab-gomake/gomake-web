import { CustomerAuthLayout } from "@/layouts";
import { CreditCardTransactionsWidget } from "@/pages-components/credit-card-transactions/credit-card-transactions";
import { Permissions } from "../../components/CheckPermission/enum";

export default function CreditCardTransactions() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_CREDIT_CARD_TRANSACTIONS}>
        <CreditCardTransactionsWidget/>
    </CustomerAuthLayout>
  );
}
