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
import {EPricingViews, EWorkSource} from "@/widgets/product-pricing-widget/enums";
import {
    OutSourceSuppliers
} from "@/widgets/product-pricing-widget/components/outsource-suppliers/out-source-suppliers-widget";
import {useTranslation} from "react-i18next";
import {useStyle} from "@/widgets/product-pricing-widget/style";
import {useRecoilValue} from "recoil";
import {selectedWorkFlowState} from "@/widgets/product-pricing-widget/state";

const PricingWidget = ({workFlows, getOutSourcingSuppliers}: IPricingWidgetProps) => {
    const [view, setView] = useState<EPricingViews>(0);
    const {t} = useTranslation();
    const {classes} = useStyle();
    const selectedWorkFlow = useRecoilValue(selectedWorkFlowState);
    useEffect(() => {
        getOutSourcingSuppliers();
    }, [])
    return (
        <Stack gap={'16px'} width={'100%'}>
            <Stack direction={"row"} justifyContent={'space-between'}>
                { !!workFlows && view !== EPricingViews.OUTSOURCE_WORKFLOW ? <ButtonGroup sx={classes.buttonGroup} orientation={'horizontal'}>
                    <PrimaryButton onClick={() => setView(0)} sx={classes.button}
                                   variant={view === 0 ? 'contained' : 'outlined'}>{t('pricingWidget.selected')}</PrimaryButton>
                    <PrimaryButton onClick={() => setView(1)} sx={classes.button}
                                   variant={view === 1 ? 'contained' : 'outlined'}>{t('pricingWidget.others')}</PrimaryButton>

                </ButtonGroup> : <div/>}
                <InOutSourceSelect onChange={(v: EWorkSource) => setView(v === EWorkSource.OUT ? EPricingViews.OUTSOURCE_WORKFLOW : EPricingViews.SELECTED_WORKFLOW)}
                                   value={view ===  EPricingViews.OUTSOURCE_WORKFLOW? EWorkSource.OUT : EWorkSource.INTERNAL}/>
            </Stack>
            {selectedWorkFlow && <GeneralInformationComponent details={selectedWorkFlow?.generalInformation}/>}
            <Divider/>
            {selectedWorkFlow && view === 0 && <Actions actions={selectedWorkFlow?.actions}/>}
            {workFlows && view === 1 && <WorkFlowsComponent showSelected={() => setView(EPricingViews.SELECTED_WORKFLOW)} workflows={workFlows}/>}
            {view === EPricingViews.OUTSOURCE_WORKFLOW && <OutSourceSuppliers/>}
        </Stack>
    );
}
export {PricingWidget}