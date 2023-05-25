import {CustomerAuthLayout} from "@/layouts";
import {CategoriesTable} from "@/widgets/machines/customer/categories-table";

export default function CustomerMachinesPage() {
    return (
        <div>
            <CustomerAuthLayout>
            <h1>Categories</h1>
                <CategoriesTable/>
            </CustomerAuthLayout>
        </div>
    );
}