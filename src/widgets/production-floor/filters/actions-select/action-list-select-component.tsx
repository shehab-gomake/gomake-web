import {GoMakeAutoComplate} from "@/components";
import {useTranslation} from "react-i18next";
import {MenuItem, Paper, Stack} from "@mui/material";
import {SecondaryCheckBox} from "@/components/check-box/secondary-check-box";
import {useActionsList} from "@/widgets/production-floor/filters/actions-select/use-actions-list";
import {IActionMachines} from "@/widgets/production-floor/state/actions-list";
interface IProps {
    onClickAction: (action: IActionMachines) => void;
    onClickMachine: (actionId: string, machineId: string, option: IActionMachines) => void;
}
const ActionsListComponent = ({onClickAction, onClickMachine}: IProps) => {
    const {actionsList, handelFilterActions} = useActionsList();
    const {t} = useTranslation();
    return(
        <GoMakeAutoComplate style={{width: '200px', backgroundColor: '#F8F8F8'}} options={actionsList}
                            onChangeTextField={(e) => {handelFilterActions(e.target.value)}}
                            placeholder={t('selectStation')}
                            renderOption={(props: any, option: IActionMachines) => {
                                return (
                                    <Stack>
                                        <MenuItem onClick={() => onClickAction(option)}>
                                            <SecondaryCheckBox checked={option.checked}/>
                                            <span>{option.actionName}</span>
                                        </MenuItem>
                                        <Stack direction={'row'} gap={'30px'}>
                                            <div/>
                                            <Stack>
                                                {
                                                    option?.machines?.map((machine) => <MenuItem onClick={() => onClickMachine(option.actionId, machine.machineId, option)}>
                                                        <SecondaryCheckBox checked={machine?.checked} />
                                                        {machine.machineName}
                                                    </MenuItem>)
                                                }
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                );
                            }}
                            PaperComponent={(props) => {
                                return <Paper onClick={(e) => e.stopPropagation()} style={{
                                    width: 'fit-content',
                                    height: 'fit-content',
                                    maxHeight: '700px',
                                    overflow: 'auto'
                                }}>
                                    {
                                        props?.children
                                    }
                                </Paper>
                            }}/>
    )
}

export {ActionsListComponent}