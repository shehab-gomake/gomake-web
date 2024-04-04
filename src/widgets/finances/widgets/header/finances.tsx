import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components";
import { useFinancesHeaderWidget } from "./use-header";
import { DownloadAccountFilesModal } from "../download-account-files-modal/download-account-files-modal";
import { HeaderTitle } from "@/widgets";

const FinancesHeaderWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { openModal, onClose, onOpen } = useFinancesHeaderWidget()

  return (
    <div style={classes.mainContainer}>
      <div style={classes.headerContainer}>
        <HeaderTitle marginTop={"0px"} marginBottom={"0px"} title={t("financesWidget.accountingDefinitions")} />
        <GomakePrimaryButton style={classes.downloadBtnStyle} onClick={onOpen}>{t("financesWidget.downloadAccountFiles")}</GomakePrimaryButton>
      </div>
      <div style={classes.dividerStyle} />
      <DownloadAccountFilesModal openModal={openModal} onClose={onClose} />
    </div>
  );
};
export { FinancesHeaderWidget };
