import { useRecoilValue } from "recoil";
import { outsourceSuppliersState } from "@/widgets/product-pricing-widget/state";
import { Stack } from "@mui/material";
import { OutSourceSuppliersRowComponent } from "./out-source-suppliers-row";


const OutSourceSuppliers = ({ widgetType, onClickAddOutSourceAction, selectedWorkFlow, selectedWorkFlowCalculatedIsLoaded }) => {
    const suppliers = useRecoilValue(outsourceSuppliersState);
    return <Stack gap={'15px'}>
        {suppliers && suppliers.length > 0 && <OutSourceSuppliersRowComponent
            widgetType={widgetType}
            options={suppliers}
            onClickAddOutSourceAction={onClickAddOutSourceAction}
            selectedWorkFlow={selectedWorkFlow}
            selectedWorkFlowCalculatedIsLoaded={selectedWorkFlowCalculatedIsLoaded}
        />}
    </Stack>
}
export { OutSourceSuppliers }

