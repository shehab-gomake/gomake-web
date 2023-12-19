import {ICalculatedWorkFlow} from "@/widgets/product-pricing-widget/interface";
import {useState} from "react";
import {useStyle} from "@/widgets/product-pricing-widget/style";
import {Collapse, Fade, IconButton} from "@mui/material";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {
    ActionComponent,
} from "@/widgets/product-pricing-widget/components/action/action-component";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {PrimaryButton} from "@/components/button/primary-button";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {ParametersMapping} from "@/widgets/product-pricing-widget/components/action/key-value-view";
import {useWorkFlows} from "@/widgets/product-pricing-widget/use-work-flows";
import {WorkflowRateComponent} from "@/widgets/product-pricing-widget/components/work-flow/workflow-rate-component";
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {currentProductItemValueState} from "@/widgets/product-pricing-widget/state";

interface IWorkFlowComponentProps extends ICalculatedWorkFlow {
    delay: number;
    index: number;
    showSelected: () => void;
}

interface IWorksFlowsProps {
    workflows: ICalculatedWorkFlow[];
    showSelected: () => void;
}

const SubWorkFlowComponent = ({
                               delay,
                               index,
                               selected,
                               actions,
                               id,
                               showSelected,
                               totalPrice,
                               totalRealProductionTime,
                               totalCost,
                               profit,
                               recommendationRang
                           }: IWorkFlowComponentProps) => {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {secondColor} = useGomakeTheme();
    const {classes} = useStyle();
    const {selectWorkFlow} = useWorkFlows();
    const [currentProductItemValue, setCurrentProductItemValue] = useRecoilState<any>(currentProductItemValueState);

    const handleSelectWorkFlow = (e) => {
        e.stopPropagation();
        if (!selected) {
            selectWorkFlow(id);
            showSelected();
        }
    }
    const parameters = [
        totalRealProductionTime,
        totalCost,
        profit,
        {
            ...totalPrice,
            valueColor: secondColor(500),
        },
    ]

    return (
        <>
            <Fade in={true} timeout={delay}>
                <Stack onClick={() => setIsOpen(!isOpen)} alignItems={"center"} direction={"row"}
                       justifyContent={'space-between'} style={{
                    ...classes.workFlowContainer,
                    border: selected ? classes.actionContainerBorder : 'unset'
                }}>
                    <Stack direction={'row'} gap={'10px'} alignItems={'center'} flexWrap={'wrap'}>
                        <span>{`${t('pricingWidget.workFlow')} ${index}`}</span>
                        <Divider orientation={'vertical'} flexItem/>
                        <ParametersMapping parameters={parameters}/>
                        <Divider orientation={'vertical'} flexItem/>
                    </Stack>
                    <Stack direction={'row'} gap={'12px'} flexWrap={'nowrap'} minWidth={'fit-content'}>
                        <PrimaryButton onClick={handleSelectWorkFlow}
                                       variant={selected ? 'text' : 'contained'}>{selected ? t('pricingWidget.selected') : t('pricingWidget.chooseWorkFlow')}</PrimaryButton>
                        <IconButton onClick={() => setIsOpen(!isOpen)} style={classes.toggleActionButton}>
                            {isOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                    </Stack>
                </Stack>
            </Fade>
            <Collapse in={isOpen} collapsedSize={0} orientation={'vertical'}>
                <Stack padding={'10px 0'} gap={'10px'} paddingLeft={'100px'}>
                    {
                        actions.map(action => <ActionComponent {...action} />)
                    }
                </Stack>
            </Collapse>
        </>
    )
};

const SubWorkFlowsComponent = ({workflows, showSelected}: IWorksFlowsProps) => {
    const totalPageDelay = 1000 * 5;
    const elementDelay = totalPageDelay / workflows.length;
    return <Stack gap={'10px'}>{workflows.map((flow, index) => <SubWorkFlowComponent showSelected={showSelected}
                                                                                  delay={index * elementDelay}
                                                                                  index={index + 1} {...flow}/>)}</Stack>
}
export {SubWorkFlowComponent, SubWorkFlowsComponent}

