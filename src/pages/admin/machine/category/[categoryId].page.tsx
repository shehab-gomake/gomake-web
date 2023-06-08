import {AdminAuthLayout} from "@/layouts";
import {AdminUpdateMachine} from "@/widgets/machines/admin/admin-update-machine";

export default function Machine() {

    return (
        <AdminAuthLayout>
            <div>
                <AdminUpdateMachine/>
            </div>
        </AdminAuthLayout>
    );
};

