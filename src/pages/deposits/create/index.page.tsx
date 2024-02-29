import { CustomerAuthLayout } from "@/layouts";
import { DepositPageWidget } from "@/pages-components/deposit/deposit";

export default function CreateDeposit() {
    return (
        <CustomerAuthLayout>
            <DepositPageWidget actionType="create"/>
        </CustomerAuthLayout>
    );
}
