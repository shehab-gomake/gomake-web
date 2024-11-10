import React from 'react';
import { useStyle } from './style';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from '@mui/material';
import { CheckboxCheckedIcon, CheckboxIcon, Warning2Icon } from '@/icons';

const PriceProfitTable = ({ headers, data }) => {
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
          {data.map((product, index) => (
            !product.IsHidden && (
              <TableRow key={index}>
                <TableCell sx={classes.tableBodyCell} style={product?.IsSelected ? { borderLeft: "6px solid #11A5EC" } : {}}>
                  <Checkbox
                    icon={<CheckboxIcon />}
                    checkedIcon={<CheckboxCheckedIcon fill="#2E3092" />}
                    checked={product.IsSelected} />
                  {product.ProductName}
                </TableCell>
                {product.PricePerQuantity.map((price, idx) => (
                  <TableCell sx={classes.tableBodyCell} key={idx} style={price.PrintHousePrice !== price.CalculatedPrice ? classes.tableBodyCellError : classes.tableBodyNotErrorCell}>
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
    </TableContainer>
  );
};

export { PriceProfitTable };