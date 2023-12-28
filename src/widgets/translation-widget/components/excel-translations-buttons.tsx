import * as React from "react";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useRef } from "react";
import { PrimaryButton } from "@/components/button/primary-button";
import { useTranslations } from "../use-translations";
import { useTranslation } from "react-i18next";

const ExcelButtons = () => {
    const elementRef = useRef(null);
    const { t } = useTranslation();
    const { downloadExcelFile, uploadExcelFile } = useTranslations();

    return (
        <Stack gap={'10px'} direction={'row'} justifyContent={'space-between'} paddingBottom={"4px"}>
            <PrimaryButton onClick={downloadExcelFile} variant={'contained'}>{t("translations.download")}</PrimaryButton>
            <input ref={elementRef} onChange={uploadExcelFile} type="file" accept=".xlsx" hidden={true} />
            <SecondaryButton onClick={() => elementRef && elementRef.current.click()} variant={'contained'}>{t("translations.upload")}</SecondaryButton>
        </Stack>
    )
};

export { ExcelButtons };