import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput, GoMakeDialog } from "@/components";
import { useStyle } from "./style";
import { GoMakeTreeSelect } from "@/components/auto-complete/tree-select";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useAddNewItem } from "./use-add-new-item";
import { Popover } from "@mui/material";
import { Stack, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { Permissions } from "@/components/CheckPermission/enum";
import { CompositeProductsDialog } from "../composite-products-dialog";

const ProductTypeSelector = ({ active, onChange, primaryColor, t }) => (
  <RadioGroup
    row
    value={active}
    onChange={onChange}
    sx={{ gap: 2, padding: "0px 10px" }}
  >
    {[t("sales.cart.existProduct"), t("sales.cart.newProduct")].map(
      (label, index) => (
        <FormControlLabel
          key={label}
          value={index === 0}
          control={
            <Radio
              sx={{
                "& .MuiSvgIcon-root": {
                  color: primaryColor(500),
                  fontSize: 18,
                },
              }}
            />
          }
          label={t(label)}
        />
      )
    )}
  </RadioGroup>
);

const GenericProductInput = ({
  productName,
  setProductName,
  productCode,
  setProductCode,
  t,
  styles,
}) => (
  <Stack direction="row" gap="20px">
    <GomakeTextInput
      sx={styles.textInput}
      value={productName}
      onChange={(e) => setProductName(e.target.value)}
      placeholder={t("products.addProduct.admin.enterName")}
    />
    <GomakeTextInput
      sx={styles.textInput}
      value={productCode}
      onChange={(e) => setProductCode(e.target.value)}
      placeholder={t("products.addProduct.admin.enterCode")}
    />
  </Stack>
);

const AddNewItemModal = ({ openModal, onClose, documentType, getQuote, getCalculateQuoteItem }) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  const {
    handleProductChange,
    combinedData,
    selectedProduct,
    onClickCreateQuoteForCustomer,
    handleClose,
    handleClick,
    open,
    id,
    isDisabled,
    anchorEl,
    _renderErrorMessage,
    handleChange,
    active,
    productName,
    setProductName,
    productCode,
    setProductCode,
    handleCloseModal,
    CheckPermission,
    selectedTab,
    setSelectedTab,
    // Composite products
    compositeDialogOpen,
    compositeProducts,
    quantityMultiplier,
    mainJobName,
    isLoadingCompositeProducts,
    compositeErrors,
    isSubmittingComposite,
    handleCompositeCancel,
    handleMainJobNameChange,
    handleMultiplierChange,
    handleProductQuantityChange,
    updateCompositeProduct,
    handleCompositeConfirm,
  } = useAddNewItem({ onClose, getQuote, documentType, getCalculateQuoteItem });

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.addNewItem")}
        onClose={handleCloseModal}
        insideStyle={classes.insideStyle}
        withRoundedCloseIcon={false}
        modalTitleStyle={
          !CheckPermission(Permissions.ADD_NEW_PRODUCT_FROM_CART)
            ? { paddingBottom: "20px" }
            : undefined
        }
      >
        <Stack style={classes.mainContainer}>
          {/*CheckPermission(Permissions.ADD_NEW_PRODUCT_FROM_CART) && (
            <ProductTypeSelector
              active={active}
              onChange={handleChange}
              primaryColor={primaryColor}
              t={t}
            />
          )*/}
          {active ? (
            <GoMakeTreeSelect
              selectedTab={selectedTab}
              setSelectedTab={(v) => setSelectedTab(v)}
              value={selectedProduct}
              options={combinedData}
              onChange={handleProductChange}
              placeholder={t("home.admin.selectProductOrMaterial")}
            />
          ) : (
            <GenericProductInput
              productName={productName}
              setProductName={setProductName}
              productCode={productCode}
              setProductCode={setProductCode}
              t={t}
              styles={classes}
            />
          )}
          <div style={classes.btnContainer}>
            <PrimaryButton
              variant="contained"
              style={classes.btnStyle}
              onClick={isDisabled ? handleClick : onClickCreateQuoteForCustomer}
            >
              {t("sales.quote.add")}
            </PrimaryButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <div style={classes.errorMsgStyle}>{_renderErrorMessage()}</div>
            </Popover>
          </div>
        </Stack>
      </GoMakeModal>
      <CompositeProductsDialog
        open={compositeDialogOpen}
        onClose={handleCompositeCancel}
        onConfirm={handleCompositeConfirm}
        isLoading={isLoadingCompositeProducts}
        compositeProducts={compositeProducts}
        quantityMultiplier={quantityMultiplier}
        mainJobName={mainJobName}
        compositeErrors={compositeErrors}
        onMultiplierChange={handleMultiplierChange}
        onMainJobNameChange={handleMainJobNameChange}
        onProductQuantityChange={handleProductQuantityChange}
        onProductJobNameChange={(index, value) =>
          updateCompositeProduct(index, "jobName", value)
        }
      />
    </>
  );
};
export { AddNewItemModal };
