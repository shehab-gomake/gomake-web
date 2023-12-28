import * as React from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { GoMakeModal } from "@/components";
import { inputs } from "./inputs";
import { useStyle } from "../style";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useTranslations } from "../../use-translations";
import { translationState } from "../states/interfaces";

interface IProps {
    state: translationState;
    setState: React.Dispatch<React.SetStateAction<translationState>>;
    translationFiles: {
        en: string[];
        he: string[];
        ar: string[];
        de: string[];
    };
}
const TranslationModal = ({ state, setState, translationFiles }: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { handleEdit, handleAdd, openModal, onClickCloseModal } = useTranslations();
    const btnLabel = state?.isEdit ? t("translations.edit") : t("translations.add");
    const modalTitle = state?.isEdit ? t("translations.editTranslation") : t("translations.addTranslation");

    const onChangeInputs = (key, value) => {
        setState({ ...state, [key]: value })
    }

    return (
        <GoMakeModal
            insideStyle={classes.insideStyle}
            openModal={openModal}
            onClose={onClickCloseModal}
            modalTitle={modalTitle}>
            <Stack style={classes.firstStack} >
                <Stack style={classes.secondStack} >
                    {
                        inputs(state).map(item => <Stack width={"180px"} ><FormInput input={item as IInput} changeState={onChangeInputs} error={item.required && !item.value} readonly={!!item.readonly} /></Stack>)
                    }
                </Stack>
                <SecondaryButton
                    variant="contained"
                    onClick={() => (state?.isEdit ? handleEdit(translationFiles, state) : handleAdd(translationFiles, state))}
                    style={classes.addBtnStyle}
                >
                    {btnLabel}
                </SecondaryButton>
            </Stack>
        </GoMakeModal>
    );
};

export { TranslationModal };