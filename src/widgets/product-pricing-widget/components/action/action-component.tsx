import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {useState} from "react";
import {IWorkFlowAction} from "@/widgets/product-pricing-widget/interface";
import {useStyle} from "@/widgets/product-pricing-widget/style";
import {Collapse, Fade, IconButton} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    EditableKeyValueViewComponent,
    ParametersMapping
} from "@/widgets/product-pricing-widget/components/action/key-value-view";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {InOutSourceSelect} from "@/widgets/product-pricing-widget/components/in-out-source-select/in-out-source-select";
import {EWorkSource, RuleType} from "@/widgets/product-pricing-widget/enums";
import {useActionUpdateValues} from "@/widgets/product-pricing-widget/components/action/use-action-update-values";

interface IActionContainerComponentProps extends IWorkFlowAction {
    delay: number;
}

interface IActionsComponentProps {
    actions: IWorkFlowAction[]
}

const Actions = ({actions}: IActionsComponentProps) => {
    return <Stack gap={'10px'}>
        {actions?.map((action, index) => <ActionContainerComponent delay={index * 800} {...action} />)}
    </Stack>
}
const ActionContainerComponent = ({
                                      actionId,
                                      actionName,
                                      outputs,
                                      delay,
                                      machineName,
                                      profitO,
                                      totalPriceO,
                                      totalRealProductionTimeO,
                                      totalCostO,
                                      source
                                  }: IActionContainerComponentProps) => {
    source = source === EWorkSource.OUT ? EWorkSource.OUT : EWorkSource.INTERNAL;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {updateDeliveryTime, updateCost, updateProfit, updatePrice, changeActionWorkSource} = useActionUpdateValues()
    const {classes} = useStyle();
    const {secondColor} = useGomakeTheme();
    const inputsParameters = outputs.filter(parameter => parameter.propertyType === RuleType.PARAMETER);
    const outputsParameters = outputs.filter(parameter => parameter.propertyType === RuleType.OUTPUT);
    const handleDeliveryTimeUpdate = (newValue: string) => {
        const object = {
            ...totalRealProductionTimeO,
            values: source === EWorkSource.INTERNAL ? [newValue] : totalRealProductionTimeO.values,
            outSourceValues: source === EWorkSource.OUT ? [newValue] : totalRealProductionTimeO.outSourceValues
        }
        updateDeliveryTime(object, actionId);
    }

    const handleCostUpdate = (newCost: string) => {
        updateCost(newCost, profitO.values[0], actionId, source);
    }

    const handleProfitUpdate = (profit: string) => {
        updateProfit(totalCostO.values[0], profit, actionId, source);
    }

    const handleUpdatePrice = (price: string) => {
        updatePrice(price, totalCostO.values[0], actionId, source);
    }

    const handleSourceChange = (source: EWorkSource) => {
        changeActionWorkSource(source, actionId);
    }
    return (
        <Fade in={true} timeout={delay}>
            <Stack onClick={() => setIsOpen(!isOpen)}
                   style={{...classes.actionContainer, border: isOpen ? classes.actionContainerBorder : 'unset'}}>
                <Stack padding={'10px 0'} direction={'row'} justifyContent={'space-between'}>
                    <Stack direction={'row'} gap={'16px'} alignItems={'center'}>
                        <Stack style={classes.sectionTitle} direction={'row'} alignItems={'center'} gap={'10px'}>
                            <span>{actionName}</span>
                            {
                                !!machineName && <> <Divider orientation={'vertical'} flexItem color={'#000'}/>
                                    <span onClick={(e) => e.stopPropagation()}>{machineName}</span></>
                            }
                        </Stack>
                        <Divider orientation={'vertical'} flexItem/>
                        <EditableKeyValueViewComponent
                            onUpdate={handleDeliveryTimeUpdate} {...totalRealProductionTimeO} source={source}/>
                        <Divider orientation={'vertical'} style={{height: '50%', margin: 'auto 0'}} flexItem/>
                        <EditableKeyValueViewComponent onUpdate={handleCostUpdate} {...totalCostO} source={source}/>
                        <Divider orientation={'vertical'} style={{height: '50%', margin: 'auto 0'}} flexItem/>
                        <EditableKeyValueViewComponent onUpdate={handleProfitUpdate} {...profitO} source={source}/>
                        <Divider orientation={'vertical'} style={{height: '50%', margin: 'auto 0'}} flexItem/>
                        <EditableKeyValueViewComponent onUpdate={handleUpdatePrice} {...totalPriceO}
                                                       source={source}
                                                       valueColor={secondColor(500)}/>
                        <Divider orientation={'vertical'} flexItem/>
                        <div onClick={(e) => e.stopPropagation()}>
                            <InOutSourceSelect value={source} onChange={handleSourceChange}/>
                        </div>
                    </Stack>
                    <IconButton onClick={() => setIsOpen(!isOpen)} style={classes.toggleActionButton}>
                        {isOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </Stack>
                <Collapse in={isOpen} collapsedSize={0} orientation={'vertical'}>
                    {
                        inputsParameters.length > 0 && <>
                            <Divider/>
                            <Stack padding={'10px 0'} direction={'row'} gap={'16px'} flexWrap={'wrap'}>
                                <ParametersMapping
                                    parameters={inputsParameters}/>
                            </Stack>
                        </>
                    }
                    {outputsParameters.length > 0 && source === EWorkSource.INTERNAL && <>
                        <Divider/>
                        <Stack padding={'10px 0'} direction={'row'} gap={'16px'} flexWrap={'wrap'}>
                            <ParametersMapping source={source} parameters={outputsParameters}/>
                        </Stack></>}
                </Collapse>
            </Stack>
        </Fade>
    )
}

const ActionComponent = ({
                             actionName,
                             machineName,
                             profitO,
                             totalPriceO,
                             totalRealProductionTimeO,
                             totalCostO,
                             source
                         }: IWorkFlowAction) => {
    source = source === EWorkSource.OUT ? EWorkSource.OUT : EWorkSource.INTERNAL;
    const {classes} = useStyle();
    const {secondColor} = useGomakeTheme();
    const parameters = [
        totalRealProductionTimeO,
        totalCostO,
        profitO,
        {
            ...totalPriceO,
            valueColor: secondColor(500),
        },
    ]
    return (
        <Stack style={{...classes.actionContainer, backgroundColor: '#D0D5DD'}}>
            <Stack padding={'10px 0'} direction={'row'} justifyContent={'space-between'}>
                <Stack direction={'row'} gap={'16px'} alignItems={'center'}>
                    <Stack style={classes.sectionTitle} direction={'row'} alignItems={'center'} gap={'10px'}>
                        <span>{actionName}</span>
                        {
                            machineName && <>
                                <Divider orientation={'vertical'} flexItem color={'#000'}/>
                                <span>{machineName}</span>
                            </>
                        }
                    </Stack>
                    <Divider orientation={'vertical'} flexItem/>
                    <ParametersMapping source={source} parameters={parameters}/>
                    <Divider orientation={'vertical'} flexItem/>
                    <InOutSourceSelect value={source} disabled={true}/>
                </Stack>
            </Stack>
        </Stack>
    );
}


export {ActionContainerComponent, Actions, ActionComponent}