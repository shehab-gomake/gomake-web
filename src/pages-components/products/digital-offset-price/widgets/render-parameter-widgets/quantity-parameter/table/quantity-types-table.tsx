import { useQuantityTypesTable } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/table/use-quantity-types-table";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { convertHeightToVH } from "@/utils/adapter";
import { GomakeTextInput } from "@/components";
import { ChangeEvent } from "react";
import { IQuantityTypesValue } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";

interface IQuantityTypesTableProps {
  save: boolean;
  onSave: (v: IQuantityTypesValue[]) => void;
}

const QuantityTypesTable = ({ save }: IQuantityTypesTableProps) => {
  const { values, onQuantityTypeChange } = useQuantityTypesTable(save);
  const { t } = useTranslation();
  return (
    <TableContainer
      component={Paper}
      style={{ maxHeight: convertHeightToVH(390) }}
    >
      <Table stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCell style={{ backgroundColor: "#EAECF0" }}>
              {t("quantityTypes.typeName")}
            </TableCell>
            <TableCell
              style={{
                textAlign: "center",
                backgroundColor: "#EAECF0",
              }}
            >
              {t("quantityTypes.quantity")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map((value, index) => (
            <TableRow>
              <TableCell>
                <GomakeTextInput
                  // disabled={!canUpdateName}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onQuantityTypeChange(index, "name", event.target.value)
                  }
                  style={{ height: "40px", width: "150px" }}
                  value={value.name}
                />
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <GomakeTextInput
                  // disabled={!canUpdateQuantity}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onQuantityTypeChange(index, "quantity", +event.target.value)
                  }
                  style={{ height: "40px", width: "150px" }}
                  value={value.quantity}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export { QuantityTypesTable };
