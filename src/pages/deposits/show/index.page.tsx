import { CustomerAuthLayout } from "@/layouts";
import { DepositPageWidget } from "@/pages-components/deposit/deposit";

export default function ShowDeposit() {
  return (
    <CustomerAuthLayout>
            <DepositPageWidget actionType="show" />
    </CustomerAuthLayout>
  );
}
