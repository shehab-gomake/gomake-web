import { useRecoilState, useRecoilValue } from "recoil";
import { DuplicateItemModal } from "@/widgets/quote-new/modals-widgets/duplicate-item-modal";
import { AddNewItemModal } from "@/widgets/quote-new/modals-widgets/add-new-item-modal";
import { ButtonsContainer } from "@/widgets/quote-new/buttons-container";
import { BusinessNewWidget } from "@/widgets/quote-new/business-widget";
import { ContactNewWidget } from "@/widgets/quote-new/contact-widget";
import { QuoteForPriceTable } from "@/widgets/quote-new/quote-table";
import { WriteCommentComp } from "@/widgets/quote-new/write-comment";
import {
  GoMakeAlertModal,
  GoMakeAutoComplate,
  GoMakeDeleteModal,
} from "@/components";
import { HeaderTitle } from "@/widgets";
import { ArrowDownNewIcon, BudgetIcon, SettingNewIcon } from "@/icons";
import { useQuoteNew } from "./use-quote";
import { quoteConfirmationState, quoteItemState } from "@/store";
import { useStyle } from "./style";
import { CancelBtnMenu } from "@/widgets/quote-new/cancel-btn-menu";
import { SendBtnMenu } from "@/widgets/quote-new/send-btn-menu";
import { _renderQuoteStatus } from "@/utils/constants";
import { IconButton, Skeleton } from "@mui/material";
import { SettingQuoteMenu } from "@/widgets/quote-new/setting-quote-menu";
import { AddDeliveryModal } from "@/widgets/quote-new/modals-widgets/add-delivery-modal/add-delivery-modal";
import { DOCUMENT_TYPE, QUOTE_STATUSES } from "../quotes/enums";
import { ButtonsConfirmContainer } from "@/widgets/quote-new/buttons-cofirm-container";
import { CopyFromOrderModal } from "@/widgets/quote-new/modals-widgets/copy-from-order-modal/copy-from-order-modal";
import { ReceiptsTable } from "@/widgets/quote-new/receipts-table";
import { useRouter } from "next/router";
import { usePaymentsTable } from "@/widgets/quote-new/receipts-table/use-payments-table";
import { useEffect, useState } from "react";
import { StepType } from "@reactour/tour";
import { useGoMakeTour } from "@/hooks/use-go-make-tour";
import { OtherReasonModal } from "@/widgets/quote-new/total-price-and-vat/other-reason-modal";
import { QuoteStatuses } from "@/widgets/quote-new/total-price-and-vat/enums";
import { fetchTaxesAuthority, LoginTaxesUrl } from "@/utils/taxes-authority";
import { printHouseProfile } from "@/store/print-house-profile";
import { WhatsAppWebModal } from "@/widgets/quote-new/modals-widgets/whats-app-web-modal";
import { AddNewContactModal } from "@/widgets/quote-new/modals-widgets/add-new-contact-modal";
import { NewItemNotesModal } from "@/widgets/quote-new/total-price-and-vat/new-item-notes-modal";
import { AddRelatedDocumentsModal } from "@/widgets/quote-new/total-price-and-vat/add-related-documents";
import { ViewSignatureApprovalModal } from "@/widgets/quote-new/total-price-and-vat/view-signature-approval-modal";
import { CreditCardPaySection } from "@/widgets/quote-confirmation-mobile/components/credit-card-pay-section";
import moment from "moment";
import { QuoteNewPageSkeletonWidget } from "./quote-skeleton";
import { InvoiceCreationModal } from "@/widgets/quote-new/invoice-creation-modal";
import { useQuoteGetData } from "./use-quote-get-data";
import { FONT_FAMILY } from "@/utils/font-family";
import { DateField } from "@/components/date-picker/date-filed";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ModalType } from "@/enums";
import { DuplicateQuickModal } from "@/widgets/quote-new/modals-widgets/duplicate-quick-modal";
import Stack from "@mui/material/Stack";
import { ClientBalanceComponent } from "@/components/client-balance/client-balance";
import { PrimaryCheckbox } from "@/components/check-box/primary-check-box";
import { SettingVatListMenu } from "@/widgets/quote-new/setting-vat-menu";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { UpdateDeliveryPriceModal } from "@/widgets/quote-new/modals-widgets/update-delivery-price-modal/update-delivery-price-modal";
import { useModal } from "@/hooks/use-modal";
import { AddAttachmentsModal } from "@/widgets/quote-new/modals-widgets/add-attachments-modal/add-attachments-modal";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { convertUtcToLocalIsoString } from "@/components/date-time/date-time-component";
import CloseOrderNote from "../quotes/widgets/general/close-order-note";
import { SettingMenuIcon } from "@/icons/setting-menu ";
import {useQuotesSocketIo} from "@/hooks/socket-io/use-quotes-socket-io";
import {useOrdersSocketIo} from "@/hooks/socket-io/use-orders-socket-io";

interface IProps {
  documentType: DOCUMENT_TYPE;
  isQuoteConfirmation?: boolean;
  isPrePaymentPage?: boolean;
}

