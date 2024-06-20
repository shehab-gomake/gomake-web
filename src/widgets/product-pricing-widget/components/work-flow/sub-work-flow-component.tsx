import { ICalculatedWorkFlow } from "@/widgets/product-pricing-widget/interface";
import { useState } from "react";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { Collapse, Fade, IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {
    ActionComponent, ActionContainerComponent,
} from "@/widgets/product-pricing-widget/components/action/action-component";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { adaptPaddingLeft, adaptPaddingRight } from "@/utils/adapter";
import { useTranslation } from "react-i18next";

interface ISubWorkFlowComponentProps extends ICalculatedWorkFlow {
    isEditableActions?: boolean;
}

interface ISubWorkFlowsComponentProps {
    workflows: ICalculatedWorkFlow[];
    isEditableActions?: boolean;

}

const SubWorkFlowComponent = ({ actions, sectionName, isEditableActions, id, productType, profit, totalCost, totalPrice, totalRealProductionTime }: ISubWorkFlowComponentProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { classes } = useStyle();
    const { t } = useTranslation()
    const direction = t('direction');
    return (
        <>
            <Fade in={true}>
                <Stack onClick={() => setIsOpen(!isOpen)} alignItems={"center"} direction={"row"}
                    justifyContent={'space-between'} style={{
                        ...classes.subWorkFlowContainer,
                    }}>
                    <Stack direction={'row'} gap={'10px'} alignItems={'center'} flexWrap={'wrap'}>
                        <span style={{ ...adaptPaddingLeft(direction, 60), width: 220 }}>{sectionName}</span>
                        <div >
                            <span style={classes.nameStyle}>{totalRealProductionTime?.name}</span>
                            <span style={classes.secondPartStyle}>{totalRealProductionTime?.values[0]} {totalRealProductionTime?.defaultUnit}</span>
                        </div>
                        <div style={classes.lineStyle} />
                        <div>
                            <span style={classes.nameStyle}>{totalCost?.name}</span>
                            <span style={classes.secondPartStyle}>{totalCost?.values[0]} {totalCost?.defaultUnit}</span>
                        </div>
                        <div style={classes.lineStyle} />
                        <div>
                            <span style={classes.nameStyle}>{profit?.name}</span>
                            <span style={classes.secondPartStyle}>{profit?.values[0]} {profit?.defaultUnit}</span>
                        </div>
                        <div style={classes.lineStyle} />
                        <div>
                            <span style={classes.nameStyle}>{totalPrice?.name}</span>
                            <span style={classes.secondPartStyle}>{totalPrice?.values[0]} {totalPrice?.defaultUnit}</span>
                        </div>
                    </Stack>
                    <Stack direction={'row'} gap={'12px'} flexWrap={'nowrap'} minWidth={'fit-content'}>
                        <IconButton onClick={() => setIsOpen(!isOpen)} style={classes.toggleSubWorkFlowActionButton}>
                            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </Stack>
                </Stack>
            </Fade>
            <Collapse in={isOpen} collapsedSize={0} orientation={'vertical'}>
                <Stack padding={'10px 0'} gap={'10px'}>
                    {
                        actions?.map((action, i) =>
                            <Stack direction={'row'} alignItems={'center'} position={'relative'} padding={'0 5px'}>
                                {
                                    i + 1 < actions?.length ? <Divider orientation={'vertical'} style={{
                                        width: '2px',
                                        backgroundColor: '#667085',
                                        margin: i === 0 ? '-20px 0 -10px 0' : '-10px 0'
                                    }} flexItem /> :
                                        <Divider style={classes.subWorkFlowDividerVertical} absolute orientation={"vertical"} />
                                }
                                <Divider orientation={'horizontal'}
                                    style={{ width: '30px', height: '2px', backgroundColor: '#667085' }} />
                                {isEditableActions ? <ActionContainerComponent productType={productType} workFlowId={id} {...action} /> :
                                    <ActionComponent {...action} />}
                            </Stack>)
                    }
                </Stack>
            </Collapse>
        </>
    )
};

const SubWorkFlowsComponent = ({ workflows, isEditableActions }: ISubWorkFlowsComponentProps) => {
    return <Stack gap={'10px'}>{workflows.map((flow) => <SubWorkFlowComponent
        isEditableActions={isEditableActions}  {...flow} />)}</Stack>
}
export { SubWorkFlowsComponent, SubWorkFlowComponent }

