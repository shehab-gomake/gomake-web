import React from "react";

import { useStyle } from "./style";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useSettings } from "./use-settings";
import { useTranslation } from "react-i18next";
import { AddProductSkuModal } from "./modals/add-contact-modal";
import ColorPicker from "react-pick-color";
export default function SettingsWidget() {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    allProductSKU,
    allTemplate,
    allGroups,
    isProductSKU,
    color,
    showColorPicker,
    productState,
    onChangeStateProduct,
    onClickCloseProductSKU,
    onClickOpenProductSKU,
    onChangeStateProductSKU,
    createNewProductSKU,
    toggleColorPicker,
    closeColorPicker,
    handleColorChange,
    createNewProduct,
  } = useSettings();
  console.log("productState", productState);

  return (
    // onClick={closeColorPicker}
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
              onChange={(e: any) => {
                onChangeStateProduct("name", e.target.value);
              }}
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
              onChange={(e: any) => {
                onChangeStateProduct("details", e.target.value);
              }}
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
              onChange={(e: any, value: any) => {
                onChangeStateProduct("productSKUId", value);
              }}
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
              onChange={(e: any, value: any) => {
                onChangeStateProduct("templateId", value);
              }}
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
              onChange={(e: any) => {
                onChangeStateProduct("deliveryTime", e.target.value);
              }}
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
                onChange={(e: any, value: any) => {
                  onChangeStateProduct("groups", value);
                }}
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
              onChange={(e: any) => {
                onChangeStateProduct("noteColor", e.target.value);
              }}
            />
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.textColor")}
          </div>
          <div onClick={toggleColorPicker}>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("products.addProduct.admin.textColor")}
              disabled={true}
              value={color}
            />
          </div>
          <div
            onClick={toggleColorPicker}
            style={{
              width: 20,
              height: 20,
              backgroundColor: color,
              position: "absolute",
              right: 15,
              bottom: 11,
            }}
          />
        </div>
      </div>
      {showColorPicker && (
        <ColorPicker color={color} onChange={handleColorChange} />
      )}
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
              onChange={(e: any) => {
                onChangeStateProduct("startingPrice", e.target.value);
              }}
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
              onChange={(e: any) => {
                onChangeStateProduct("additionPrice", e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div style={clasess.btnsContainer}>
        <div style={clasess.goToListBtn} onClick={createNewProduct}>
          {t("products.addProduct.admin.addGoToList")}
        </div>
        <div style={clasess.addNwBtn}>
          {t("products.addProduct.admin.addNewProduct")}
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
