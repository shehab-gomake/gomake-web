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
import { IconButton } from "@mui/material";
import { InputAdornment } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { DotIcon } from "@/icons";
import { useParameters } from "@/hooks/use-parameters";

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
    handleClose,
    handleClick,
    open,
    anchorEl,
    onClickClearFilter,
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
                    {selectedSKU && (
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
        {term || selectedSKU ? (
          <PrimaryTable
            stickyFirstCol={false}
            // rows={productSearched}
            rows={productSearched.map((item) => item.row)} // Only pass the row data
            headers={tableHeaders}
            maxHeight={"calc(100vh - 303px)"}
            stickyHeader={true}
          />
        ) : (
          <PrimaryTable
            stickyFirstCol={false}
            // rows={allProducts}
            rows={allProducts?.map((product) => product?.row) || []} // Only pass the row data
            headers={tableHeaders}
            maxHeight={"calc(100vh - 303px)"}
            stickyHeader={true}
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
