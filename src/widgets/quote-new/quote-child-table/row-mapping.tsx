import { PrimaryTableCell } from "@/components/tables/primary-table";
import { Checkbox, Divider, TableRow } from "@mui/material";
import { useStyle } from "./style";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { InputUpdatedValues } from "../input-updated-values";
import { useQuoteTable } from "./use-quote-table";
import { MoreMenuWidgetWithChilds } from "../more-circle-with-childs";
import { DocumentPermission } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";
import { useRouter } from "next/router";
import { useState } from "react";
import { CharacterDetails } from "../quote-table/row-details/character-details";

const RowMappingChildWidget = ({
  item,
  index,
  columnWidths,
  headerHeight,
  getCalculateQuoteItem,
  onClickDeleteQouteItem,
  parentIndex,
  childInex,
  changedocumentItemsChild,
  childList,
  documentType,
  isQuoteConfirmation = false,
  parentItem,
  onChangeSelectedItemRowForQoute,
  quoteItems,
  getQuote
}: any) => {

  const { classes } = useStyle({ headerHeight });
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
    changedocumentItemsChild,
    item,
    index,
    parentIndex,
    childInex,
  });
  const router = useRouter();
  const { CheckDocumentPermission } = useUserPermission();
  const [isSelected, setIsSelected] = useState(item?.isSelected);
  const canUpdate = router.query.isNewCreation ? true : item?.isEditable;
  console.log("childList", { childList, childInex })
  const handleChangeSelectedItem = (checked, itemId) => {
    setIsSelected(checked);
    onChangeSelectedItemRowForQoute(checked, itemId);
  };
  const canUpdatePrices = router.query.isNewCreation ? true :
    (item?.isEditable && CheckDocumentPermission(documentType, DocumentPermission.UPDATE_DOCUMENT_ITEM_PRICES));

  return (
    <TableRow
      key={item.id}
      style={{
        background: index % 3 === 0 ? "#FFFFFF" : "#F8FAFB",
      }}
    >
      <PrimaryTableCell
        style={{
          width: columnWidths[0],
          ...classes.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            position: 'relative'
          }}
        >
          <Divider orientation={'vertical'}
            style={{
              width: '2px',
              height: childList?.length - 1 !== childInex ? '86px' : '43px',
              backgroundColor: "#99A9CA",
              position: 'absolute',
              top: -25,
              // marginRight: -10,
              // marginTop: 1,
            }} />
          <Divider orientation={'horizontal'}
            style={{
              width: '15px',
              height: '2px',
              backgroundColor: '#99A9CA',
              marginRight: -10,
              marginTop: 1,
            }} />
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            checked={isSelected}
            onChange={(e) =>
              handleChangeSelectedItem(e.target.checked, item?.id)
            }
          />
          {index}
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[1],
          ...classes.cellContainerStyle,
          color: "#000000",
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      ></PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[2],
          ...FONT_FAMILY.Inter(600, 14),
          color: "#5859A8",
          borderBottom: childList?.length - 1 !== childInex && "none",
          ...classes.cellContainerStyle,
        }}
      ></PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[3],
          textAlign: "start",
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        {quoteItems?.isShowDetails && (
          <PrimaryTableCell
            style={{
              width: columnWidths[3],
              textAlign: "start",
              borderBottom: "none",
              borderTop: "none",
            }}
          >
            <CharacterDetails
              details={item?.details}
              getQuote={getQuote}
              documentItemId={item?.id}
              canUpdate={canUpdate}
            />
          </PrimaryTableCell>
        )}
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[4],
          ...classes.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        <div style={classes.cellTextInputStyle}>
          <InputUpdatedValues
            value={item.quantity}
            onBlur={onBlurAmount}
            isUpdate={canUpdatePrices && isUpdateAmount}
            setIsUpdate={setIsUpdateAmount}
            onInputChange={(e) => onInputChangeAmount(e)}
          />
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[6],
          ...classes.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        <div style={classes.cellTextInputStyle}>
          <InputUpdatedValues
            value={item.price}
            onBlur={onBlurPrice}
            isUpdate={canUpdatePrices && isUpdatePrice}
            setIsUpdate={setIsUpdatePrice}
            onInputChange={(e) => onInputChangePrice(e)}
          />
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[5],
          ...classes.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        <div style={classes.cellTextInputStyle}>
          <InputUpdatedValues
            value={item.discount ? item.discount : "0"}
            onBlur={onBlurDiscount}
            isUpdate={canUpdatePrices && isUpdateDiscount}
            setIsUpdate={setIsUpdateDiscount}
            onInputChange={(e) => onInputChangeDiscount(e)}
          />
        </div>
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[7],
          ...classes.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        <div style={classes.cellTextInputStyle}>
          <InputUpdatedValues
            value={item.finalPrice}
            onBlur={onBlurFinalPrice}
            isUpdate={canUpdatePrices && isUpdateFinalPrice}
            setIsUpdate={setIsUpdateFinalPrice}
            onInputChange={(e) => onInputChangeFinalPrice(e)}
          />
        </div>
      </PrimaryTableCell>
      {!isQuoteConfirmation && <PrimaryTableCell
        style={{
          width: columnWidths[7],
          ...classes.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        <MoreMenuWidgetWithChilds
          quoteItem={item}
          onClickDeleteQouteItem={onClickDeleteQouteItem}
        />
      </PrimaryTableCell>}
    </TableRow>
  );
};
export { RowMappingChildWidget };
