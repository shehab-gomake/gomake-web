import React, { useState } from 'react';
import { useStyle } from './style';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, MenuItem } from '@mui/material';
import { CheckboxCheckedIcon, CheckboxIcon, Warning2Icon } from '@/icons';
import { GoMakeMenu } from '@/components';
import { ReStoreIcon } from './icons/restore-icon';
import { UpdatedPriceIcon } from './icons/update-icon';
import { ReviewIcon } from './icons/review-icon';

interface PriceProfitTableProps {
  headers: any[];
  data: any[];
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
}

const PriceProfitTable = ({
  headers,
  data,
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
  setSelectedProduct
}: PriceProfitTableProps) => {
  const { classes } = useStyle()

  return (
    <TableContainer>
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
          <TableRow>
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
            !product.IsHidden && (
              <TableRow key={index}>
                <TableCell sx={classes.tableBodyCell} style={product?.IsSelected ? { borderLeft: "6px solid #11A5EC" } : {}}>
                  <Checkbox
                    icon={<CheckboxIcon />}
                    checkedIcon={<CheckboxCheckedIcon fill="#2E3092" />}
                    checked={product.IsSelected}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  {product.ProductName}
                </TableCell>
                {product.PricePerQuantity.map((price, idx) => (
                  <TableCell
                    sx={classes.tableBodyCell}
                    key={idx}
                    style={price.PrintHousePrice !== price.CalculatedPrice ? classes.tableBodyCellError : classes.tableBodyNotErrorCell}
                    onClick={(event) => {
                      if (price.PrintHousePrice !== price.CalculatedPrice) {
                        // Open your popup here
                        handleOpen(event)
                        setSelectedProduct({ ...product, ...price })
                      }
                    }}
                  >
                    <div style={classes.tableBodyCellContent}>
                      {price.IsNotCalcuated ? <Warning2Icon /> :
                        price.CalculatedPrice}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            )
          ))}
        </TableBody>
      </Table>
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