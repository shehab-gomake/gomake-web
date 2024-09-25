import {cloneElement, FormEvent, ReactElement, useCallback, useRef} from "react";
import {Button, FormGroup, Paper} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {GomakeTextInput} from "@/components";
import {Source, useActionsList} from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import {SecondaryButton} from "@/components/button/secondary-button";
import {IStation} from "@/widgets/production-floor/interfaces/filters";
import {ClickOutside} from "@/components/click-out-side/click-out-side";
import {adaptRight} from "@/utils/adapter";
import {FONT_FAMILY} from "@/utils/font-family";
import {
    CollapseOptionComponent
} from "@/widgets/production-floor/filters/select/actions-select/collapse-option-component";


interface IProps {
    onClickApply: (v: IStation[]) => void,
    source: Source;
    buttonElement?: ReactElement;
}

const ActionsListComponent = ({onClickApply, source, buttonElement}: IProps) => {

    const {
        actionsList,
        onSelectMachine,
        onSelectStation,
        actionsMachinesIds,
        open,
        setOpen,
        filter,
        setFilter,
        t
    } = useActionsList(source);
    const direction = t('direction')

    const handleClick = () => {
        setOpen(!open)
    };

    const handleFilterChange = (event: FormEvent<HTMLInputElement>) => {
        setFilter(event.currentTarget.value);
    }

    const buttonRef = useRef<HTMLButtonElement>(null);

    const getList = useCallback(() => {
        let list = [...actionsList];
        if (filter) {
            list = actionsList?.map(action => ({
                ...action,
                machines: action.machines.filter(m => m.machineName?.toLowerCase().includes(filter?.toLowerCase()) || action.actionName?.toLowerCase().includes(filter?.toLowerCase()))
            }))
                ?.filter(action => action.actionName?.toLowerCase().includes(filter?.toLowerCase()) || action.machines.length > 0)
        }
        return list?.length > 0 ? list?.sort((a, b) => a.checked === b.checked ? 0 : !!a.checked ? -1 : 0) : []
    }, [actionsList, filter]);

    const clonedChild = buttonElement && cloneElement(buttonElement, {
        ref: buttonRef,
        onClick: handleClick,
    });

    return (
        <div style={{position: 'relative'}}>
            {
                !!buttonElement ?
                    clonedChild :
                    <Button
                        ref={buttonRef}
                        style={{
                            width: '163px',
                            height: '36px',
                            borderRadius: '8px',
                            border: '1px solid rgba(208, 213, 221, 1)',
                            backgroundColor: '#FFF',
                            ...FONT_FAMILY.Lexend(500, 16),
                            cursor: 'pointer',
                            color: 'rgba(52, 64, 84, 1)',
                            display: 'flex',
                            alignItems: 'center' as 'center',
                            justifyContent: 'center' as 'center',
                            gap: '4px',
                            textTransform: 'none' as 'none',
                            boxShadow: 'none'
                        }} variant={'outlined'}
                        onClick={handleClick}>
                        <span>{t('productionFloor.selectStations')}</span>
                        <KeyboardArrowDownIcon/>
                    </Button>
            }
            {open &&
                <ClickOutside
                    exceptionRef={buttonRef}
                    onClick={() => setOpen(false)}>
                    <Paper sx={{
                        position: 'absolute', ...adaptRight(direction, 0),
                        top: source === Source.USERS ? '-610px' : '110%',
                        width: '350px',
                        height: 'fit-content',
                        maxHeight: '600px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        zIndex: 99999999999999
                    }}>
                        <FormGroup>
                            <div style={{position: 'sticky', top: 0, backgroundColor: '#FFF', zIndex: 1}}>
                                <GomakeTextInput placeholder={t('productionFloor.search')} value={filter}
                                                 onChange={handleFilterChange}/>
                            </div>
                            <div style={{padding: '5px'}}>

                            {
                                getList().map((option, index) => {
                                    return <CollapseOptionComponent isFilter={!!filter} key={index + option.actionId + option.actionName}
                                                                    onSelectStation={onSelectStation}
                                                                    onSelectMachine={onSelectMachine} {...option}/>
                                })
                            }
                            </div>
                        </FormGroup>
                        <div style={{
                            position: 'sticky',
                            bottom: 0,
                            right: 0,
                            left: 0,
                            backgroundColor: '#FFF',
                            zIndex: 1
                        }}>
                            <SecondaryButton style={{width: '100%'}} variant={'contained'} onClick={() => {
                                setOpen(false)
                                onClickApply(actionsMachinesIds)
                            }
                            }>{t("productionFloor.apply")}</SecondaryButton>
                        </div>
                    </Paper>
                </ClickOutside>
            }
        </div>
    )
}

export {ActionsListComponent}