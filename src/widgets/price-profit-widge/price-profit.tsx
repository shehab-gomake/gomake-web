import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { usePriceProfit } from "./use-price-profit";
import { ParmaetersPriceProfitWidget } from "./widgets/parameters/parameters-price-profit-widge";
import { PriceProfitHeaderWidget } from "./widgets/header/header-price-profit-widge";
import { PriceProfitTable } from "./widgets/table/table-price-profit-widge";
import { GoMakeModal } from "@/components";
import { GaussianChart } from "@/pages-components/gussian-chart/gussian-chart";
import CircleIcon from "@mui/icons-material/Circle";

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
    updateProfitProfileProductSelected,
    updateSelectedPrintHousePrices,
    onClickPrint,
    resetPrintHousePrice,
    reCalculatePrice,
    handleCloseChartModal,
    handleOpenChartModal,
    openChartModal,
  } = usePriceProfit();
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
        updateSelectedPrintHousePrices={updateSelectedPrintHousePrices}
        onClickPrint={onClickPrint}
        resetPrintHousePrice={resetPrintHousePrice}
        handleOpenChartModal={handleOpenChartModal}
      />
      <Divider style={classes.divider} />
      {products && products?.requiredParameters?.length > 0 && (
        <ParmaetersPriceProfitWidget
          parameters={products?.requiredParameters}
          updateDropdownValue={updateDropdownValue}
          updateDropdownMaterialValue={updateDropdownMaterialValue}
          updateTextInputValue={updateTextInputValue}
          updateProfitProfileProductParameter={
            updateProfitProfileProductParameter
          }
          reCalculatePrice={reCalculatePrice}
        />
      )}
      {products &&
        products?.headers?.length > 0 &&
        products?.data?.length > 0 && (
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
            updateProfitProfileProductSelected={
              updateProfitProfileProductSelected
            }
          />
        )}
      <GoMakeModal
        openModal={openChartModal}
        onClose={handleCloseChartModal}
        modalTitle={" "}
        insideStyle={classes.modalStyle}
        style={{ zIndex: 999999 }}
        withRoundedCloseIcon={false}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0px 60px",
            gap: "20px",
          }}
        >
          <span style={{ fontSize: "14px" }}>
            <CircleIcon style={{ color: "rgba(75,192,192,1)", fontSize: 14 }} />{" "}
            Calculate Price
          </span>
          <span style={{ fontSize: "14px" }}>
            <CircleIcon style={{ color: "rgba(255,99,132,1)", fontSize: 14 }} />{" "}
            User Price
          </span>
        </div>
        <GaussianChart />
      </GoMakeModal>
    </div>
  );
};
export { PriceProfitWidge };
