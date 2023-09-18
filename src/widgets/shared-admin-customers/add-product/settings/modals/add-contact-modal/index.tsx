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
  errorName,
  errorCode,
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
        <div style={{ marginTop: 20, height: "80%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              height: "100%",
            }}
          >
            <div style={clasess.mainInputsContainer}>
              <div style={{ width: "100%" }}>
                <GomakeTextInput
                  style={clasess.textInputStyle}
                  placeholder={t("products.addProduct.admin.enterName")}
                  onChange={(e: any) => {
                    onChangeStateProductSKU("name", e.target.value);
                  }}
                />
                {errorName && (
                  <div style={clasess.errorlabelStyle}>Field is required</div>
                )}
              </div>
              <div style={{ width: "100%" }}>
                <GomakeTextInput
                  style={clasess.textInputStyle}
                  placeholder={t("products.addProduct.admin.enterCode")}
                  onChange={(e: any) => {
                    onChangeStateProductSKU("code", e.target.value);
                  }}
                />
                {errorCode && (
                  <div style={clasess.errorlabelStyle}>Field is required</div>
                )}
              </div>
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
