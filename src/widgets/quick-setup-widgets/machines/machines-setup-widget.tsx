import {CircularProgress, Stack} from "@mui/material";
import {PrimaryButton} from "@/components/button/primary-button";
import {useStyle} from "@/widgets/quick-setup-widgets/machines/style";
import {useTranslation} from "react-i18next";
import {useMachinesSetupData} from "@/widgets/quick-setup-widgets/machines/use-machines-setup-data";
import {
    MaterialViewComponent
} from "@/widgets/quick-setup-widgets/materials/selected-materials-component/material-view-component";
import {GoMakeAutoComplate} from "@/components";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const MachinesSetupWidget = () => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const {
        getMachineColor,
        onClickNext,
        loading,
        machinesCategoriesList,
        onSelectCategory,
        selectedCategory,
        categoryMachines,
        machinesLoading,
        onSelectMachine,
        printHouseMachines,
        onRemovePrintHouseMachine
    } = useMachinesSetupData();
    return (
        <Stack gap={'10px'} alignItems={'center'}>
            <h2 style={classes.header}>{t('signup.machinesHeader')}</h2>
            <GoMakeAutoComplate style={classes.autoComplete} value={selectedCategory}
                                onChange={(e, v) => onSelectCategory(v?.value as ECategoryId)}
                                options={machinesCategoriesList}
                                placeholder={'Choose machine Category'}/>
            <GoMakeAutoComplate value={''} onChange={(e, machine) => onSelectMachine(machine)} loading={machinesLoading}
                                style={classes.autoComplete} options={categoryMachines} placeholder={'machine name'}/>
            <Stack flexWrap={'wrap'} direction={'row'} columnGap={'10px'} rowGap={'2px'} padding={'15px'}
                   overflow={'auto'}
                   position={'relative'}
                   style={classes.selectedMachinesContainer}>
                {
                    printHouseMachines.map(machine => <MaterialViewComponent id={machine?.value} label={machine?.label}
                                                                             bgColor={getMachineColor(machine?.category)}
                                                                             onRemove={() => onRemovePrintHouseMachine(machine?.value)}/>)
                }
            </Stack>
            <PrimaryButton endIcon={loading && <CircularProgress style={{width: '20px', height: '20px'}}/>}
                           onClick={onClickNext}
                           style={classes.nextButton}
                           disabled={loading}
                           variant={'contained'}>
                {loading ? `Adding machines` : t('signup.next')}
            </PrimaryButton>
        </Stack>
    )
}

export {MachinesSetupWidget}