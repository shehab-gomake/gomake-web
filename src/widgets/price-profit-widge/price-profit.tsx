import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { usePriceProfit } from "./use-price-profit";
import { ParmaetersPriceProfitWidget } from "./widgets/parameters/parameters-price-profit-widge";
import { PriceProfitHeaderWidget } from "./widgets/header/header-price-profit-widge";
import { PriceProfitTable } from "./widgets/table/table-price-profit-widge";

const PriceProfitWidge = () => {
  const { classes } = useStyle();
  const {
    open,
    anchorEl,
    selectedProduct,
    products,
    anchorElSetting,
    openSetting,
    handleClose,
    handleOpen,
    handleOpenSetting,
    handleCloseSetting,
    handleCheckboxChange,
    handleRestoreOriginalPrice,
    handleUpdateNewPrice,
    handleReviewCalculation,
    setSelectedProduct,
    handlePriceChange,
    isUpdate,
    setIsUpdate,
    onBlurPriceChange,
    handlePrintClose,
    anchorElPrint,
    openPrint,
    handleOpenPrint,
    handleHideProduct,
    updateDropdownValue,
    updateDropdownMaterialValue,
    updateTextInputValue,
    pricingProfileSetting,
    selectedPricingProfileSetting,
    setSelectedPricingProfileSetting,
    updateProfitProfileProductParameter,
    onBlurQuantityChange,
    handleQuantity,
    isUpdateQuantity,
    setIsUpdateQuantity,
    updatePrintHousePrice,
    updateProfitProfileProductHidden,
    updateProfitProfileProductSelected
  } = usePriceProfit()
  return (
    <div style={classes.mainContainer}>
      <PriceProfitHeaderWidget
        handleClose={handleCloseSetting}
        anchorEl={anchorElSetting}
        open={openSetting}
        handleOpen={handleOpenSetting}
        handlePrintClose={handlePrintClose}
        anchorElPrint={anchorElPrint}
        openPrint={openPrint}
        handleOpenPrint={handleOpenPrint}
        pricingProfileSetting={pricingProfileSetting}
        selectedPricingProfileSetting={selectedPricingProfileSetting}
        setSelectedPricingProfileSetting={setSelectedPricingProfileSetting}
      />
      <Divider style={classes.divider} />
      {
        products && products?.requiredParameters?.length > 0 &&
        <ParmaetersPriceProfitWidget
          parameters={products?.requiredParameters}
          updateDropdownValue={updateDropdownValue}
          updateDropdownMaterialValue={updateDropdownMaterialValue}
          updateTextInputValue={updateTextInputValue}
          updateProfitProfileProductParameter={updateProfitProfileProductParameter}

        />
      }
      {
        products && products?.headers?.length > 0 && products?.data?.length > 0 &&
        <PriceProfitTable
          headers={products?.headers}
          open={open}
          anchorEl={anchorEl}
          handleClose={handleClose}
          handleOpen={handleOpen}
          handleCheckboxChange={handleCheckboxChange}
          handleRestoreOriginalPrice={handleRestoreOriginalPrice}
          handleUpdateNewPrice={handleUpdateNewPrice}
          handleReviewCalculation={handleReviewCalculation}
          selectedProduct={selectedProduct}
          products={products}
          setSelectedProduct={setSelectedProduct}
          handlePriceChange={handlePriceChange}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
          onBlurPriceChange={onBlurPriceChange}
          handleHideProduct={handleHideProduct}
          onBlurQuantityChange={onBlurQuantityChange}
          handleQuantity={handleQuantity}
          isUpdateQuantity={isUpdateQuantity}
          setIsUpdateQuantity={setIsUpdateQuantity}
          updatePrintHousePrice={updatePrintHousePrice}
          updateProfitProfileProductHidden={updateProfitProfileProductHidden}
          updateProfitProfileProductSelected={updateProfitProfileProductSelected}
        />
      }
    </div>
  );
};
export { PriceProfitWidge };
