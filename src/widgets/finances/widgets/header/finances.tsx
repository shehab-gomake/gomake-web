import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { useFinancesHeaderWidget } from "./use-header";
import { DownloadAccountFilesModal } from "../download-account-files-modal/download-account-files-modal";
import { HeaderTitle } from "@/widgets";
import { FinancialPeriodModal } from "../financial-period-modal/financial-period-moda";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";

const FinancesHeaderWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    openModal,
    onClose,
    onOpen,
    openFinancialModal,
    onCloseFinancialModal,
    onOpenFinancialModal } = useFinancesHeaderWidget()

  return (
    <div style={classes.mainContainer}>
      <div style={classes.headerContainer}>
        <HeaderTitle marginTop={"0px"} marginBottom={"0px"} title={t("financesWidget.accountingDefinitions")} />
        <Stack direction={"row"} gap="5px">
        <SecondaryButton variant="contained" style={classes.downloadBtnStyle} onClick={onOpenFinancialModal}>{t("financesWidget.financialPeriod")}</SecondaryButton>
        <SecondaryButton variant="outlined"  style={classes.downloadBtnStyle} onClick={onOpen}>{t("financesWidget.downloadAccountFiles")}</SecondaryButton>
        </Stack>
      </div>
      <div style={classes.dividerStyle} />
      <DownloadAccountFilesModal openModal={openModal} onClose={onClose} />
      <FinancialPeriodModal openModal={openFinancialModal} onClose={onCloseFinancialModal} />
    </div>
  );
};
export { FinancesHeaderWidget };
