import React, { memo, useCallback } from 'react';
import { useQuantityTypesTable } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/table/use-quantity-types-table";
import { GomakeTextInput } from "@/components";
import { ChangeEvent } from "react";
import { IQuantityTypesValue } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import { TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody } from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import { useTranslation } from 'react-i18next';

interface IQuantityTypesTableProps {
  save: boolean;
  onSave: (v: IQuantityTypesValue[]) => void;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    values: IQuantityTypesValue[];
    onQuantityTypeChange: (index: number, key: "quantity" | "name", value: string | number) => void;
  };
}

const Row = memo(({ index, style, data }: RowProps) => {
  const { values, onQuantityTypeChange } = data;
  const value = values[index];

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onQuantityTypeChange(index, "name", event.target.value);
    },
    [index, onQuantityTypeChange]
  );

  const handleQuantityChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onQuantityTypeChange(index, "quantity", +event.target.value);
    },
    [index, onQuantityTypeChange]
  );

  return (
    <div style={style} key={index}>
      <TableRow>
        <TableCell>
          <GomakeTextInput
            onChange={handleNameChange}
            style={{ height: "40px", width: "160px" }}
            value={value.name}
          />
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          <GomakeTextInput
            onChange={handleQuantityChange}
            style={{ height: "40px", width: "160px" }}
            value={value.quantity}
          />
        </TableCell>
      </TableRow>
    </div>
  );
});

const QuantityTypesTable = ({ save }: IQuantityTypesTableProps) => {
  const { values, onQuantityTypeChange } = useQuantityTypesTable(save);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const itemData = {
    values,
    onQuantityTypeChange,
  };

  const _renderBody = () => {
    return (
      <TableBody>
        <List
          height={295} // Ensure this is a number
          itemCount={values.length}
          itemSize={70}
          width={370}
          itemData={itemData} // Pass data explicitly to avoid unnecessary re-renders
        >
          {Row}
        </List>
      </TableBody>
    );
  };

  return (
    <>
      <TableContainer component={Paper} style={{ maxHeight: 390 }}>
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow>
              {isRTL ? (
                <>
                  <TableCell style={{ backgroundColor: "#EAECF0", textAlign: "right" }}>
                    {t("quantityTypes.quantity")}
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#EAECF0", textAlign: "right", paddingRight: 100 }}>
                    {t("quantityTypes.typeName")}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell style={{ backgroundColor: "#EAECF0", textAlign: "left" }}>
                    {t("quantityTypes.typeName")}
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#EAECF0", textAlign: "right" }}>
                    {t("quantityTypes.quantity")}
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      {_renderBody()}
    </>
  );
};

export { QuantityTypesTable };
