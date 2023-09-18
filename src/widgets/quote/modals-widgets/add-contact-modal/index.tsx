import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages/quote/store/quote";

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
                onChange={(e: any) => {
                  quoteStateValue?.onChangeAddClientContactState(
                    "contactName",
                    e.target.value
                  );
                }}
              />
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.email")}
                onChange={(e: any) => {
                  quoteStateValue?.onChangeAddClientContactState(
                    "contactMail",
                    e.target.value
                  );
                }}
              />
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.phone")}
                onChange={(e: any) => {
                  quoteStateValue?.onChangeAddClientContactState(
                    "contactPhone",
                    e.target.value
                  );
                }}
              />
            </div>
            <div style={clasess.btnContainer}>
              <GomakePrimaryButton
                style={clasess.addBtnStyle}
                onClick={() => quoteStateValue?.addNewClientContact()}
              >
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
