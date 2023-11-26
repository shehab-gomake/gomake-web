import { PrimaryTableCell } from "@/components/tables/primary-table";
import { Checkbox, TableRow } from "@mui/material";
import { useStyle } from "./style";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { InputUpdatedValues } from "../input-updated-values";
import { useQuoteTable } from "./use-quote-table";
import { MoreMenuWidgetWithChilds } from "@/widgets/quote/more-circle-with-childs";

const RowMappingChildWidget = ({
  item,
  index,
  columnWidths,
  headerHeight,
  getCalculateQuoteItem,
  onClickDeleteQouteItem,
  parentIndex,
  childInex,
  changepriceListItemsChild,
  childList,
}: any) => {
  const { clasess } = useStyle({ headerHeight });
  const {
    isUpdateAmount,
    isUpdateDiscount,
    isUpdatePrice,
    isUpdateFinalPrice,
    setIsUpdateFinalPrice,
    onBlurFinalPrice,
    onInputChangeFinalPrice,
    setIsUpdatePrice,
    onBlurPrice,
    onInputChangePrice,
    onBlurDiscount,
    onInputChangeDiscount,
    setIsUpdateDiscount,
    setIsUpdateAmount,
    onBlurAmount,
    onInputChangeAmount,
  } = useQuoteTable({
    getCalculateQuoteItem,
    changepriceListItemsChild,
    item,
    index,
    parentIndex,
    childInex,
  });
  return (
    <TableRow
      key={item.id}
      style={{
        background: index % 2 === 0 ? "#FFFFFF" : "#F8FAFB",
      }}
    >
      <PrimaryTableCell
        style={{
          width: columnWidths[0],
          ...clasess.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
          />
          {index}
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[1],
          ...clasess.cellContainerStyle,
          color: "#000000",
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      ></PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[2],
          ...FONT_FAMILY.Inter(600, 14),
          color: "#5859A8",
          ...clasess.cellContainerStyle,
        }}
      ></PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[3],
          textAlign: "start",
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      ></PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[4],
          ...clasess.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        <div style={clasess.cellTextInputStyle}>
          <InputUpdatedValues
            value={item.quantity}
            onBlur={onBlurAmount}
            isUpdate={isUpdateAmount}
            setIsUpdate={setIsUpdateAmount}
            onInputChange={(e) => onInputChangeAmount(e)}
          />
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[5],
          ...clasess.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        <div style={clasess.cellTextInputStyle}>
          <InputUpdatedValues
            value={item.discount ? item.discount : "0"}
            onBlur={onBlurDiscount}
            isUpdate={isUpdateDiscount}
            setIsUpdate={setIsUpdateDiscount}
            onInputChange={(e) => onInputChangeDiscount(e)}
          />
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[6],
          ...clasess.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        <div style={clasess.cellTextInputStyle}>
          <InputUpdatedValues
            value={item.price}
            onBlur={onBlurPrice}
            isUpdate={isUpdatePrice}
            setIsUpdate={setIsUpdatePrice}
            onInputChange={(e) => onInputChangePrice(e)}
          />
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[7],
          ...clasess.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        <div style={clasess.cellTextInputStyle}>
          <InputUpdatedValues
            value={item.finalPrice}
            onBlur={onBlurFinalPrice}
            isUpdate={isUpdateFinalPrice}
            setIsUpdate={setIsUpdateFinalPrice}
            onInputChange={(e) => onInputChangeFinalPrice(e)}
          />
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[7],
          ...clasess.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        <MoreMenuWidgetWithChilds
          quoteItem={item}
          onClickDeleteQouteItem={onClickDeleteQouteItem}
        />
      </PrimaryTableCell>
    </TableRow>
  );
};
export { RowMappingChildWidget };
