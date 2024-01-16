import Stack from "@mui/material/Stack";
import {
    useQuantityTypes
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/use-quantity-types";
import {FormInput} from "@/components/form-inputs/form-input";
import {PrimarySwitch} from "@/components";
import {useTranslation} from "react-i18next";
import {
    useStyle
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/style";
import {SecondaryButton} from "@/components/button/secondary-button";
import {
    QuantityTypesTable
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/table/quantity-types-table";
import {convertWidthToVW} from "@/utils/adapter";

interface IQuantityTypesComponent {
}
const QuantityTypesComponent = ({}: IQuantityTypesComponent) => {
    const {inputs, isDuplicateName, toggleDuplicateName, save, setSave} = useQuantityTypes();
    const {t} = useTranslation();
    const {classes} = useStyle();
    return (
        <Stack direction={'column'} height={'100%'} gap={'7px'}>
            <Stack direction={'row'} gap={'20%'} flexWrap={'wrap'}>
                {
                    inputs.map((input =>
                        <Stack width={convertWidthToVW(140)} paddingTop={'7px'}>
                            <FormInput readonly={!!input.readonly} input={input} changeState={input.onChange} error={false}/>
                        </Stack>
               ))
                }
            </Stack>
            <Stack direction={'row'} alignItems={'center'} padding={'5px 0'}>
                <PrimarySwitch checked={isDuplicateName} onChange={toggleDuplicateName}/>
                <span style={classes.duplicateName}>{t('Duplicate Name')}</span>
            </Stack>
            <Stack padding={'0 2px'}>
                <QuantityTypesTable onSave={()=>{}} save={save}/>
            </Stack>
            <Stack marginTop={'auto'} style={{backgroundColor: 'white'}}>
                <SecondaryButton onClick={() => {
                    setSave(true);
                }} style={{width: '100%'}} variant={'contained'}>{t('save')}</SecondaryButton>
            </Stack>
        </Stack>
    )
}

export {
    QuantityTypesComponent
}