import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
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
  console.log("suppliersCurrencies", suppliersCurrencies);

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={"Update Currency"}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <GoMakeAutoComplate
            options={suppliersCurrencies}
            style={clasess.textInputStyle}
            placeholder="Select Currency"
            getOptionLabel={(option: any) => option.label}
            onChange={(e: any, value: any) => {
              onChangeData(value?.value);
            }}
          />
          {/* <GomakeTextInput
            style={clasess.textInputStyle}
            placeholder="Enter Price"
            onChange={(e: any) => onChangeData(e.target.value)}
          /> */}
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton style={clasess.sendBtn} onClick={onClickBtn}>
              Update
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { UpdateCurrencyModal };
