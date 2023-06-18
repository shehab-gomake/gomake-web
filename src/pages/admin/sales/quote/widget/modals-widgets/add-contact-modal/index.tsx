import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { quoteState } from "../../../store/quote";

const AddNewContactModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const quoteStateValue = useRecoilValue<any>(quoteState);
  return (
    <>
      <GoMakeModal
        openModal={quoteStateValue?.openAddNewModalContact}
        modalTitle={t("sales.quote.addNewContacts")}
        onClose={() => quoteStateValue?.onCloseAddNewContactClient()}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <div>
            <div style={clasess.mainInputsContainer}>
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.name")}
              />
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.email")}
              />
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.phone")}
              />
            </div>
            <div style={clasess.btnContainer}>
              <GomakePrimaryButton style={clasess.addBtnStyle}>
                {t("sales.quote.addNewContacts")}
              </GomakePrimaryButton>
            </div>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewContactModal };
