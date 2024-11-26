import { ICalculatedWorkFlow } from "@/widgets/product-pricing-widget/interface";
import { useEffect, useState } from "react";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { Collapse, Fade, IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {
    ActionComponent, ActionContainerComponent,
} from "@/widgets/product-pricing-widget/components/action/action-component";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FmdBadIcon from '@mui/icons-material/FmdBad';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { adaptPaddingLeft, adaptPaddingRight } from "@/utils/adapter";
import { useTranslation } from "react-i18next";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { SortIcon } from "@/icons";

interface ISubWorkFlowComponentProps extends ICalculatedWorkFlow {
    isEditableActions?: boolean;
    widgetType: EWidgetProductType;
}

interface ISubWorkFlowsComponentProps {
    workflows: ICalculatedWorkFlow[];
    isEditableActions?: boolean;
    widgetType: EWidgetProductType;
}

const SubWorkFlowComponent = ({ actions, sectionName, isEditableActions, id, productType, profit, totalCost, totalPrice, totalRealProductionTime, widgetType }: ISubWorkFlowComponentProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { classes } = useStyle();
    const { t } = useTranslation()
    const direction = t('direction');
    const hasActionException = actions.some(action => action.actionException);
    const [actionsList, setActionsList] = useState(actions);
    const onDragEnd = (result) => {
        if (!result.destination) return;
        const reorderedActions = Array.from(actionsList);
        const [removed] = reorderedActions.splice(result.source.index, 1);
        reorderedActions.splice(result.destination.index, 0, removed);
        setActionsList(reorderedActions);
    };
    return (
        <>
            <Fade in={true}>
                <Stack onClick={() => setIsOpen(!isOpen)} alignItems={"center"} direction={"row"}
                    justifyContent={'space-between'} style={{
                        ...classes.subWorkFlowContainer,
                    }}>
                    <Stack direction={'row'} gap={'10px'} alignItems={'center'} flexWrap={'wrap'}>
                        <span style={{ ...adaptPaddingLeft(direction, 60), width: 180 }}>{sectionName}</span>
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

                    <Stack direction={'row'} alignItems={"center"} gap={'12px'} flexWrap={'nowrap'} minWidth={'fit-content'}>
                        {hasActionException && <IconButton>
                            <FmdBadIcon style={{ color: "#F04349" }} />
                        </IconButton>
                        }
                        <IconButton onClick={() => setIsOpen(!isOpen)} style={classes.toggleSubWorkFlowActionButton}>
                            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </Stack>
                </Stack>
            </Fade>
            <Collapse in={isOpen} collapsedSize={0} orientation={'vertical'}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={`actions-${id}`}>
                        {(provided) => (
                            <Stack padding={'10px 0'} gap={'10px'} ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    actionsList?.map((action, i) => (
                                        <Draggable key={action.id} draggableId={action.id} index={i}>
                                            {(provided) => (
                                                <Stack
                                                    direction={'row'}
                                                    alignItems={'center'}
                                                    position={'relative'}
                                                    padding={'0 5px'}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
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
                                                    {isEditableActions ? <ActionContainerComponent widgetType={widgetType} productType={productType} workFlowId={id} {...action} /> :
                                                        <ActionComponent {...action} />}
                                                </Stack>
                                            )}
                                        </Draggable>
                                    ))
                                }
                                {provided.placeholder}
                            </Stack>
                        )}
                    </Droppable>
                </DragDropContext>
                {/* <Stack padding={'10px 0'} gap={'10px'}>
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
                                {isEditableActions ? <ActionContainerComponent widgetType={widgetType} productType={productType} workFlowId={id} {...action} /> :
                                    <ActionComponent {...action} />}
                            </Stack>)
                    }
                </Stack> */}
            </Collapse>
        </>
    )
};

const SubWorkFlowsComponent = ({ workflows, isEditableActions, widgetType }: ISubWorkFlowsComponentProps) => {
    const [workflowsList, setWorkflowsList] = useState(workflows);
    useEffect(() => {
        setWorkflowsList(workflows)
    }, [workflows])
    const onDragEnd = (result) => {
        if (!result.destination) return;
        const reorderedWorkflows = Array.from(workflowsList);
        const [removed] = reorderedWorkflows.splice(result.source.index, 1);
        reorderedWorkflows.splice(result.destination.index, 0, removed);
        console.log(reorderedWorkflows)

        setWorkflowsList(reorderedWorkflows);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="workflows">
                {(provided) => (
                    <Stack gap={'10px'} ref={provided.innerRef} {...provided.droppableProps}>
                        {workflowsList.map((flow, index) => (
                            <Draggable key={flow.id} draggableId={flow.id} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", }}>
                                            <div style={{ marginTop: "15px" }}>
                                                <SortIcon />
                                            </div>
                                            <div>
                                                <SubWorkFlowComponent
                                                    widgetType={widgetType}
                                                    isEditableActions={isEditableActions}
                                                    {...flow}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Stack>
                )}
            </Droppable>
        </DragDropContext>
    );
};
export { SubWorkFlowsComponent, SubWorkFlowComponent }

