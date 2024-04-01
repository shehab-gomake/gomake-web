import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components";
import { useFinancesHeaderWidget } from "./use-header";
import { DownloadAccountFilesModal } from "../download-account-files-modal/download-account-files-modal";

const FinancesHeaderWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();

  const { openModal, onClose, onOpen } = useFinancesHeaderWidget()

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerContainer}>
        <div>
          <GomakePrimaryButton style={clasess.downloadBtnStyle} onClick={onOpen}>{t("financesWidget.downloadAccountFiles")}</GomakePrimaryButton>
        </div>
        <div style={clasess.titleStyle}>{t("financesWidget.accountingDefinitions")}</div>
      </div>
      <div style={clasess.dividerStyle} />
      <DownloadAccountFilesModal openModal={openModal} onClose={onClose} />
    </div>
  );
};
export { FinancesHeaderWidget };
