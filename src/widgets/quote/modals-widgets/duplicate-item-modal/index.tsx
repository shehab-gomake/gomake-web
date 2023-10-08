import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages-components/quote/store/quote";

const DuplicateItemModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const quoteStateValue = useRecoilValue<any>(quoteState);
  return (
    <>
      <GoMakeModal
        openModal={quoteStateValue?.openDuplicateWithDifferentQTYModal}
        modalTitle={t("sales.quote.duplicateItemWithDifferentQTY")}
        onClose={() => quoteStateValue?.onCloseDuplicateWithDifferentQTY()}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <div style={{ width: "40%", marginTop: 15 }}>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("sales.quote.item")}
              type="number"
              onChange={(e: any) => quoteStateValue.setAmountValue(e.target.value)}
            />
          </div>
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton style={clasess.sendBtn} onClick={()=>quoteStateValue.duplicateQuoteItemWithAnotherQuantity()}>
              {t("sales.quote.duplicate")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { DuplicateItemModal };
