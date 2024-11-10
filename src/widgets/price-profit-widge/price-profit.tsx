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
    handleClose,
    handleOpen,
    handleCheckboxChange,
    handleRestoreOriginalPrice,
    handleUpdateNewPrice,
    handleReviewCalculation,
    setSelectedProduct,
  } = usePriceProfit()

  return (
    <div style={classes.mainContainer}>
      <PriceProfitHeaderWidget />
      <Divider style={classes.divider} />
      <FilterPriceProfitWidget />
      <PriceProfitTable
        headers={data?.headers}
        data={data?.data}
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
      />
    </div>
  );
};
export { PriceProfitWidge };
