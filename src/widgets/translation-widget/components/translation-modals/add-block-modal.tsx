import * as React from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useState } from "react";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslations } from "../../use-translations";

const AddBlockModal = ({ openModal, setOpenModal, state, translationFiles }: any) => {
    const { t } = useTranslation();
    const { classes } = useStyle()
    const [categoryName, setCategoryName] = useState<string>();
    const { addEmptyBlockToAllFiles } = useTranslations();

    return (
        <GoMakeModal
            insideStyle={classes.categoryModalStyle}
            openModal={openModal}
            onClose={() => setOpenModal(false)}
            modalTitle={t("Add category")}>
            <Stack direction={'column'} gap={"40px"}>
                <GomakeTextInput onChange={(e) => setCategoryName(e.target.value)}  style={classes.addButtonStyle} placeholder={"add category"}/>
                <Stack direction={'row'} justifyContent={"flex-end"}>
                    <SecondaryButton onClick={() => addEmptyBlockToAllFiles(translationFiles,categoryName )} variant={"contained"}>{t("mailingSettings.add")}</SecondaryButton>
                </Stack>
            </Stack>
        </GoMakeModal>
    )
};

export { AddBlockModal };