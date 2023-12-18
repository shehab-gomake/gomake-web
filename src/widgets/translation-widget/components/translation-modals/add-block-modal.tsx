import * as React from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useState } from "react";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { useStyle } from "../style";
import { useTranslations } from "../../use-translations";

interface IProps {
    translationFiles: {
      en: string[];
      he: string[];
      ar: string[];
      de: string[];
    };
  }
const AddBlockModal = ({ translationFiles }: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle()
    const [categoryName, setCategoryName] = useState<string>();
    const { addEmptyBlockToAllFiles , onClickCloseBlockModal , openBlockModal} = useTranslations();

    return (
        <GoMakeModal
            insideStyle={classes.categoryModalStyle}
            openModal={openBlockModal}
            onClose={onClickCloseBlockModal}
            modalTitle={t("translations.addNewBlock")}>
            <Stack style={classes.firstStackStyle}>
                <GomakeTextInput onChange={(e) => setCategoryName(e.target.value)}  style={classes.addButtonStyle} placeholder={t("translations.addNewBlock")}/>
                <Stack style={classes.secondStackStyle}>
                    <SecondaryButton onClick={() => addEmptyBlockToAllFiles(translationFiles,categoryName )} variant={"contained"}>{t("translations.add")}</SecondaryButton>
                </Stack>
            </Stack>
        </GoMakeModal>
    )
};

export { AddBlockModal };