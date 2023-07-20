import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";

const AddProductSkuModal = ({
  openModal,
  modalTitle,
  onClose,
  onChangeStateProductSKU,
  createNewProductSKU,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div>
          <div>
            <div style={clasess.mainInputsContainer}>
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder={t("products.addProduct.admin.enterName")}
                onChange={(e: any) => {
                  onChangeStateProductSKU("name", e.target.value);
                }}
              />
              <GomakeTextInput
                style={clasess.textInputStyle}
                placeholder={t("products.addProduct.admin.enterCode")}
                onChange={(e: any) => {
                  onChangeStateProductSKU("code", e.target.value);
                }}
              />
            </div>
            <div style={clasess.btnContainer}>
              <GomakePrimaryButton
                style={clasess.addBtnStyle}
                onClick={() => createNewProductSKU()}
              >
                {t("products.addProduct.admin.modalProductSKUTitle")}
              </GomakePrimaryButton>
            </div>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddProductSkuModal };
