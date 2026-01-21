import * as React from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useState } from "react";
import { GoMakeAutoComplate, GoMakeModal, GomakeTextInput } from "@/components";
import { useStyle } from "../style";
import { languageOptionsState } from "@/store/languages";
import { useRecoilValue } from "recoil";
import { companyProfileState, ICompanyProfile } from "@/store/company-profile";

interface IAddLangModalProps {
  openModal: boolean;
  onClose: () => void;
  onClickAddLang: (langKey: string) => void;
}

const AddLangModal = ({
  openModal,
  onClose,
  onClickAddLang,
}: IAddLangModalProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [langKey, setLangKey] = useState<string>();
  const languages = useRecoilValue(languageOptionsState);
  const profileData = useRecoilValue<ICompanyProfile>(companyProfileState);
  const defaultLanguageOptions = profileData?.languages?.length > 0
    ? languages.filter((lang) => profileData?.languages?.includes(lang.value))
    : [];

  return (
    <GoMakeModal
      insideStyle={classes.categoryModalStyle}
      openModal={openModal}
      onClose={onClose}
      modalTitle={t("translations.addNewLang")}
    >
      <Stack style={classes.firstStackStyle}>
        <GoMakeAutoComplate
          options={defaultLanguageOptions}
          onChange={(e: any, value: any) => setLangKey(value?.value)}
          placeholder={t("translations.selectLang")}
        />

        <Stack style={classes.secondStackStyle}>
          <SecondaryButton
            onClick={() => onClickAddLang(langKey)}
            variant={"contained"}
          >
            {t("translations.add")}
          </SecondaryButton>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

export { AddLangModal };
