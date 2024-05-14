import {FormEvent, useCallback} from "react";
import {Button,FormGroup, Menu, MenuItem, MenuProps} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {styled} from "@mui/material/styles";
import {GomakeTextInput} from "@/components";
import Stack from "@mui/material/Stack";
import {SecondaryCheckBox} from "@/components/check-box/secondary-check-box";
import {useActionsList} from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import {SecondaryButton} from "@/components/button/secondary-button";
import {IStation} from "@/widgets/production-floor/interfaces/filters";



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
        position: 'relative',
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
    onClickApply: (v: IStation[]) => void
}

const ActionsListComponent = ({onClickApply}: IProps) => {

    const {actionsList, onSelectMachine, onSelectStation, actionsMachinesIds, open, filter, setFilter, anchorEl, setAnchorEl, t} = useActionsList();

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
            </StyledMenu>
        </>
    )
}

export {ActionsListComponent}
