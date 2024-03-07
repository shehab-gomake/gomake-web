import { CustomerAuthLayout } from "@/layouts";
import { DepositPageWidget } from "@/pages-components/deposit/deposit";
import { DEPOSIT_ACTIONS } from "@/pages-components/deposit/enums";

export default function ShowDeposit() {
  
  return (
    <CustomerAuthLayout>
      <DepositPageWidget actionType={DEPOSIT_ACTIONS.Show} />
    </CustomerAuthLayout>
  );
}
