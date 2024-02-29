import { CustomerAuthLayout } from "@/layouts";
import { DepositPageWidget } from "@/pages-components/deposit/deposit";
import { DEPOSIT_ACTIONS } from "@/pages-components/deposit/enums";

export default function CreateDeposit() {
    
    return (
        <CustomerAuthLayout>
            <DepositPageWidget actionType={DEPOSIT_ACTIONS.Create} />
        </CustomerAuthLayout>
    );
}
