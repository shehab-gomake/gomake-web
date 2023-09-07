import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages/quote/store/quote";

const AddNewAddressModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const quoteStateValue = useRecoilValue<any>(quoteState);
  // addClientAddressState,
  // onChangeAddClientAddressState,
  // addNewClientAddress,
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
              <div style={{ width: "30%" }}>
                <GomakeTextInput
                  style={clasess.textInputStyle}
                  placeholder={t("sales.quote.addressName")}
                  onChange={(e: any) => {
                    quoteStateValue?.onChangeAddClientAddressState(
                      "addressName",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div style={{ width: "30%" }}>
                <GomakeTextInput
                  style={clasess.textInputStyle}
                  placeholder={t("sales.quote.city")}
                  onChange={(e: any) => {
                    quoteStateValue?.onChangeAddClientAddressState(
                      "city",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div style={{ width: "30%" }}>
                <GomakeTextInput
                  style={clasess.textInputStyle}
                  placeholder={t("sales.quote.street")}
                  onChange={(e: any) => {
                    quoteStateValue?.onChangeAddClientAddressState(
                      "street",
                      e.target.value
                    );
                  }}
                />
              </div>
            </div>
            <div style={clasess.mainInputsContainer}>
              <div style={{ width: "30%" }}>
                <GomakeTextInput
                  style={clasess.textInputStyle}
                  placeholder={t("sales.quote.entrance")}
                  onChange={(e: any) => {
                    quoteStateValue?.onChangeAddClientAddressState(
                      "entry",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div style={{ width: "30%" }}>
                <GomakeTextInput
                  style={clasess.textInputStyle}
                  placeholder={t("sales.quote.apartment")}
                  onChange={(e: any) => {
                    quoteStateValue?.onChangeAddClientAddressState(
                      "apartment",
                      e.target.value
                    );
                  }}
                />
              </div>
            </div>
            <div style={clasess.btnContainer}>
              <GomakePrimaryButton
                style={clasess.addBtnStyle}
                onClick={() => quoteStateValue?.addNewClientAddress()}
              >
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
