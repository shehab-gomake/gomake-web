import {FormEvent, useCallback} from "react";
import {Button, FormGroup, MenuItem, Paper} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {GomakeTextInput} from "@/components";
import Stack from "@mui/material/Stack";
import {SecondaryCheckBox} from "@/components/check-box/secondary-check-box";
import {useActionsList} from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import {SecondaryButton} from "@/components/button/secondary-button";
import {IStation} from "@/widgets/production-floor/interfaces/filters";
import {ClickOutside} from "@/components/click-out-side/click-out-side";


interface IProps {
    onClickApply: (v: IStation[]) => void
}

const ActionsListComponent = ({onClickApply}: IProps) => {

    const {actionsList, onSelectMachine, onSelectStation, actionsMachinesIds, open, setOpen, filter, setFilter, t} = useActionsList();

    const handleClick = () => {
        setOpen(!open)
    };
    const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
        setFilter(event.currentTarget.value);
    }

    const getList = useCallback(()=> {
        if (filter) {
            return actionsList?.map(action => ({...action, machines: action.machines.filter(m => m.machineName?.toLowerCase().includes(filter?.toLowerCase()))}))
                ?.filter(action => action.actionName?.toLowerCase().includes(filter?.toLowerCase()) || action.machines.length > 0)
        }
        return actionsList
    }, [actionsList, filter])
    return(
        <div style={{position: 'relative'}}>
            <Button style={{color: '#9E9E9E', borderColor: '#9E9E9E', height: '38px'}} variant={'outlined'} onClick={handleClick}>
                <span>{t('productionFloor.selectStations')}</span>
                <KeyboardArrowDownIcon/>
            </Button>
            {open &&
                <ClickOutside onClick={()=> setOpen(false)}>
                <Paper sx={{position: 'absolute', right: 0, top: '110%', maxWidth: '300px', maxHeight: '600px', overflow: 'auto', zIndex: 99999999}}>
                <FormGroup>
                    <div style={{position: 'sticky', top: 0, backgroundColor: '#FFF', zIndex: 1}}>
                        <GomakeTextInput  placeholder={t('productionFloor.search')} value={filter} onChange={handleFilterChange}/>
                    </div>
                    {
                        getList().map((option, index) => {
                            return  <Stack key={index + option.actionId + option.actionName}>
                                <MenuItem onClick={() => onSelectStation(option.actionId, !!option.checked)}>
                                    <SecondaryCheckBox checked={!!option.checked}/>
                                    <span>{option.actionName}</span>
                                </MenuItem>
                                <Stack direction={'row'} gap={'30px'}>
                                    <div/>
                                    <Stack>
                                        {
                                            option?.machines?.map((machine) => <MenuItem onClick={() => onSelectMachine(option.actionId, machine.machineId)}>
                                                <SecondaryCheckBox checked={!!machine?.checked} />
                                                {machine.machineName}
                                            </MenuItem>)
                                        }
                                    </Stack>
                                </Stack>
                            </Stack>

                        })
                    }
                </FormGroup>
                <div style={{position: 'sticky', bottom: 0, right: 0, left: 0, backgroundColor: '#FFF', zIndex: 1}}>
                    <SecondaryButton style={{width: '100%'}} variant={'contained'} onClick={() =>
                        onClickApply(actionsMachinesIds)
                    }>apply</SecondaryButton>
                </div>
            </Paper>
                </ClickOutside>
            }
        </div>
    )
}

export {ActionsListComponent}
