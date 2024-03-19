import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton, 
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";

const DuplicateItemModal = ({
  openModal,
  onClose,
  setAmountValue,
  duplicateQuoteItemWithAnotherQuantity,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.duplicateItemWithDifferentQTY")}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <div style={{ width: "40%", marginTop: 15 }}>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("sales.quote.item")}
              type="number"
              onChange={(e: any) => setAmountValue(e.target.value)}
            />
          </div>
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton
              style={clasess.sendBtn}
              onClick={() => duplicateQuoteItemWithAnotherQuantity()}
            >
              {t("sales.quote.duplicate")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { DuplicateItemModal };
