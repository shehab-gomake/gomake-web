import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { PrimaryButton } from "@/components/button/primary-button";

import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";

const OtherReasonModal = ({
  openModal,
  onClose,
  setReasonText,
  onClickCancelOffer,
  style,
}: {
  openModal: boolean;
  onClose: () => void;
  setReasonText: (text: string) => void;
  onClickCancelOffer: () => void;
  style?: React.CSSProperties | null;
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.reasonForCancellation")}
        onClose={onClose}
        insideStyle={
          style ? { ...classes.insideStyle, ...style } : classes.insideStyle
        }
        modalTitleColor={"black"}
      >
        <div style={classes.mainModalContainer}>
          <GomakeTextInput
            multiline={6}
            style={classes.textInputStyle}
            placeholder={t("sales.quote.reasonForCancellation")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setReasonText(event.target.value)
            }
          />
          <div style={classes.btnContainer}>
            <PrimaryButton
              style={classes.cancelBtn}
              onClick={onClose}
              variant="outlined"
            >
              {t("sales.quote.close")}
            </PrimaryButton>
            <SecondaryButton
              style={classes.sendBtn}
              onClick={onClickCancelOffer}
              variant="contained"
            >
              {t("sales.quote.cancelBtn")}
            </SecondaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { OtherReasonModal };
