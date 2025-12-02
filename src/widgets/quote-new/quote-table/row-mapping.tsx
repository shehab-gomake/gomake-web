import { PrimaryTableCell } from "@/components/tables/primary-table";
import { Checkbox, IconButton, TableRow } from "@mui/material";
import { useStyle } from "./style";
import {
  ArrowDownWithCircle,
  ArrowUpWithCircle,
  CheckboxCheckedIcon,
  CheckboxIcon,
} from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { CharacterDetails } from "./row-details/character-details";
import { InputUpdatedValues } from "../input-updated-values";
import { useQuoteTable } from "./use-quote-table";
import { useEffect, useState } from "react";
import { useQuoteConfirmation } from "@/pages-components/quote-confirmation/use-quote-confirmation";
import { useRouter } from "next/router";
import { MoreMenuWidget } from "../more-circle";
import { useRecoilValue } from "recoil";
import { quoteConfirmationState } from "@/store";
import { DOCUMENT_TYPE, QUOTE_STATUSES } from "@/pages-components/quotes/enums";
import PriceOfferWidget from "@/widgets/price-offer-widget/price-offer-widget";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import {
  ECalculationStatus,
  ERPDocumentsTypesEnum,
  ShowDocumentDetailsEnum,
  ShowPricesEnum,
} from "@/enums/document-type-enum";
import { useTranslation } from "react-i18next";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { QuoteQuantityCell } from "./quantity-cell";
import { MaterialStockUnit } from "@/widgets/materials-widget/enums";

