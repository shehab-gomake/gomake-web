import {CircularProgress, Grid, Paper, Stack} from "@mui/material";
import {PrimaryButton} from "@/components/button/primary-button";
import {useStyle} from "@/widgets/quick-setup-widgets/machines/style";
import {useTranslation} from "react-i18next";
import {useMachinesSetup} from "@/widgets/quick-setup-widgets/machines/use-machines-setup";
import {CheckBoxList} from "@/widgets/machines/components/list/check-box-list";
import {SecondaryButton} from "@/components/button/secondary-button";
import {AdminMachinesList} from "@/widgets/quick-setup-widgets/machines/admin-machines-list";
import {useMachinesSetupData} from "@/widgets/quick-setup-widgets/machines/use-machines-setup-data";
import {SelectedMachineComponent} from "@/widgets/quick-setup-widgets/machines/selected-machine-component";
import {convertHeightToVH, convertWidthToVW} from "@/utils/adapter";
import {SearchInputComponent} from "@/components/form-inputs/search-input-component";

const MachinesSetupWidget = () => {
    const {
        printHouseMachines,
        addMachinesToPrintHouseMachine,
        removeMachinesFromPrintHouse,
        categoryMachines,
        onSelectAdminMachine,
        onSelectPrintHouseMachine,
        setSearchText,
        searchText
    } = useMachinesSetup();
    const {classes} = useStyle();
    const {t} = useTranslation();
    const {getMachineNameKey, step, getMachineColor, onClickNext, onClickSkip, loading} = useMachinesSetupData();
    return (
        <Stack gap={'10px'} alignItems={'center'}>
            <h2 style={classes.header}>{t('signup.machinesHeader')}</h2>
            <div style={classes.inputsContainer}>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item>
                        <Paper sx={{
                            width: 'fit-content',
                            height: convertHeightToVH(450),
                            minWidth: convertWidthToVW(250),
                            overflow: 'auto',
                            padding: '0px 10px 5px 10px',
                            position: 'relative'
                        }}>
                            <div style={{backgroundColor: '#FFF', position: 'sticky', width: '100%', height: 'fit-content', top: 0, padding: '5px 0', zIndex: 1}}>
                                <SearchInputComponent onChange={(value) => setSearchText(value)} value={searchText}/>
                            </div>
                            {
                                step.categories.map(category =>
                                    <AdminMachinesList items={categoryMachines(category)}
                                                       onClickOnCheckbox={onSelectAdminMachine}
                                                       categoryName={getMachineNameKey(category)}/>)
                            }
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <PrimaryButton
                                sx={{my: 0.5}}
                                variant="contained"
                                size="small"
                                onClick={addMachinesToPrintHouseMachine}
                            >
                                &gt;
                            </PrimaryButton>
                            <SecondaryButton
                                sx={{my: 0.5}}
                                variant="contained"
                                size="small"
                                onClick={removeMachinesFromPrintHouse}
                            >
                                &lt;
                            </SecondaryButton>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Paper sx={{
                            width: 'fit-content',
                            minWidth: convertWidthToVW(250),
                            height: convertHeightToVH(450),
                            overflow: 'auto',
                            marginTop: 2,
                            padding: '5px 10px'
                        }}>
                            <Stack gap={'5px'}>
                                {
                                    printHouseMachines.map(machine =>
                                        <SelectedMachineComponent machineName={machine.name}
                                                                  selected={machine.checked}
                                                                  onClick={() => onSelectPrintHouseMachine(machine.id)}
                                                                  bgColor={getMachineColor(machine.category)}/>
                                    )
                                }
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
            <PrimaryButton endIcon={loading && <CircularProgress style={{width: '20px', height: '20px'}}/>}
                           onClick={onClickNext}
                           style={classes.nextButton}
                           disabled={loading}
                           variant={'contained'}>
                {loading ? `Adding machines` : t('signup.next')}
            </PrimaryButton>
            {
                !step.required && <SecondaryButton onClick={onClickSkip}>skip</SecondaryButton>
            }
        </Stack>
    )
}

export {MachinesSetupWidget}