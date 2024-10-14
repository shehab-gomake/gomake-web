import { useEffect, useState } from "react";
import { MinusIcon } from "@/icons/minus-icon";
import { PlusNewIcon } from "@/icons";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { AddressModal } from "./address-widget/address-modal";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { useBusinessWidget } from "./use-business-widget";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { isValidCustomer } from "@/utils/helpers";
import { CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { GoMakeDeleteModal, ThreeOptionsModal } from "@/components";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const BusinessNewWidget = ({
  values,
  onBlurPurchaseNumber,
  isUpdatePurchaseNumber,
  setIsUpdatePurchaseNumber,
  onBlurBusinessCode,
  setIsUpdateBusinessCode,
  onBlurAddress,
  isUpdateAddress,
  setIsUpdateAddress,
  selectedAgent,
  agentListValue,
  onBlurAgent,
  isUpdateAgent,
  setIsUpdateAgent,
  updateAgent,
  onChangeSelectBusiness,
  onBlurBusinessName,
  isUpdateBusinessName,
  setIsUpdateBusinessName,
  onClickDeleteAddress,
  documentType,
  isQuoteConfirmation = false,
  onBlurClientName,
  isUpdateClientName,
  setIsUpdateClientName,
  clientName,
  setClientName,
  onBlurTitle,
  isUpdateDocumentTitle,
  setIsUpdateDocumentTitle,
}) => {
  const {
    t,
    setIsConfirmation,
    checkWhatRenderArray,
    setOpenModal,
    purchaseNumber,
    setPurchaseNumber,
    quoteStateValue,
    quoteConfirm,
    isReceipt,
    isExistReceipt,
    taxConfirmationNumber,
    setTaxConfirmationNumber,
    isInvoice,
    isUpdateTaxNumber,
    setIsUpdateTaxNumber,
    onBlurTaxNumber,
    mappedCustomers,
    openCustomerModal,
    setOpenCustomerModal,
    customer,
    setCustomer,
    onCustomerAdd,
    canEditDocument,
    canEditPurchaseNumber,
    setQuoteItemValue,
    onClickOpenChangeClientModal,
    onClickCloseChangeClientModal,
    onClickCloseChangeClientModalFromInvoice,
    openChangeClientModalFromInvoice,
    openChangeClientModal,
    selectedClient,
    manuaLInvoiceNum,
    setManuaLInvoiceNum,
    isUpdateManuaLInvoiceNum,
    setIsUpdateManuaLInvoiceNum,
    onBlurManualInvoiceNum,
    canEditInvoiceNumber,
    isOrder,
    isQuote,
    documentTitle,
    setDocumentTitle,
  } = useBusinessWidget({ values, documentType });
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const { classes } = useStyle({ isRTL });

  useEffect(() => {
    setPurchaseNumber(values?.purchaseNumber);
  }, [values?.purchaseNumber]);

  useEffect(() => {
    setTaxConfirmationNumber(values?.taxConfirmationNumber);
  }, [values?.taxConfirmationNumber]);

  useEffect(() => {
    setManuaLInvoiceNum(values?.manualInvoiceNumber);
  }, [values?.manualInvoiceNumber]);

  useEffect(() => {
    setDocumentTitle(values?.title);
  }, [values?.title]);

  return (
    <>
      <div style={classes.businessContainerStyle}>
        <AutoCompleteUpdatedValue
          label={t("sales.quote.businessName")}
          value={
            isQuoteConfirmation
              ? quoteConfirm?.client?.name
              : quoteStateValue?.client?.name
                ? quoteStateValue?.client?.name
                : t("sales.quote.selectBusinessName")
          }
          options={mappedCustomers}
          onBlur={onBlurBusinessName}
          isUpdate={canEditDocument && isUpdateBusinessName}
          setIsUpdate={
            isQuoteConfirmation || isExistReceipt
              ? setIsConfirmation
              : setIsUpdateBusinessName
          }
          getOptionLabel={(item) => item.text}
          onChange={(e, value) => onClickOpenChangeClientModal(value)}
          onChangeTextField={checkWhatRenderArray}
        />
        <PermissionCheck userPermission={Permissions.ADD_CLIENT}>
          {!isQuoteConfirmation && documentType === DOCUMENT_TYPE.quote && (
            <span
              style={classes.plusStyle}
              onClick={() => setOpenCustomerModal(true)}
            >
              +
            </span>
          )}
        </PermissionCheck>
        {quoteStateValue?.client?.isOccasional && (
          <InputUpdatedValues
            value={clientName}
            placeholder={clientName ? clientName : t("reports.enterClientName")}
            label={t("reports.clientName")}
            onBlur={onBlurClientName}
            setIsUpdate={setIsUpdateClientName}
            isUpdate={isUpdateClientName}
            onInputChange={(v) => setClientName(v)}
          />
        )}
        <InputUpdatedValues
          value={
            isQuoteConfirmation
              ? `${quoteConfirm?.client?.code}`
              : `${quoteStateValue?.client?.code}`
          }
          label={t("sales.quote.businessCode")}
          onBlur={onBlurBusinessCode}
          setIsUpdate={
            isQuoteConfirmation ? setIsConfirmation : setIsUpdateBusinessCode
          }
        />
        {!isQuoteConfirmation && (
          <AutoCompleteUpdatedValue
            label={t("sales.quote.agent")}
            value={
              selectedAgent?.text
                ? selectedAgent.text
                : t("sales.quote.selectAgent")
            }
            options={agentListValue}
            onBlur={onBlurAgent}
            isUpdate={canEditDocument && isUpdateAgent}
            setIsUpdate={
              isQuoteConfirmation || isExistReceipt
                ? setIsConfirmation
                : setIsUpdateAgent
            }
            getOptionLabel={(item) => item.text}
            onChange={(e, value) => updateAgent(value)}
          />
        )}
        {(isOrder || isQuote) && (
          <InputUpdatedValues
            value={documentTitle}
            placeholder={documentTitle ? documentTitle : t("sales.cart.title")}
            label={t("sales.cart.title")}
            onBlur={() => onBlurTitle(documentTitle)}
            isUpdate={canEditDocument && isUpdateDocumentTitle}
            setIsUpdate={
              isQuoteConfirmation ? setIsConfirmation : setIsUpdateDocumentTitle
            }
            onInputChange={(v) => setDocumentTitle(v)}
          />
        )}
        {!isReceipt && (
          <InputUpdatedValues
            value={purchaseNumber}
            placeholder={
              purchaseNumber
                ? purchaseNumber
                : t("sales.quote.noPurchaseNumber")
            }
            label={t("sales.quote.purchaseNumber")}
            onBlur={() => onBlurPurchaseNumber(purchaseNumber)}
            // isUpdate={canEditDocument && isUpdatePurchaseNumber}
            isUpdate={canEditPurchaseNumber && isUpdatePurchaseNumber}
            setIsUpdate={
              isQuoteConfirmation
                ? setIsConfirmation
                : setIsUpdatePurchaseNumber
            }
            onInputChange={(v) => setPurchaseNumber(v)}
          />
        )}
        {isInvoice && (
          <InputUpdatedValues
            value={taxConfirmationNumber}
            placeholder={
              taxConfirmationNumber
                ? taxConfirmationNumber
                : t("sales.quote.noTaxConfirmationNumber")
            }
            label={t("sales.quote.taxConfirmationNumber")}
            onBlur={onBlurTaxNumber}
            isUpdate={canEditDocument && isUpdateTaxNumber}
            setIsUpdate={setIsUpdateTaxNumber}
            onInputChange={(v) => setTaxConfirmationNumber(v)}
          />
        )}
        {isInvoice && (
          <InputUpdatedValues
            value={manuaLInvoiceNum}
            placeholder={
              manuaLInvoiceNum
                ? manuaLInvoiceNum
                : t("sales.cart.noInvoiceNumber")
            }
            label={t("sales.cart.manuaLInvoiceNum")}
            onBlur={() => onBlurManualInvoiceNum(manuaLInvoiceNum)}
            isUpdate={canEditInvoiceNumber && isUpdateManuaLInvoiceNum}
            setIsUpdate={setIsUpdateManuaLInvoiceNum}
            onInputChange={(v) => setManuaLInvoiceNum(v)}
          />
        )}

        {values?.documentAddresses?.length > 0 && (
          <InputUpdatedValues
            value={
              values?.documentAddresses?.length > 0
                ? `${values?.documentAddresses[0]?.street} ${values?.documentAddresses[0]?.apartment}, ${values?.documentAddresses[0]?.city}`
                : "no address found"
            }
            label={t("customers.modal.address")}
            isUnderLine={true}
            onBlur={onBlurAddress}
            isUpdate={false}
            setIsUpdate={setIsUpdateAddress}
            flag={!isQuoteConfirmation && canEditDocument}
            onClickFlag={() => setOpenModal(true)}
          />
        )}
        {values?.documentAddresses?.length > 0
          ? !isQuoteConfirmation &&
          canEditDocument && (
            <div style={classes.addNewAddressStyle} onClick={() => null}>
              <MinusIcon />
              <div
                style={classes.addNewAddressTextStyle}
                onClick={() =>
                  onClickDeleteAddress(values?.documentAddresses[0])
                }
              >
                {t("sales.quote.removeAddress")}
              </div>
            </div>
          )
          : !isQuoteConfirmation &&
          canEditDocument && (
            <div style={classes.addNewAddressStyle}>
              <PlusNewIcon />
              <div
                style={classes.addNewAddressTextStyle}
                onClick={() => setOpenModal(true)}
              >
                {t("sales.quote.addAddress")}
              </div>
            </div>
          )}
        {!isQuoteConfirmation && (
          <AddressModal
            isUpdate={values?.documentAddresses?.length > 0}
            documentType={documentType}
          />
        )}
      </div>
      <CustomerCardWidget
        isValidCustomer={isValidCustomer}
        customerAction={CUSTOMER_ACTIONS.Add}
        codeFlag={false}
        typeClient={"C"}
        onCustomerAdd={onCustomerAdd}
        openModal={openCustomerModal}
        modalTitle={t("customers.modal.addTitle")}
        onClose={() => setOpenCustomerModal(false)}
        showAddButton={true}
        customer={customer}
        setCustomer={setCustomer}
        onChangeSelectBusiness={onChangeSelectBusiness}
        isFromCartPage={true}
      />
      <GoMakeDeleteModal
        icon={
          <WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />
        }
        openModal={openChangeClientModal}
        onClose={onClickCloseChangeClientModal}
        title={t("products.profits.titleChangeClient")}
        subTitle={t("products.profits.subTitleChangeClient")}
        yesBtn={t("sales.quote.yesBtn")}
        onClickDelete={() => onChangeSelectBusiness(selectedClient)}
      />
      <ThreeOptionsModal
        title={t("products.profits.titleChangeClient")}
        subTitle={t("sales.cart.subTitleChangeClientFromInvoice")}
        openModal={openChangeClientModalFromInvoice}
        onClose={onClickCloseChangeClientModalFromInvoice}
        onClickYes={() => onChangeSelectBusiness(selectedClient, values)}
        onClickNo={() => onChangeSelectBusiness(selectedClient)}
        yesBtn={"sales.cart.saveAndChangeClients"}
        noBtn={"sales.cart.startNewInvoice"}
      />
    </>
  );
};

export { BusinessNewWidget };
