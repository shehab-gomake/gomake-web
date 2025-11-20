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
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { ETab } from "@/pages-components/admin/home/widgets/quote-widget/enums";
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

const AddNewItemModal = ({ openModal, onClose, documentType, getQuote, getCalculateQuoteItem, isMaterial, isNewCreation, isPurchaseOrder, isCanIntake }) => {
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
  } = useAddNewItem({ onClose, getQuote, documentType, getCalculateQuoteItem, isMaterial, isNewCreation, isPurchaseOrder, isCanIntake });

  const handlePrimaryAction = () => {
    if (isDisabled) {
      // Show error popover - find the primary button div in the footer
      setTimeout(() => {
        const dialog = document.querySelector('[role="dialog"]');
        if (dialog) {
          const footer = dialog.querySelector('[class*="MuiDialogActions"]');
          if (footer) {
            // Find the primary button div (it's the first clickable div in the footer buttons container)
            const buttonDiv = footer.querySelector('div[style*="cursor"]') as HTMLElement;
            if (buttonDiv) {
              handleClick({ currentTarget: buttonDiv } as any);
            }
          }
        }
      }, 0);
    } else {
      onClickCreateQuoteForCustomer();
    }
  };
  return (
    <>
      <GoMakeDialog
        open={openModal}
        title={t("sales.quote.addNewItem")}
        customStyles={
          {
            title: !CheckPermission(Permissions.ADD_NEW_PRODUCT_FROM_CART)
              ? { paddingBottom: "20px" }
              : undefined
          }
        }
        onClose={handleCloseModal}
        showFooter={true}
        primaryButtonLabel={t("sales.quote.add")}
        onPrimaryAction={handlePrimaryAction}
        primaryButtonDisabled={isDisabled}

        maxWidth="sm"
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
              setSelectedTab={(v) => {
                // Prevent tab switching for purchase orders
                if (documentType === DOCUMENT_TYPE.purchaseOrder) {
                  return;
                }
                setSelectedTab(v);
              }}
              value={selectedProduct}
              options={combinedData}
              onChange={handleProductChange}
              // placeholder={t("home.admin.selectProductOrMaterial")}
              placeholder={selectedTab === ETab.PRODUCTS ? t("modal.pleaseSelect") : t("modal.pleaseSelectMaterial")}

              hideOtherTabs={documentType === DOCUMENT_TYPE.purchaseOrder}
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
        </Stack>
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
      </GoMakeDialog>
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
