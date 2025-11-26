import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import {
  GoMakeAutoComplate,
  GoMakeMenu,
  GomakePrimaryButton,
} from "@/components";
import { useProductManagement } from "./use-product-management";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { PrimaryTable } from "@/components/tables/primary-table";
import { PrimaryButton } from "@/components/button/primary-button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AddRuleModal } from "@/pages-components/products/profits-new/widgets/add-rule-modal";
import {
  ETypeException,
  EValueType,
} from "@/pages-components/products/profits-new/enums/profites-enum";
import { EditProductProfitRulesModal } from "@/widgets/properties/properties-modals/edit-rule-modal/edit-product-rule-modal";
import { IconButton, TableRow, TableCell, TableBody } from "@mui/material";
import { InputAdornment } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { DotIcon } from "@/icons";
import { useParameters } from "@/hooks/use-parameters";
import { useMemo } from "react";

const ProductTableWithSubProducts = ({ rows, headers }: any) => {
  const processedRows = useMemo(() => {
    return rows.map((item: any) => ({
      row: item.row,
      isSubProduct: item.isSubProduct,
    }));
  }, [rows]);

  return (
    <PrimaryTable
      stickyFirstCol={false}
      rows={processedRows.map((item: any) => item.row)}
      headers={headers}
      maxHeight={"calc(100vh - 303px)"}
      stickyHeader={true}
      rowMetadata={processedRows.map((item: any) => item.isSubProduct)}
    />
  );
};

