import { Paper, FormGroup, MenuItem, Stack } from "@mui/material";
import { SecondaryCheckBox } from "@/components/check-box/secondary-check-box";
import { SecondaryButton } from "@/components/button/secondary-button";
import { GomakeTextInput } from "@/components";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { adaptRight } from "@/utils/adapter";
import { useTranslation } from "react-i18next";

const ActionsDropdown = ({
    open,
    setOpen,
    filter,
    handleFilterChange,
    getList,
    onSelectStation,
    onSelectMachine,
    actionsMachinesIds,
    onStationsChange,
    buttonRef,
    dir,
}) => {
    const { t } = useTranslation();

    return (
        <>
            {open &&
                <ClickOutside exceptionRef={buttonRef} onClick={() => setOpen(false)}>
                    <Paper sx={{
                        position: 'absolute', ...adaptRight(dir, 0), top: '110%',
                        maxWidth: '300px', height: 'fit-content', maxHeight: '600px', overflow: 'auto', zIndex: 99999999999999
                    }}>
                        <FormGroup>
                            <div style={{ position: 'sticky', top: 0, backgroundColor: '#FFF', zIndex: 1 }}>
                                <GomakeTextInput placeholder={t('productionFloor.search')} value={filter} onChange={handleFilterChange} />
                            </div>
                            {getList().map((option, index) => (
                                <Stack key={index + option.actionId + option.actionName}>
                                    <MenuItem onClick={() => onSelectStation(option.actionId, !!option.checked)}>
                                        <SecondaryCheckBox checked={!!option.checked} />
                                        <span>{option.actionName}</span>
                                    </MenuItem>
                                    <Stack direction={'row'} gap={'30px'}>
                                        <div />
                                        <Stack>
                                            {option.machines?.map(machine => (
                                                <MenuItem key={machine.machineId} onClick={() => onSelectMachine(option.actionId, machine.machineId)}>
                                                    <SecondaryCheckBox checked={!!machine.checked} />
                                                    {machine.machineName}
                                                </MenuItem>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </Stack>
                            ))}
                        </FormGroup>
                        <div style={{ position: 'sticky', bottom: 0, backgroundColor: '#FFF', zIndex: 1 }}>
                            <SecondaryButton style={{ width: '100%' }} variant={'contained'} onClick={() => {
                                setOpen(false);
                                onStationsChange(actionsMachinesIds);
                            }}>
                                {t("productionFloor.apply")}
                            </SecondaryButton>
                        </div>
                    </Paper>
                </ClickOutside>
            }
        </>
    );
};

export default ActionsDropdown;
