import {AdminAuthLayout, CustomerAuthLayout} from "@/layouts";
import {AdminAddMachine} from "@/widgets/machines/admin/admin-add-machine";

export default function AdminAddMachinePage() {
    return (
        <CustomerAuthLayout>
            <AdminAddMachine/>
        </CustomerAuthLayout>
    );
}