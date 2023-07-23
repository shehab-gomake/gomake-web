import React from "react";

import { useTranslation } from "react-i18next";
import { SketchPicker } from "react-color";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { AddProductSkuModal } from "./modals/add-contact-modal";
import { useSettings } from "./use-settings";
import { useStyle } from "./style";

const SettingsWidget = ({
  onClickParametersTab,
  productState,
  onChangeStateProduct,
  isUpdate = false,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    allProductSKU,
    allTemplate,
    allGroups,
    isProductSKU,
    showColorPicker,
    showColorPickerForNoteColor,
    onClickCloseProductSKU,
    onClickOpenProductSKU,
    onChangeStateProductSKU,
    createNewProductSKU,
    toggleColorPicker,
    toggleColorPickerForNoteColor,
    createNewProduct,
    createNewProductAndGoToParameterList,
    updatedProduct,
  } = useSettings({ onClickParametersTab, productState, onChangeStateProduct });
  const defultProductSKU = allProductSKU?.filter(
    (item) => item.id === productState?.productSKUId
  );
  const defultTemplate = allTemplate?.filter(
    (item) => item.id === productState?.templateId
  );
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
              onChange={(e: any) => {
                onChangeStateProduct("name", e.target.value);
              }}
              value={productState?.name}
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
              value={productState?.details}
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
            {allProductSKU && (
              <GoMakeAutoComplate
                options={allProductSKU}
                placeholder={
                  defultProductSKU?.length > 0
                    ? defultProductSKU[0]?.name
                    : t("products.addProduct.admin.productSKU")
                }
                style={clasess.dropDownListStyle}
                getOptionLabel={(option: any) => option.name}
                onChange={(e: any, value: any) => {
                  onChangeStateProduct("productSKUId", value);
                }}
              />
            )}
          </div>
        </div>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.pricingType")}
          </div>
          <div style={{ width: "100%" }}>
            {allTemplate && defultTemplate && (
              <GoMakeAutoComplate
                options={allTemplate}
                placeholder={
                  defultTemplate?.length > 0
                    ? defultTemplate[0]?.name
                    : t("products.addProduct.admin.pricingType")
                }
                style={clasess.dropDownListStyle}
                getOptionLabel={(option: any) => option.name}
                onChange={(e: any, value: any) => {
                  onChangeStateProduct("templateId", value);
                }}
              />
            )}
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
              value={productState?.deliveryTime}
            />
          </div>
        </div>
        <div style={clasess.itemGropupsContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.groups")}
          </div>
          <div style={{ width: "100%" }}>
            {allGroups?.length > 0 && (
              <GoMakeAutoComplate
                options={allGroups}
                placeholder={t("products.addProduct.admin.groups")}
                style={clasess.multiSelectStyle}
                multiple
                onChange={(e: any, value: any) => {
                  onChangeStateProduct(
                    "groups",
                    value?.map((item: any) => item?.id)
                  );
                }}
                value={productState?.groups?.map((item: any) => {
                  const group = allGroups?.find(
                    (group: any) => group?.id === item
                  );
                  return {
                    label: group?.label,
                    id: group?.id,
                  };
                })}
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
          <div onClick={toggleColorPickerForNoteColor}>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("products.addProduct.admin.textColor")}
              disabled={true}
              value={productState?.noteColor}
            />
          </div>
          <div
            onClick={toggleColorPickerForNoteColor}
            style={{
              width: 20,
              height: 20,
              backgroundColor: productState?.noteColor,
              position: "absolute",
              right: 15,
              bottom: 11,
            }}
          />
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
              value={productState?.textColor}
            />
          </div>
          <div
            onClick={toggleColorPicker}
            style={{
              width: 20,
              height: 20,
              backgroundColor: productState?.textColor,
              position: "absolute",
              right: 15,
              bottom: 11,
            }}
          />
        </div>
      </div>
      {showColorPicker && (
        <SketchPicker
          color={productState?.textColor}
          onChangeComplete={(value: any) => {
            onChangeStateProduct("textColor", value?.hex);
          }}
        />
      )}
      {showColorPickerForNoteColor && (
        <SketchPicker
          color={productState?.noteColor}
          onChangeComplete={(value: any) => {
            onChangeStateProduct("noteColor", value?.hex);
          }}
        />
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
              value={productState?.startingPrice}
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
              value={productState?.additionPrice}
            />
          </div>
        </div>
      </div>
      {isUpdate ? (
        <div style={clasess.btnsContainer}>
          <div style={clasess.addNwBtn} onClick={updatedProduct}>
            {t("products.addProduct.admin.updateNewProduct")}
          </div>
        </div>
      ) : (
        <div style={clasess.btnsContainer}>
          <div
            style={clasess.goToListBtn}
            onClick={createNewProductAndGoToParameterList}
          >
            {t("products.addProduct.admin.addGoToList")}
          </div>
          <div style={clasess.addNwBtn} onClick={createNewProduct}>
            {t("products.addProduct.admin.addNewProduct")}
          </div>
        </div>
      )}

      <AddProductSkuModal
        openModal={isProductSKU}
        modalTitle={t("products.addProduct.admin.modalProductSKUTitle")}
        onClose={onClickCloseProductSKU}
        onChangeStateProductSKU={onChangeStateProductSKU}
        createNewProductSKU={createNewProductSKU}
      />
    </div>
  );
};
export { SettingsWidget };
