import {AdminAuthLayout} from "@/layouts";
import {AdminCategoriesTable} from "@/widgets/machines/admin/admin-categories-table";

export default function CustomerMachinesPage() {
    return (
        <div>
            <AdminAuthLayout>
                <AdminCategoriesTable/>
            </AdminAuthLayout>
        </div>
    );
}