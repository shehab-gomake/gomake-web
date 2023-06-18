import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { quoteState } from "../../../store/quote";

const AddNewItemModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const quoteStateValue = useRecoilValue<any>(quoteState);
  //change openModal onClose
  return (
    <>
      <GoMakeModal
        openModal={quoteStateValue?.openAddNewModalContact}
        modalTitle={t("sales.quote.addNewItem")}
        onClose={() => quoteStateValue?.onCloseAddNewContactClient()}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <div style={{ width: "40%", marginTop: 10 }}>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("sales.quote.item")}
            />
          </div>
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton style={clasess.sendBtn}>
              {t("sales.quote.duplicate")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewItemModal };
