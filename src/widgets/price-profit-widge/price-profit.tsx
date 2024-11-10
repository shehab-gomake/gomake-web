import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { usePriceProfit } from "./use-price-profit";
import { FilterPriceProfitWidget } from "./widgets/filters/filer-price-profit-widge";
import { PriceProfitHeaderWidget } from "./widgets/header/header-price-profit-widge";
import { PriceProfitTable } from "./widgets/table/table-price-profit-widge";

const PriceProfitWidge = () => {
  const { classes } = useStyle();
  const {
    data,
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
    onBlurPriceChange
  } = usePriceProfit()

  return (
    <div style={classes.mainContainer}>
      <PriceProfitHeaderWidget
        handleClose={handleCloseSetting}
        anchorEl={anchorElSetting}
        open={openSetting}
        handleOpen={handleOpenSetting}
      />
      <Divider style={classes.divider} />
      <FilterPriceProfitWidget />
      <PriceProfitTable
        headers={data?.headers}
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
      />
    </div>
  );
};
export { PriceProfitWidge };
