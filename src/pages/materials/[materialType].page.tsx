import { CustomerAuthLayout } from "@/layouts";
import { MaterialsWidget } from "@/widgets/materials-widget/materials-widget";

export default function MaterialPage() {

    return (
        <CustomerAuthLayout customHeaderStyle={{ marginBottom: 0 }} >
            <MaterialsWidget isAdmin={false} />
        </CustomerAuthLayout>
    )
}