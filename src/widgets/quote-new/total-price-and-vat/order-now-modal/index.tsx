import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";
import { OrderNowIcon } from "./icons";
import { Stack } from "@mui/material";

const OrderNowModal = ({
  openModal,
  onClose,
  confirmWithoutNotification,
  confirmWithNotification,
  isUsedStripe,
}: any) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  const confirmWithNotificationText = t(
    `sales.quote.${
      isUsedStripe ? "SendPaymentLink" : "confirmWithNotification"
    }`
  );

  const confirmWithoutNotificationText = t(
    `sales.quote.${
      isUsedStripe ? "goToPaymentLink" : "confirmWithoutNotification"
    }`
  );

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        onClose={onClose}
        insideStyle={classes.insideStyle}
        headerStyle={classes.headerStyle}
        withClose={false}
        withRoundedCloseIcon={false}
      >
        <div style={classes.mainContainer}>
          <OrderNowIcon />
          <Stack alignItems={"center"} gap={"5px"} marginBottom={5}>
            <span style={classes.titleContainer}>
              {t("sales.quote.orderNowTitle")}
            </span>

            <span style={classes.subTitleContainer}>
              {t("sales.quote.warningMsg")}
            </span>
          </Stack>
          <div style={classes.mainBtnContainer}>
            <GomakePrimaryButton
              style={{
                borderRadius: "8px",
                height: "40px",
                background: "white",
                color: "#000000",
                border: "1px solid  #D0D5DD",
              }}
              onClick={onClose}
            >
              {t("sales.quote.cancel")}
            </GomakePrimaryButton>
            <GomakePrimaryButton
              style={classes.secondBtn}
              onClick={confirmWithoutNotification}
            >
              {confirmWithoutNotificationText}
            </GomakePrimaryButton>
            <GomakePrimaryButton
              style={classes.btnStyle}
              onClick={confirmWithNotification}
            >
              {confirmWithNotificationText}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { OrderNowModal };
