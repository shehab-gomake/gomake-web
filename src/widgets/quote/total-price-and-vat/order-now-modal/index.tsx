import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { useStyle } from "./style";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const OrderNowModal = ({
  openModal,
  onClose,
  confirmWithoutNotification,
  confirmWithNotification,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.orderNowTitle")}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <WarningAmberIcon style={clasess.iconContainer} />
          <div style={clasess.titleContainer}>
            {t("sales.quote.warningMsg")}
          </div>
          <div style={clasess.mainBtnContainer}>
            <GomakePrimaryButton
              style={clasess.cancelContainer}
              onClick={onClose}
            >
              {t("sales.quote.cancel")}
            </GomakePrimaryButton>
            <GomakePrimaryButton
              style={clasess.withNotificationContainer}
              onClick={confirmWithoutNotification}
            >
              {t("sales.quote.confirmWithoutNotification")}
            </GomakePrimaryButton>
            <GomakePrimaryButton
              style={clasess.withoutNotificationContainer}
              onClick={confirmWithNotification}
            >
              {t("sales.quote.confirmWithNotification")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { OrderNowModal };
