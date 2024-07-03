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
import { GoMakeDeleteModal } from "@/components";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const BusinessNewWidget = ({
  values,
  selectConfirmBusiness,
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
  setClientName
}) => {
  const { classes } = useStyle();
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

  } = useBusinessWidget({ values, documentType });

  useEffect(() => {
    setPurchaseNumber(values?.purchaseNumber);
  }, [values?.purchaseNumber]);

  useEffect(() => {
    setTaxConfirmationNumber(values?.taxConfirmationNumber);
  }, [values?.taxConfirmationNumber]);

  const [openChangeClientModal, setOpenChangeClientModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState({})
  const onClickCloseChangeClientModal = () => {
    setOpenChangeClientModal(false);
  }
  const onClickopenChangeClientModal = (value) => {
    setSelectedClient(value)
    setOpenChangeClientModal(true);

  }
  return (
    <>
      <div style={classes.businessContainerStyle}>
        <AutoCompleteUpdatedValue
          label={t("sales.quote.businessName")}
          value={isQuoteConfirmation ? quoteConfirm?.client?.name : quoteStateValue?.client?.name ? quoteStateValue?.client?.name : t("sales.quote.selectBusinessName")}
          options={mappedCustomers}
          onBlur={onBlurBusinessName}
          isUpdate={canEditDocument && isUpdateBusinessName}
          setIsUpdate={isQuoteConfirmation || isExistReceipt ? setIsConfirmation : setIsUpdateBusinessName}
          getOptionLabel={(item) => item.text}
          onChange={(e, value) => onClickopenChangeClientModal(value)}
          onChangeTextField={checkWhatRenderArray}
        />


        <PermissionCheck userPermission={Permissions.ADD_CLIENT}>
          {(!isQuoteConfirmation && documentType === DOCUMENT_TYPE.quote) && <span style={classes.plusStyle} onClick={() => setOpenCustomerModal(true)}>+</span>}
        </PermissionCheck>
        {
          quoteStateValue?.client?.isOccasional &&
          <InputUpdatedValues
            value={clientName}
            placeholder={clientName ? clientName : t("reports.enterClientName")}
            label={t("reports.clientName")}
            onBlur={onBlurClientName}
            setIsUpdate={setIsUpdateClientName}
            isUpdate={isUpdateClientName}
            onInputChange={(v) => setClientName(v)}
          />
        }
        {!isReceipt && <InputUpdatedValues
          value={purchaseNumber}
          placeholder={purchaseNumber ? purchaseNumber : t("sales.quote.noPurchaseNumber")}
          label={t("sales.quote.purchaseNumber")}
          onBlur={() => onBlurPurchaseNumber(purchaseNumber)}
          isUpdate={canEditDocument && isUpdatePurchaseNumber}
          setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdatePurchaseNumber}
          onInputChange={(v) => setPurchaseNumber(v)}
        />}
        {isInvoice && <InputUpdatedValues
          value={taxConfirmationNumber}
          placeholder={taxConfirmationNumber ? taxConfirmationNumber : t("sales.quote.noTaxConfirmationNumber")}
          label={t("sales.quote.taxConfirmationNumber")}
          onBlur={onBlurTaxNumber}
          isUpdate={canEditDocument && isUpdateTaxNumber}
          setIsUpdate={setIsUpdateTaxNumber}
          onInputChange={(v) => setTaxConfirmationNumber(v)}
        />}
        <InputUpdatedValues
          value={isQuoteConfirmation ? `${quoteConfirm?.client?.code}` : `${quoteStateValue?.client?.code}`}
          label={t("sales.quote.businessCode")}
          onBlur={onBlurBusinessCode}
          setIsUpdate={isQuoteConfirmation ? setIsConfirmation : setIsUpdateBusinessCode}
        />
        {!isQuoteConfirmation && <AutoCompleteUpdatedValue
          label={t("sales.quote.agent")}
          value={selectedAgent?.text ? selectedAgent.text : t("sales.quote.selectAgent")}
          options={agentListValue}
          onBlur={onBlurAgent}
          isUpdate={canEditDocument && isUpdateAgent}
          setIsUpdate={isQuoteConfirmation || isExistReceipt ? setIsConfirmation : setIsUpdateAgent}
          getOptionLabel={(item) => item.text}
          onChange={(e, value) => updateAgent(value)}
        />}
        {values?.documentAddresses?.length > 0 && <InputUpdatedValues
          value={values?.documentAddresses?.length > 0 ? `${values?.documentAddresses[0]?.street} ${values?.documentAddresses[0]?.apartment}, ${values?.documentAddresses[0]?.city}` : "no address found"}
          label={t("customers.modal.address")}
          isUnderLine={true}
          onBlur={onBlurAddress}
          isUpdate={false}
          setIsUpdate={setIsUpdateAddress}
          flag={!isQuoteConfirmation && canEditDocument}
          onClickFlag={() => setOpenModal(true)}
        />}
        {values?.documentAddresses?.length > 0 ?
          ((!isQuoteConfirmation && canEditDocument) && <div
            style={classes.addNewAddressStyle}
            onClick={() => null}
          >
            <MinusIcon />
            <div style={classes.addNewAddressTextStyle} onClick={() => onClickDeleteAddress(values?.documentAddresses[0])}>{t("sales.quote.removeAddress")}</div>
          </div>)
          :
          ((!isQuoteConfirmation && canEditDocument) &&
            <div style={classes.addNewAddressStyle} >
              <PlusNewIcon />
              <div style={classes.addNewAddressTextStyle} onClick={() => setOpenModal(true)} >{t("sales.quote.addAddress")}</div>
            </div>
          )}
        {!isQuoteConfirmation && <AddressModal isUpdate={values?.documentAddresses?.length > 0} documentType={documentType} />}
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
    </>
  );
};

export { BusinessNewWidget };