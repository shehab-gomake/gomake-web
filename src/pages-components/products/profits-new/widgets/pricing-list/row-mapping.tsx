import { PrimaryTableCell } from "@/components/tables/primary-table";
import { TableRow } from "@mui/material";
import { useStyle } from "./style";
import { InputUpdatedValues } from "@/widgets/quote-new/input-updated-values";
import { usePriceList } from "./use-pricing-list";
import { PricingListTableRowProps } from "../../interface";
import { ChangeEvent } from "react";
import { EPricingBy } from "../../enums/profites-enum";
import { MoreCircleIcon } from "@/icons";
import { useRouter } from "next/router";

const RowMappingWidget = ({
  item,
  index,
  changeactionProfitRowsItems,
  updateActionProfitRow,
  selectedPricingBy,
  handleClickMorePriceTable,
  setSelectedActionProfit,
  selectedAdditionalProfitRow,
}: PricingListTableRowProps) => {
  const { clasess } = useStyle();
  const router = useRouter();
  const {
    isUpdateCost,
    isUpdatTotalPrice,
    isUpdateProfit,
    profit,
    unitPrice,
    isUpdateUnitPrice,
    setIsUpdateProfitValue,
    setIsUpdateUnitPrice,
    onBlurProfit,
    onInputChangeProfit,
    setIsUpdateTotalPrice,
    setIsUpdateCost,
    onBlurCost,
    onInputChangeCost,
    onBlurTotalPrice,
    onInputChangeTotalPrice,
    setIsUpdateProfit,
    onBlurUnitPrice,
    onInputChangeUnitPrice,
  } = usePriceList({
    changeactionProfitRowsItems,
    index,
    updateActionProfitRow,
    item,
    selectedPricingBy,
  });
  return (
    <TableRow key={item.id}>
      {router?.query?.draftId && (
        <PrimaryTableCell style={clasess.cellContainerStyle}>
          <div style={clasess.cellTextInputStyle}>
            <InputUpdatedValues
              value={item?.caseQuantity}
              onBlur={() => onBlurCost(item)}
              isUpdate={isUpdateCost}
              setIsUpdate={setIsUpdateCost}
              onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
                onInputChangeCost(e)
              }
            />
          </div>
        </PrimaryTableCell>
      )}
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
              isTwoDigit={true}
              onBlur={() => onBlurProfit(item)}
              isUpdate={isUpdateProfit}
              setIsUpdate={setIsUpdateProfit}
              onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
                onInputChangeProfit(e)
              }
            />
          ) : (
            <InputUpdatedValues
              value={unitPrice}
              onBlur={() => onBlurUnitPrice(item)}
              isUpdate={isUpdateUnitPrice}
              setIsUpdate={setIsUpdateUnitPrice}
              onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
                onInputChangeUnitPrice(e)
              }
            />
          )}
        </div>
      </PrimaryTableCell>
      {selectedAdditionalProfitRow?.id && (
        <PrimaryTableCell style={clasess.cellContainerStyle}>
          <div style={clasess.cellTextInputStyle}>
            <InputUpdatedValues
              value={selectedAdditionalProfitRow.profitValue}
              onBlur={() => setIsUpdateProfitValue(0)}
              isUpdate={false}
              setIsUpdate={setIsUpdateProfitValue}
              onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
                onInputChangeTotalPrice(e)
              }
            />
          </div>
        </PrimaryTableCell>
      )}
      {router?.query?.draftId && (
        <PrimaryTableCell style={clasess.cellContainerStyle}>
          <div style={clasess.cellTextInputStyle}>
            <InputUpdatedValues
              value={item?.caseQuantity}
              onBlur={() => onBlurCost(item)}
              isUpdate={isUpdateCost}
              setIsUpdate={setIsUpdateCost}
              onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
                onInputChangeCost(e)
              }
            />
          </div>
        </PrimaryTableCell>
      )}
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

      <PrimaryTableCell style={clasess.cellContainerStyle}>
        <div
          onClick={(e) => {
            handleClickMorePriceTable(e);
            setSelectedActionProfit(item);
          }}
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignSelf: "flex-start",
          }}
        >
          <MoreCircleIcon />
        </div>
      </PrimaryTableCell>
    </TableRow>
  );
};
export { RowMappingWidget };
