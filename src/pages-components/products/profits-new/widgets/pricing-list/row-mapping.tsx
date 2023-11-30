import { PrimaryTableCell } from "@/components/tables/primary-table";
import { TableRow } from "@mui/material";
import { useStyle } from "./style";
import { InputUpdatedValues } from "@/widgets/quote-new/input-updated-values";
import { usePriceList } from "./use-pricing-list";
import { PricingListTableRowProps } from "../../interface";

const RowMappingWidget = ({
  item,
  index,
  changeactionProfitRowsItems,
}: PricingListTableRowProps) => {
  const { clasess } = useStyle();
  const {
    isUpdateCost,
    isUpdatTotalPrice,
    setIsUpdateTotalPrice,
    setIsUpdateCost,
    onBlurDiscount,
    onInputChangeDiscount,
    onBlurTotalPrice,
    onInputChangeTotalPrice,
  } = usePriceList({ changeactionProfitRowsItems, index });
  return (
    <TableRow key={item.id}>
      <PrimaryTableCell style={clasess.cellContainerStyle}>
        <div style={clasess.cellTextInputStyle}>
          <InputUpdatedValues
            value={item?.value}
            onBlur={onBlurDiscount}
            isUpdate={isUpdateCost}
            setIsUpdate={setIsUpdateCost}
            onInputChange={(e: any) => onInputChangeDiscount(e)}
          />
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell style={clasess.cellContainerStyle}>
        {item?.value === 0
          ? 0
          : (((item?.totalPrice - item?.value) / item?.value) * 100).toFixed(
              2
            )}{" "}
        %
      </PrimaryTableCell>
      <PrimaryTableCell style={clasess.cellContainerStyle}>
        <div style={clasess.cellTextInputStyle}>
          <InputUpdatedValues
            value={item?.totalPrice}
            onBlur={onBlurTotalPrice}
            isUpdate={isUpdatTotalPrice}
            setIsUpdate={setIsUpdateTotalPrice}
            onInputChange={(e: any) => onInputChangeTotalPrice(e)}
          />
        </div>
      </PrimaryTableCell>

      <PrimaryTableCell
        style={{
          ...clasess.cellContainerStyle,
          color: "#8283BE",
          cursor: "pointer",
        }}
      >
        Edit
      </PrimaryTableCell>
    </TableRow>
  );
};
export { RowMappingWidget };
