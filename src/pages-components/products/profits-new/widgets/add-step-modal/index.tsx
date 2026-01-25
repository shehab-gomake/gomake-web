import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { AddStepModalProps } from "../../interface";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRouter } from "next/router";

const AddStepModal = ({
  openModal,
  onCloseModal,
  selectedPricingBy,
  addNewStepForActionProfitRow,
}: AddStepModalProps) => {
  const router = useRouter()
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [value, setValue] = useState<number>(null);
  const [totalPrice, setTotalPrice] = useState<number>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const totalPriceLabel = router.query.isOutSource
    ? t("products.profits.pricingListWidget.totalCost")
    : selectedPricingBy?.value === 1
      ? t("products.profits.pricingListWidget.totalPrice")
      : t("products.profits.pricingListWidget.unitPrice")
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("products.profits.pricingListWidget.addNewStep")}
        onClose={onCloseModal}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.textInputsContainer}>
            <div style={classes.labelTextContainer}>
              <div>{selectedPricingBy?.label}</div>
              <GomakeTextInput
                placeholder={selectedPricingBy?.label}
                style={classes.textInputStyle}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setValue(parseFloat(e.target.value));
                }}
                type="number"
              />
            </div>
            <div style={classes.labelTextContainer}>
              <div>{totalPriceLabel}</div>
              <GomakeTextInput
                placeholder={totalPriceLabel}
                style={classes.textInputStyle}
                value={totalPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTotalPrice(parseFloat(e.target.value));
                }}
                type="number"
              />
            </div>
          </div>
          <div style={classes.errorMsgStyle}>{errorMsg}</div>
          <div style={classes.btnContainer}>
            <GomakePrimaryButton
              style={classes.btnStyle}
              onClick={() => {
                if (
                  value !== null &&
                  value !== 0 &&
                  totalPrice !== null &&
                  totalPrice !== 0
                ) {
                  addNewStepForActionProfitRow(value, selectedPricingBy?.value === 1 ? totalPrice : value * totalPrice);
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
