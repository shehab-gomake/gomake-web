import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Divider } from '@mui/material';
import { PlusIcon } from '@/icons';
import { GoMakeMenu } from '@/components';


import { ProductsRowMappingTable } from './products-row-mapping-widge';
import { UpdatedPriceIcon } from './icons/update-icon';
import { ReStoreIcon } from './icons/restore-icon';
import { ReviewIcon } from './icons/review-icon';
import { useStyle } from './style';
import { InputUpdatedValues } from '@/widgets/quote-new/input-updated-values';
import { useTranslation } from 'react-i18next';

interface PriceProfitTableProps {
  headers: any[];
  open: boolean;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleCheckboxChange: (index: number) => void;
  handleRestoreOriginalPrice: (data: any) => void;
  handleUpdateNewPrice: (data: any) => void;
  handleReviewCalculation: (data: any) => void;
  selectedProduct: any;
  products: any;
  setSelectedProduct: (data: any) => void;
  handlePriceChange: (index: number, idx: number, newValue: string) => void;
  isUpdate: boolean;
  setIsUpdate: (value: boolean) => void;
  onBlurPriceChange: (value: any) => void;
  handleHideProduct: (index: number, data: any) => void;
  onBlurQuantityChange: () => void;
  handleQuantity: (index: number, value: string) => void;
  isUpdateQuantity: boolean;
  setIsUpdateQuantity: (value: boolean) => void;
  updatePrintHousePrice: (data: any, isNewPrice: boolean, isCalculatedPrice?: boolean) => void;
  updateProfitProfileProductHidden: (data: any, handleClose: () => void) => void;
  updateProfitProfileProductSelected: (data: any) => void;
}

const PriceProfitTable = ({
  headers,
  open,
  anchorEl,
  handleClose,
  handleOpen,
  handleCheckboxChange,
  handleRestoreOriginalPrice,
  handleUpdateNewPrice,
  handleReviewCalculation,
  selectedProduct,
  products,
  setSelectedProduct,
  handlePriceChange,
  isUpdate,
  setIsUpdate,
  onBlurPriceChange,
  handleHideProduct,
  onBlurQuantityChange,
  handleQuantity,
  isUpdateQuantity,
  setIsUpdateQuantity,
  updatePrintHousePrice,
  updateProfitProfileProductHidden,
  updateProfitProfileProductSelected
}: PriceProfitTableProps) => {
  const { classes } = useStyle()
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [activeCell, setActiveCell] = useState<{ index: number, idx: number } | null>(null);
  const [isActiveQuantityCell, setIsActiveQuantityCell] = useState(null);
  const { t } = useTranslation()

  return (
    <TableContainer style={{ ...classes.tableContainer, overflowY: 'auto', maxHeight: "calc(100vh - 300px)" }}>
      <Table style={classes.table}>
        <TableHead>
          <TableRow style={{ ...classes.tableHead, position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#B1B2E3' }}>
            <TableCell sx={classes.tableHeadCell}>{t("priceProfit.quantities")}</TableCell>
            {headers?.map((header, index) => {
              const isActive = isActiveQuantityCell === index; // Check if the current cell is active

              return (
                <TableCell sx={classes.tableHeadCellValue} key={index} colSpan={header?.quantities?.length}>
                  <div style={classes.tableBodyCellContent}>
                    <InputUpdatedValues
                      value={header?.quantity ?? "----"}
                      onBlur={() => {
                        onBlurQuantityChange();
                      }}
                      isUpdate={isActive && isUpdateQuantity} // Update only if the cell is active
                      setIsUpdate={() => {
                        setIsActiveQuantityCell(index)
                        setIsUpdateQuantity(!isUpdateQuantity);
                      }}
                      onInputChange={(value) => {
                        handleQuantity(index, value);
                      }}
                      speicalStyle={{ color: "#FFF", textAlign: "center" }}
                    />
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
          <TableRow style={{ ...classes.tableHeadTotal, position: 'sticky', top: '72px', zIndex: 1, backgroundColor: '#D0D5DD' }}>
            <TableCell sx={classes.tableHeadCellValueTotal}>{t("priceProfit.total")}</TableCell>
            {headers?.map((header, index) => (
              <TableCell sx={classes.tableHeadCellTotalValue} key={index} colSpan={header?.quantities?.length}>
                {isNaN(header?.total) ? 0 : header?.total?.toFixed(3)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products?.data?.map((product, index) => {
            return (
              (showAllProducts || !product.isHidden) && (
                <ProductsRowMappingTable
                  product={product}
                  index={index}
                  handleCheckboxChange={handleCheckboxChange}
                  handleOpen={handleOpen}
                  setSelectedProduct={setSelectedProduct}
                  onBlurPriceChange={onBlurPriceChange}
                  handlePriceChange={handlePriceChange}
                  isUpdate={isUpdate}
                  setIsUpdate={setIsUpdate}
                  activeCell={activeCell}
                  setActiveCell={setActiveCell}
                  handleHideProduct={handleHideProduct}
                  updatePrintHousePrice={updatePrintHousePrice}
                  updateProfitProfileProductHidden={updateProfitProfileProductHidden}
                  updateProfitProfileProductSelected={updateProfitProfileProductSelected}
                  handleReviewCalculation={handleReviewCalculation}
                />
              )
            )
          })}
        </TableBody>
      </Table>
      <div style={classes.viewAllContainer}>
        <PlusIcon stroke="#2E3092" width={16} height={16} />
        <span onClick={() => setShowAllProducts(!showAllProducts)}>{showAllProducts ? t("priceProfit.hideHidden") : t("priceProfit.viewAll")}</span>
      </div>
      <Divider />
      <GoMakeMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
      >
        <div style={classes.menuContainer}>
          <MenuItem onClick={() => handleRestoreOriginalPrice(selectedProduct)} style={classes.menuItem}>
            <div style={classes.menuItemRestoreContainer}>
              <ReStoreIcon />
              <div style={classes.menuItemRestoreText}>
                {t("priceProfit.restoreOriginalPrice")}
              </div>
            </div>
            <div style={classes.menuItemRestoreText}>
              ₪ {selectedProduct?.PrintHousePrice}
            </div>
          </MenuItem>
          <MenuItem onClick={() => handleUpdateNewPrice(selectedProduct)} style={classes.menuItem}>
            <div style={classes.menuItemUpdateContainer}>
              <UpdatedPriceIcon />
              <div style={classes.menuItemUpdateText}>
                {t("priceProfit.updateNewPrice")}
              </div>
            </div>
            <div style={classes.menuItemUpdateText}>
              ₪ {selectedProduct?.CalculatedPrice}
            </div>
          </MenuItem>
          <MenuItem onClick={() => handleReviewCalculation(selectedProduct)}>
            <div style={classes.menuItemReviewContainer}>
              <ReviewIcon />
              <div style={classes.menuItemReviewText}>{t("priceProfit.reviewCalculation")}</div>
            </div>
          </MenuItem>
        </div>
      </GoMakeMenu>
    </TableContainer>
  );
};

export { PriceProfitTable };