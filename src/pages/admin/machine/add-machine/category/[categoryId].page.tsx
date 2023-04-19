import {AdminAuthLayout} from "@/layouts";
import {AddMachine} from "@/widgets/admin-machines/add-machine";

export default function AdminAddMachine() {
    return (
        <AdminAuthLayout>
            <AddMachine/>
        </AdminAuthLayout>
    );
}