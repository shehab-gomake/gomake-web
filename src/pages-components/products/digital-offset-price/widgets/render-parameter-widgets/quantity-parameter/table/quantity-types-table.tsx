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
  const { t, i18n } = useTranslation();
  const dir: 'rtl' | 'ltr' = t('direction');
  const isRTL = i18n.dir() === 'rtl';
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
    <div key={index} style={{ display: "flex", flexDirection: isRTL ? "row-reverse" : "row", ...style, overflowX: "hidden" }}>
      <TableCell>
        <GomakeTextInput
          onChange={handleNameChange}
          style={{ height: "40px", width: "145px" }}
          value={value.name}
          direction={dir}
        />
      </TableCell>
      <TableCell style={{ textAlign: "center" }}>
        <GomakeTextInput
          onChange={handleQuantityChange}
          style={{ height: "40px", width: "145px" }}
          value={value.quantity}
          direction={dir}
        />
      </TableCell>
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
      <TableBody className='quantity-table-list'>
        <List
          height={295}
          width={375}
          itemCount={values.length}
          itemSize={70}
          itemData={itemData}
        >
          {Row}
        </List>

        {/* Custom scrollbar styles */}
        <style>{`
          .quantity-table-list::-webkit-scrollbar {
            width: 10px !important;
          }
          
          .quantity-table-list::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
            border-radius: 10px;
          }
          
          .quantity-table-list::-webkit-scrollbar-thumb {
            background: #cccdcf !important;
            border-radius: 10px !important;
            border: 2px solid #f1f1f1;
          }
          
          .quantity-table-list::-webkit-scrollbar-thumb:hover {
            background: #b0b0b0 !important;
          }
          
          /* For Firefox */
          .quantity-table-list {
            scrollbar-width: thin;
            scrollbar-color: #cccdcf #f1f1f1;
          }
          
          /* Alternative custom-scroller style if you prefer */
          .quantity-table-list.custom-scroller::-webkit-scrollbar {
            width: 7px !important;
          }
          
          .quantity-table-list.custom-scroller::-webkit-scrollbar-track {
            background: #f6f6f6 !important;
          }
          
          .quantity-table-list.custom-scroller::-webkit-scrollbar-thumb {
            background: #d5d6e9 !important;
            border-radius: 10px !important;
          }
          
          .quantity-table-list.custom-scroller::-webkit-scrollbar-thumb:hover {
            background: #b0b0b0 !important;
          }
        `}</style>
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
                  <TableCell style={{ backgroundColor: "#EAECF0", textAlign: "center", width: "50%" }}>
                    {t("quantityTypes.typeName")}
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#EAECF0", textAlign: "center", width: "50%" }}>
                    {t("quantityTypes.quantity")}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell style={{ backgroundColor: "#EAECF0", textAlign: "center", width: "50%" }}>
                    {t("quantityTypes.typeName")}
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#EAECF0", textAlign: "center", width: "50%" }}>
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