const RowMappingWidget = ({
  item,
  index,
  columnWidths,
  headerHeight,
  changeDocumentItems,
  getCalculateQuoteItem,
  getCalculateQuoteConfirmationItem,
  onClickDuplicateWithDifferentQTY,
  onClickQuickDuplicate,
  onClickDeleteQouteItem,
  parentIndex,
  documentType,
  getQuote,
  isQuoteConfirmation = false,
  isPrePaymentPage,
  onChangeSelectedItemRowForQoute,
  quoteItems,
  isShowChilds,
  setIsShowChilds,
  _renderIconcalculationStatus,
  updateItemStatus,
  isMaterialPurchaseOrder,
}) => {
  console.log("item", item);
  const router = useRouter();
  const { t } = useTranslation();
  const { classes } = useStyle({ headerHeight });
  const [isConfirmation, setIsConfirmation] = useState(null);
  const [isSelected, setIsSelected] = useState(item?.isSelected);

  useEffect(() => {
    setIsSelected(item?.isSelected);
  }, [item?.isSelected]);
  const { getCurrencyUnitText } = useQuoteGetData();

  const handleChangeSelectedItem = (checked, itemId) => {
    setIsSelected(checked);
    onChangeSelectedItemRowForQoute(checked, itemId);
  };

  const { CheckPreferenceValue } = usePrintHousePreferences();
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
    onBlurApproveAmount,
    isUpdateApproveAmount,
    setIsUpdateApproveAmount,
    isUpdatePackagesQuantity,
    setIsUpdatePackagesQuantity,
    onBlurPackagesQuantity,
    onInputChangePackagesQuantity,
    isUpdateQuantityInPackage,
    setIsUpdateQuantityInPackage,
    onBlurQuantityInPackage,
    onInputChangeQuantityInPackage,
  } = useQuoteTable({
    getCalculateQuoteItem,
    getCalculateQuoteConfirmationItem,
    changeDocumentItems,
    item,
    index,
    printHouseId: quoteItems?.printHouseId,
    documentType,
  });

  const { handleItemCheck } = useQuoteConfirmation();
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const isQuote = documentType === DOCUMENT_TYPE.quote;
  const isOrder = documentType === DOCUMENT_TYPE.order;
  const isDeliveryNote =
    documentType === DOCUMENT_TYPE.deliveryNote ||
    documentType === DOCUMENT_TYPE.deliveryNoteRefund;
  const isInvoice =
    documentType === DOCUMENT_TYPE.invoice ||
    documentType === DOCUMENT_TYPE.invoiceRefund;
  const canUpdate = router.query.isNewCreation ? true : item?.isEditable;
  const hasChilds = quoteItems?.documentItems?.some(
    (q) =>
      q.childsDocumentItems && Object.keys(q.childsDocumentItems).length > 0
  );

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
        {!isPrePaymentPage &&
          isQuoteConfirmation &&
          !quoteConfirm?.isConfirmed &&
          quoteConfirm?.documentStatus !== QUOTE_STATUSES.Canceled ? (
          <div style={classes.checkBoxContainer}>
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              checked={item?.isChecked}
              onChange={(checked) => handleItemCheck(checked, item.id)}
            />
            {parentIndex}
          </div>
        ) : (isQuote || isOrder) && !isPrePaymentPage && !isQuoteConfirmation ? (
          <span style={classes.checkBoxContainer}>
            {item?.childsDocumentItems?.length > 0 && (
              <IconButton onClick={() => setIsShowChilds((prev) => !prev)}>
                {isShowChilds ? <ArrowUpWithCircle /> : <ArrowDownWithCircle />}
              </IconButton>
            )}
            {!item?.childsDocumentItems && hasChilds && (
              <div style={{ width: "32px", height: "32px" }} />
            )}
            {
              !isOrder &&
              <Checkbox
                icon={<CheckboxIcon />}
                checkedIcon={
                  <CheckboxCheckedIcon
                    fill={item?.isConfirmedByClient && "green"}
                  />
                }
                checked={isSelected}
                disabled={
                  item?.relatedWorkTypeItemId?.length > 0 ||
                    item?.isConfirmedByClient ||
                    item?.isClosed
                    ? true
                    : false
                }
                onChange={(e) =>
                  handleChangeSelectedItem(e.target.checked, item?.id)
                }
              />
            }

            {parentIndex}
          </span>
        ) : (
          parentIndex
        )}
      </PrimaryTableCell>
      {(isDeliveryNote || isInvoice) && (
        <PrimaryTableCell
          style={{
            width: columnWidths[2],
            ...classes.cellContainerStyle,
            color: "#000000",
            borderBottom: item?.childsDocumentItems && "none",
          }}
        >
          <span style={{ display: "block", color: "#5859A8" }}>
            {item?.sourceDocumentType
              ? `${t(
                `SourceDocument.${ERPDocumentsTypesEnum[item?.sourceDocumentType]
                }`
              )} ${t("general.shortForNum")}`
              : ""}
          </span>
          <span style={{ display: "block" }}>
            {item?.sourceDocumentNumber ? item?.sourceDocumentNumber : ""}
          </span>
        </PrimaryTableCell>
      )}
      {!CheckPreferenceValue(
        EPreferences.HIDE_ITEM_CODE_FROM_DOCUMENT_CART
      ) && (
          <>
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
          </>
        )}
      {CheckPreferenceValue(EPreferences.HIDE_ITEM_CODE_FROM_DOCUMENT_CART) && (
        <>
          <PrimaryTableCell
            style={{
              width: columnWidths[1],
              ...classes.cellContainerStyle,
              color: "#000000",
              borderBottom: item?.childsDocumentItems && "none",
            }}
          >
            {item?.code || item?.productCode || "000"} -{" "}
            {item?.productName === "Delivery"
              ? t("home.tabs.Delivery")
              : item?.productName}
          </PrimaryTableCell>
        </>
      )}
      {quoteItems?.showDetails !== ShowDocumentDetailsEnum.HideDetails && (
        <PrimaryTableCell
          style={{
            width: columnWidths[3],
            textAlign: "start",
            borderBottom: item?.childsDocumentItems && "none",
          }}
        >
          <CharacterDetails
            details={
              quoteItems?.showDetails === ShowDocumentDetailsEnum.All
                ? item?.details
                : item?.workName
            }
            getQuote={getQuote}
            documentItemId={item?.id}
            canUpdate={canUpdate}
            documentType={documentType}
            workName={item?.workName}
            isPrePaymentPage={isPrePaymentPage}
            item={item}
          />
        </PrimaryTableCell>
      )}
      {isMaterialPurchaseOrder && (
        <PrimaryTableCell
          style={{
            width: columnWidths[quoteItems?.showDetails !== ShowDocumentDetailsEnum.HideDetails ? 4 : 3],
            ...classes.cellContainerStyle,
            borderBottom: item?.childsDocumentItems && "none",
          }}
        >
          <div style={classes.cellTextInputStyle}>
            <InputUpdatedValues
              value={item?.packagesQuantity || item?.packageQuantity || (item?.amount ? "1" : "0")}
              onBlur={onBlurPackagesQuantity}
              isUpdate={canUpdate && isUpdatePackagesQuantity && !isPrePaymentPage}
              setIsUpdate={setIsUpdatePackagesQuantity}
              onInputChange={(e) => onInputChangePackagesQuantity(e)}
            />
          </div>
        </PrimaryTableCell>
      )}
      {isMaterialPurchaseOrder && (
        <PrimaryTableCell
          style={{
            width: columnWidths[quoteItems?.showDetails !== ShowDocumentDetailsEnum.HideDetails ? 5 : 4],
            ...classes.cellContainerStyle,
            borderBottom: item?.childsDocumentItems && "none",
          }}
        >
          <div style={classes.cellTextInputStyle}>
            <InputUpdatedValues
              value={item?.quantityInPackage || item?.quantityPerPackage || (item?.amount ? item.amount.toString() : "1")}
              onBlur={onBlurQuantityInPackage}
              isUpdate={canUpdate && isUpdateQuantityInPackage && !isPrePaymentPage}
              setIsUpdate={setIsUpdateQuantityInPackage}
              onInputChange={(e) => onInputChangeQuantityInPackage(e)}
            />
          </div>
        </PrimaryTableCell>
      )}
      <PrimaryTableCell
        style={{
          width: columnWidths[isMaterialPurchaseOrder ? (quoteItems?.showDetails !== ShowDocumentDetailsEnum.HideDetails ? 6 : 5) : 5],
          ...classes.cellContainerStyle,
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >

        <QuoteQuantityCell
          classes={classes}
          item={item}
          isQuoteConfirmation={isQuoteConfirmation}
          quoteItems={quoteItems}
          onBlurApproveAmount={onBlurApproveAmount}
          isUpdateApproveAmount={isUpdateApproveAmount}
          setIsUpdateApproveAmount={setIsUpdateApproveAmount}
          onInputChangeAmount={onInputChangeAmount}
          canUpdatePricesBasedOnType={canUpdate}
          isUpdateAmount={isUpdateAmount}
          setIsUpdateAmount={setIsUpdateAmount}
          onBlurAmount={onBlurAmount}
          isPrePaymentPage={isPrePaymentPage}
          t={t}
        />
      </PrimaryTableCell>
      {isMaterialPurchaseOrder && (
        <PrimaryTableCell
          style={{
            width: columnWidths[isMaterialPurchaseOrder ? (quoteItems?.showDetails !== ShowDocumentDetailsEnum.HideDetails ? 7 : 6) : 6],
            ...classes.cellContainerStyle,
            borderBottom: item?.childsDocumentItems && "none",
          }}
        >
          {item?.unit?.value ||
            (typeof item?.unit === 'string' ? item?.unit : null) ||
            item?.packagesUnit ||
            (item?.stockUnit !== undefined && item?.stockUnit !== null
              ? (typeof item.stockUnit === 'number'
                ? t(`boardMissions.${MaterialStockUnit[item.stockUnit]}`) || MaterialStockUnit[item.stockUnit]
                : item.stockUnit)
              : "")}
        </PrimaryTableCell>
      )}
      {quoteItems?.showPrices !== ShowPricesEnum.HidePrices && (
        <PrimaryTableCell
          style={{
            width: columnWidths[isMaterialPurchaseOrder ? (quoteItems?.showDetails !== ShowDocumentDetailsEnum.HideDetails ? 8 : 7) : 5],
            ...classes.cellContainerStyle,
            borderBottom: item?.childsDocumentItems && "none",
          }}
        >
          <div style={classes.cellTextInputStyle}>
            {item?.calculationStatus === null ||
              item?.calculationStatus === undefined ||
              item?.calculationStatus === ECalculationStatus.Done ? (
              <InputUpdatedValues
                value={item.price}
                onBlur={onBlurPrice}
                isUpdate={canUpdate && isUpdatePrice && !isPrePaymentPage}
                setIsUpdate={
                  isQuoteConfirmation ? setIsConfirmation : setIsUpdatePrice
                }
                onInputChange={(e) => onInputChangePrice(e)}
              />
            ) : (
              "-"
            )}
          </div>
        </PrimaryTableCell>
      )}

      {quoteItems?.showPrices !== ShowPricesEnum.HidePrices && (
        <PrimaryTableCell
          style={{
            width: columnWidths[isMaterialPurchaseOrder ? (quoteItems?.showDetails !== ShowDocumentDetailsEnum.HideDetails ? 9 : 8) : 6],
            ...classes.cellContainerStyle,
            borderBottom: item?.childsDocumentItems && "none",
          }}
        >
          <div style={classes.cellTextInputStyle}>
            {item?.calculationStatus === null ||
              item?.calculationStatus === undefined ||
              item?.calculationStatus === ECalculationStatus.Done ? (
              <InputUpdatedValues
                value={item.discount ? item.discount : "0"}
                onBlur={onBlurDiscount}
                isUpdate={canUpdate && isUpdateDiscount && !isPrePaymentPage}
                setIsUpdate={
                  isQuoteConfirmation ? setIsConfirmation : setIsUpdateDiscount
                }
                onInputChange={(e) => onInputChangeDiscount(e)}
              />
            ) : (
              "-"
            )}
          </div>
        </PrimaryTableCell>
      )}

      {quoteItems?.showPrices !== ShowPricesEnum.HidePrices && (
        <PrimaryTableCell
          style={{
            width: columnWidths[isMaterialPurchaseOrder ? (quoteItems?.showDetails !== ShowDocumentDetailsEnum.HideDetails ? 10 : 9) : 7],
            ...classes.cellContainerStyle,
            borderBottom: item?.childsDocumentItems && "none",
          }}
        >
          <div style={classes.cellTextInputStyle}>
            {quoteItems?.isManager && item?.pricingHistories.length > 0 ? (
              <PriceOfferWidget
                oldPrice={item?.pricingHistories[
                  item?.pricingHistories.length - 1
                ]?.finalPrice.toFixed(2)}
                newPrice={item.finalPrice}
                currency={getCurrencyUnitText(quoteItems?.currency)}
                item={item}
                onBlurFinalPrice={onBlurFinalPrice}
                canUpdatePricesBasedOnType={canUpdate}
                isUpdateFinalPrice={isUpdateFinalPrice}
                isQuoteConfirmation={isQuoteConfirmation}
                setIsConfirmation={setIsConfirmation}
                setIsUpdateFinalPrice={setIsUpdateFinalPrice}
                onInputChangeFinalPrice={onInputChangeFinalPrice}
              />
            ) : (
              <>
                {item?.calculationStatus === null ||
                  item?.calculationStatus === undefined ||
                  item?.calculationStatus === ECalculationStatus.Done ? (
                  <InputUpdatedValues
                    value={item.finalPrice}
                    onBlur={onBlurFinalPrice}
                    isUpdate={canUpdate && isUpdateFinalPrice && !isPrePaymentPage}
                    setIsUpdate={
                      isQuoteConfirmation
                        ? setIsConfirmation
                        : setIsUpdateFinalPrice
                    }
                    onInputChange={(e) => onInputChangeFinalPrice(e)}
                  />
                ) : (
                  _renderIconcalculationStatus(item, updateItemStatus)
                )}
              </>
            )}
          </div>
        </PrimaryTableCell>
      )}

      {!isQuoteConfirmation && (
        <PrimaryTableCell
          style={{
            width: columnWidths[7],
            ...classes.cellContainerStyle,
            borderBottom: item?.childsDocumentItems && "none",
          }}
        >
          {canUpdate && (
            <MoreMenuWidget
              quoteItem={item}
              onClickDuplicateWithDifferentQTY={
                onClickDuplicateWithDifferentQTY
              }
              onClickQuickDuplicate={onClickQuickDuplicate}
              onClickDeleteQouteItem={onClickDeleteQouteItem}
              documentType={documentType}
            />
          )}
        </PrimaryTableCell>
      )}
    </TableRow>
  );
};
export { RowMappingWidget };



