import {AdminAuthLayout} from "@/layouts";
import {MachineCategories} from "@/widgets/admin-machines/categories/machine-categories";

export default function CategoriesPage () {
    return (
        <AdminAuthLayout>
            <MachineCategories/>
        </AdminAuthLayout>
    );
}