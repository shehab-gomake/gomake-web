import Stack from "@mui/material/Stack";
import {useStyle} from "@/components/form-inputs/style";
import {useTranslation} from "react-i18next";

interface IFormInputsSectionProps {
    sectionTitle: string;
    children: any;
}

const FormInputsSectionComponent = ({sectionTitle, children}: IFormInputsSectionProps) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    return <Stack direction={'column'} gap={'32px'}>
        <h3 style={classes.subSectionHeader}>{t(sectionTitle)}</h3>
        <Stack gap={'16px'} direction={'row'} display={'flex'} flexWrap={'wrap'}>
            {children}
        </Stack>
    </Stack>

}

export {FormInputsSectionComponent};