const QuoteNewPageWidget = ({
  documentType,
  isQuoteConfirmation = false,
  isPrePaymentPage,
}: IProps) => {
  const { classes } = useStyle(isQuoteConfirmation);

  const router = useRouter();
  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);

  useEffect(() => {
    setQuoteItemValue({});
  }, []);

  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const printHouseProfileState = useRecoilValue<any>(printHouseProfile);
  const quoteState = isQuoteConfirmation ? quoteConfirm : quoteItemValue;
  const { resetReceiptState } = usePaymentsTable();
  const { getCurrencyUnitText } = useQuoteGetData();
  const [docNumber, setDocNumber] = useState(quoteState?.number);
  const {
    selectDate,
    taxDateRef,
    creationDateRef,
    creationDate,
    taxDate,
    isUpdateBusinessName,
    isUpdatePurchaseNumber,
    isUpdateAddress,
    selectedAgent,
    agentListValue,
    isUpdateAgent,
    isDisplayWidget,
    clientContactsValue,
    items,
    displayedItems,
    isUpdateContactEmail,
    isUpdateContactMobile,
    selectedContactById,
    openDeleteModalContact,
    selectedContact,
    openAddNewItemModal,
    openDuplicateWithDifferentQTYModal,
    openDeleteItemModal,
    documentItems,
    tableHeaders,
    columnWidths,
    headerHeight,
    quoteItems,
    dateRef,
    anchorElCancelBtn,
    anchorElSendBtn,
    openSendBtn,
    openCancelBtn,
    openOtherReasonModal,
    openIrrelevantCancelModal,
    openPriceCancelModal,
    openDeliveryTimeCancelModal,
    anchorElSettingMenu,
    openSettingMenu,
    anchorElSettingMenuForVat,
    openNewSttingMenuForVat,
    handleSettingMenuClick,
    handleSettingMenuClose,
    handleSettingMenuClickForVat,
    handleSettingMenuCloseForVat,
    onClickClosePriceModal,
    onClickOpenDeliveryTimeModal,
    onClickOpenPriceModal,
    onClickOpenIrrelevantModal,
    onClickCloseModal,
    onClickOpenModal,
    onClickCloseDeliveryTimeModal,
    onClickCloseIrrelevantModal,
    handleCancelBtnClick,
    handleCancelBtnClose,
    handleSendBtnClick,
    handleSendBtnClose,
    changeDocumentItems,
    changeQuoteItems,
    changeDocumentItemsChild,
    getCalculateQuote,
    onCloseDeleteItemModal,
    deleteQuoteItem,
    onCloseDuplicateWithDifferentQTY,
    setAmountValue,
    onOpenNewItem,
    onCloseNewItem,
    setSelectDate,
    setTaxDate,
    setIsUpdateBusinessName,
    openCopyFromOrderModal,
    onCloseCopyFromOrder,
    onOpenCopyFromOrder,
    setIsUpdateAddress,
    setIsUpdatePurchaseNumber,
    setIsUpdateBusinessCode,
    onBlurBusinessName,
    onBlurPurchaseNumber,
    onBlurBusinessCode,
    onBlurAddress,
    onBlurAgent,
    setIsUpdateAgent,
    updateAgent,
    t,
    handleShowLess,
    setIsDisplayWidget,
    onOpenDeleteModalContact,
    changeItems,
    updateClientContact,
    setIsUpdateContactName,
    setIsUpdateContactMobile,
    setIsUpdateContactEmail,
    handleShowMore,
    setSelectedContactById,
    onInputChangePhone,
    onInputChangeMail,
    onClickAddNewContact,
    onCloseDeleteModalContact,
    onClickDeleteContact,
    onBlurContactMobile,
    onBlurContactName,
    onBlurContactEmail,
    getCalculateQuoteItem,
    getCalculateQuoteConfirmationItem,
    onClickDuplicateWithDifferentQTY,
    duplicateQuoteItemWithAnotherQuantity,
    onClickDeleteQouteItem,
    setActiveClickAway,
    setReasonText,
    onClickCancelOffer,
    updateCancelQuote,
    onClickSendQuoteToClient,
    onClickSendReceiptToClient,
    onChangeSelectBusiness,
    onClickDeleteAddress,
    onOpenDeliveryModal,
    openAddDeliveryModal,
    onCloseDeliveryModal,
    openUpdateDeliveryModal,
    onOpenUpdateDeliveryModal,
    onCloseUpdateDeliveryModal,
    onAddDelivery,
    handleSaveBtnClick,
    handleRejectBtnClick,
    handleAcceptBtnClick,
    documentTitle,
    onBlurExchangeRate,
    setIsUpdateExchangeRate,
    isUpdateExchangeRate,
    onBlurCurrency,
    setIsUpdateCurrency,
    isUpdateCurrency,
    setIsUpdateVatStatus,
    onBlurVatStatus,
    isUpdateVatStatus,
    updateCurrency,
    updateVatStatus,
    refreshExchangeRate,
    getQuote,
    handleSaveBtnClickForDocument,
    getAllClientContacts,
    copyFromDocumentType,
    openLoginModal,
    onClickClosLoginModal,
    onClickOpenLoginModal,
    openWhatsAppModal,
    onClickOpenWhatsAppModal,
    onClickCloseWhatsAppModal,
    sortDocumentItems,
    updateDiscountType,
    updateDocumentPreference,
    getWhatsAppMessage,
    getWhatsAppMessageForReceipt,
    whatsappMassage,
    openAddNewContactModal,
    onCloseNewContact,
    onOpenNewContact,
    onChangeSelectedItemRowForQoute,
    openNewItemNotesModal,
    onClickCloseNewItemNotesModal,
    onClickOpenRelatedDocumentsModal,
    onClickCloseRelatedDocumentsModal,
    openRelatedDocumentsModal,
    openSignatureApprovalModal,
    onClickCloseSignatureApprovalModal,
    onClickOpenSignatureApprovalModal,
    onBlurClientName,
    isUpdateClientName,
    setIsUpdateClientName,
    clientName,
    setClientName,
    onClickOpenNewItemNotesModal,
    setActiveClickAwayForTaxDate,
    openReferenceModal,
    onClickCloseReferenceModal,
    onChangeDatesToCreationDate,
    onClickOpenReferenceModal,
    setNewCreationDate,
    openInvoiceCreationModal,
    onClickCloseInvoiceCreation,
    onBlurTitle,
    isUpdateDocumentTitle,
    setIsUpdateDocumentTitle,
    isShowSettingIcon,
    showVatListInSettingIconNew,
    isInvoice,
    isDeliveryNote,
    onClickOpenChangeProductionStatusModal,
    openChangeProductionStatusModal,
    onClickCloseChangeProductionStatusModal,
    selectedDocument,
    isSelectedCLoseAsDeliveryNote,
    allClientActiveBudgets,
    moveOrderToReady,
    navigate,
    updateDocumentBudget,
    selectedBudget,
    setSelectedBudget,
    onCloseQuickDuplicate,
    onClickQuickDuplicate,
    openQuickDuplicateModal,
    quoteItemId,
    quoteItem,
    handleSendUsingWhatsAppWeb,
    isOrder,
    isQuote,
    confirmCreateDocument,
    onClickConfirmCreateDocument,
    onClickCloseConfirmCreateDocument,
    isReceipt,
    isMoveToReady,
    handleCheckboxChange,
    isPurchaseDocument,
    isOpenRelatedDocuments,
    setIsOpenRelatedDocuments,
    isPurchaseInvoice,
    systemVAT,
    isAddQuantity,
    openAddAttachmentsModal,
    onOpenAddAttachmentsModal,
    onCloseAddAttachmentsModal,
    onClickOpenDeleteDeliveryModal,
    onClickCloseDeleteDeliveryModal,
    onClickDeleteDelivery,
    openDeleteDeliveryModal,
    contactsListRef,
    alertNotVerifiedMail,
    alertNotVerifiedModalState,
    AddCustomerModal,
    handleSaveDraftBtnClick,
    alertExistPurchaseNumber,
    pendingPurchaseNumber,
    setPendingPurchaseNumber,
    originalPurchaseNumber,
    updatePurchaseNumber,
    modalCallback,
    openReceiptModal,
    receiptSendModal,
  } = useQuoteNew({
    docType: documentType,
    isQuoteConfirmation: isQuoteConfirmation,
    isPrePaymentPage: isPrePaymentPage,
  });
  if (documentType == DOCUMENT_TYPE.quote) {
    const { } = useQuotesSocketIo({ getQuote });
  }
  if (documentType == DOCUMENT_TYPE.order) {
    const { } = useOrdersSocketIo({ getQuote });
  }

  const dir: "rtl" | "ltr" = t("direction");

  const handleChangeCreationDate = (newDate) => {
    const currentCreationDate = creationDate
      ? moment(creationDate).format("YYYY-MM-DD")
      : "";

    if (newDate !== currentCreationDate) {
      setNewCreationDate(newDate);
      onClickOpenReferenceModal();
    }
  };

  useEffect(() => {
    if (quoteState?.budgetId) {
      const budget = allClientActiveBudgets.find(
        (budget) => budget.id === quoteState.budgetId
      );
      setSelectedBudget(budget);
    }
  }, [quoteState, allClientActiveBudgets]);

  const quoteSteps: StepType[] = [
    {
      selector: '[data-tour="quoteStep1"]',
      content:
        "Here is the quote. You can:\n" +
        "Add contacts\n" +
        "Add address\n" +
        "Change client\n" +
        "change languge and more",
      position: "center",
    },
    {
      selector: '[data-tour="quoteStep2"]',
      content:
        "With this bar, you can:\n" +
        "Add items\n" +
        "Send and save the quote\n" +
        "Transfer the quote to an order, and more",
      position: "top",
    },
    {
      selector: '[data-tour="menu-materials"]',
      content:
        "And now, it's time to explore all the settings.\n" +
        'Press "Materials"\n' +
        "to discover how you can control your materials.",
      position: "top",
      styles: {
        maskWrapper: (props) => ({ ...props, zIndex: 1000000 }),
        popover: (props) => ({ ...props, zIndex: 1000000 }),
      },
    },
  ];

  const {} = useGoMakeTour(quoteSteps, []);

  const theme = createTheme({
    direction: dir, // Ensure the theme is in RTL mode
  });

  useEffect(() => {
    if (isInvoice) {
      const fetchTaxesData = async () => {
        try {
          const taxesData = await fetchTaxesAuthority(
            printHouseProfileState?.business_ID
          );
          if (taxesData?.statusCode === 404) {
            onClickOpenLoginModal();
          }
        } catch (error) {
          console.error("Error fetching taxes data:", error);
        }
      };
      fetchTaxesData();
    }
  }, []);

  useEffect(() => {
    if (isReceipt) resetReceiptState();
  }, []);

  useEffect(() => {
    setDocNumber(quoteState?.number);
  }, [quoteState?.number, router, quoteState, isQuoteConfirmation]);

  const alertModal = useModal();

  useEffect(() => {
    if (!router.isReady) return;

    if (quoteState?.id) {
      const isNewCreation = router.query.isNewCreation === "true";
      const isCorrectPage =
        router.pathname === "/invoice" || router.pathname === "/deliveryNote";
      const isVATMismatch = Math.abs(systemVAT - quoteState?.vat) > 0.001;

      if (isNewCreation && isCorrectPage && isVATMismatch) {
        alertModal.open();
      }
    }
  }, [router.isReady, router.query, quoteState]);

  return (
    <>
      {quoteState?.id ? (
        <div data-tour={"quoteStep1"} style={classes.mainContainer}>
          <div style={classes.secondContainer}>
            <div style={{ paddingLeft: 20, paddingRight: 12 }}>
              <div style={classes.titleSettingContainer}>
                <div style={classes.titleQuateContainer}>
                  <HeaderTitle
                    title={
                      router?.query?.isNewCreation
                        ? `${t(
                            "properties.create"
                          )} ${documentTitle.toLowerCase()}`
                        : documentTitle
                    }
                    marginBottom={1}
                    marginTop={1}
                    color="rgba(241, 53, 163, 1)"
                  />
                  {!router?.query?.isNewCreation && (
                    <div style={classes.quoteNumberStyle}>
                      {" - "} {docNumber}
                    </div>
                  )}
                </div>
                {!isQuoteConfirmation && (
                  <div style={classes.settingsStatusContainer}>
                    {(documentType === DOCUMENT_TYPE.quote ||
                      documentType === DOCUMENT_TYPE.order ||
                      documentType === DOCUMENT_TYPE.deliveryNote) &&
                      allClientActiveBudgets.length !== 0 && (
                        <GoMakeAutoComplate
                          startIcon={<BudgetIcon width={20} height={20} />}
                          arrowIcon={<ArrowDownNewIcon color="#344054" />}
                          options={allClientActiveBudgets}
                          style={classes.budgetList}
                          placeholder={t("sales.quote.budget")}
                          getOptionLabel={(option) =>
                            `${option.name} - ${option.amount}`
                          }
                          withArrow={true}
                          key={selectedBudget?.id}
                          value={selectedBudget}
                          onChange={(e, value) => {
                            if (value) {
                              updateDocumentBudget(value);
                            }
                          }}
                          renderOption={(props: any, option: any) => (
                            <div
                              {...props}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: 10,
                                cursor: "pointer",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  ...FONT_FAMILY.Lexend(600, 14),
                                }}
                              >
                                <BudgetIcon width={16} height={16} />
                                {option.name}
                              </div>
                              <div style={{ ...FONT_FAMILY.Lexend(600, 14) }}>
                                {option.amount}
                                {getCurrencyUnitText(quoteItemValue?.currency)}
                              </div>
                            </div>
                          )}
                        />
                      )}
                    <>
                      {quoteItemValue?.signImageUrl &&
                      quoteItemValue?.signerName ? (
                        <div
                          style={classes.signatureApproval}
                          onClick={onClickOpenSignatureApprovalModal}
                        >
                          Signature approval
                        </div>
                      ) : (
                        <>
                          {!router?.query?.isNewCreation && (
                            <div style={classes.quoteStatusContainer}>
                              {_renderQuoteStatus(
                                quoteState?.documentStatus,
                                quoteState,
                                t
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </>

                    {isShowSettingIcon && (
                      <IconButton
                        style={{ marginRight: 4 }}
                        onClick={handleSettingMenuClick}
                      >
                        <SettingMenuIcon />
                      </IconButton>
                    )}
                    {showVatListInSettingIconNew && (
                      <IconButton
                        style={{ marginRight: 4 }}
                        onClick={handleSettingMenuClickForVat}
                      >
                        <SettingMenuIcon />
                      </IconButton>
                    )}
                  </div>
                )}
              </div>
              {isPrePaymentPage ? (
                <div style={classes.firstBorder} />
              ) : (
                <div style={classes.datesContainer}>
                  {!isQuoteConfirmation && quoteState?.createdBy && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div style={classes.createdByContainer}>
                        {t("sales.quote.createBy")}
                      </div>
                      <div style={classes.createdByContainer}>
                        {quoteState?.createdBy}
                      </div>
                    </div>
                  )}
                  <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <LocalizationProvider
                      dateAdapter={AdapterMoment}
                      adapterLocale="en-gb"
                    >
                      <DateField
                        label={t("sales.quote.creationDate")}
                        date={creationDate}
                        handleChange={handleChangeCreationDate}
                        isEditable={
                          (isInvoice || isPurchaseInvoice) &&
                          quoteItemValue?.isEditable
                        }
                        inputRef={creationDateRef}
                        // preventOpenCondition={!quoteState.client}
                      />
                      {documentType !== DOCUMENT_TYPE.purchaseOrder &&
                        (isQuote && !selectDate ? (
                          <Skeleton variant="text" width={200} height={40} />
                        ) : (
                          <DateField
                            label={
                              isOrder || isQuote
                                ? t("sales.quote.deliveryDate")
                                : t("sales.quote.dateOfReference")
                            }
                            date={convertUtcToLocalIsoString(selectDate)}
                            handleChange={(newDate) => {
                              let mom = moment(newDate);
                              let formattedDueDate = mom
                                .utc()
                                .format("YYYY-MM-DD HH:mm:ss");
                              setSelectDate(formattedDueDate);
                              setActiveClickAway(true);
                            }}
                            isEditable={quoteItemValue?.isEditable}
                            inputRef={dateRef}
                            // preventOpenCondition={!quoteState.client}
                            withTime={isOrder || isQuote}
                          />
                        ))}

                      {isInvoice && (
                        <DateField
                          label={t("sales.quote.taxDate")}
                          date={taxDate}
                          handleChange={(newDate) => {
                            setTaxDate(newDate);
                            setActiveClickAwayForTaxDate(true);
                          }}
                          isEditable={quoteItemValue?.isEditable}
                          inputRef={taxDateRef}
                          // preventOpenCondition={!quoteState.client}
                        />
                      )}
                    </LocalizationProvider>
                  </ThemeProvider>
                  <Stack flex={1} direction={"row"} justifyContent={"flex-end"}>
                    <ClientBalanceComponent
                      clientBalance={quoteState.clientBalance}
                      clientId={quoteState?.client?.id}
                      clientType={
                        isPurchaseDocument
                          ? CLIENT_TYPE.SUPPLIER
                          : CLIENT_TYPE.CUSTOMER
                      }
                    />
                  </Stack>
                </div>
              )}
              <div
                style={classes.bordersecondContainer}
                className="custom-scrollbar"
              >
                <BusinessNewWidget
                  values={quoteState}
                  onBlurBusinessName={onBlurBusinessName}
                  isUpdateBusinessName={isUpdateBusinessName}
                  setIsUpdateBusinessName={setIsUpdateBusinessName}
                  onBlurPurchaseNumber={onBlurPurchaseNumber}
                  isUpdatePurchaseNumber={isUpdatePurchaseNumber}
                  setIsUpdatePurchaseNumber={setIsUpdatePurchaseNumber}
                  onBlurBusinessCode={onBlurBusinessCode}
                  setIsUpdateBusinessCode={setIsUpdateBusinessCode}
                  onBlurAddress={onBlurAddress}
                  isUpdateAddress={isUpdateAddress}
                  setIsUpdateAddress={setIsUpdateAddress}
                  selectedAgent={selectedAgent}
                  agentListValue={agentListValue}
                  onBlurAgent={onBlurAgent}
                  isUpdateAgent={isUpdateAgent}
                  setIsUpdateAgent={setIsUpdateAgent}
                  updateAgent={updateAgent}
                  onChangeSelectBusiness={onChangeSelectBusiness}
                  onClickDeleteAddress={onClickDeleteAddress}
                  documentType={documentType}
                  isQuoteConfirmation={isQuoteConfirmation}
                  onBlurClientName={onBlurClientName}
                  isUpdateClientName={isUpdateClientName}
                  setIsUpdateClientName={setIsUpdateClientName}
                  clientName={clientName}
                  setClientName={setClientName}
                  onBlurTitle={onBlurTitle}
                  isUpdateDocumentTitle={isUpdateDocumentTitle}
                  setIsUpdateDocumentTitle={setIsUpdateDocumentTitle}
                  clientType={
                    isPurchaseDocument
                      ? CLIENT_TYPE.SUPPLIER
                      : CLIENT_TYPE.CUSTOMER
                  }
                  AddCustomerModal={AddCustomerModal}
                />
                <ContactNewWidget
                  handleShowLess={handleShowLess}
                  items={items}
                  displayedItems={displayedItems}
                  setIsDisplayWidget={setIsDisplayWidget}
                  onOpenDeleteModalContact={onOpenDeleteModalContact}
                  changeItems={changeItems}
                  updateClientContact={updateClientContact}
                  setIsUpdateContactName={setIsUpdateContactName}
                  isUpdateContactMobile={isUpdateContactMobile}
                  setIsUpdateContactMobile={setIsUpdateContactMobile}
                  isUpdateContactEmail={isUpdateContactEmail}
                  setIsUpdateContactEmail={setIsUpdateContactEmail}
                  handleShowMore={handleShowMore}
                  isDisplayWidget={isDisplayWidget}
                  clientContactsValue={clientContactsValue}
                  onBlurContactName={onBlurContactName}
                  setSelectedContactById={setSelectedContactById}
                  selectedContactById={selectedContactById}
                  onBlurContactMobile={onBlurContactMobile}
                  onInputChangePhone={onInputChangePhone}
                  onBlurContactEmail={onBlurContactEmail}
                  onInputChangeMail={onInputChangeMail}
                  onClickAddNewContact={onClickAddNewContact}
                  openDeleteModalContact={openDeleteModalContact}
                  onCloseDeleteModalContact={onCloseDeleteModalContact}
                  onClickDeleteContact={onClickDeleteContact}
                  selectedContact={selectedContact}
                  isQuoteConfirmation={isQuoteConfirmation}
                  documentType={documentType}
                  getQuote={getQuote}
                  getAllClientContacts={getAllClientContacts}
                  onOpenNewContact={onOpenNewContact}
                  contactsListRef={contactsListRef}
                  clientType={
                    isPurchaseDocument
                      ? CLIENT_TYPE.SUPPLIER
                      : CLIENT_TYPE.CUSTOMER
                  }
                />
              </div>
            </div>
            <div
              style={{
                flex: 0.9,
                overflow: "auto",
                paddingLeft: 20,
                paddingRight: 12,
              }}
            >
              {!isReceipt && (
                <QuoteForPriceTable
                  documentItems={documentItems}
                  tableHeaders={tableHeaders}
                  columnWidths={columnWidths}
                  headerHeight={headerHeight}
                  changeDocumentItems={changeDocumentItems}
                  getCalculateQuoteItem={getCalculateQuoteItem}
                  getCalculateQuoteConfirmationItem={
                    getCalculateQuoteConfirmationItem
                  }
                  onClickDuplicateWithDifferentQTY={
                    onClickDuplicateWithDifferentQTY
                  }
                  onClickQuickDuplicate={onClickQuickDuplicate}
                  onClickDeleteQouteItem={onClickDeleteQouteItem}
                  quoteItems={quoteItems}
                  changeQuoteItems={changeQuoteItems}
                  getCalculateQuote={getCalculateQuote}
                  changeDocumentItemsChild={changeDocumentItemsChild}
                  documentType={documentType}
                  getQuote={getQuote}
                  isQuoteConfirmation={isQuoteConfirmation}
                  isPrePaymentPage={isPrePaymentPage}
                  onChangeSelectedItemRowForQoute={
                    onChangeSelectedItemRowForQoute
                  }
                />
              )}
              {isPrePaymentPage && (
                <>
                  <div style={classes.borderContainer} />
                  <div style={classes.titleStyle}>
                    {t("payment.paymentDetails")}
                  </div>
                  <CreditCardPaySection
                    isFromBigScreen={true}
                    documentType={documentType}
                  />
                </>
              )}
              {isReceipt && <ReceiptsTable />}
            </div>
            {!isPrePaymentPage && (
              <WriteCommentComp
                documentState={quoteState}
                getQuote={getQuote}
                isQuoteConfirmation={isQuoteConfirmation}
                documentType={documentType}
                onClickOpenRelatedDocumentsModal={
                  onClickOpenRelatedDocumentsModal
                }
              />
            )}
          </div>
          {!isQuoteConfirmation && (
            <div style={{ width: "100%" }} data-tour={"quoteStep2"}>
              <ButtonsContainer
                openSendBtn={openSendBtn}
                onOpenNewItem={onOpenNewItem}
                onOpenDeliveryModal={onOpenDeliveryModal}
                onOpenUpdateDeliveryModal={onOpenUpdateDeliveryModal}
                handleCancelBtnClick={handleCancelBtnClick}
                handleSaveBtnClick={handleSaveBtnClick}
                handleSendBtnClick={handleSendBtnClick}
                documentType={documentType}
                onOpenCopyFromOrder={onOpenCopyFromOrder}
                onClickOpenNewItemNotesModal={onClickOpenNewItemNotesModal}
                handleRejectBtnClick={handleRejectBtnClick}
                handleAcceptBtnClick={handleAcceptBtnClick}
                onClickOpenChangeProductionStatusModal={
                  onClickOpenChangeProductionStatusModal
                }
                onClickSendReceiptToClient={onClickSendReceiptToClient}
                handleSendUsingWhatsAppWeb={handleSendUsingWhatsAppWeb}
                onClickConfirmCreateDocument={onClickConfirmCreateDocument}
                onClickOpenAddAttachmentsModal={onOpenAddAttachmentsModal}
                onClickOpenDeleteDeliveryModal={onClickOpenDeleteDeliveryModal}
                AddCustomerModal={AddCustomerModal}
                handleSaveDraftBtnClick={handleSaveDraftBtnClick}
                modalCallback={modalCallback}
                receiptSendModal={receiptSendModal}
                openReceiptModal={openReceiptModal}
              />
            </div>
          )}
        </div>
      ) : (
        <QuoteNewPageSkeletonWidget />
      )}
      {isQuoteConfirmation &&
        !isPrePaymentPage &&
        !quoteConfirm?.isConfirmed &&
        quoteConfirm?.documentStatus !== QUOTE_STATUSES.Canceled && (
          <ButtonsConfirmContainer
            onClickOpenAddAttachmentsModal={onOpenAddAttachmentsModal}
            isQuoteConfirmation={isQuoteConfirmation}
            quoteConfirm={quoteConfirm}
          />
        )}
      <AddNewItemModal
        openModal={openAddNewItemModal}
        onClose={onCloseNewItem}
        documentType={documentType}
        getQuote={getQuote}
        getCalculateQuoteItem={getCalculateQuoteItem}
      />
      <AddNewContactModal
        openModal={openAddNewContactModal}
        onClose={onCloseNewContact}
        getQuote={getQuote}
        getAllClientContacts={getAllClientContacts}
        documentType={documentType}
      />
      {!isPrePaymentPage && (
        <AddDeliveryModal
          openModal={openAddDeliveryModal}
          onClose={onCloseDeliveryModal}
          onClickAdd={onAddDelivery}
        />
      )}
      {!isPrePaymentPage && (
        <UpdateDeliveryPriceModal
          openModal={openUpdateDeliveryModal}
          onClose={onCloseUpdateDeliveryModal}
          onClickAdd={onAddDelivery}
        />
      )}
      <CopyFromOrderModal
        openModal={openCopyFromOrderModal}
        onClose={onCloseCopyFromOrder}
        documentType={documentType}
        copyFromDocumentType={copyFromDocumentType}
      />
      <DuplicateItemModal
        openModal={openDuplicateWithDifferentQTYModal}
        onClose={onCloseDuplicateWithDifferentQTY}
        setAmountValue={setAmountValue}
        duplicateQuoteItemWithAnotherQuantity={
          duplicateQuoteItemWithAnotherQuantity
        }
      />
      <DuplicateQuickModal
        openModal={openQuickDuplicateModal}
        onClose={onCloseQuickDuplicate}
        quoteItemId={quoteItemId}
        quoteItem={quoteItem}
        documentType={documentType}
        getQuote={getQuote}
        isAddQuantity={isAddQuantity}
      />
      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        openModal={openDeleteItemModal}
        onClose={onCloseDeleteItemModal}
        onClickDelete={deleteQuoteItem}
      />
      <SendBtnMenu
        handleClose={handleSendBtnClose}
        open={openSendBtn}
        anchorEl={anchorElSendBtn}
        onClickSendQuoteToClient={onClickSendQuoteToClient}
        onClickSendReceiptToClient={onClickSendReceiptToClient}
        onClickOpenWhatsAppModal={onClickOpenWhatsAppModal}
        documentState={quoteItemValue}
        documentType={documentType}
        openReceiptModal={openReceiptModal}
      />
      <WhatsAppWebModal
        openModal={openWhatsAppModal}
        onClose={onClickCloseWhatsAppModal}
        getWhatsAppMessage={getWhatsAppMessage}
        getWhatsAppMessageForReceipt={getWhatsAppMessageForReceipt}
        whatsappMassage={whatsappMassage}
        documentType={documentType}
      />

      <SettingQuoteMenu
        handleClose={handleSettingMenuClose}
        open={openSettingMenu}
        anchorEl={anchorElSettingMenu}
        onBlurExchangeRate={onBlurExchangeRate}
        setIsUpdateExchangeRate={setIsUpdateExchangeRate}
        isUpdateExchangeRate={isUpdateExchangeRate}
        onBlurCurrency={onBlurCurrency}
        setIsUpdateCurrency={setIsUpdateCurrency}
        isUpdateCurrency={isUpdateCurrency}
        updateCurrency={updateCurrency}
        updateVatStatus={updateVatStatus}
        onClickRefresh={refreshExchangeRate}
        sortDocumentItems={sortDocumentItems}
        updateDiscountType={updateDiscountType}
        updateDocumentPreference={updateDocumentPreference}
        documentType={documentType}
        onBlurVatStatus={onBlurVatStatus}
        setIsUpdateVatStatus={setIsUpdateVatStatus}
        isUpdateVatStatus={isUpdateVatStatus}
      />
      <SettingVatListMenu
        handleClose={handleSettingMenuCloseForVat}
        open={openNewSttingMenuForVat}
        anchorEl={anchorElSettingMenuForVat}
        onBlurVatStatus={onBlurVatStatus}
        setIsUpdateVatStatus={setIsUpdateVatStatus}
        isUpdateVatStatus={isUpdateVatStatus}
        updateVatStatus={updateVatStatus}
        onBlurCurrency={onBlurCurrency}
        setIsUpdateCurrency={setIsUpdateCurrency}
        isUpdateCurrency={isUpdateCurrency}
        updateCurrency={updateCurrency}
        quoteStateValue={quoteItemValue}
      />
      <CancelBtnMenu
        handleClose={handleCancelBtnClose}
        open={openCancelBtn}
        anchorEl={anchorElCancelBtn}
        onClickOpenDeliveryTimeModal={onClickOpenDeliveryTimeModal}
        onClickOpenPriceModal={onClickOpenPriceModal}
        onClickOpenIrrelevantModal={onClickOpenIrrelevantModal}
        onClickOpenModal={onClickOpenModal}
      />
      <OtherReasonModal
        openModal={openOtherReasonModal}
        onClose={onClickCloseModal}
        setReasonText={setReasonText}
        onClickCancelOffer={onClickCancelOffer}
      />
      <ViewSignatureApprovalModal
        openModal={openSignatureApprovalModal}
        onClose={onClickCloseSignatureApprovalModal}
      />
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openIrrelevantCancelModal}
        onClose={onClickCloseIrrelevantModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={() =>
          updateCancelQuote(QuoteStatuses.CANCELED_IRRELEVANT)
        }
      />
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openPriceCancelModal}
        onClose={onClickClosePriceModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={() => updateCancelQuote(QuoteStatuses.CANCELED_PRICE)}
      />
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openDeliveryTimeCancelModal}
        onClose={onClickCloseDeliveryTimeModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={() =>
          updateCancelQuote(QuoteStatuses.CANCELED_DELIVERY_TIME)
        }
      />
      <GoMakeAlertModal
        openModal={openLoginModal}
        onClose={onClickClosLoginModal}
        subTitle={t("No login!!!!")}
        yesBtn={"login.login"}
        withIcon={true}
        onClickConfirm={() => {
          window.open(
            LoginTaxesUrl + printHouseProfileState?.business_ID,
            "_blank"
          );
          onClickClosLoginModal();
        }}
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={
          isSelectedCLoseAsDeliveryNote
            ? "customers.modal.closeOrderAsDeliveryNote"
            : "customers.modal.closeOrderAsInvoice"
        }
        subTitle={"customers.modal.thisOrderIsAlreadyInProcess"}
        yesBtn={
          isSelectedCLoseAsDeliveryNote
            ? t("customers.modal.closeAsDeliveryNote")
            : t("customers.modal.closeAsInvoice")
        }
        openModal={openChangeProductionStatusModal}
        onClose={onClickCloseChangeProductionStatusModal}
        onClickDelete={
          isMoveToReady
            ? moveOrderToReady
            : () => {
                if (isSelectedCLoseAsDeliveryNote) {
                  navigate(
                    `/deliveryNote?isNewCreation=true&orderId=${selectedDocument?.id}`
                  );
                } else {
                  const path =
                    documentType === DOCUMENT_TYPE.order
                      ? `/invoice?isNewCreation=true&orderId=${selectedDocument?.id}`
                      : `/invoice?isNewCreation=true&deliveryNoteId=${selectedDocument?.id}`;
                  navigate(path);
                }
              }
        }
      >
        <Stack alignItems={"center"}>
          <div
            style={{
              ...classes.inputLbl,
              color: isMoveToReady ? "black" : "#475467",
            }}
          >
            <PrimaryCheckbox
              checked={isMoveToReady}
              onChange={handleCheckboxChange}
            />
            {t("sales.moveToReadyAndCloseOrder")}
          </div>
          <CloseOrderNote note={selectedDocument?.closeOrderNotes} />
        </Stack>
      </GoMakeDeleteModal>
      <NewItemNotesModal
        openModal={openNewItemNotesModal}
        onClose={onClickCloseNewItemNotesModal}
        handleSaveBtnClickForDocument={handleSaveBtnClickForDocument}
        documentType={documentType}
      />
      <AddRelatedDocumentsModal
        openModal={openRelatedDocumentsModal}
        onClose={onClickCloseRelatedDocumentsModal}
      />
      <GoMakeDeleteModal
        openModal={openReferenceModal}
        onClose={onClickCloseReferenceModal}
        hideIcon={true}
        title={t("sales.quote.titleReferenceModal")}
        yesBtn={t("sales.quote.yesBtn")}
        onClickDelete={() => onChangeDatesToCreationDate()}
      />
      <InvoiceCreationModal
        onClose={onClickCloseInvoiceCreation}
        openModal={openInvoiceCreationModal}
        docType={documentType}
        onClickSendDocumentToClient={onClickSendQuoteToClient}
        handleSendUsingWhatsAppWeb={handleSendUsingWhatsAppWeb}
      />
      <GoMakeDeleteModal
        openModal={confirmCreateDocument}
        onClose={onClickCloseConfirmCreateDocument}
        yesBtn={t("sales.quote.yesBtn")}
        modalType={ModalType.WARNING}
        title={`${t("sales.quote.titleConfirmCreateDocument", {
          document: t(
            `sales.quote.${DOCUMENT_TYPE[documentType]}`
          ).toLowerCase(),
        })}?`}
        subTitle={`${t("sales.quote.subTitleConfirmCreateDocument", {
          document: t(
            `sales.quote.${DOCUMENT_TYPE[documentType]}`
          ).toLowerCase(),
        })}`}
        onClickDelete={() => handleSaveBtnClickForDocument()}
      >
        {documentType == DOCUMENT_TYPE.invoiceRefund ? (
          <div
            style={{
              ...classes.inputLbl,
              color: isOpenRelatedDocuments ? "black" : "#475467",
            }}
          >
            <PrimaryCheckbox
              checked={isOpenRelatedDocuments}
              onChange={(value) =>
                setIsOpenRelatedDocuments(!isOpenRelatedDocuments)
              }
            />
            {t("sales.openRelatedDocuments")}
          </div>
        ) : (
          <div></div>
        )}
      </GoMakeDeleteModal>
      <GoMakeDeleteModal
        openModal={openDeleteDeliveryModal}
        onClose={onClickCloseDeleteDeliveryModal}
        onClickDelete={onClickDeleteDelivery}
      />

      <GoMakeAlertModal
        openModal={alertModal.isOpen}
        onClose={alertModal.close}
        onClickConfirm={alertModal.close}
        subTitle="modal.alertDifferentVat"
        yesBtn="modal.ok"
        withCancelBtn={false}
      />
      <AddAttachmentsModal
        openModal={openAddAttachmentsModal}
        onClose={onCloseAddAttachmentsModal}
        documentType={documentType}
        getQuote={getQuote}
        isQuoteConfirmation={isQuoteConfirmation}
        quoteConfirm={quoteConfirm}
      />
      <GoMakeAlertModal
        openModal={alertNotVerifiedMail.isOpen}
        onClose={() => {
          alertNotVerifiedMail.close();
        }}
        onClickConfirm={() => {
          alertNotVerifiedModalState.onConfirm?.();
          alertNotVerifiedMail.close();
        }}
        subTitle={alertNotVerifiedModalState.message}
        withCancelBtn={!!alertNotVerifiedModalState.onConfirm}
      />
      <GoMakeAlertModal
        openModal={alertExistPurchaseNumber.isOpen}
        onClose={() => {
          alertExistPurchaseNumber.close();
          setQuoteItemValue((prev) => ({
            ...prev,
            purchaseNumber: originalPurchaseNumber,
          }));
          setPendingPurchaseNumber(null);
        }}
        onClickConfirm={async () => {
          alertExistPurchaseNumber.close();
          if (pendingPurchaseNumber) {
            await updatePurchaseNumber(pendingPurchaseNumber, true);
            setPendingPurchaseNumber(null);
          }
        }}
        subTitle={t("alerts.thisPurchaseNumberIsExist")}
        yesBtn={t("alerts.UpdateAnyway")}
      />
    </>
  );
};

export { QuoteNewPageWidget };
