import { PrimaryTableCell } from "@/components/tables/primary-table";
import { TableRow } from "@mui/material";
import { useStyle } from "./style";
import { InputUpdatedValues } from "@/widgets/quote-new/input-updated-values";
import { usePriceList } from "./use-pricing-list";
import { PricingListTableRowProps } from "../../interface";
import { ChangeEvent } from "react";
import { EPricingBy } from "../../enums/profites-enum";

const RowMappingWidget = ({
  item,
  index,
  changeactionProfitRowsItems,
  updateActionProfitRow,
  selectedPricingBy,
}: PricingListTableRowProps) => {
  const { clasess } = useStyle();
  const {
    isUpdateCost,
    isUpdatTotalPrice,
    isUpdateProfit,
    profit,
    onBlurProfit,
    onInputChangeProfit,
    setIsUpdateTotalPrice,
    setIsUpdateCost,
    onBlurCost,
    onInputChangeCost,
    onBlurTotalPrice,
    onInputChangeTotalPrice,
    setIsUpdateProfit,
  } = usePriceList({
    changeactionProfitRowsItems,
    index,
    updateActionProfitRow,
    item,
  });
  return (
    <TableRow key={item.id}>
      <PrimaryTableCell style={clasess.cellContainerStyle}>
        <div style={clasess.cellTextInputStyle}>
          <InputUpdatedValues
            value={item?.value}
            onBlur={() => onBlurCost(item)}
            isUpdate={isUpdateCost}
            setIsUpdate={setIsUpdateCost}
            onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
              onInputChangeCost(e)
            }
          />
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell style={clasess.cellContainerStyle}>
        <div style={clasess.cellTextInputStyle}>
          {selectedPricingBy?.value === EPricingBy.COST ? (
            <InputUpdatedValues
              value={profit}
              sign={"%"}
              onBlur={() => onBlurProfit(item)}
              isUpdate={isUpdateProfit}
              setIsUpdate={setIsUpdateProfit}
              onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
                onInputChangeProfit(e)
              }
            />
          ) : null}
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell style={clasess.cellContainerStyle}>
        <div style={clasess.cellTextInputStyle}>
          <InputUpdatedValues
            value={item?.totalPrice}
            onBlur={() => onBlurTotalPrice(item)}
            isUpdate={isUpdatTotalPrice}
            setIsUpdate={setIsUpdateTotalPrice}
            onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
              onInputChangeTotalPrice(e)
            }
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
