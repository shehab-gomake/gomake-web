import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  ThreeOptionsModal,
} from "@/components";
import { useStyle } from "./style";
import { OrderNowIcon } from "./icons";
import { Stack } from "@mui/material";
import { useRecoilValue } from "recoil";
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";

const OrderNowModal = ({
  openModal,
  onClose,
  confirmWithoutNotification,
  confirmWithNotification,
  isUsedStripe,
  isConnectedToStripe,
  CheckoutOptionModal,
  onConfirm,
}: any) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);
  const showBtn = !isUsedStripe || (isConnectedToStripe && isUsedStripe);
  const showSingleConfirmButton = hasFrontDeskFeature && !isUsedStripe;

  const confirmWithNotificationText = t(
    `sales.quote.${isUsedStripe ? "checkout" : "confirmWithNotification"}`
  );

  const confirmWithoutNotificationText = t(
    `sales.quote.${
      isUsedStripe
        ? isConnectedToStripe
          ? "continueWithoutCheckout"
          : "continue"
        : "confirmWithoutNotification"
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

            {showSingleConfirmButton ? (
              <GomakePrimaryButton
                style={classes.btnStyle}
                onClick={onConfirm || confirmWithNotification}
              >
                {t("modal.confirm")}
              </GomakePrimaryButton>
            ) : (
              <>
                <GomakePrimaryButton
                  style={showBtn ? classes.secondBtn : classes.btnStyle}
                  onClick={confirmWithoutNotification}
                >
                  {confirmWithoutNotificationText}
                </GomakePrimaryButton>

                {showBtn && (
                  <GomakePrimaryButton
                    style={classes.btnStyle}
                    onClick={
                      isUsedStripe
                        ? CheckoutOptionModal.open
                        : confirmWithNotification
                    }
                  >
                    {confirmWithNotificationText}
                  </GomakePrimaryButton>
                )}
              </>
            )}
          </div>
        </div>
      </GoMakeModal>

      <ThreeOptionsModal
        hideIcon={true}
        title={t("sales.modals.chooseCheckoutOption")}
        subTitle={t("sales.modals.checkoutPrompt")}
        yesBtn={"sales.modals.creditCard"}
        noBtn={"sales.modals.cash"}
        openModal={CheckoutOptionModal.isOpen}
        onClose={CheckoutOptionModal.close}
        onClickYes={() => confirmWithNotification(false)}
        onClickNo={() => confirmWithNotification(true)}
      />
    </>
  );
};
export { OrderNowModal };
