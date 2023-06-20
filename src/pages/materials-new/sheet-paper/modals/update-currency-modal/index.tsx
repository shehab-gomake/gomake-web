import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";

import { useStyle } from "./style";
import { useSupplier } from "@/hooks";
import { useEffect } from "react";

const UpdateCurrencyModal = ({
  openModal,
  onClose,
  onClickBtn,
  onChangeData,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { getSupplierCurrencies, suppliersCurrencies } = useSupplier();
  useEffect(() => {
    getSupplierCurrencies();
  }, []);

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("materials.sheetPaper.updateCurrency")}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <GoMakeAutoComplate
            options={suppliersCurrencies}
            style={clasess.textInputStyle}
            placeholder={t("materials.sheetPaper.selectCurrency")}
            getOptionLabel={(option: any) => option.label}
            onChange={(e: any, value: any) => {
              onChangeData(value?.value);
            }}
          />
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton style={clasess.sendBtn} onClick={onClickBtn}>
              {t("materials.inputs.update")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { UpdateCurrencyModal };
