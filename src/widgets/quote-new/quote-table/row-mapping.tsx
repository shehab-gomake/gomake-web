import { PrimaryTableCell } from "@/components/tables/primary-table";
import { Checkbox, TableRow } from "@mui/material";
import { useStyle } from "./style";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { CharacterDetails } from "./character-details";
import { InputUpdatedValues } from "../input-updated-values";
import { useQuoteTable } from "./use-quote-table";
import { useEffect, useState } from "react";
import { useQuoteConfirmation } from "@/pages-components/quote-confirmation/use-quote-confirmation";
import { useRouter } from "next/router";
import { MoreMenuWidget } from "../more-circle";
import { useRecoilValue } from "recoil";
import { quoteConfirmationState, quoteItemState } from "@/store";
import { DOCUMENT_TYPE, QUOTE_STATUSES } from "@/pages-components/quotes/enums";
import { Permissions , DocumentPermission } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";

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
  onChangeSelectedItemRowForQoute

}) => {
  const router = useRouter();
  const { classes } = useStyle({ headerHeight });
  const [isConfirmation, setIsConfirmation] = useState(null);
  const [isSelected, setIsSelected] = useState(item?.isSelected);
  const handleChangeSelectedItem = (checked, itemId) => {
    setIsSelected(checked)
    onChangeSelectedItemRowForQoute(checked, itemId)
  }
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
  const {CheckPermission ,  CheckDocumentPermission } = useUserPermission();
  const { handleItemCheck } = useQuoteConfirmation();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);

  const canUpdate = router.query.isNewCreation ? true : item?.isEditable;
  const canUpdatePrices = router.query.isNewCreation ? true : (item?.isEditable && CheckDocumentPermission(documentType, DocumentPermission.UPDATE_DOCUMENT_ITEM_PRICES));
  const canUpdateDeliveryPrices = router.query.isNewCreation ? true : (item?.isEditable && CheckPermission(Permissions.UPDATE_DELIVERY_ITEM_PRICES));
  const canUpdatePricesBasedOnType = item?.productType === 1 ? canUpdateDeliveryPrices : canUpdatePrices;

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
        {(isQuoteConfirmation && (!quoteConfirm?.isConfirmed && quoteConfirm?.documentStatus !== QUOTE_STATUSES.Canceled)) ?
          <div style={classes.checkBoxContainer} >
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              checked={item?.isChecked}
              onChange={(checked) => handleItemCheck(checked, item.id)}
            />
            {parentIndex}
          </div>
          : documentType === DOCUMENT_TYPE.quote ?
            <span style={classes.checkBoxContainer}>
              <Checkbox
                icon={<CheckboxIcon />}
                checkedIcon={<CheckboxCheckedIcon fill={item?.isConfirmedByClient && "green"} />}
                checked={isSelected}
                disabled={item?.isConfirmedByClient ? true : false}
                onChange={(e) => handleChangeSelectedItem(e.target.checked, item?.id)}
              />
              {parentIndex}
            </span>
            :
            parentIndex 
        }
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
      {
        quoteItemValue?.isShowDetails &&
        <PrimaryTableCell
          style={{
            width: columnWidths[3],
            textAlign: "start",
            borderBottom: item?.childsDocumentItems && "none",
          }}
        >
          <CharacterDetails details={item.details} getQuote={getQuote} documentItemId={item?.id} canUpdate={canUpdate} />
        </PrimaryTableCell>
      }
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
            isUpdate={canUpdatePricesBasedOnType && isUpdateAmount}
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
            isUpdate={canUpdatePricesBasedOnType && isUpdateDiscount}
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
            isUpdate={canUpdatePricesBasedOnType && isUpdatePrice}
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
           isUpdate={canUpdatePricesBasedOnType && isUpdateFinalPrice}
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