const ProductManagementWidget = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle();
  const {
    tableHeaders,
    allProducts,
    term,
    productSearched,
    setTerm,
    allProductSKU,
    router,
    handleGoBack,
    openAddProfitRule,
    openEditProfitRule,
    setEditProfitRule,
    setOpenProfitRule,
    addProductProfitRule,
    editProductId,
    setEditProductId,
    setProductAddProfitRuleId,
    selectedSKU,
    setSelectedSKU,
    selectedTemplateId,
    setSelectedTemplateId,
    allProductTypes,
    handleClose,
    handleClick,
    open,
    anchorEl,
    onClickClearFilter,
    expandedProducts,
    toggleProductExpansion,
    _mapSubProductToRow,
  } = useProductManagement();
  const { parametersStateValue } = useParameters();

  const { productId } = router.query;

  return (
    <div style={classes.mainContainer}>
      <div style={classes.subHeaderContainer}>
        <div style={classes.subHeaderLeftSide}>
          {productId && (
            <div style={classes.backBtnContainer}>
              <PrimaryButton
                variant={"text"}
                onClick={handleGoBack}
                startIcon={
                  dir === "ltr" ? <ArrowBackIcon /> : <ArrowForwardIcon />
                }
                style={classes.backButtonStyle}
              >
                {t("materials.buttons.back")}
              </PrimaryButton>
              <h1 style={classes.header}>
                {t("products.addProduct.admin.subProducts")}
              </h1>
              <h4 style={classes.subHeader}>/ {router?.query?.productName}</h4>
            </div>
          )}
        </div>
        <SearchInputComponent
          filtersButton={
            !productId && (
              <InputAdornment position="start">
                <div>
                  <IconButton onClick={handleClick}>
                    <TuneIcon />
                    {(selectedSKU || selectedTemplateId) && (
                      <div style={{ position: "absolute", top: -5, right: -1 }}>
                        <DotIcon />
                      </div>
                    )}
                  </IconButton>
                  <GoMakeMenu
                    handleClose={handleClose}
                    open={open}
                    anchorEl={anchorEl}
                  >
                    <div style={classes.filtersContainer}>
                      <div style={classes.selectProductContainer}>
                        <div style={classes.selectProductTextStyle}>
                          {t(
                            "products.productManagement.admin.selectProductCode"
                          )}
                        </div>
                        <div style={{ width: 250 }}>
                          <GoMakeAutoComplate
                            key={selectedSKU}
                            options={allProductSKU}
                            placeholder={t(
                              "products.addProduct.admin.modalProductCode"
                            )}
                            style={classes.dropDownListStyle}
                            getOptionLabel={(option: any) =>
                              `${option.name} - ${option.code}`
                            }
                            onChange={(e: any, value: any) => {
                              setSelectedSKU(value?.code);
                            }}
                            value={
                              allProductSKU?.find(
                                (item) => item.code === selectedSKU
                              ) || null
                            }
                          />
                        </div>
                      </div>
                      <div style={classes.selectProductContainer}>
                        <div style={classes.selectProductTextStyle}>
                          {t("products.addProduct.admin.selectPricingType")}
                        </div>
                        <div style={{ width: 250 }}>
                          <GoMakeAutoComplate
                            key={selectedTemplateId}
                            options={allProductTypes || []}
                            placeholder={t(
                              "products.addProduct.admin.pricingType"
                            )}
                            style={classes.dropDownListStyle}
                            getOptionLabel={(option: any) =>
                              option.label || option.name
                            }
                            onChange={(e: any, value: any) => {
                              setSelectedTemplateId(value?.id);
                            }}
                            value={
                              allProductTypes?.find(
                                (item: any) => item.id === selectedTemplateId
                              ) || null
                            }
                          />
                        </div>
                      </div>
                      <div style={classes.buttonsFilterContainer}>
                        <GomakePrimaryButton
                          style={classes.clearBtnStyle}
                          onClick={onClickClearFilter}
                        >
                          {t("sales.quote.clear")}
                        </GomakePrimaryButton>
                      </div>
                    </div>
                  </GoMakeMenu>
                </div>
              </InputAdornment>
            )
          }
          value={term}
          onChange={setTerm}
        />
      </div>
      <>
        {term || selectedSKU || selectedTemplateId ? (
          <ProductTableWithSubProducts
            rows={(() => {
              const flatRows: any[] = [];
              productSearched.forEach((product) => {
                // Add main product row
                flatRows.push({ row: product.row, isSubProduct: false });
                // Add sub-product rows if expanded
                if (
                  product.isExpanded &&
                  product.subProducts &&
                  product.subProducts.length > 0
                ) {
                  product.subProducts.forEach((subProduct: any) => {
                    const subProductRow = _mapSubProductToRow(
                      subProduct,
                      product.originalData || product
                    );
                    flatRows.push({
                      row: subProductRow.row,
                      isSubProduct: true,
                    });
                  });
                }
              });
              return flatRows;
            })()}
            headers={tableHeaders}
          />
        ) : (
          <ProductTableWithSubProducts
            rows={(() => {
              const flatRows: any[] = [];
              allProducts?.forEach((product) => {
                // Add main product row
                flatRows.push({ row: product?.row, isSubProduct: false });
                // Add sub-product rows if expanded
                if (
                  product?.isExpanded &&
                  product?.subProducts &&
                  product?.subProducts.length > 0
                ) {
                  product.subProducts.forEach((subProduct: any) => {
                    const subProductRow = _mapSubProductToRow(
                      subProduct,
                      product?.originalData || product
                    );
                    flatRows.push({
                      row: subProductRow.row,
                      isSubProduct: true,
                    });
                  });
                }
              });
              return flatRows;
            })()}
            headers={tableHeaders}
          />
        )}
      </>

      {/* <div style={classes.filtersSwichContainer}>
        <div style={classes.filterSwichContainer}>
          <SecondSwitch />
          <div style={classes.labelTextContainer}>
            Price correction 1 for quantities
          </div>
        </div>
        <div style={classes.filterSwichContainer}>
          <SecondSwitch />
          <div style={classes.labelTextContainer}>
            Price correction 2 for quantities
          </div>
        </div>
        <div style={classes.filterSwichContainer}>
          <SecondSwitch />
          <div style={classes.labelTextContainer}>
            Takes a maximum for the quantity in purchase orders
          </div>
        </div>
      </div> */}

      <AddRuleModal
        openModal={openAddProfitRule}
        onCloseModal={() => setOpenProfitRule(false)}
        isPropertiesWidge={true}
        selectedProperties={{
          ruleType: 0,
          valueType: EValueType.PROFIT,
          propertyName: "Profit",
        }}
        getProperitesService={""}
        typeExceptionSelected={ETypeException.PROFIT}
        onCreate={(v) =>
          addProductProfitRule(v).then(() => setOpenProfitRule(false))
        }
        parametersStateValue={parametersStateValue}
      />
      <EditProductProfitRulesModal
        openModal={openEditProfitRule}
        onClose={() => {
          setEditProfitRule(false);
          setEditProductId("");
        }}
        onOpenAddRuleModal={() => {
          setOpenProfitRule(true);
          setProductAddProfitRuleId(editProductId);
          setEditProductId("");
        }}
        productId={editProductId}
      />
    </div>
  );
};

export { ProductManagementWidget };
