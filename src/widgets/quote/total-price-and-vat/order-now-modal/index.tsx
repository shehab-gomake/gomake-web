import { useTranslation } from "react-i18next";
import { GoMakeModal} from "@/components";
import { useStyle } from "./style";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { SecondaryButton } from "@/components/button/secondary-button";
import { PrimaryButton } from "@/components/button/primary-button";

const OrderNowModal = ({
  openModal,
  onClose,
  confirmWithoutNotification,
  confirmWithNotification,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.orderNowTitle")}
        onClose={onClose}
        insideStyle={classes.insideStyle}
        headerStyle={classes.headerStyle}
        withClose={false}
        isMiddleTitle={true}
      >
        <div style={classes.mainContainer}>
          <WarningAmberIcon style={classes.iconContainer} />
          <div style={classes.titleContainer}>
            {t("sales.quote.warningMsg")}
          </div>
          <div style={classes.mainBtnContainer}>
            <SecondaryButton
              style={classes.withoutNotificationContainer}
              onClick={confirmWithNotification}
              variant="contained"
            >
              {t("sales.quote.confirmWithNotification")}
            </SecondaryButton>
            <SecondaryButton
              style={classes.withNotificationContainer}
              onClick={confirmWithoutNotification}
              variant="outlined"
            >
              {t("sales.quote.confirmWithoutNotification")}
            </SecondaryButton>
            <PrimaryButton
              style={classes.cancelContainer}
              onClick={onClose}
              variant="outlined"
            >
              {t("sales.quote.cancel")}
            </PrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { OrderNowModal };
