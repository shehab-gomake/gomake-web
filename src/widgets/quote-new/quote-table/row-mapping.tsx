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
import { DocumentPermission } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";
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
  updateItemStatus
}) => {
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
  } = useQuoteTable({
    getCalculateQuoteItem,
    getCalculateQuoteConfirmationItem,
    changeDocumentItems,
    item,
    index,
    printHouseId: quoteItems?.printHouseId,
    documentType,
  });

  const { CheckDocumentPermission } = useUserPermission();
  const { handleItemCheck } = useQuoteConfirmation();
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const isQuote = documentType === DOCUMENT_TYPE.quote;
  const isDeliveryNote =
    documentType === DOCUMENT_TYPE.deliveryNote ||
    documentType === DOCUMENT_TYPE.deliveryNoteRefund;
  const isInvoice =
    documentType === DOCUMENT_TYPE.invoice ||
    documentType === DOCUMENT_TYPE.invoiceRefund;

  const canUpdate = router.query.isNewCreation ? true : item?.isEditable;
  const canUpdatePrices = router.query.isNewCreation
    ? true
    : item?.isEditable &&
    CheckDocumentPermission(
      documentType,
      DocumentPermission.UPDATE_DOCUMENT_ITEM_PRICES
    );
  const canUpdateDeliveryPrices = router.query.isNewCreation
    ? true
    : item?.isEditable &&
    CheckDocumentPermission(
      documentType,
      DocumentPermission.UPDATE_DOCUMENT_DELIVERY_ITEM_PRICES
    );
  const canUpdatePricesBasedOnType =
    item?.productType === 1 ? canUpdateDeliveryPrices : canUpdatePrices;

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
        ) : isQuote && !isPrePaymentPage && !isQuoteConfirmation ? (
          <span style={classes.checkBoxContainer}>
            {item?.childsDocumentItems?.length > 0 && (
              <IconButton onClick={() => setIsShowChilds((prev) => !prev)}>
                {isShowChilds ? <ArrowUpWithCircle /> : <ArrowDownWithCircle />}
              </IconButton>
            )}
            {!item?.childsDocumentItems && (
              <div style={{ width: "32px", height: "32px" }} />
            )}
            {
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
          />
        </PrimaryTableCell>
      )}
      <PrimaryTableCell
        style={{
          width: columnWidths[5],
          ...classes.cellContainerStyle,
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >
        <div style={classes.cellTextInputStyle}>
          {item?.calculationStatus === null ||
            item?.calculationStatus === undefined ||
            item?.calculationStatus === ECalculationStatus.Done ? (
            isQuoteConfirmation ? (
              <InputUpdatedValues
                value={item?.quantity}
                onBlur={onBlurApproveAmount}
                isUpdate={
                  quoteItems?.isCanUpdateQuantity && isUpdateApproveAmount
                }
                setIsUpdate={setIsUpdateApproveAmount}
                onInputChange={(e) => onInputChangeAmount(e)}
              />
            ) : (
              <InputUpdatedValues
                value={item?.quantity}
                onBlur={onBlurAmount}
                isUpdate={canUpdatePricesBasedOnType && isUpdateAmount}
                setIsUpdate={setIsUpdateAmount}
                onInputChange={(e) => onInputChangeAmount(e)}
              />
            )
          ) : (
            "-"
          )}
        </div>
      </PrimaryTableCell>
      {quoteItems?.showPrices !== ShowPricesEnum.HidePrices && (
        <PrimaryTableCell
          style={{
            width: columnWidths[5],
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
                isUpdate={canUpdatePricesBasedOnType && isUpdatePrice}
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
            width: columnWidths[6],
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
                isUpdate={canUpdatePricesBasedOnType && isUpdateDiscount}
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
            width: columnWidths[7],
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
                canUpdatePricesBasedOnType={canUpdatePricesBasedOnType}
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
                    isUpdate={canUpdatePricesBasedOnType && isUpdateFinalPrice}
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
