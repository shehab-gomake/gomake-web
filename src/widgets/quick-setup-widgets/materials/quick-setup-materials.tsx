import { Stack} from "@mui/material";
import {
    MaterialViewComponent
} from "@/widgets/quick-setup-widgets/materials/selected-materials-component/material-view-component";
import {useQuickSetupMaterials} from "@/widgets/quick-setup-widgets/materials/use-quick-setup-materials";
import {useStyle} from "@/widgets/quick-setup-widgets/materials/style";
import {PrimaryButton} from "@/components/button/primary-button";
import {useTranslation} from "react-i18next";

const QuickSetupMaterials = () => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const {onRemoveMaterial, selectedMaterials,saveSelectedMaterials} = useQuickSetupMaterials();
    return (
        <Stack gap={'30px'} alignItems={'center'}>
            <h3 style={classes.header}>Approve and add you materials!</h3>
            <Stack flexWrap={'wrap'} direction={'row'} columnGap={'10px'} rowGap={'2px'} padding={'15px'}
                   overflow={'auto'}
                   position={'relative'}
                   style={classes.materialsContainer}>
                {
                    selectedMaterials.map(material => <MaterialViewComponent id={material.id} label={material.label}
                                                                             onRemove={onRemoveMaterial}/>)
                }
            </Stack>
            <PrimaryButton style={classes.nextButton} onClick={saveSelectedMaterials} variant={'contained'}>{t('signup.next')}</PrimaryButton>
        </Stack>
    )
}

export {QuickSetupMaterials}