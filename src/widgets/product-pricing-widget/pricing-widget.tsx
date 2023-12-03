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
import {InOutSourceSelect} from "@/widgets/product-pricing-widget/components/in-out-source-select/in-out-source-select";
import {EWorkSource} from "@/widgets/product-pricing-widget/enums";
import {
    OutSourceSuppliers
} from "@/widgets/product-pricing-widget/components/outsource-suppliers/out-source-suppliers-widget";

const PricingWidget = ({workFlows, getOutSourcingSuppliers}: IPricingWidgetProps) => {
    const [view, setView] = useState<number>(0);
    const selectedWorkFlow = workFlows?.find(flow => flow.selected);
    useEffect(() => {
        if (view === 3) {
            getOutSourcingSuppliers();
        }
    } , [view])
    return (
        <Stack gap={'16px'} width={'100%'}>
            <Stack direction={"row"} justifyContent={'space-between'}>
                <ButtonGroup orientation={'horizontal'}>
                    {
                        !!workFlows && view !== 3 ? <><PrimaryButton onClick={() => setView(0)} sx={{width: '200px'}}
                                                       variant={view === 0 ? 'contained' : 'outlined'}>selected</PrimaryButton>
                            <PrimaryButton onClick={() => setView(1)} sx={{
                                width: '200px'
                            }}
                                           variant={view === 1 ? 'contained' : 'outlined'}>others</PrimaryButton></> :
                            <div/>
                    }
                </ButtonGroup>
                <InOutSourceSelect onChange={(v: EWorkSource) => setView(v === EWorkSource.OUT ? 3 : 0)} value={view === 3 ? EWorkSource.OUT : EWorkSource.INTERNAL}/>
            </Stack>
            {selectedWorkFlow && <GeneralInformationComponent details={selectedWorkFlow?.generalInformation}/>}
            <Divider/>
            {selectedWorkFlow && view === 0 && <Actions actions={selectedWorkFlow?.actions}/>}
            {workFlows && view === 1 && <WorkFlowsComponent showSelected={() => setView(0)} workflows={workFlows}/>}
            {view === 3 && <OutSourceSuppliers/>}
        </Stack>
    );
}
export {PricingWidget}