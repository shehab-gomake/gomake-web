import {FormEvent, useCallback, useState} from "react";
import {Button,FormGroup, Menu, MenuItem, MenuProps} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useTranslation} from "react-i18next";
import {styled} from "@mui/material/styles";
import {GomakeTextInput} from "@/components";
import Stack from "@mui/material/Stack";
import {SecondaryCheckBox} from "@/components/check-box/secondary-check-box";
import {useActionsList} from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import {IActionMachines} from "@/widgets/production-floor/state/actions-list";



const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(() => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        width: '250px',
        height: 'fit-content',
        maxHeight: 500,
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',

        },
        '& .MuiMenuItem-root': {
            fontSize: '12px',
            color: '#12133A',
            padding: 0

        },
        '& .MuiFormControlLabel-root': {
            margin: 0
        }
    },
}));
interface IProps {
    onClickAction: (action: IActionMachines) => void;
    onClickMachine: (actionId: string, machineId: string, option: IActionMachines) => void;
}

const ActionsListComponent = ({onClickAction, onClickMachine}: IProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [filter, setFilter] = useState<string>();
    const open = Boolean(anchorEl);
    const {t} = useTranslation();
    const {actionsList} = useActionsList();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
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
        <>
            <Button style={{color: '#9E9E9E', borderColor: '#9E9E9E', height: '38px'}} variant={'outlined'} onClick={handleClick}>
                <span>{t('productionFloor.selectStations')}</span>
                <KeyboardArrowDownIcon/>
            </Button>
            <StyledMenu  anchorEl={anchorEl}
                         open={open}
                         onClose={handleClose}>
                <FormGroup>
                    <div>
                        <GomakeTextInput  placeholder={t('productionFloor.search')} value={filter} onChange={handleFilterChange}/>
                    </div>
                    {
                        getList().map((option, index) => {
                            return  <Stack key={index + option.actionId + option.actionName}>
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

                        })
                    }
                </FormGroup>
            </StyledMenu>
        </>
    )
}

export {ActionsListComponent}
