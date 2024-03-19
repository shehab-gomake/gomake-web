import { CustomerAuthLayout } from "@/layouts";
import { MaterialsWidget } from "@/widgets/materials-widget/materials-widget";

export default function MaterialPage() {

    return (
        <CustomerAuthLayout>
            <MaterialsWidget isAdmin={false} />
        </CustomerAuthLayout>
    )
}