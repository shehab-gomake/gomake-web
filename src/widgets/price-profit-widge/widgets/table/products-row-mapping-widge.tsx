import { Checkbox, TableCell } from '@mui/material';
import { TableRow } from '@mui/material';
import { PriceProfitRowMappingTable } from './table-price-profit-row-mapping-widge';
import { CheckboxCheckedIcon } from '@/icons';
import { CheckboxIcon } from '@/icons';
import { useStyle } from './style';
import { MoreIcon } from './icons/more-icon';


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
  setActiveCell
}) => {
  const { classes } = useStyle()


  return (
    <TableRow key={index}>
      <TableCell sx={classes.tableBodyCellForProduct} style={product?.IsSelected ? { borderLeft: "6px solid #11A5EC" } : {}}>
        <Checkbox
          icon={<CheckboxIcon />}
          checkedIcon={<CheckboxCheckedIcon fill="#2E3092" />}
          checked={product.IsSelected}
          onChange={() => handleCheckboxChange(index)}
        />
        {product.ProductName}
        <div style={classes.moreIconContainer}>
          <MoreIcon />
        </div>
      </TableCell>
      {product.PricePerQuantity.map((price, idx) => (
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
        />
      ))}
    </TableRow>
  );
};

export { ProductsRowMappingTable };