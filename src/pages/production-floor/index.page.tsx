import {CustomerAuthLayout} from "@/layouts";
import {ProductionFloorWidget} from "@/widgets/production-floor-widget/production-floor-widget";

export default function  ProductionFloorPage() {
    return(
        <CustomerAuthLayout>
            <ProductionFloorWidget/>
        </CustomerAuthLayout>
    );
}