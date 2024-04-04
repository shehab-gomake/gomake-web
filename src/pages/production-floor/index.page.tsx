import {CustomerAuthLayout} from "@/layouts";
import {ProductionFloorWidget} from "@/widgets/production-floor/production-floor-widget";

export default function  ProductionFloorPage() {
    return(
        <CustomerAuthLayout>
            <ProductionFloorWidget/>
        </CustomerAuthLayout>
    );
}