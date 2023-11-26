import {IOutput} from "@/widgets/product-pricing-widget/interface";
import Stack from "@mui/material/Stack";
import {ParametersMapping} from "@/widgets/product-pricing-widget/components/action/key-value-view";

const GeneralInformationComponent = ({details}: { details: IOutput[] }) => {
    return (
        <Stack gap={'10px'}>
            <h3>General information</h3>
            <Stack direction={'row'} gap={'16px'}>
                <ParametersMapping parameters={details}/>
            </Stack>
        </Stack>
    );
}

export {GeneralInformationComponent}