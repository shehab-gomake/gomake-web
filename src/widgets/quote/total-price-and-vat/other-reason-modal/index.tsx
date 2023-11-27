import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";

const OtherReasonModal = ({
  openModal,
  onClose,
  setReasonText,
  onClickCancelOffer,
}: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.reasonForCancellation")}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainModalContainer}>
          <GomakeTextInput
            multiline={6}
            style={clasess.textInputStyle}
            placeholder={t("sales.quote.reasonForCancellation")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setReasonText(event.target.value)
            }
          />
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton
              style={clasess.sendBtn}
              onClick={onClickCancelOffer}
            >
              {t("sales.quote.cancelOffer")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { OtherReasonModal };
