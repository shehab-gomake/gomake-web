import { PrimaryTableCell } from "@/components/tables/primary-table";
import { Checkbox, TableRow } from "@mui/material";
import { useStyle } from "./style";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { CharacterDetails } from "./character-details";
import { InputUpdatedValues } from "../input-updated-values";
import { useQuoteTable } from "./use-quote-table";
import { useState } from "react";
import { useQuoteConfirmation } from "@/pages-components/quote-confirmation/use-quote-confirmation";
import { useRouter } from "next/router";
import { MoreMenuWidget } from "../more-circle";

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
  const { handleItemCheck } = useQuoteConfirmation();
  const canUpdate = router.query.isNewCreation ? true : item?.isEditable;

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
        {isQuoteConfirmation ?
          <div style={classes.checkBoxContainer} >
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              checked={item?.isChecked}
              onChange={(checked) => handleItemCheck(checked, item.id)}
            />
            {parentIndex}
          </div>
          : parentIndex}
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[1],
          ...classes.cellContainerStyle,
          color: "#000000",
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >
        {item?.code ? item?.code : "225"}
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
        <CharacterDetails details={item.details} getQuote={getQuote} documentItemId={item?.id} canUpdate={canUpdate} />
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
            isUpdate={router.query.isNewCreation ? isUpdateAmount : !item?.isEditable ? false : isUpdateAmount}
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
            isUpdate={router.query.isNewCreation ? isUpdateDiscount : !item?.isEditable ? false : isUpdateDiscount}
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
            isUpdate={router.query.isNewCreation ? isUpdatePrice : !item?.isEditable ? false : isUpdatePrice}
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
            isUpdate={router.query.isNewCreation ? isUpdateFinalPrice : !item?.isEditable ? false : isUpdateFinalPrice}
            setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateFinalPrice}
            onInputChange={(e) => onInputChangeFinalPrice(e)}
          />
        </div>

      </PrimaryTableCell>
      {
        !isQuoteConfirmation &&
        <PrimaryTableCell
          style={{
            width: columnWidths[7],
            ...classes.cellContainerStyle,
            borderBottom: item?.childsDocumentItems && "none",
          }}
        >
          {canUpdate && <MoreMenuWidget
            quoteItem={item}
            onClickDuplicateWithDifferentQTY={onClickDuplicateWithDifferentQTY}
            onClickDeleteQouteItem={onClickDeleteQouteItem}
            documentType={documentType}
          />}
        </PrimaryTableCell>
      }
    </TableRow>
  );
};
export { RowMappingWidget };