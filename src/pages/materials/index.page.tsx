import {CustomerAuthLayout} from "@/layouts";
import {MaterialsTableComponent} from "@/widgets/materials-widget/components/materials-table/materials-table";

export default function MaterialsTablePage () {
    return (
        <CustomerAuthLayout>
            <MaterialsTableComponent/>
        </CustomerAuthLayout>
    )
}