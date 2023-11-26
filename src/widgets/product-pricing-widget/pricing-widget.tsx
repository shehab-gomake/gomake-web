import {IPricingWidgetProps} from "@/widgets/product-pricing-widget/interface";
import Stack from "@mui/material/Stack";
import {
    GeneralInformationComponent
} from "@/widgets/product-pricing-widget/components/general-information/general-information-component";
import {ButtonGroup, Divider} from "@mui/material";
import {Actions} from "@/widgets/product-pricing-widget/components/action/action-component";
import {useEffect, useState} from "react";
import {PrimaryButton} from "@/components/button/primary-button";
import {WorkFlowsComponent} from "@/widgets/product-pricing-widget/components/work-flow/work-flow-component";
import {printHouseSuppliersState} from "@/widgets/product-pricing-widget/state";
import {useSetRecoilState} from "recoil";
import {useGomakeAxios} from "@/hooks";
import {getPrintHouseSuppliersListApi} from "@/services/api-service/suppliers/suppliers-endpoints";

const PricingWidget = ({workFlows}: IPricingWidgetProps) => {
    const [view, setView] = useState<number>(0);
    const setSuppliers = useSetRecoilState(printHouseSuppliersState);
    const selectedWorkFlow = workFlows?.find(flow => flow.selected);
    const {callApi} = useGomakeAxios();

    useEffect(() => {
        const callBack = (res) => {
            if (res.success) {
                setSuppliers(res.data?.map(({name, id}) => ({label: name, value: id})));
            }
        }
        getPrintHouseSuppliersListApi(callApi, callBack).then()
    }, [])

    return (
        <Stack gap={'16px'} width={'100%'}>
            {workFlows && <Stack direction={"row"}>
                <ButtonGroup orientation={'horizontal'}>
                    <PrimaryButton onClick={() => setView(0)} sx={{width: '200px'}}
                                   variant={view === 0 ? 'contained' : 'outlined'}>selected</PrimaryButton>
                    <PrimaryButton onClick={() => setView(1)} sx={{
                        width: '200px'
                    }}
                                   variant={view === 1 ? 'contained' : 'outlined'}>others</PrimaryButton>
                </ButtonGroup>
            </Stack>}
            {selectedWorkFlow && <GeneralInformationComponent details={selectedWorkFlow?.generalInformation}/>}
            <Divider/>
            {selectedWorkFlow && view === 0 && <Actions actions={selectedWorkFlow?.actions}/>}
            {workFlows && view === 1 && <WorkFlowsComponent showSelected={() => setView(0)} workflows={workFlows}/>}
        </Stack>
    );
}
export {PricingWidget}