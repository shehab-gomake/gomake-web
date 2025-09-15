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
import { ECalculationStatus, ShowDocumentDetailsEnum } from "@/enums";
import { useTranslation } from "react-i18next";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const RowMappingChildWidget = ({
  item,
  index,
  columnWidths,
  headerHeight,
  getCalculateQuoteItem,
  onClickDeleteQouteItem,
  parentIndex,
  childInex,
  changeDocumentItemsChild,
  childList,
  documentType,
  isQuoteConfirmation = false,
  parentItem,
  onChangeSelectedItemRowForQoute,
  quoteItems,
  getQuote,
  _renderIconcalculationStatus,
  updateItemStatus,
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
    changeDocumentItemsChild,
    item,
    index,
    parentIndex,
    childInex,
  });
  const router = useRouter();
  const { t } = useTranslation();
  const { CheckDocumentPermission } = useUserPermission();
  const [isSelected, setIsSelected] = useState(item?.isSelected);
  const canUpdate = router.query.isNewCreation ? true : item?.isEditable;
  const handleChangeSelectedItem = (checked, itemId) => {
    setIsSelected(checked);
    onChangeSelectedItemRowForQoute(checked, itemId);
  };
  const canUpdatePrices = router.query.isNewCreation
    ? true
    : item?.isEditable &&
    CheckDocumentPermission(
      documentType,
      DocumentPermission.UPDATE_DOCUMENT_ITEM_PRICES
    );
  const isOrder = documentType === DOCUMENT_TYPE.order;
  return (
    <TableRow
      key={item.id}
      style={{
        background: index % 2 === 1 ? "#FFFFFF" : "#F8FAFB",
      }}
    >
      <PrimaryTableCell
        style={{
          width: columnWidths[0],
          ...classes.cellContainerStyle,
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        {item?.isShowDuplicateWithSameJob && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Divider
                orientation={"vertical"}
                style={{
                  width: "2px",
                  height: childList?.length - 1 !== childInex ? "86px" : "43px",
                  backgroundColor: "#99A9CA",
                  position: "absolute",
                  top: -25,
                }}
              />
              <Divider
                orientation={"horizontal"}
                style={{
                  width: "15px",
                  height: "2px",
                  backgroundColor: "#99A9CA",
                  marginRight: -10,
                  marginTop: 1,
                }}
              />

              {!isOrder ? <Checkbox
                icon={<CheckboxIcon />}
                checkedIcon={<CheckboxCheckedIcon />}
                checked={isSelected}
                onChange={(e) =>
                  handleChangeSelectedItem(e.target.checked, item?.id)
                }
              /> : <div style={{ width: "32px", height: "32px" }} />}
              {index}
            </div>
          </>
        )}
        {!item?.isShowDuplicateWithSameJob && index}
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[1],
          ...classes.cellContainerStyle,
          color: "#000000",
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >
        {item?.code || item?.productCode || "000"}
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
        {item?.productName === "Delivery"
          ? t("home.tabs.Delivery")
          : item?.productName}
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[3],
          textAlign: "start",
          borderBottom: childList?.length - 1 !== childInex && "none",
        }}
      >
        {quoteItems?.showDetails !== ShowDocumentDetailsEnum.HideDetails && (
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
              documentType={documentType}
              workName={item?.workName}
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
          {item?.calculationStatus === null ||
            item?.calculationStatus === ECalculationStatus.Done ? (
            <InputUpdatedValues
              value={item.quantity}
              onBlur={onBlurAmount}
              isUpdate={canUpdatePrices && isUpdateAmount}
              setIsUpdate={setIsUpdateAmount}
              onInputChange={(e) => onInputChangeAmount(e)}
            />
          ) : (
            "-"
          )}
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
          {item?.calculationStatus === null ||
            item?.calculationStatus === ECalculationStatus.Done ? (
            <InputUpdatedValues
              value={item.price}
              onBlur={onBlurPrice}
              isUpdate={canUpdatePrices && isUpdatePrice}
              setIsUpdate={setIsUpdatePrice}
              onInputChange={(e) => onInputChangePrice(e)}
            />
          ) : (
            "-"
          )}
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
          {item?.calculationStatus === null ||
            item?.calculationStatus === ECalculationStatus.Done ? (
            <InputUpdatedValues
              value={item.discount ? item.discount : "0"}
              onBlur={onBlurDiscount}
              isUpdate={canUpdatePrices && isUpdateDiscount}
              setIsUpdate={setIsUpdateDiscount}
              onInputChange={(e) => onInputChangeDiscount(e)}
            />
          ) : (
            "-"
          )}
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
          {item?.calculationStatus === null ||
            item?.calculationStatus === ECalculationStatus.Done ? (
            <InputUpdatedValues
              value={item.finalPrice}
              onBlur={onBlurFinalPrice}
              isUpdate={canUpdatePrices && isUpdateFinalPrice}
              setIsUpdate={setIsUpdateFinalPrice}
              onInputChange={(e) => onInputChangeFinalPrice(e)}
            />
          ) : (
            _renderIconcalculationStatus(item, updateItemStatus)
          )}
        </div>
      </PrimaryTableCell>
      {!isQuoteConfirmation && (
        <PrimaryTableCell
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
        </PrimaryTableCell>
      )}
    </TableRow>
  );
};
export { RowMappingChildWidget };
