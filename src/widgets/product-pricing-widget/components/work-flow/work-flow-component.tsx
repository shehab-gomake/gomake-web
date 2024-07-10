import { ICalculatedWorkFlow } from "@/widgets/product-pricing-widget/interface";
import { useState } from "react";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { Collapse, Fade, IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {
    ActionComponent,
} from "@/widgets/product-pricing-widget/components/action/action-component";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { PrimaryButton } from "@/components/button/primary-button";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ParametersMapping } from "@/widgets/product-pricing-widget/components/action/key-value-view";
import { useWorkFlows } from "@/widgets/product-pricing-widget/use-work-flows";
import { WorkflowRateComponent } from "@/widgets/product-pricing-widget/components/work-flow/workflow-rate-component";
import { useTranslation } from "react-i18next";
import { SubWorkFlowsComponent } from "@/widgets/product-pricing-widget/components/work-flow/sub-work-flow-component";
import { useRecoilState } from "recoil";
import { actionListForWorkFlow } from "@/store";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";

interface IWorkFlowComponentProps extends ICalculatedWorkFlow {
    delay: number;
    index: number;
    showSelected: () => void;
    getWorkFlowsActions?: any
    selectedWorkFlowId?: any
    setSelectedWorkFlowId?: any
    isOpen?: boolean;
    toggleOpen?: (id: string) => void;
}

interface IWorksFlowsProps {
    workflows: ICalculatedWorkFlow[];
    showSelected: () => void;
    getWorkFlowsActions?: any
    selectedWorkFlowId?: any,
    setSelectedWorkFlowId?: any
}

const WorkFlowComponent = ({
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
    recommendationRang,
    subWorkFlows,
    getWorkFlowsActions,
    selectedWorkFlowId,
    setSelectedWorkFlowId,
    isOpen,
    toggleOpen
}: IWorkFlowComponentProps) => {
    console.log("actions", actions)
    const { t } = useTranslation();
    // const [isOpen, setIsOpen] = useState<boolean>(false);
    const { secondColor } = useGomakeTheme();
    const { classes } = useStyle();
    const { selectWorkFlow } = useWorkFlows();
    const [actionList, setActionList] = useRecoilState(actionListForWorkFlow)
    console.log("actionList", actionList)
    const handleSelectWorkFlow = (e) => {
        e.stopPropagation();
        if (!selected) {
            selectWorkFlow(id);
            showSelected();
        }
    }
    const parameters = [
        {
            ...totalRealProductionTime,
            key: 'totalRealProductionTime',
        },
        {
            ...totalCost,
            key: 'totalCost',
        },
        {
            ...profit,
            key: "profit"
        },
        {
            ...totalPrice,
            key: "totalPrice",
            valueColor: secondColor(500),
        },
    ]
    return (
        <>
            <Fade in={true} timeout={delay}>
                <Stack alignItems={"center"} direction={"row"}
                    justifyContent={'space-between'} style={{
                        ...classes.workFlowContainer,
                        border: selected ? classes.actionContainerBorder : 'unset'
                    }}>
                    <Stack direction={'row'} gap={'10px'} alignItems={'center'} flexWrap={'wrap'}>
                        <span>{`${t('pricingWidget.workFlow')} ${index}`}</span>
                        <Divider orientation={'vertical'} flexItem />
                        <ParametersMapping parameters={parameters} isWorkFlows={true} />
                        <PermissionCheck userPermission={Permissions.SHOW_COSTS_IN_CALCULATIONS}>
                            <Divider orientation={'vertical'} flexItem />
                        </PermissionCheck>
                        <Stack direction={'row'} flexWrap={"wrap"} alignItems={'center'} gap={'10px'}>
                            <WorkflowRateComponent label={t('pricingWidget.price')} value={recommendationRang?.price} />
                            <WorkflowRateComponent label={t('pricingWidget.profit')} value={recommendationRang?.profit} />
                            <WorkflowRateComponent label={t('pricingWidget.endTime')} value={recommendationRang?.deliveryTime} />
                        </Stack>
                    </Stack>
                    <Stack direction={'row'} gap={'12px'} flexWrap={'nowrap'} minWidth={'fit-content'}>
                        <PrimaryButton onClick={handleSelectWorkFlow}
                            variant={selected ? 'text' : 'contained'}>{selected ? t('pricingWidget.selected') : t('pricingWidget.chooseWorkFlow')}</PrimaryButton>
                        <IconButton onClick={(e) => {
                            e.stopPropagation();
                            toggleOpen(id);
                            getWorkFlowsActions(id)
                            setSelectedWorkFlowId(id)
                        }} style={classes.toggleActionButton}>
                            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </Stack>
                </Stack>
            </Fade>
            <Collapse in={isOpen && selectedWorkFlowId === id} collapsedSize={0} orientation={'vertical'}>
                <Stack padding={'10px 0'} gap={'10px'} paddingLeft={'30px'}>
                    {
                        <SubWorkFlowsComponent isEditableActions={false} workflows={subWorkFlows || []} />
                    }
                    {
                        actionList.map(action => <ActionComponent {...action} />)
                    }
                </Stack>
            </Collapse>
        </>
    )
};

const WorkFlowsComponent = ({ workflows, showSelected, getWorkFlowsActions, selectedWorkFlowId, setSelectedWorkFlowId }: IWorksFlowsProps) => {
    const [openWorkFlowId, setOpenWorkFlowId] = useState<string | null>(null);
    const toggleOpen = (id: string) => {
        setOpenWorkFlowId(prevId => (prevId === id ? null : id));
    };
    const totalPageDelay = 1000 * 5;
    const elementDelay = totalPageDelay / workflows.length;
    return <Stack gap={'10px'}>{workflows.map((flow, index) => <WorkFlowComponent getWorkFlowsActions={getWorkFlowsActions} showSelected={showSelected}
        isOpen={openWorkFlowId === flow.id}
        toggleOpen={toggleOpen}
        selectedWorkFlowId={selectedWorkFlowId}
        setSelectedWorkFlowId={setSelectedWorkFlowId}
        delay={index * elementDelay}
        index={index + 1} {...flow} />)}</Stack>
}
export { WorkFlowComponent, WorkFlowsComponent }

