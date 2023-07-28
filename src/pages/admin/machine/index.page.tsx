import {AdminAuthLayout} from "@/layouts";
import {CategoriesTable} from "@/widgets/machines/components/categories-table/categories-table";

export default function CustomerMachinesPage() {
    return (
        <div>
            <AdminAuthLayout>
                <CategoriesTable isAdmin={true}/>
            </AdminAuthLayout>
        </div>
    );
}