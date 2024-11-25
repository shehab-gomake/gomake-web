import {FC} from "react";
import {Stack} from "@mui/material";
import {PrimaryButton} from "@/components/button/primary-button";
import {useTranslation} from "react-i18next";

interface ActionButtonsProps {
    onSave: () => void;
    onClose: () => void;
}

const ActionButtons: FC<ActionButtonsProps> = ({ onSave, onClose }) => {
    const {t} = useTranslation();
    return <Stack direction="row" gap={'10px'} justifyContent="flex-end">
        <PrimaryButton variant="outlined" onClick={onClose}>
            {t('modal.cancel')}
        </PrimaryButton>
        <PrimaryButton variant="contained" color="primary" onClick={onSave}>
            {t('materials.buttons.save')}
        </PrimaryButton>
    </Stack>
}


export {ActionButtons}
