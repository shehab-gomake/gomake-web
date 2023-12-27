import React, { useEffect } from "react";

import { useTranslation } from "react-i18next";
import { SketchPicker } from "react-color";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { AddProductSkuModal } from "./modals/add-contact-modal";
import { useSettings } from "./use-settings";
import { useStyle } from "./style";
import { EProductClient } from "./settings-data";

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
    errorName,
    errorCode,
    productClientsList,
    SelectproductClient,
    customersList,
    clientTypesList,
    setSelectProductClient,
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

  console.log("productState", productState);
  const defultProductSKU = allProductSKU?.find(
    (item) => item.id === productState?.productSKUId
  );
  const defultTemplate = allTemplate?.find(
    (item) => item.id === productState?.templateId
  );
  const _renderProductClientSelector = () => {
    if (SelectproductClient?.id === EProductClient.BY_CLIENT) {
      return (
        <div style={clasess.itemGropupsContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.byClient")}
          </div>
          <div style={{ width: "100%" }}>
            <GoMakeAutoComplate
              options={customersList.map((item) => {
                return {
                  ...item,
                  label: item?.name,
                  id: item.id,
                };
              })}
              placeholder={t("products.addProduct.admin.byClient")}
              style={clasess.multiSelectStyle}
              multiple
              onChange={(e: any, value: any) => {
                onChangeStateProduct(
                  "clients",
                  value?.map((item: any) => item?.id)
                );
              }}
              value={productState?.clients?.map((item: any) => {
                const customer = customersList?.find(
                  (customer: any) => customer?.id === item
                );
                return {
                  label: customer?.name,
                  id: customer?.id,
                };
              })}
            />
          </div>
        </div>
      );
    } else if (SelectproductClient?.id === EProductClient.BY_CLIENT_TYPE) {
      return (
        <div style={clasess.itemGropupsContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.byClientType")}
          </div>
          <div style={{ width: "100%" }}>
            <GoMakeAutoComplate
              key={SelectproductClient?.id}
              options={clientTypesList.map((item) => {
                return {
                  ...item,
                  label: item?.name,
                  id: item.id,
                };
              })}
              placeholder={t("products.addProduct.admin.byClientType")}
              style={clasess.multiSelectStyle}
              multiple
              onChange={(e: any, value: any) => {
                onChangeStateProduct(
                  "clientsTypes",
                  value?.map((item: any) => item?.id)
                );
              }}
              value={productState?.clientsTypes?.map((item: any) => {
                const clientType = clientTypesList?.find(
                  (clientType: any) => clientType?.id === item
                );
                return {
                  label: clientType?.name,
                  id: clientType?.id,
                };
              })}
            />
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

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
                key={defultProductSKU}
                options={allProductSKU}
                placeholder={t("products.addProduct.admin.productSKU")}
                style={clasess.dropDownListStyle}
                getOptionLabel={(option: any) => option.name}
                value={
                  typeof productState?.productSKUId === "string"
                    ? defultProductSKU
                    : productState.productSKU
                }
                // defaultValue={defultProductSKU}
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
            {allTemplate && (
              <GoMakeAutoComplate
                key={defultTemplate}
                options={allTemplate}
                placeholder={t("products.addProduct.admin.pricingType")}
                style={clasess.dropDownListStyle}
                getOptionLabel={(option: any) => option.name}
                value={
                  typeof productState?.templateId
                    ? defultTemplate
                    : productState?.templateId
                }
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
        {t("products.addProduct.admin.clients")}
      </div>
      <div style={clasess.firstContainer}>
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.pricingType")}
          </div>
          <div style={{ width: "100%" }}>
            <GoMakeAutoComplate
              key={SelectproductClient?.id}
              options={productClientsList}
              placeholder={t("products.addProduct.admin.pricingType")}
              style={clasess.dropDownListStyle}
              value={SelectproductClient}
              onChange={(e: any, value: any) => {
                setSelectProductClient(value);
                onChangeStateProduct("clientsTypes", []);
                onChangeStateProduct("clients", []);
              }}
            />
          </div>
        </div>
        {_renderProductClientSelector()}
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
        modalTitle={t("products.addProduct.admin.modalProductSKU")}
        onClose={onClickCloseProductSKU}
        onChangeStateProductSKU={onChangeStateProductSKU}
        createNewProductSKU={createNewProductSKU}
        errorName={errorName}
        errorCode={errorCode}
      />
    </div>
  );
};
export { SettingsWidget };
