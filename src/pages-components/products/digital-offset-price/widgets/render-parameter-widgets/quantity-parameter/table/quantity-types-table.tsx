import React from 'react';
import { useQuantityTypesTable } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/table/use-quantity-types-table";
import { FixedSizeList as List } from 'react-window';
import { useTranslation } from "react-i18next";
import { GomakeTextInput } from "@/components";
import { ChangeEvent } from "react";
import { IQuantityTypesValue } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import { TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody } from '@mui/material';

interface IQuantityTypesTableProps {
  save: boolean;
  onSave: (v: IQuantityTypesValue[]) => void;
}

const QuantityTypesTable = ({ save }: IQuantityTypesTableProps) => {
  const { values, onQuantityTypeChange } = useQuantityTypesTable(save);
  const { t } = useTranslation();

  const Row = ({ index, style }) => (
    <div style={style}>
      <TableRow>
        <TableCell>
          <GomakeTextInput
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onQuantityTypeChange(index, "name", event.target.value)
            }
            style={{ height: "40px", width: "150px" }}
            value={values[index].name}
          />
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          <GomakeTextInput
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onQuantityTypeChange(index, "quantity", +event.target.value)
            }
            style={{ height: "40px", width: "150px" }}
            value={values[index].quantity}
          />
        </TableCell>
      </TableRow>
    </div>
  );

  return (
    <TableContainer component={Paper} style={{ maxHeight: 390 }}>
      <Table stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCell style={{ backgroundColor: "#EAECF0" }}>
              {t("quantityTypes.typeName")}
            </TableCell>
            <TableCell style={{ textAlign: "center", backgroundColor: "#EAECF0" }}>
              {t("quantityTypes.quantity")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <List
            height={295} // Ensure this is a number
            itemCount={values.length}
            itemSize={70}
            width={400}
          >
            {Row}
          </List>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { QuantityTypesTable };