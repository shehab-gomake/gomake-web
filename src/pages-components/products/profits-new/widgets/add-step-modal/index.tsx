import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { AddStepModalProps } from "../../interface";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const AddStepModal = ({
  openModal,
  onCloseModal,
  selectedPricingBy,
  addNewStepForActionProfitRow,
}: AddStepModalProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const [value, setValue] = useState<number>(null);
  const [totalPrice, setTotalPrice] = useState<number>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("products.profits.pricingListWidget.addNewStep")}
        onClose={onCloseModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <div style={clasess.textInputsContainer}>
            <div style={clasess.labelTextContainer}>
              <div>{selectedPricingBy?.label}</div>
              <GomakeTextInput
                placeholder={selectedPricingBy?.label}
                style={clasess.textInputStyle}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setValue(parseInt(e.target.value, 10));
                }}
                type="number"
              />
            </div>
            <div style={clasess.labelTextContainer}>
              <div>{t("products.profits.pricingListWidget.totalPrice")}</div>
              <GomakeTextInput
                placeholder={t("products.profits.pricingListWidget.totalPrice")}
                style={clasess.textInputStyle}
                value={totalPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTotalPrice(parseInt(e.target.value, 10));
                }}
                type="number"
              />
            </div>
          </div>
          <div style={clasess.errorMsgStyle}>{errorMsg}</div>
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton
              style={clasess.btnStyle}
              onClick={() => {
                if (
                  value !== null &&
                  value !== 0 &&
                  totalPrice !== null &&
                  totalPrice !== 0
                ) {
                  addNewStepForActionProfitRow(value, totalPrice);
                  onCloseModal();
                  setTotalPrice(null);
                  setValue(null);
                  setErrorMsg("");
                } else {
                  setErrorMsg(
                    t(
                      "products.profits.pricingListWidget.pleaseEnterallrequiredvalues"
                    )
                  );
                }
              }}
            >{t("materials.buttons.add")}</GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};

export { AddStepModal };
