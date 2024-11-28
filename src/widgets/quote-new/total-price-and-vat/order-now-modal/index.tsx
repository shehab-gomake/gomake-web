import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";
import { GoMakeLoadingBackdrop } from "@/widgets/loading-with-shadow/go-make-loading-back-drop";
import { OrderNowIcon } from "./icons";
import { Stack } from "@mui/material";

//!here
const OrderNowModal = ({
  openModal,
  onClose,
  confirmWithoutNotification,
  confirmWithNotification,
  loading,
}: any) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

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
              style={classes.btnStyle}
              onClick={confirmWithNotification}
            >
              {t("sales.quote.confirmWithNotification")}
            </GomakePrimaryButton>
            <GomakePrimaryButton
              style={classes.secondBtn}
              onClick={confirmWithoutNotification}
            >
              {t("sales.quote.confirmWithoutNotification")}
            </GomakePrimaryButton>
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
          </div>
        </div>
        <GoMakeLoadingBackdrop loading={loading} circular={false} />
      </GoMakeModal>
    </>
  );
};
export { OrderNowModal };
