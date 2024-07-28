import { useRecoilValue } from "recoil";
import { OutSourceSupplierComponent } from "@/widgets/product-pricing-widget/components/outsource-suppliers/out-source-supplier";
import { outsourceSuppliersState } from "@/widgets/product-pricing-widget/state";
import { Stack } from "@mui/material";


const OutSourceSuppliers = ({ widgetType }) => {
    const suppliers = useRecoilValue(outsourceSuppliersState);
    return <Stack gap={'15px'}>
        {
            suppliers?.map(supplier => <OutSourceSupplierComponent {...supplier} widgetType={widgetType} />)
        }
    </Stack>
}
export { OutSourceSuppliers }

