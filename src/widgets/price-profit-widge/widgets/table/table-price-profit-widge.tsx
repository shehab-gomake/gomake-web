import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Divider } from '@mui/material';
import { PlusIcon } from '@/icons';
import { GoMakeMenu } from '@/components';


import { ProductsRowMappingTable } from './products-row-mapping-widge';
import { UpdatedPriceIcon } from './icons/update-icon';
import { ReStoreIcon } from './icons/restore-icon';
import { ReviewIcon } from './icons/review-icon';
import { useStyle } from './style';

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
  handleHideProduct
}: PriceProfitTableProps) => {
  const { classes } = useStyle()
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [activeCell, setActiveCell] = useState<{ index: number, idx: number } | null>(null);

  return (
    <TableContainer style={classes.tableContainer}>
      <Table style={classes.table}>
        <TableHead>
          <TableRow style={classes.tableHead}>
            <TableCell sx={classes.tableHeadCell}>Quantities</TableCell>
            {headers.map((header, index) => (
              <TableCell sx={classes.tableHeadCellValue} key={index} colSpan={header?.quantities?.length}>
                {header?.Qunatity}
              </TableCell>
            ))}
          </TableRow>
          <TableRow style={classes.tableHeadTotal}>
            <TableCell sx={classes.tableHeadCellValueTotal}>Total</TableCell>
            {headers.map((header, index) => (
              <TableCell sx={classes.tableHeadCellTotalValue} key={index} colSpan={header?.quantities?.length}>
                {header?.Total}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products?.data?.map((product, index) => (
            (showAllProducts || !product.IsHidden) && (
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
              />
            )
          ))}
        </TableBody>
      </Table>
      <div style={classes.viewAllContainer}>
        <PlusIcon stroke="#2E3092" width={16} height={16} />
        <span onClick={() => setShowAllProducts(!showAllProducts)}>{showAllProducts ? "Hide hidden" : "View all"}</span>
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
                Restore original price
              </div>
            </div>
            <div style={classes.menuItemRestoreText}>
              ₪ {selectedProduct?.PrintHousePrice}
            </div>
          </MenuItem>
          <MenuItem onClick={() => handleUpdateNewPrice(selectedProduct)} style={classes.menuItem}>
            <div style={classes.menuItemUpdateContainer}>
              <UpdatedPriceIcon />
              <div style={classes.menuItemUpdateText}>Update new price</div>
            </div>
            <div style={classes.menuItemUpdateText}>
              ₪ {selectedProduct?.CalculatedPrice}
            </div>
          </MenuItem>
          <MenuItem onClick={() => handleReviewCalculation(selectedProduct)}>
            <div style={classes.menuItemReviewContainer}>
              <ReviewIcon />
              <div style={classes.menuItemReviewText}>Review calculation</div>
            </div>
          </MenuItem>
        </div>
      </GoMakeMenu>
    </TableContainer>
  );
};

export { PriceProfitTable };