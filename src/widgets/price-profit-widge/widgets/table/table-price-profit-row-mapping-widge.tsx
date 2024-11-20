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
  setActiveCell,
  updatePrintHousePrice
}) => {
  const { classes } = useStyle()

  const isActive = activeCell?.index === index && activeCell?.idx === idx;

  return (
    <TableCell
      sx={classes.tableBodyCell}
      key={idx}
      style={(price.printHousePrice !== price.calculatedPrice) && price.printHousePrice !== null ? classes.tableBodyCellError : classes.tableBodyNotErrorCell}
      onClick={(event) => {

        if ((price.printHousePrice !== price.calculatedPrice) && price.printHousePrice !== null) {
          handleOpen(event)
          setSelectedProduct({ ...product, ...price })
        }
        else {
          setActiveCell({ index, idx });
        }
      }}
    >
      <div style={classes.tableBodyCellContent}>
        {price.isErrorInCalculation ? (
          <Warning2Icon />
        ) : (
          <InputUpdatedValues
            value={price.calculatedPrice ?? "----"}
            isTwoDigit
            onBlur={() => {
              // onBlurPriceChange();
              updatePrintHousePrice({ ...product, ...price }, false,true)
              setActiveCell(null);
            }}
            isUpdate={(isUpdate && isActive) && price.calculatedPrice !== null}
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