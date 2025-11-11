import { useEffect, useState } from "react";
import { MinusIcon } from "@/icons/minus-icon";
import { PlusNewIcon } from "@/icons";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { AddressModal } from "./address-widget/address-modal";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { useBusinessWidget } from "./use-business-widget";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { GoMakeDeleteModal, ThreeOptionsModal } from "@/components";
import { ModalType } from "@/enums";
import { addressTypeState, EAddressType } from "./address-widget/state";
import { ClientChangeSource } from "@/pages-components/quote-new/store/quote";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { useRecoilState } from "recoil";
import { SupplierChangeConfirmationModal } from "@/widgets/quote-new/modals-widgets/supplier-change-confirmation-modal";
import { reCalculateDocumentItemsDataFromRowMaterialsApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { v4 as uuidv4 } from "uuid";

const BusinessNewWidget = ({
  values,
  onBlurPurchaseNumber,
  isUpdatePurchaseNumber,
  setIsUpdatePurchaseNumber,
  checkPurchaseNumber,
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
  clientType,
  AddCustomerModal,
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
    isDeliveryNote,
    isUpdateTaxNumber,
    setIsUpdateTaxNumber,
    onBlurTaxNumber,
    mappedCustomers,
    mappedSuppliers,
    openCustomerModal,
    setOpenCustomerModal,
    customer,
    setCustomer,
    onCustomerAdd,
    canEditDocument,
    canEditAddress,
    canEditPurchaseNumber,
    setQuoteItemValue,
    onClickOpenChangeClientModal,
    onClickCloseChangeClientModal,
    onClickCloseChangeClientModalFromInvoice,
    openChangeClientModalFromInvoice,
    openChangeClientModal,
    openSupplierChangeConfirmationModal,
    onClickCloseSupplierChangeConfirmationModal,
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
    isFetching,
    isPurchaseDocument,
    canUpdateAgent,
    alertFault,
  } = useBusinessWidget({ values, documentType, onChangeSelectBusiness });

  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const { classes } = useStyle({ isRTL });
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [isReCalculating, setIsReCalculating] = useState(false);

  // Handler for option 1: Start new document
  const handleStartNew = () => {
    onChangeSelectBusiness(
      selectedClient,
      ClientChangeSource.SAVE_AND_START_NEW_DOC
    );
    onClickCloseSupplierChangeConfirmationModal();
  };

  // Handler for option 2: Change supplier and recalculate prices
  const handleRecalculatePrice = async () => {
    if (!selectedClient?.id) {
      return;
    }

    // Get printHouseMaterialsIds from document items
    const printHouseMaterialsIds = quoteStateValue?.documentItems
      ?.filter((item) => item.printHouseMaterialId)
      ?.map((item) => item.printHouseMaterialId) || [];

    if (printHouseMaterialsIds.length === 0) {
      alertFaultUpdate();
      onClickCloseSupplierChangeConfirmationModal();
      return;
    }

    setIsReCalculating(true);

    const callBack = async (res) => {
      setIsReCalculating(false);
      if (res?.success && res?.data) {
        // Get the re-calculated items from the response
        // The data is already extracted by getSetApiData, so res.data is the array
        const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);

        if (items.length === 0) {
          alertFaultUpdate();
          return;
        }

        // Transform items to match documentItems format
        const transformedItems = items.map((item: any) => ({
          id: uuidv4(),
          printHouseMaterialId: item.printHouseMaterialId,
          code: item.productCode,
          details: item.details,
          price: item.unitPrice,
          workName: "",
          discount: 0,
          finalPrice: item.finalPrice || item.unitPrice,
          quantity: item.quantity || (item.packagesQuantity * item.quantityInPackage),
          productName: item.productName,
          isSelected: false,
          productType: 0,
          productID: item.productId,
          packagesQuantity: item.packagesQuantity || 0,
          quantityInPackage: item.quantityInPackage || 1,
          ...(item.unit && { unit: item.unit }),
        }));

        // Change the supplier and merge the items
        await onChangeSelectBusiness(
          selectedClient,
          ClientChangeSource.REGULAR_CHANGE,
          {
            documentItems: transformedItems,
          }
        );

        alertSuccessUpdate();
        onClickCloseSupplierChangeConfirmationModal();
      } else {
        alertFaultUpdate();
      }
    };

    await reCalculateDocumentItemsDataFromRowMaterialsApi(
      callApi,
      callBack,
      {
        supplierId: selectedClient.id,
        printHouseMaterialsIds: printHouseMaterialsIds,
      }
    );
  };

  // Handler for option 3: Change supplier and keep items without price change
  const handleKeepItemsWithoutPriceChange = async () => {
    if (!selectedClient?.id) {
      return;
    }

    // Keep existing documentItems as-is, just change the supplier
    await onChangeSelectBusiness(
      selectedClient,
      ClientChangeSource.REGULAR_CHANGE,
      {
        documentItems: quoteStateValue?.documentItems || [],
      }
    );

    alertSuccessUpdate();
    onClickCloseSupplierChangeConfirmationModal();
  };

  // Handler for option 3: Cancel
  const handleCancel = () => {
    onClickCloseSupplierChangeConfirmationModal();
  };

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

  const [selectedAddressType, setSelectedAddressType] =
    useRecoilState<EAddressType>(addressTypeState);

  const openBillingModal = () => {
    if (!values.client) {
      alertFault(
        `home.admin.${clientType === CLIENT_TYPE.CUSTOMER
          ? "pleaseSelectClient"
          : "pleaseSelectSupplier"
        }`
      );
      return;
    }
    setSelectedAddressType(EAddressType.BILLING);
    setOpenModal(true);
  };

  const openDeliveryModal = () => {
    if (!values.client) {
      alertFault(
        `home.admin.${clientType === CLIENT_TYPE.CUSTOMER
          ? "pleaseSelectClient"
          : "pleaseSelectSupplier"
        }`
      );
      return;
    }
    setSelectedAddressType(EAddressType.DELIVERY);
    setOpenModal(true);
  };

  const [immediateSelectedCustomer, setImmediateSelectedCustomer] =
    useState(null);

  // Reset immediateSelectedCustomer when quote state changes (new document created)
  useEffect(() => {
    // If there's no client in the quote state, reset the immediate selection
    if (!quoteStateValue?.client?.name) {
      setImmediateSelectedCustomer(null);
    }
  }, [quoteStateValue?.client?.name]);

  // 2. Update the onChange handler to set the immediate value
  const handleCustomerChange = (e, value) => {
    // Immediately update the UI with the selected customer
    setImmediateSelectedCustomer(value);

    // Then proceed with the original logic
    onClickOpenChangeClientModal(value);
    setIsUpdateBusinessName(null);
  };

  const getDisplayValue = () => {
    // If we have an immediate selection, use it first
    if (immediateSelectedCustomer) {
      return immediateSelectedCustomer.text;
    }

    // Otherwise, use the original logic
    if (isQuoteConfirmation) {
      return quoteConfirm?.client?.name;
    }

    if (quoteStateValue?.client?.name) {
      return quoteStateValue?.client?.name;
    }

    return isPurchaseDocument
      ? t("sales.quote.chooseSupplier")
      : t("sales.quote.selectBusinessName");
  };

  return (
    <>
      <div style={{ ...classes.businessContainerStyle, marginBottom: "10px" }}>
        <ClientAutocomplete
          uiType="updated"
          clientType={
            isPurchaseDocument ? CLIENT_TYPE.SUPPLIER : CLIENT_TYPE.CUSTOMER
          }
          value={getDisplayValue()}
          options={isPurchaseDocument ? mappedSuppliers : mappedCustomers}
          onBlur={onBlurBusinessName}
          isUpdate={canEditDocument && isUpdateBusinessName}
          setIsUpdate={
            isQuoteConfirmation || isExistReceipt
              ? setIsConfirmation
              : setIsUpdateBusinessName
          }
          getOptionLabel={(item) => item.text}
          onChange={handleCustomerChange} // Use the new handler
          onChangeTextField={checkWhatRenderArray}
          isFetching={isFetching}
          onChangeSelectBusiness={onChangeSelectBusiness}
          isFromCartPage={true}
        />
        {/* <ClientAutocomplete
          uiType="updated"
          clientType={
            isPurchaseDocument ? CLIENT_TYPE.SUPPLIER : CLIENT_TYPE.CUSTOMER
          }
          value={
            isQuoteConfirmation
              ? quoteConfirm?.client?.name
              : quoteStateValue?.client?.name
              ? quoteStateValue?.client?.name
              : isPurchaseDocument
              ? t("sales.quote.chooseSupplier")
              : t("sales.quote.selectBusinessName")
          }
          options={isPurchaseDocument ? mappedSuppliers : mappedCustomers}
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
          isFetching={isFetching}
          onChangeSelectBusiness={onChangeSelectBusiness}
          isFromCartPage={true}
        /> */}
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
            onBlur={() => onBlurClientName(clientName)}
            setIsUpdate={setIsUpdateClientName}
            isUpdate={isUpdateClientName}
            onInputChange={(v) => setClientName(v)}
          />
        )}
        {quoteStateValue?.client && (
          <InputUpdatedValues
            value={
              isQuoteConfirmation
                ? `${quoteConfirm?.client?.code}`
                : `${quoteStateValue?.client?.code}`
            }
            label={
              isPurchaseDocument
                ? t("suppliers.supplierCode")
                : t("sales.quote.businessCode")
            }
            onBlur={onBlurBusinessCode}
            setIsUpdate={
              isQuoteConfirmation ? setIsConfirmation : setIsUpdateBusinessCode
            }
          />
        )}
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
            isUpdate={canUpdateAgent && isUpdateAgent}
            setIsUpdate={
              isQuoteConfirmation || isExistReceipt
                ? setIsConfirmation
                : setIsUpdateAgent
            }
            getOptionLabel={(item) => item.text}
            onChange={(e, value) => updateAgent(value)}
            showClearIcon={!!selectedAgent?.value}
          />
        )}
        {(isOrder || isQuote || isDeliveryNote || isInvoice) && (
          <InputUpdatedValues
            value={documentTitle}
            placeholder={documentTitle ? documentTitle : t("sales.cart.title")}
            label={t("sales.cart.title")}
            onBlur={() => onBlurTitle(documentTitle)}
            isUpdate={isUpdateDocumentTitle}
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
                : documentType === DOCUMENT_TYPE.purchaseInvoice ||
                  documentType === DOCUMENT_TYPE.purchaseInvoiceRefund
                  ? t("sales.cart.noInvoiceNumber")
                  : t("sales.quote.noPurchaseNumber")
            }
            label={
              documentType === DOCUMENT_TYPE.purchaseInvoice ||
                documentType === DOCUMENT_TYPE.purchaseInvoiceRefund
                ? t("sales.quote.invoiceNumber")
                : t("sales.quote.purchaseNumber")
            }
            onBlur={() => onBlurPurchaseNumber(purchaseNumber)}
            isUpdate={canEditPurchaseNumber && isUpdatePurchaseNumber}
            setIsUpdate={
              isQuoteConfirmation
                ? setIsConfirmation
                : setIsUpdatePurchaseNumber
            }
            onInputChange={(v) => {
              setPurchaseNumber(v);
              if (checkPurchaseNumber) {
                checkPurchaseNumber(v);
              }
            }}
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
        {/* Delivery Address Input */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {values?.documentDeliveryAddresses?.length > 0 && (
            <InputUpdatedValues
              specialStyle={{ fontWeight: "500px" }}
              value={
                values?.documentDeliveryAddresses?.length > 0
                  ? (() => {
                    const addressParts = [
                      values?.documentDeliveryAddresses[0]?.city &&
                      `${t("customers.modal.city")}: ${values?.documentDeliveryAddresses[0]?.city
                      }`,
                      values?.documentDeliveryAddresses[0]?.street &&
                      `${t("customers.modal.street")}: ${values?.documentDeliveryAddresses[0]?.street
                      }`,
                      values?.documentDeliveryAddresses[0]?.entry &&
                      `${t("customers.modal.entrance")}: ${values?.documentDeliveryAddresses[0]?.entry
                      }`,
                      values?.documentDeliveryAddresses[0]?.apartment &&
                      `${t("customers.modal.apartment")}: ${values?.documentDeliveryAddresses[0]?.apartment
                      }`,
                      values?.documentDeliveryAddresses[0]?.floor &&
                      `${t("customers.modal.floor")}: ${values?.documentDeliveryAddresses[0]?.floor
                      }`,
                      values?.documentDeliveryAddresses[0]?.zipCode &&
                      `${t("customers.modal.zipCode")}: ${values?.documentDeliveryAddresses[0]?.zipCode
                      }`,
                      values?.documentDeliveryAddresses[0]?.postbox &&
                      `${t("customers.modal.po")}: ${values?.documentDeliveryAddresses[0]?.postbox
                      }`,
                    ].filter(Boolean);

                    return addressParts.length > 0
                      ? addressParts.join(" | ")
                      : t("sales.cart.noAddressFound");
                  })()
                  : t("sales.cart.noAddressFound")
              }
              label={t("sales.cart.deliveryAddress")}
              isUnderLine={true}
              onBlur={onBlurAddress}
              isUpdate={false}
              setIsUpdate={setIsUpdateAddress}
              flag={!isQuoteConfirmation && canEditAddress}
              onClickFlag={openDeliveryModal}
            />
          )}
          {values?.documentDeliveryAddresses?.length > 0
            ? !isQuoteConfirmation &&
            canEditDocument && (
              <div style={classes.addNewAddressStyle}>
                <MinusIcon />
                <div
                  style={classes.addNewAddressTextStyle}
                  onClick={() =>
                    onClickDeleteAddress(values?.documentDeliveryAddresses[0])
                  }
                >
                  {t("sales.cart.removerDeliveryAddress")}
                </div>
              </div>
            )
            : !isQuoteConfirmation &&
            canEditAddress && (
              <div style={classes.addNewAddressStyle}>
                <PlusNewIcon />
                <div
                  style={classes.addNewAddressTextStyle}
                  onClick={openDeliveryModal}
                >
                  {t("sales.cart.addDeliveryAddress")}
                </div>
              </div>
            )}
        </div>
        {/* Billing Address Input */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {values?.documentBillingAddresses?.length > 0 && (
            <InputUpdatedValues
              value={
                values?.documentBillingAddresses?.length > 0
                  ? (() => {
                    const addressParts = [
                      values?.documentBillingAddresses[0]?.city &&
                      `${t("customers.modal.city")}: ${values?.documentBillingAddresses[0]?.city
                      }`,
                      values?.documentBillingAddresses[0]?.street &&
                      `${t("customers.modal.street")}: ${values?.documentBillingAddresses[0]?.street
                      }`,
                      values?.documentBillingAddresses[0]?.entry &&
                      `${t("customers.modal.entrance")}: ${values?.documentBillingAddresses[0]?.entry
                      }`,
                      values?.documentBillingAddresses[0]?.apartment &&
                      `${t("customers.modal.apartment")}: ${values?.documentBillingAddresses[0]?.apartment
                      }`,
                      values?.documentBillingAddresses[0]?.floor &&
                      `${t("customers.modal.floor")}: ${values?.documentBillingAddresses[0]?.floor
                      }`,
                      values?.documentBillingAddresses[0]?.zipCode &&
                      `${t("customers.modal.zipCode")}: ${values?.documentBillingAddresses[0]?.zipCode
                      }`,
                      values?.documentBillingAddresses[0]?.postbox &&
                      `${t("customers.modal.po")}: ${values?.documentBillingAddresses[0]?.postbox
                      }`,
                    ].filter(Boolean);

                    return addressParts.length > 0
                      ? addressParts.join(" | ")
                      : t("sales.cart.noAddressFound");
                  })()
                  : t("sales.cart.noAddressFound")
              }
              label={t("sales.cart.billingAddress")}
              isUnderLine={true}
              onBlur={onBlurAddress}
              isUpdate={false}
              setIsUpdate={setIsUpdateAddress}
              flag={!isQuoteConfirmation && canEditAddress}
              onClickFlag={openBillingModal}
            />
          )}
          {values?.documentBillingAddresses?.length > 0
            ? !isQuoteConfirmation &&
            canEditDocument && (
              <div style={classes.addNewAddressStyle}>
                <MinusIcon />
                <div
                  style={classes.addNewAddressTextStyle}
                  onClick={() =>
                    onClickDeleteAddress(values?.documentBillingAddresses[0])
                  }
                >
                  {t("sales.cart.removeBillingAddress")}
                </div>
              </div>
            )
            : !isQuoteConfirmation &&
            canEditAddress && (
              <div style={classes.addNewAddressStyle}>
                <PlusNewIcon />
                <div
                  style={classes.addNewAddressTextStyle}
                  onClick={openBillingModal}
                >
                  {t("sales.cart.addBillingAddress")}
                </div>
              </div>
            )}
        </div>
      </div>
      {!isQuoteConfirmation && (
        <AddressModal
          addressType={selectedAddressType}
          isUpdate={
            selectedAddressType === EAddressType.BILLING
              ? values?.documentBillingAddresses?.length > 0
              : values?.documentDeliveryAddresses?.length > 0
          }
          documentType={documentType}
        />
      )}
      <CustomerCardWidget
        key={`add-customer-card-1`}
        customerAction={CUSTOMER_ACTIONS.Add}
        typeClient={CLIENT_TYPE.CUSTOMER}
        codeFlag={false}
        onCustomerAdd={onCustomerAdd}
        openModal={openCustomerModal}
        onClose={() => setOpenCustomerModal(false)}
        customer={customer}
        setCustomer={setCustomer}
        onChangeSelectBusiness={onChangeSelectBusiness}
        isFromCartPage={true}
      />
      <CustomerCardWidget
        key={`add-customer-card-2`}
        customerAction={CUSTOMER_ACTIONS.Add}
        typeClient={CLIENT_TYPE.CUSTOMER}
        codeFlag={false}
        onCustomerAdd={onCustomerAdd}
        openModal={AddCustomerModal.isOpen}
        onClose={AddCustomerModal.close}
        customer={customer}
        setCustomer={setCustomer}
        onChangeSelectBusiness={onChangeSelectBusiness}
        isFromCartPage={true}
      />

      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        openModal={openChangeClientModal}
        onClose={onClickCloseChangeClientModal}
        title={t(
          `products.profits.${isPurchaseDocument ? "titleChangeSupplier" : "titleChangeClient"
          }`
        )}
        subTitle={t(
          `products.profits.${isPurchaseDocument
            ? "subTitleChangeSupplier"
            : "subTitleChangeClient"
          }`
        )}
        yesBtn={t("sales.quote.yesBtn")}
        onClickDelete={() => onChangeSelectBusiness(selectedClient)}
      />
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t(
          `products.profits.${isPurchaseDocument ? "titleChangeSupplier" : "titleChangeClient"
          }`
        )}
        subTitle={t(`sales.cart.subTitleChangeClientFromInvoice`)}
        openModal={openChangeClientModalFromInvoice}
        onClose={onClickCloseChangeClientModalFromInvoice}
        onClickYes={() =>
          onChangeSelectBusiness(
            selectedClient,
            ClientChangeSource.SAVE_AND_CHANGE_CLIENT,
            values
          )
        }
        onClickNo={() =>
          onChangeSelectBusiness(
            selectedClient,
            ClientChangeSource.SAVE_AND_START_NEW_DOC
          )
        }
        yesBtn={`sales.cart.${isPurchaseDocument ? "saveAndChangeSupplier" : "saveAndChangeClients"
          }`}
        noBtn={"sales.cart.startNewInvoice"}
      />
      <SupplierChangeConfirmationModal
        open={openSupplierChangeConfirmationModal}
        onClose={handleCancel}
        onStartNew={handleStartNew}
        onRecalculatePrice={handleRecalculatePrice}
        onKeepItemsWithoutPriceChange={handleKeepItemsWithoutPriceChange}
      />
    </>
  );
};

export { BusinessNewWidget };
