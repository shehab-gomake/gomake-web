import React, { useEffect, useMemo, useState } from "react";
import { MuiColorInput } from "mui-color-input";
import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GomakeTextInput,
} from "@/components";
import ProductMultiSelect from "@/components/auto-complete/product-multi-select";
import { AddProductSkuModal } from "./modals/add-contact-modal";
import { UploadImgProduct } from "./upload-widget";
import { EProductClient, EProductStructureType } from "./settings-data";
import { useSettings } from "./use-settings";
import { useStyle } from "./style";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import TranslateIcon from "@mui/icons-material/Translate";
import { IconButton, Tooltip } from "@mui/material";
import { ModalType } from "@/enums";
import { ProductTranslationModal, IProductTranslation } from "./modals/product-translation-modal";
import { useRecoilValue } from "recoil";
import { companyProfileState, ICompanyProfile } from "@/store/company-profile";
import { languageOptionsState } from "@/store/languages";

const SettingsWidget = ({
  onClickParametersTab,
  productState,
  onChangeStateProduct,
  isUpdate = false,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const profile = useRecoilValue<ICompanyProfile>(companyProfileState);
  const allLanguages = useRecoilValue(languageOptionsState);
  const [openTranslationModal, setOpenTranslationModal] = useState(false);
  const {
    allProductSKU,
    allTemplate,
    allGroups,
    isProductSKU,
    errorName,
    errorCode,
    productClientsList,
    SelectproductClient,
    customersList,
    clientTypesList,
    openDeleteRowModal,
    onClickOpenDeleteRowModal,
    onClickCloseDeleteRowModal,
    onClickCloseProductSKU,
    onClickOpenProductSKU,
    onChangeStateProductSKU,
    createNewProductSKU,
    createNewProduct,
    createNewProductAndGoToParameterList,
    updatedProduct,
    UploadProductImage,
    deleteProductSKURow,
    openPricingTypeModal,
    onClickOpenPricingType,
    selectPricingType,
    onClickClosePricingType,
    query,
    productSKU,
    updateProductSKURow,
    productsList,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    updateSelectedCustomersCache,
    selectedCustomersCache,
  } = useSettings({ onClickParametersTab, productState, onChangeStateProduct });

  const [defultProductSKU, setDefultProductSKU] = useState();
  const [defultTemplate, setDefultTemplate] = useState();

  // Get print house languages
  const printHouseLanguages = useMemo(() => {
    if (!profile?.languages || profile.languages.length === 0) {
      return [];
    }
    return allLanguages.filter((lang) =>
      profile.languages?.includes(lang.value)
    );
  }, [profile?.languages, allLanguages]);

  // Get default language
  const defaultLanguage = useMemo(() => {
    return profile?.systemLanguage || printHouseLanguages[0]?.value || "en";
  }, [profile?.systemLanguage, printHouseLanguages]);

  // Get product name from default language translation
  const getDefaultLanguageName = useMemo(() => {
    if (!productState?.translations || productState.translations.length === 0) {
      return productState?.name || "";
    }
    const defaultTranslation = productState.translations.find(
      (trans: IProductTranslation) => trans.lang === defaultLanguage
    );
    return defaultTranslation?.name || productState?.name || "";
  }, [productState?.translations, productState?.name, defaultLanguage]);

  // Handle translation modal save
  const handleTranslationSave = (translations: IProductTranslation[]) => {
    onChangeStateProduct("translations", translations);
    // Update product name with default language translation
    const defaultTranslation = translations.find(
      (trans) => trans.lang === defaultLanguage
    );
    if (defaultTranslation?.name) {
      onChangeStateProduct("name", defaultTranslation.name);
    }
  };
  const productStructureOptions = useMemo(
    () => [
      {
        label: t("products.addProduct.admin.base"),
        id: EProductStructureType.BASE,
      },
      {
        label: t("products.addProduct.admin.composite"),
        id: EProductStructureType.COMPOSITE,
      },
    ],
    [t]
  );
  const selectedProductStructure = useMemo(() => {
    const currentStructureType =
      typeof productState?.productStructureType === "object"
        ? productState?.productStructureType?.id
        : productState?.productStructureType;

    return (
      productStructureOptions.find(
        (option) => option.id === currentStructureType
      ) ?? productStructureOptions[0]
    );
  }, [productStructureOptions, productState?.productStructureType]);

  const isCompositeStructure =
    selectedProductStructure?.id === EProductStructureType.COMPOSITE;

  // Combined pricing type options: Composite first, then templates
  const pricingTypeOptions = useMemo(() => {
    const compositeOption = {
      id: "COMPOSITE",
      name: t("products.addProduct.admin.composite"),
      isComposite: true,
    };
    const templateOptions = allTemplate?.map((template: any) => ({
      ...template,
      isComposite: false,
    })) || [];
    return [compositeOption, ...templateOptions];
  }, [allTemplate, t]);

  // Determine selected pricing type value
  const selectedPricingType = useMemo(() => {
    if (isCompositeStructure) {
      return pricingTypeOptions[0]; // Composite option
    }
    if (productState?.templateId) {
      const templateId = typeof productState?.templateId === "object"
        ? productState?.templateId?.id
        : productState?.templateId;
      return pricingTypeOptions.find(
        (option: any) => option.id === templateId && !option.isComposite
      ) || defultTemplate || null;
    }
    return defultTemplate || null;
  }, [isCompositeStructure, productState?.templateId, pricingTypeOptions, defultTemplate]);

  useEffect(() => {
    if (!isCompositeStructure) {
      return;
    }

    if (!Array.isArray(productState?.compositeProductIds)) {
      onChangeStateProduct("compositeProductIds", []);
      return;
    }

    const hasNonPrimitive = productState?.compositeProductIds?.some(
      (item: any) => typeof item === "object"
    );

    if (hasNonPrimitive) {
      onChangeStateProduct(
        "compositeProductIds",
        productState?.compositeProductIds?.map((item: any) =>
          typeof item === "object" ? item?.id ?? item?.value : item
        )
      );
    }
  }, [isCompositeStructure, productState?.compositeProductIds, onChangeStateProduct]);

  useEffect(() => {
    if (!productState?.productStructureType) {
      onChangeStateProduct("productStructureType", EProductStructureType.BASE);
    }
  }, [productState?.productStructureType, onChangeStateProduct]);

  useEffect(() => {
    const defultProductSKU = allProductSKU?.find(
      (item) => item.id === productState?.productSKUId
    );
    const defultTemplate = allTemplate?.find(
      (item) => item.id === productState?.templateId
    );
    if (defultTemplate) {
      setDefultTemplate(defultTemplate);
    }
    if (defultProductSKU) {
      setDefultProductSKU(defultProductSKU);
    }
  }, [productState, allTemplate, allProductSKU]);

  const _renderProductClientSelector = () => {
    if (productState?.pricingType === EProductClient.BY_CLIENT) {
      return (
        <div style={clasess.itemGropupsContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.byClient")}
          </div>
          <div style={{ width: "100%" }}>
            <GoMakeAutoComplate
              options={renderOptions(productState?.clients)?.map((item) => {
                return {
                  ...item,
                  label: item?.name,
                  id: item.id,
                };
              })}
              placeholder={t("products.addProduct.admin.byClient")}
              style={{
                ...clasess.multiSelectStyle,
                overflow: "auto",
                height: "auto",
                minHeight: "40px",
              }}
              multiple
              onChangeTextField={checkWhatRenderArray}
              loading={isFetching}
              defaultFiltering={false}
              onChange={(e: any, value: any) => {
                // Filter out special options (recentOptions, searchMore, addClient)
                const validValues = value?.filter(
                  (item: any) =>
                    item?.id &&
                    item?.id !== "recentOptions" &&
                    item?.id !== "searchMore" &&
                    item?.id !== "addClient"
                );
                const selectedIds = validValues?.map((item: any) => item?.id) || [];

                // Store the full customer objects for selected customers
                updateSelectedCustomersCache(selectedIds, validValues);

                // Update both clients (IDs) and clientsDetails (full objects with names)
                onChangeStateProduct("clients", selectedIds);

                // Also update clientsDetails with the full customer objects
                const clientsDetails = validValues.map((item: any) => ({
                  id: item.id,
                  name: item.name || item.label || item.customerName || item.clientName || '',
                }));
                onChangeStateProduct("clientsDetails", clientsDetails);
              }}
              value={(() => {
                // Priority 1: Use clientsDetails if available (from backend or updated by onChange)
                if (productState?.clientsDetails && Array.isArray(productState.clientsDetails) && productState.clientsDetails.length > 0) {
                  return productState.clientsDetails.map((customer: any) => ({
                    label: customer?.name || customer?.customerName || customer?.clientName || customer?.label || '',
                    id: customer?.id,
                  })).filter((c: any) => c.id && c.label);
                }

                // Priority 2: Use clients array (could be IDs or objects)
                if (!productState?.clients || productState.clients.length === 0) {
                  return [];
                }

                return productState.clients.map((item: any) => {
                  // Check if item is already an object with id and name
                  if (typeof item === 'object' && item.id) {
                    return {
                      label: item?.name || item?.customerName || item?.clientName || item?.label || '',
                      id: item.id,
                    };
                  }

                  // Item is an ID string - find customer in lists
                  const customerId = item;
                  // First try to find in current customersList
                  let customer = customersList?.find(
                    (customer: any) => customer?.id === customerId
                  );
                  // If not found in current list, try to find in cached selected customers
                  if (!customer) {
                    customer = selectedCustomersCache?.find(
                      (c: any) => c?.id === customerId
                    );
                  }
                  if (!customer) {
                    return null;
                  }
                  // Get customer name - check multiple possible field names
                  const customerName = customer?.name || customer?.customerName || customer?.clientName || customer?.label || null;
                  if (!customerName) {
                    // If no name found, return null so it doesn't show with ID
                    return null;
                  }
                  return {
                    label: customerName,
                    id: customer?.id,
                  };
                }).filter(Boolean);
              })()}
              getOptionLabel={(option: any) => {
                if (option?.isInfo) {
                  return option?.name || "";
                }
                return option?.name || option?.label || "";
              }}
              renderOption={(props: any, option: any) => {
                if (option?.isInfo) {
                  return (
                    <li
                      {...props}
                      style={{
                        ...props.style,
                        cursor: option?.id === "searchMore" ? "pointer" : "default",
                        color: option?.id === "recentOptions" ? "#2e3092" : "#1976d2",
                        fontWeight: option?.id === "recentOptions" ? "bold" : "normal",
                      }}
                    >
                      {option?.name}
                    </li>
                  );
                }
                return (
                  <li {...props}>
                    {option?.name || option?.label || ""}
                  </li>
                );
              }}
            />
          </div>
        </div>
      );
    } else if (productState?.pricingType === EProductClient.BY_CLIENT_TYPE) {
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
    <div style={clasess.mainContainer} className="custom-scrollbar">
      <div style={clasess.categoryNameStyle}>
        {t("products.addProduct.admin.productCategory")}
      </div>

      <div style={clasess.firstContainer}>
        {isUpdate && (
          <UploadImgProduct
            productState={productState}
            onChangeStateProduct={onChangeStateProduct}
            UploadProductImage={UploadProductImage}
          />
        )}
        <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.productName")}
            <span style={clasess.requierdInput}>*</span>
            {printHouseLanguages.length > 0 && (
              <Tooltip title={t("products.addProduct.admin.translateProductName")}>
                <IconButton
                  size="small"
                  onClick={() => setOpenTranslationModal(true)}
                  sx={{
                    padding: "4px",
                    marginLeft: "8px",
                    color: clasess.labelTitleStyle.color,
                  }}
                >
                  <TranslateIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <div>
            <GomakeTextInput
              style={clasess.textInputStyle}
              placeholder={t("products.addProduct.admin.productName")}
              onChange={(e: any) => {
                onChangeStateProduct("name", e.target.value);
                // Update default language translation when name changes
                if (productState?.translations) {
                  const updatedTranslations = productState.translations.map(
                    (trans: IProductTranslation) =>
                      trans.lang === defaultLanguage
                        ? { ...trans, name: e.target.value }
                        : trans
                  );
                  onChangeStateProduct("translations", updatedTranslations);
                }
              }}
              value={getDefaultLanguageName}
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
            {t("products.addProduct.admin.productCode")}
            <span style={clasess.requierdInput}>*</span>
            <span onClick={onClickOpenProductSKU} style={clasess.plusInput}>
              +
            </span>
          </div>
          <div style={{ width: 250 }}>
            {allProductSKU && (
              <GoMakeAutoComplate
                key={defultProductSKU}
                options={allProductSKU}
                placeholder={t("products.addProduct.admin.productCode")}
                style={clasess.dropDownListStyle}
                getOptionLabel={(option: any) =>
                  `${option.name} - ${option.code}`
                }
                value={
                  typeof productState?.productSKUId === "string"
                    ? defultProductSKU
                    : productState.productSKUId
                }
                onChange={(e: any, value: any) => {
                  onChangeStateProduct("productSKUId", value);
                }}
              />
            )}
          </div>
        </div>
        {isCompositeStructure ? (
          <>
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
                      productState?.productStructureType === EProductStructureType.COMPOSITE ? {
                        label: t("products.addProduct.admin.composite"),
                        id: "COMPOSITE",
                        name: t("products.addProduct.admin.composite"),
                        isComposite: true,
                      } :
                        typeof productState?.templateId != "object"
                          ? defultTemplate
                          : productState?.templateId
                    }
                    onChange={(e: any, value: any) => {
                      // Store templateId for display but don't send in payload
                      onChangeStateProduct("templateId", value);
                      // If templateId is cleared and not composite, set to BASE
                      if (!value && productState?.productStructureType === EProductStructureType.COMPOSITE) {
                        onChangeStateProduct("productStructureType", EProductStructureType.BASE);
                        onChangeStateProduct("compositeProductIds", []);
                      }
                      else {
                        onChangeStateProduct("productStructureType", EProductStructureType.BASE);
                        onChangeStateProduct("compositeProductIds", []);
                      }
                    }}
                  />
                )}
              </div>
            </div>
            <div style={clasess.itemGropupsContainer}>
              <div style={clasess.labelTitleStyle}>
                {t("boardMissions.products")}
                <span style={clasess.requierdInput}>*</span>
              </div>
              <ProductMultiSelect
                products={productsList ?? []}
                selectedProductIds={productState?.compositeProductIds ?? []}
                onProductChange={(ids) => {
                  onChangeStateProduct("compositeProductIds", ids);
                }}
                placeholder={t(
                  "boardMissions.selectProducts"
                )}
                containerStyle={{ width: "100%" }}
                selectStyle={{ width: "100%" }}
              />
            </div>
          </>
        ) : (
          <>
            <div style={clasess.itemOnFirstContainer}>
              <div style={clasess.labelTitleStyle}>
                {t("products.addProduct.admin.pricingType")}
                <span style={clasess.requierdInput}>*</span>
              </div>
              <div style={{ width: "100%" }}>
                {pricingTypeOptions && pricingTypeOptions.length > 0 && (
                  <GoMakeAutoComplate
                    key={selectedPricingType ? String(selectedPricingType.id) : "pricing-type"}
                    options={pricingTypeOptions}
                    placeholder={t("products.addProduct.admin.pricingType")}
                    style={clasess.dropDownListStyle}
                    getOptionLabel={(option: any) => option.name}
                    value={selectedPricingType}
                    onChange={(e: any, value: any) => {
                      if (!value) {
                        // Value cleared: reset to BASE (1)
                        onChangeStateProduct("productStructureType", EProductStructureType.BASE);
                        onChangeStateProduct("compositeProductIds", []);
                        onChangeStateProduct("templateId", null);
                        return;
                      }
                      if (value?.isComposite) {
                        // ONLY when Composite is selected: set productStructureType to COMPOSITE (2)
                        onChangeStateProduct("productStructureType", EProductStructureType.COMPOSITE);
                        if (!Array.isArray(productState?.compositeProductIds)) {
                          onChangeStateProduct("compositeProductIds", []);
                        }
                        // Clear templateId when selecting Composite
                        onChangeStateProduct("templateId", null);
                      } else {
                        // When selecting ANY template option: set productStructureType to BASE (1)
                        onChangeStateProduct("productStructureType", EProductStructureType.BASE);
                        onChangeStateProduct("compositeProductIds", []);
                        if (isUpdate) {
                          onClickOpenPricingType(value);
                        } else {
                          onChangeStateProduct("templateId", value);
                        }
                      }
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
            <div style={clasess.itemOnFirstContainer}>
              <div style={clasess.labelTitleStyle}>
                {`${t("customers.modal.additionProfits")} (%)`}
              </div>
              <div>
                <GomakeTextInput
                  style={clasess.textInputStyle}
                  placeholder={t("customers.modal.additionProfits")}
                  onChange={(e: any) => {
                    onChangeStateProduct("additionProfits", e.target.value);
                  }}
                  value={productState?.additionProfits}
                  type={"number"}
                />
              </div>
            </div>
            <div style={clasess.itemOnFirstContainer}>
              <div style={clasess.labelTitleStyle}>
                {t("products.addProduct.admin.externalCode")}
              </div>
              <div>
                <GomakeTextInput
                  style={clasess.textInputStyle}
                  placeholder={t("products.addProduct.admin.externalCode")}
                  onChange={(e: any) => {
                    onChangeStateProduct("externalCode", e.target.value);
                  }}
                  value={productState?.externalCode}
                />
              </div>
            </div>
            <div style={clasess.itemOnFirstContainer}>
              <div style={clasess.labelTitleStyle}>
                {t("products.addProduct.admin.minimumPrice")}
              </div>
              <div>
                <GomakeTextInput
                  style={clasess.textInputStyle}
                  placeholder={t("products.addProduct.admin.minimumPrice")}
                  onChange={(e: any) => {
                    onChangeStateProduct("minimumPrice", e.target.value);
                  }}
                  value={productState?.minimumPrice}
                  type="number"
                />
              </div>
            </div>
          </>
        )}
      </div>
      {!isCompositeStructure && (
        <>
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
                  key={productState?.pricingType}
                  options={productClientsList}
                  placeholder={t("products.addProduct.admin.pricingType")}
                  style={clasess.dropDownListStyle}
                  onChange={(e: any, value: any) => {
                    onChangeStateProduct("pricingType", value?.id);
                    onChangeStateProduct("clientsTypes", []);
                    onChangeStateProduct("clients", []);
                  }}
                  value={productClientsList.find(
                    (item) => item.id === productState?.pricingType
                  )}
                />
              </div>
            </div>
            {_renderProductClientSelector()}
          </div>
          <div style={clasess.categoryNameStyle}>
            {t("products.addProduct.admin.style")}
          </div>
          <div style={clasess.firstContainer}>
            {/* <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.noteColor")}
          </div>
          <div style={clasess.fileInputStyle}>
            <MuiColorInput
              value={
                productState?.noteColor ??
                t("products.addProduct.admin.noteColor")
              }
              onChange={(value: any) => {
                onChangeStateProduct("noteColor", value);
              }}
              format="hex"
            />
            {productState?.noteColor && (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onChangeStateProduct("noteColor", null)}
              >
                <FormatColorResetIcon />
              </div>
            )}
          </div>
        </div> */}
            {/* <div style={clasess.itemOnFirstContainer}>
          <div style={clasess.labelTitleStyle}>
            {t("products.addProduct.admin.textColor")}
          </div>
          <div style={clasess.fileInputStyle}>
            <MuiColorInput
              value={
                productState?.textColor ??
                t("products.addProduct.admin.textColor")
              }
              onChange={(value: any) => {
                onChangeStateProduct("textColor", value);
              }}
              format="hex"
            />
            {productState?.textColor && (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onChangeStateProduct("textColor", null)}
              >
                <FormatColorResetIcon />
              </div>
            )}
          </div>
        </div> */}
            <div style={clasess.itemOnFirstContainer}>
              <div style={clasess.labelTitleStyle}>
                {t("products.addProduct.admin.jobColor")}
              </div>
              <div style={clasess.fileInputStyle}>
                <MuiColorInput
                  value={
                    productState?.productionFloorJobColor ??
                    t("products.addProduct.admin.jobColor")
                  }
                  onChange={(value: any) => {
                    onChangeStateProduct("productionFloorJobColor", value);
                  }}
                  format="hex"
                />
                {productState?.productionFloorJobColor && (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      onChangeStateProduct("productionFloorJobColor", null)
                    }
                  >
                    <FormatColorResetIcon />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {/* <div style={clasess.categoryNameStyle}>
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
      </div> */}
      {isUpdate ? (
        <div style={clasess.btnsContainer}>
          <div style={clasess.addNwBtn} onClick={updatedProduct}>
            {t("products.addProduct.admin.updateNewProduct")}
          </div>
        </div>
      ) : (
        <div style={clasess.btnsContainer}>
          {!isCompositeStructure && (
            <div
              style={clasess.goToListBtn}
              onClick={createNewProductAndGoToParameterList}
            >
              {t("products.addProduct.admin.addGoToList")}
            </div>
          )}
          <div style={clasess.addNwBtn} onClick={createNewProduct}>
            {t("products.addProduct.admin.addNewProduct")}
          </div>
        </div>
      )}
      <AddProductSkuModal
        openModal={isProductSKU}
        modalTitle={t("products.addProduct.admin.modalProductCode")}
        onClose={onClickCloseProductSKU}
        onChangeStateProductSKU={onChangeStateProductSKU}
        createNewProductSKU={createNewProductSKU}
        errorName={errorName}
        errorCode={errorCode}
        allProductSKU={allProductSKU}
        openDeleteRowModal={openDeleteRowModal}
        onClickOpenDeleteRowModal={onClickOpenDeleteRowModal}
        onClickCloseDeleteRowModal={onClickCloseDeleteRowModal}
        deleteProductSKURow={deleteProductSKURow}
        updateProductSKURow={updateProductSKURow}
        productSKUState={productSKU}
      />
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        title={t("modal.pricingTypeTitle")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openPricingTypeModal}
        onClose={onClickClosePricingType}
        hideIcon={true}
        onClickDelete={() =>
          onChangeStateProduct("templateId", selectPricingType)
        }
      />
      <ProductTranslationModal
        open={openTranslationModal}
        onClose={() => setOpenTranslationModal(false)}
        translations={productState?.translations || []}
        onSave={handleTranslationSave}
        productName={getDefaultLanguageName}
      />
    </div>
  );
};
export { SettingsWidget };
