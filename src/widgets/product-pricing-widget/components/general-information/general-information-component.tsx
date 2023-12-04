import {IOutput} from "@/widgets/product-pricing-widget/interface";
import Stack from "@mui/material/Stack";
import {ParametersMapping} from "@/widgets/product-pricing-widget/components/action/key-value-view";
import {useTranslation} from "react-i18next";

const GeneralInformationComponent = ({details}: { details: IOutput[] }) => {
    const {t} = useTranslation()
    return (
        <Stack gap={'10px'}>
            <h3>{t('pricingWidget.generalInformation')}</h3>
            <Stack direction={'row'} gap={'16px'}>
                <ParametersMapping parameters={details}/>
            </Stack>
        </Stack>
    );
}

export {GeneralInformationComponent}