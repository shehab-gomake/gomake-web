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
import TextField from "@mui/material/TextField";
import * as React from "react";
import {DotsLoader} from "@/components/dots-loader/dots-Loader";
import {AutocompleteOption} from "@mui/joy";

interface IProps {
    categories?: ECategoryId[];
    nextStep: string;
    header: string;
}

const MachinesSetupWidget = ({categories, nextStep, header}: IProps) => {
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
        onRemovePrintHouseMachine,
        onSearchMachine,
        newMachine,
    } = useMachinesSetupData(categories, nextStep);
    return (
        <Stack gap={'10px'} alignItems={'center'}>
            <h2 style={classes.header}>{t(header)}</h2>
            <GoMakeAutoComplate style={classes.autoComplete} value={selectedCategory}
                                onChange={(e, v) => onSelectCategory(v?.value as ECategoryId)}
                                options={machinesCategoriesList}
                                disableClearable={true}
                                placeholder={t('signup.chooseMachineCategory')}/>
            {/*<GoMakeAutoComplate
                disabled={machinesLoading}
                loading={machinesLoading}
                onChange={() => {
                }}
                popupIcon={machinesLoading ? <DotsLoader/> : ''}
                disableClearable={true}
                style={classes.autoComplete}
                renderInput={(params) => <TextField
                    {...params}
                    placeholder={t('signup.machineName')}
                    onChange={(e) => {
                        onSearchMachine(e?.target?.value)
                    }}
                    value={newMachine.value}
                />}
                options={[newMachine, ...categoryMachines]?.filter(machine => machine?.value !== '')}
                renderOption={(props, option) => {
                    return <AutocompleteOption {...props}
                                               onClick={() => onSelectMachine(option)}>{option.label}</AutocompleteOption>
                }}
                placeholder={t('signup.machineName')}/>*/}
            <Stack flexWrap={'wrap'} direction={'row'} columnGap={'10px'} rowGap={'2px'} padding={'15px'}
                   overflow={'auto'}
                   position={'relative'}
                   style={classes.selectedMachinesContainer}>
                {
                    printHouseMachines.map((machine, index) => <MaterialViewComponent id={machine?.value}
                                                                                      label={machine?.label}
                                                                                      bgColor={getMachineColor(machine?.category as ECategoryId)}
                                                                                      textColor={'#FFF'}
                                                                                      onRemove={() => onRemovePrintHouseMachine(index)}/>)
                }
            </Stack>
            <PrimaryButton endIcon={loading && <CircularProgress style={{width: '20px', height: '20px'}}/>}
                           onClick={onClickNext}
                           style={classes.nextButton}
                           disabled={loading}
                           variant={'contained'}>
                {loading ? `signup.addingMachines` : t('signup.next')}
            </PrimaryButton>
        </Stack>
    )
}

export {MachinesSetupWidget}