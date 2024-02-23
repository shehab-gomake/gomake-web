import { PrimaryTableCell } from "@/components/tables/primary-table";
import { Checkbox, TableRow } from "@mui/material";
import { useStyle } from "./style";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { CharacterDetails } from "./character-details";
import { MoreMenuWidget } from "@/widgets/quote/more-circle";
import { InputUpdatedValues } from "../input-updated-values";
import { useQuoteTable } from "./use-quote-table";
import { useState } from "react";
import { useQuoteConfirmation } from "@/pages-components/quote-confirmation/use-quote-confirmation";
import { useRouter } from "next/router";

const RowMappingWidget = ({
  item,
  index,
  columnWidths,
  headerHeight,
  changedocumentItems,
  getCalculateQuoteItem,
  onClickDuplicateWithDifferentQTY,
  onClickDeleteQouteItem,
  parentIndex,
  documentType,
  getQuote,
  isQuoteConfirmation = false,
}) => {
  const router = useRouter()
  const { classes } = useStyle({ headerHeight });
  const [isConfirmation, setIsConfirmation] = useState(null);
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
    changedocumentItems,
    item,
    index,
  });

  // in quote confirmation case
  const { handleItemCheck } = useQuoteConfirmation();

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
          ...classes.cellContainerStyle,
          borderBottom: item?.childsDocumentItems && "none",
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
          {isQuoteConfirmation ?
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              checked={item?.isChecked}
              onChange={(checked) => handleItemCheck(checked, item.id)}
            /> :
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
            />}
          {parentIndex}
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[1],
          ...classes.cellContainerStyle,
          color: "#000000",
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >
        225
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[2],
          ...FONT_FAMILY.Inter(600, 14),
          color: "#5859A8",
          ...classes.cellContainerStyle,
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >
        {item.productName}
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[3],
          textAlign: "start",
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >
        <CharacterDetails details={item.details} getQuote={getQuote} documentItemId={item?.id} canUpdate={router.query.Id ? false : !isQuoteConfirmation} />
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[4],
          ...classes.cellContainerStyle,
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >
        <div style={classes.cellTextInputStyle}>
          <InputUpdatedValues
            value={item.quantity}
            onBlur={onBlurAmount}
            isUpdate={router.query.Id ? false : isUpdateAmount}
            setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateAmount}
            onInputChange={(e) => onInputChangeAmount(e)}
          />
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[5],
          ...classes.cellContainerStyle,
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >
        <div style={classes.cellTextInputStyle}>
          <InputUpdatedValues
            value={item.discount ? item.discount : "0"}
            onBlur={onBlurDiscount}
            isUpdate={router.query.Id ? false : isUpdateDiscount}
            setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateDiscount}
            onInputChange={(e) => onInputChangeDiscount(e)}
          />
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[6],
          ...classes.cellContainerStyle,
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >
        <div style={classes.cellTextInputStyle}>
          <InputUpdatedValues
            value={item.price}
            onBlur={onBlurPrice}
            isUpdate={router.query.Id ? false : isUpdatePrice}
            setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdatePrice}
            onInputChange={(e) => onInputChangePrice(e)}
          />
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[7],
          ...classes.cellContainerStyle,
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >
        <div style={classes.cellTextInputStyle}>
          <InputUpdatedValues
            value={item.finalPrice}
            onBlur={onBlurFinalPrice}
            isUpdate={router.query.Id ? false : isUpdateFinalPrice}
            setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateFinalPrice}
            onInputChange={(e) => onInputChangeFinalPrice(e)}
          />
        </div>
      </PrimaryTableCell>
      {!isQuoteConfirmation && <PrimaryTableCell
        style={{
          width: columnWidths[7],
          ...classes.cellContainerStyle,
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >
        <MoreMenuWidget
          quoteItem={item}
          onClickDuplicateWithDifferentQTY={onClickDuplicateWithDifferentQTY}
          onClickDeleteQouteItem={onClickDeleteQouteItem}
          documentType={documentType}
        />
      </PrimaryTableCell>}
    </TableRow>
  );
};
export { RowMappingWidget };