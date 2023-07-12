import React from "react";

import { useStyle } from "./style";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useSettings } from "./use-settings";
import { useTranslation } from "react-i18next";
import { AddProductSkuModal } from "./modals/add-contact-modal";

export default function SettingsWidget() {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    allProductSKU,
    allTemplate,
    allGroups,
    isProductSKU,
    onClickCloseProductSKU,
    onChangeStateProductSKU,
    onClickOpenProductSKU,
    createNewProductSKU,
  } = useSettings();
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.categoryNameStyle}>
        {t("products.addProduct.admin.productCategory")}
      </div>
      <div style={clasess.firstContainer}>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.productName")}
            <span style={clasess.requierdInput}> *</span>
          </div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("products.addProduct.admin.productName")}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.details")}
          </div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("products.addProduct.admin.details")}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.productSKU")}{" "}
            <span onClick={onClickOpenProductSKU} style={clasess.plusInput}>
              +
            </span>
          </div>
          <div style={{ width: "100%" }}>
            <GoMakeAutoComplate
              options={allProductSKU}
              placeholder={t("products.addProduct.admin.productSKU")}
              style={clasess.dropDownListStyle}
              getOptionLabel={(option: any) => option.name}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.pricingType")}
          </div>
          <div style={{ width: "100%" }}>
            <GoMakeAutoComplate
              options={allTemplate}
              placeholder={t("products.addProduct.admin.pricingType")}
              style={clasess.dropDownListStyle}
              getOptionLabel={(option: any) => option.name}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.deliveryTime")}
          </div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("products.addProduct.admin.deliveryTime")}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.groups")}
          </div>
          <div style={{ width: "100%" }}>
            {allGroups?.length > 0 && (
              <GoMakeAutoComplate
                options={allGroups}
                placeholder={t("products.addProduct.admin.groups")}
                style={clasess.multiSelectStyle}
                getOptionLabel={(option: any) => option.name}
                multiple
              />
            )}
          </div>
        </div>
      </div>
      <div style={clasess.categoryNameStyle}>
        {t("products.addProduct.admin.style")}
      </div>
      <div style={clasess.firstContainer}>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.noteColor")}
          </div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("products.addProduct.admin.noteColor")}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.textColor")}
          </div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("products.addProduct.admin.textColor")}
            />
          </div>
        </div>
      </div>
      <div style={clasess.categoryNameStyle}>
        {t("products.addProduct.admin.graphicsRequired")}
      </div>
      <div style={clasess.firstContainer}>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.startingPrice")}
          </div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("products.addProduct.admin.startingPrice")}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.additionToType")}
          </div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("products.addProduct.admin.additionToType")}
            />
          </div>
        </div>
      </div>
      <AddProductSkuModal
        openModal={isProductSKU}
        modalTitle={t("products.addProduct.admin.modalProductSKUTitle")}
        onClose={onClickCloseProductSKU}
        onChangeStateProductSKU={onChangeStateProductSKU}
        createNewProductSKU={createNewProductSKU}
      />
    </div>
  );
}
