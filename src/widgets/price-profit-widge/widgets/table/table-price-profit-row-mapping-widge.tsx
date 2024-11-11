import React from 'react';
import { TableCell } from '@mui/material';
import { Warning2Icon } from '@/icons';
import { useStyle } from './style';
import { InputUpdatedValues } from '@/widgets/quote-new/input-updated-values';


const PriceProfitRowMappingTable = ({
  price,
  idx,
  index,
  handleOpen,
  setSelectedProduct,
  onBlurPriceChange,
  handlePriceChange,
  isUpdate,
  product,
  setIsUpdate,
  activeCell,
  setActiveCell
}) => {
  const { classes } = useStyle()

  const isActive = activeCell?.index === index && activeCell?.idx === idx;

  return (
    <TableCell
      sx={classes.tableBodyCell}
      key={idx}
      style={price.PrintHousePrice !== price.CalculatedPrice ? classes.tableBodyCellError : classes.tableBodyNotErrorCell}
      onClick={(event) => {

        if (price.PrintHousePrice !== price.CalculatedPrice) {
          handleOpen(event)
          setSelectedProduct({ ...product, ...price })
        }
        else {
          setActiveCell({ index, idx });
        }
      }}
    >
      <div style={classes.tableBodyCellContent}>
        {price.IsNotCalcuated ? (
          <Warning2Icon />
        ) : (
          <InputUpdatedValues
            value={price.CalculatedPrice}
            onBlur={() => {
              onBlurPriceChange();
              setActiveCell(null);
            }}
            isUpdate={isUpdate && isActive}
            setIsUpdate={() => setIsUpdate(!isUpdate)}
            onInputChange={(value) => {
              handlePriceChange(index, idx, value);
            }}
          />
        )}
      </div>
    </TableCell>
  );
};

export { PriceProfitRowMappingTable };