import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CLIENT_TYPE } from "../enums";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";

interface IProps {
  onClickExport: () => void;
  onClickImport: (file) => void;
}

const ExcelButtons = ({ onClickExport, onClickImport}: IProps) => {
  const { t } = useTranslation();
  const elementRef = useRef(null);

  return (
    <Stack gap={'10px'} direction={'row'} justifyContent={'space-between'} >
      <SecondaryButton onClick={onClickExport} variant={'contained'}>{t("customers.buttons.export")}</SecondaryButton>
      <input ref={elementRef} onChange={onClickImport} type="file" accept=".xlsx" hidden={true} />
      <SecondaryButton onClick={() => elementRef && elementRef.current.click()} variant={'outlined'}>{t("customers.buttons.import")}</SecondaryButton>
    </Stack>

  );
};
export { ExcelButtons };