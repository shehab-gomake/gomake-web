import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { quoteState } from "../../../store/quote";

const AddNewAddressModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const quoteStateValue = useRecoilValue<any>(quoteState);
  return (
    <>
      <GoMakeModal
        openModal={quoteStateValue?.openAddNewModalAddress}
        modalTitle={t("sales.quote.addNewAddress")}
        onClose={() => quoteStateValue?.onCloseAddNewAddressClient()}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <div>
            <div style={clasess.mainInputsContainer}>
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.city")}
              />
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.street")}
              />
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.entrance")}
              />
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.apartment")}
              />
            </div>
            <div style={clasess.btnContainer}>
              <GomakePrimaryButton style={clasess.addBtnStyle}>
                {t("sales.quote.addNewAddress")}
              </GomakePrimaryButton>
            </div>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewAddressModal };
