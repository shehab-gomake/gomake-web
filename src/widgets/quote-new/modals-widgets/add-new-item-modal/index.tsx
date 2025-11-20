import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput, GoMakeDialog } from "@/components";
import { useStyle } from "./style";
import { GoMakeTreeSelect } from "@/components/auto-complete/tree-select";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useAddNewItem } from "./use-add-new-item";
import { Popover, Skeleton } from "@mui/material";
import { Stack, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { Permissions } from "@/components/CheckPermission/enum";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

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
  const { secondColor } = useGomakeTheme();

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
      <GoMakeDialog
        open={compositeDialogOpen}
        onClose={handleCompositeCancel}
        title={t("products.addProduct.admin.compositeProductTitle")}
        primaryButtonLabel={t("products.offsetPrice.admin.addOrderBtn")}
        cancelButtonLabel={t("modal.cancel")}
        onPrimaryAction={handleCompositeConfirm}
        onCancel={handleCompositeCancel}
        primaryButtonLoading={isSubmittingComposite}
        primaryButtonDisabled={isSubmittingComposite}
        maxWidth="md"
        customStyles={{
          primaryButton: {
            backgroundColor: secondColor(500),
          },
        }}
      >
        <div
          className={"custom-scrollbar"}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minWidth: 500,
            marginTop: 8,
            maxHeight: "600px",
            overflowY: "auto",
            paddingRight: 8,
          }}>
          {isLoadingCompositeProducts ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                padding: 16,
                backgroundColor: "#f5f5f5",
                borderRadius: 8,
                marginBottom: 8
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <Skeleton variant="text" width={80} height={20} />
                  <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <Skeleton variant="text" width={80} height={20} />
                  <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                </div>
              </div>
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: 16,
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                  }}
                >
                  <Skeleton variant="text" width={200} height={24} style={{ marginBottom: 8 }} />
                  <div style={{ display: "flex", flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                      <Skeleton variant="text" width={70} height={20} />
                      <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                      <Skeleton variant="text" width={80} height={20} />
                      <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : compositeProducts.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center" }}>
              {t("products.addProduct.admin.noCompositeProducts")}
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}>
              <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                padding: 16,
                backgroundColor: "#f5f5f5",
                borderRadius: 8,
                marginBottom: 8
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>
                    {t("products.addProduct.admin.quantityLabel")}
                  </div>
                  <GomakeTextInput
                    value={quantityMultiplier.toString()}
                    placeholder={t("products.addProduct.admin.quantityPlaceholder")}
                    onChange={(event) => {
                      const value = event.target.value;
                      const numValue = value === "" ? 1 : Number(value);
                      handleMultiplierChange(numValue);
                    }}
                    type="number"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>
                    {t("products.addProduct.admin.jobNameLabel")}
                  </div>
                  <GomakeTextInput
                    value={mainJobName}
                    placeholder={t("products.addProduct.admin.jobNamePlaceholder")}
                    onChange={(event) => {
                      handleMainJobNameChange(event.target.value);
                    }}
                  />
                </div>
              </div>
              {compositeProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: 16,
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
                    {product.name}
                  </div>
                  <div style={{ display: "flex", flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>
                        {t("products.addProduct.admin.quantityLabel")}
                        <span style={{ color: "red", marginLeft: 4 }}>*</span>
                      </div>
                      <GomakeTextInput
                        value={product.quantity.toString()}
                        placeholder={t("products.addProduct.admin.quantityPlaceholder")}
                        onChange={(event) => {
                          const value = event.target.value;
                          const numValue = value === "" ? 0 : Number(value);
                          handleProductQuantityChange(index, numValue);
                        }}
                        type="number"
                        error={Boolean(compositeErrors[`${index}`]?.quantity)}
                        helperText={compositeErrors[`${index}`]?.quantity}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>
                        {t("products.addProduct.admin.jobNameLabel")}
                      </div>
                      <GomakeTextInput
                        value={product.jobName}
                        placeholder={t("products.addProduct.admin.jobNamePlaceholder")}
                        onChange={(event) => {
                          updateCompositeProduct(index, "jobName", event.target.value);
                        }}
                        error={Boolean(compositeErrors[`${index}`]?.jobName)}
                        helperText={compositeErrors[`${index}`]?.jobName}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GoMakeDialog>
    </>
  );
};
export { AddNewItemModal };
