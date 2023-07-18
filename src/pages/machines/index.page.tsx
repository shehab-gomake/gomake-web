import {CustomerAuthLayout} from "@/layouts";
import {CategoriesTable} from "@/widgets/machines/components/categories-table/categories-table";

export default function CustomerMachinesPage() {
    return (
        <div>
            <CustomerAuthLayout>
                <CategoriesTable isAdmin={false}/>
            </CustomerAuthLayout>
        </div>
    );
}