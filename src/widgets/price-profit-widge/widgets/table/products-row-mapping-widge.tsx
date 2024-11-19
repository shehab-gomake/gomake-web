import { Checkbox, TableCell } from '@mui/material';
import { TableRow } from '@mui/material';
import { PriceProfitRowMappingTable } from './table-price-profit-row-mapping-widge';
import { CheckboxCheckedIcon } from '@/icons';
import { CheckboxIcon } from '@/icons';
import { useStyle } from './style';
import { MoreIcon } from './icons/more-icon';
import { GoMakeMenu, SecondSwitch } from '@/components';
import { useState } from 'react';


const ProductsRowMappingTable = ({
  product,
  index,
  handleCheckboxChange,
  handleOpen,
  setSelectedProduct,
  onBlurPriceChange,
  handlePriceChange,
  isUpdate,
  setIsUpdate,
  activeCell,
  setActiveCell,
  handleHideProduct,
  updatePrintHousePrice
}) => {
  const { classes } = useStyle()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleActiveOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  return (
    <>
      <TableRow key={index}>
        <TableCell
          className="tableBodyCellForProduct"
          sx={{
            ...classes.tableBodyCellForProduct,
            borderLeft: product?.isSelected ? '6px solid #11A5EC' : 'none',
          }}
          style={product?.isSelected ? { borderLeft: "6px solid #11A5EC" } : {}}>
          <div>
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon fill="#2E3092" />}
              checked={product.isSelected}
              onChange={() => handleCheckboxChange(index)}
            />
            {product.productName}
          </div>
          <div
            className="moreIconContainer"
            style={classes.moreIconContainer}
            onClick={handleActiveOpen}
          >
            <MoreIcon />
          </div>
        </TableCell>
        {product?.pricePerQuantity?.map((price, idx) => (
          <PriceProfitRowMappingTable
            price={price}
            idx={idx}
            index={index}
            handleOpen={handleOpen}
            setSelectedProduct={setSelectedProduct}
            onBlurPriceChange={onBlurPriceChange}
            handlePriceChange={handlePriceChange}
            isUpdate={isUpdate}
            product={product}
            setIsUpdate={setIsUpdate}
            activeCell={activeCell}
            setActiveCell={setActiveCell}
            updatePrintHousePrice={updatePrintHousePrice}
          />
        ))}
      </TableRow>
      <GoMakeMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
      >
        <div style={classes.moreMenuContainer}>
          <div style={classes.appearanceText}>Appearance</div>
          <div style={classes.switchContainer}>
            <div style={classes.switchText}>{product?.isHidden ? "off" : "on"}</div>
            <SecondSwitch
              checked={!product?.isHidden}
              onChange={(e) => {
                handleHideProduct(index, e.target.checked)
              }}
            />
          </div>
        </div>
      </GoMakeMenu>
    </>
  );
};

export { ProductsRowMappingTable };