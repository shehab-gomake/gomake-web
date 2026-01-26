import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { companyProfileState, ICompanyProfile } from "@/store/company-profile";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { GomakeTextInput } from "@/components";
import { Stack, Typography, Box } from "@mui/material";
import { useStyle } from "./style";
import { useDefaultLanguageOptions } from "@/hooks/use-default-language-options";

interface IProductTranslation {
  name: string;
  lang: string;
}

interface IProductTranslationModalProps {
  open: boolean;
  onClose: () => void;
  translations: IProductTranslation[];
  onSave: (translations: IProductTranslation[]) => void;
  productName?: string;
}

const ProductTranslationModal: React.FC<IProductTranslationModalProps> = ({
  open,
  onClose,
  translations,
  onSave,
  productName = "",
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const profile = useRecoilValue<ICompanyProfile>(companyProfileState);
  const { defaultLanguageOptions } = useDefaultLanguageOptions();

  // Get print house languages
  const printHouseLanguages = useMemo(() => {
    if (!profile?.languages || profile.languages.length === 0) {
      return [];
    }
    return defaultLanguageOptions.filter((lang) =>
      profile.languages?.includes(lang.value)
    );
  }, [profile?.languages, defaultLanguageOptions]);

  // Get default language from profile
  const defaultLanguage = useMemo(() => {
    return profile?.systemLanguage || printHouseLanguages[0]?.value || "en";
  }, [profile?.systemLanguage, printHouseLanguages]);

  // Initialize translations state
  const [localTranslations, setLocalTranslations] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (open) {
      // Initialize with existing translations
      const initialTranslations: Record<string, string> = {};
      if (translations && translations.length > 0) {
        translations.forEach((trans) => {
          if (trans.lang) {
            initialTranslations[trans.lang] = trans.name || "";
          }
        });
      }
      // Pre-fill default language with product name if not already set
      if (productName && !initialTranslations[defaultLanguage]) {
        initialTranslations[defaultLanguage] = productName;
      }
      setLocalTranslations(initialTranslations);
    }
  }, [open, translations, productName, defaultLanguage]);

  const handleTranslationChange = (lang: string, value: string) => {
    setLocalTranslations((prev) => ({
      ...prev,
      [lang]: value,
    }));
  };

  const handleSave = () => {
    // Convert to array format: [{name: "", lang: ""}]
    const translationsArray: IProductTranslation[] = printHouseLanguages
      .map((lang) => ({
        name: localTranslations[lang.value] || "",
        lang: lang.value,
      }))
      .filter((trans) => trans.name.trim().length > 0); // Only include non-empty translations

    onSave(translationsArray);
    onClose();
  };

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("products.addProduct.admin.translateProductName")}
      onPrimaryAction={handleSave}
      primaryButtonLabel={t("common.save")}
      cancelButtonLabel={t("common.cancel")}
      maxWidth="sm"
    >
      <Stack spacing={2} sx={classes.container}>
        {printHouseLanguages.length === 0 ? (
          <Typography sx={classes.emptyState}>
            {t("products.addProduct.admin.noTranslationsAvailable")}
          </Typography>
        ) : (
          printHouseLanguages.map((lang) => (
            <Box key={lang.value} sx={classes.inputContainer}>
              <Typography sx={classes.label}>{lang.text}</Typography>
              <GomakeTextInput
                style={classes.textInput}
                placeholder={t("products.addProduct.admin.enterProductName")}
                value={localTranslations[lang.value] || ""}
                onChange={(e: any) =>
                  handleTranslationChange(lang.value, e.target.value)
                }
              />
            </Box>
          ))
        )}
      </Stack>
    </GoMakeDialog>
  );
};

export { ProductTranslationModal };
export type { IProductTranslation };

