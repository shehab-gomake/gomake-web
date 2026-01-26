import * as React from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useState } from "react";
import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import { useStyle } from "../style";
import { useDefaultLanguageOptions } from "@/hooks/use-default-language-options";
import { permissionsState } from "@/store";
import { useRecoilValue } from "recoil";
import { Permissions } from "@/components/CheckPermission/enum";

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
  const { defaultLanguageOptions } = useDefaultLanguageOptions();
  const permissions = useRecoilValue(permissionsState);

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
          onChange={(e: any, value: any) => {
            if (value?.value === "add_language_action") {
              if (!permissions?.includes(Permissions.EDIT_COMPANY_PROFILE)) {
                window.alert("ask your admin to add language");
                return;
              }
              window.location.href = "/settings/company-profile";
              return;
            }
            setLangKey(value?.value);

          }}
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
