import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {useState} from "react";
import {IWorkFlowAction} from "@/widgets/product-pricing-widget/interface";
import {useStyle} from "@/widgets/product-pricing-widget/style";
import {Collapse, Fade, IconButton} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {ParametersMapping} from "@/widgets/product-pricing-widget/components/action/key-value-view";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {InOutSourceSelect} from "@/widgets/product-pricing-widget/components/in-out-source-select/in-out-source-select";
import {RuleType} from "@/widgets/product-pricing-widget/enums";

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
                                      actionName,
                                      outputs,
                                      delay,
                                      machineName,
                                      profitO,
                                      totalPriceO,
                                      totalRealProductionTimeO,
                                      totalCostO
                                  }: IActionContainerComponentProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
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
    const inputsParameters = outputs.filter(parameter => parameter.propertyType === RuleType.PARAMETER);
    const outputsParameters = outputs.filter(parameter => parameter.propertyType === RuleType.OUTPUT);
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
                        <ParametersMapping parameters={parameters}/>
                        <Divider orientation={'vertical'} flexItem/>
                        <div onClick={(e) => e.stopPropagation()}>
                            <InOutSourceSelect/>
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
                    {outputsParameters.length > 0 && <><Divider/>
                        <Stack padding={'10px 0'} direction={'row'} gap={'16px'} flexWrap={'wrap'}>
                            <ParametersMapping parameters={outputsParameters}/>
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
                             totalCostO
                         }: IWorkFlowAction) => {
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
                    <ParametersMapping parameters={parameters}/>
                    <Divider orientation={'vertical'} flexItem/>
                    <InOutSourceSelect disabled={true}/>
                </Stack>
            </Stack>
        </Stack>
    );
}


export {ActionContainerComponent, Actions, ActionComponent}