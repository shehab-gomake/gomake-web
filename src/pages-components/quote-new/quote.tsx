import { useRecoilState, useRecoilValue } from "recoil";
import { DuplicateItemModal } from "@/widgets/quote-new/modals-widgets/duplicate-item-modal";
import { AddNewItemModal } from "@/widgets/quote-new/modals-widgets/add-new-item-modal";
import { InventoryIntakeModal } from "@/widgets/quote-new/modals-widgets/inventory-intake-modal";
import { PurchaseOrderTypeModal } from "@/widgets/quote-new/modals-widgets/purchase-order-type-modal";
import { ButtonsContainer } from "@/widgets/quote-new/buttons-container";
import { BusinessNewWidget } from "@/widgets/quote-new/business-widget";
import { ContactNewWidget } from "@/widgets/quote-new/contact-widget";
import { QuoteForPriceTable } from "@/widgets/quote-new/quote-table";
import { WriteCommentComp } from "@/widgets/quote-new/write-comment";
import {
  GoMakeAlertModal,
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GoMakeMenu,
} from "@/components";
import { HeaderTitle } from "@/widgets";
import { ArrowDownNewIcon, BudgetIcon } from "@/icons";
import { useQuoteNew } from "./use-quote";
import { quoteConfirmationState, quoteItemState } from "@/store";
import { useStyle } from "./style";
import { CancelBtnMenu } from "@/widgets/quote-new/cancel-btn-menu";
import { SendBtnMenu } from "@/widgets/quote-new/send-btn-menu";
import { _renderQuoteStatus } from "@/utils/constants";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Skeleton,
} from "@mui/material";
import { SettingQuoteMenu } from "@/widgets/quote-new/setting-quote-menu";
import { AddDeliveryModal } from "@/widgets/quote-new/modals-widgets/add-delivery-modal/add-delivery-modal";
import { DOCUMENT_TYPE, QUOTE_STATUSES } from "../quotes/enums";
import { ButtonsConfirmContainer } from "@/widgets/quote-new/buttons-cofirm-container";
import { CopyFromOrderModal } from "@/widgets/quote-new/modals-widgets/copy-from-order-modal/copy-from-order-modal";
import { ReceiptsTable } from "@/widgets/quote-new/receipts-table";
import { useRouter } from "next/router";
import { usePaymentsTable } from "@/widgets/quote-new/receipts-table/use-payments-table";
import { useEffect, useState, MouseEvent } from "react";
import {
  checksRowState,
  CheckData,
} from "@/widgets/quote-new/buttons-container/states";
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
import { ModalType } from "@/enums";
import { DuplicateQuickModal } from "@/widgets/quote-new/modals-widgets/duplicate-quick-modal";
import Stack from "@mui/material/Stack";
import { ClientBalanceComponent } from "@/components/client-balance/client-balance";
import { PrimaryCheckbox } from "@/components/check-box/primary-check-box";
import { SettingVatListMenu } from "@/widgets/quote-new/setting-vat-menu";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { UpdateDeliveryPriceModal } from "@/widgets/quote-new/modals-widgets/update-delivery-price-modal/update-delivery-price-modal";
import { AddAttachmentsModal } from "@/widgets/quote-new/modals-widgets/add-attachments-modal/add-attachments-modal";
import { convertUtcToLocalIsoString } from "@/components/date-time/date-time-component";
import CloseOrderNote from "../quotes/widgets/general/close-order-note";
import { SettingMenuIcon } from "@/icons/setting-menu ";
import { useQuotesSocketIo } from "@/hooks/socket-io/use-quotes-socket-io";
import { useOrdersSocketIo } from "@/hooks/socket-io/use-orders-socket-io";
import { AddAttachmentsPurchaseModal } from "@/widgets/quote-new/modals-widgets/add-attachments-purchase-modal/add-attachments-purchase-modal";
import { EPreferences } from "@/enums/prefernces";
import { updateQuoteStatusSocketIo } from "@/hooks/socket-io/update-quote-status-socket-io";
import { useQuoteConfirmation } from "@/pages-components/quote-confirmation/use-quote-confirmation";
import { FrontDeskEmailComposerWrapper } from "../quotes/components/frontdesk-email-composer-wrapper";

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

  console.log("ssssssssssssssssss", quoteItemValue);

  useEffect(() => {
    setQuoteItemValue({});
  }, []);

  const {} = updateQuoteStatusSocketIo({
    setUserQuote: null,
    setQuoteId: null,
    setQuoteNumber: null,
    setQuoteIfExist: null,
    setSelectedClient: null,
    setSelectedClientType: null,
    clientTypesValue: null,
    isFromHomePage: false,
  });

  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const printHouseProfileState = useRecoilValue<any>(printHouseProfile);
  const quoteState = isQuoteConfirmation ? quoteConfirm : quoteItemValue;
  const checksReceipt = useRecoilValue<CheckData[]>(checksRowState);
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
    reCalculateItem,
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
    isSelectedCLoseAsProformaInvoice,
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
    isPurchaseOrder,
    purchaseOrderStatusOptions,
    updatePurchaseOrderStatus,
    isUpdatingPurchaseStatus,
    isOpenRelatedDocuments,
    setIsOpenRelatedDocuments,
    isPurchaseInvoice,
    systemVAT,
    isAddQuantity,
    openAddAttachmentsModal,
    openAddAttachmentsPurchaseModal,
    onOpenAddAttachmentsPurchaseModal,
    onCloseAddAttachmentsPurchaseModal,
    onOpenAddAttachmentsModal,
    onCloseAddAttachmentsModal,
    onFileUploadStart,
    onFileUploadComplete,
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
    setOriginalPurchaseNumber,
    updatePurchaseNumber,
    checkPurchaseNumber,
    modalCallback,
    openReceiptModal,
    receiptSendModal,
    isNewCreation,
    renderCreateNewButton,
    primaryColor,
    moveToReadyOption,
    handleRadioChange,
    openChangeStatusModal,
    onClickCloseChangeStatusModal,
    updateQuoteStatus,
    CheckPreferenceValue,
    openVatMismatchModal,
    onCloseVatMismatchModal,
    onConfirmVatMismatchModal,
    estimatedProductionDate,
    handleExportToExcel,
    onClickSendEmailViaComposer,
    isEmailComposerOpen,
    emailData,
    closeEmailComposer,
    isMaterial,
    isMaterialPurchaseOrder,
    isCanIntake,
    openInventoryIntakeModal,
    onClickOpenInventoryIntakeModal,
    onClickCloseInventoryIntakeModal,
    inventoryData,
    inventoryLoading,
    openPurchaseOrderTypeModal,
    onOpenPurchaseOrderTypeModal,
    onClosePurchaseOrderTypeModal,
    handleSelectPurchaseOrderType,
  } = useQuoteNew({
    docType: documentType,
    isQuoteConfirmation: isQuoteConfirmation,
    isPrePaymentPage: isPrePaymentPage,
  });
  const { getQuoteConfirmation } = useQuoteConfirmation();
  if (documentType == DOCUMENT_TYPE.quote) {
    const {} = useQuotesSocketIo({ getQuote });
  }
  if (documentType == DOCUMENT_TYPE.order) {
    const {} = useOrdersSocketIo({ getQuote });
  }

  const [purchaseStatusAnchorEl, setPurchaseStatusAnchorEl] =
    useState<null | HTMLElement>(null);
  const isPurchaseStatusMenuOpen = Boolean(purchaseStatusAnchorEl);
  const currentPurchaseOrderStatus = quoteItemValue?.documentStatus;
  const currentPurchaseOrderStatusLabel = purchaseOrderStatusOptions.find(
    (option) => option.value === currentPurchaseOrderStatus
  )?.label;

  const handleOpenPurchaseStatusMenu = (event: MouseEvent<HTMLElement>) => {
    if (quoteItemValue?.documentStatus === 8) return;
    event.preventDefault();
    event.stopPropagation();
    setPurchaseStatusAnchorEl(event.currentTarget);
  };

  const handleClosePurchaseStatusMenu = () => {
    setPurchaseStatusAnchorEl(null);
  };

  const handleSelectPurchaseStatus = (statusValue: number) => {
    handleClosePurchaseStatusMenu();
    if (
      statusValue === currentPurchaseOrderStatus ||
      isUpdatingPurchaseStatus
    ) {
      return;
    }
    updatePurchaseOrderStatus(statusValue);
  };

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

  // Update due date to the latest check date when paying with checks
  useEffect(() => {
    const isOutgoingPayments = router.query?.isOutgoingPayments === "true";

    if (
      isReceipt &&
      isOutgoingPayments &&
      isNewCreation &&
      checksReceipt?.length > 0
    ) {
      // Filter checks with valid due dates and non-zero amounts
      const validChecks = checksReceipt.filter(
        (check) => check.dueDate && check.checkSum > 0
      );

      if (validChecks.length > 0) {
        // Find the latest (maximum) due date among all checks
        const latestCheckDate = validChecks.reduce((latest, check) => {
          const checkDate = new Date(check.dueDate);
          const latestDate = new Date(latest);
          return checkDate > latestDate ? check.dueDate : latest;
        }, validChecks[0].dueDate);

        // Update the due date if we found a valid latest check date
        if (latestCheckDate) {
          const formattedDate = moment(latestCheckDate)
            .utc()
            .format("YYYY-MM-DD HH:mm:ss");
          setSelectDate(formattedDate);
        }
      }
    }
  }, [
    checksReceipt,
    isReceipt,
    isNewCreation,
    router.query?.isOutgoingPayments,
  ]);

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
                      (documentType === DOCUMENT_TYPE.deliveryNote &&
                        !isNewCreation)) &&
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
                          key={
                            selectedBudget
                              ? `budget-${selectedBudget.id}`
                              : "budget-null"
                          }
                          value={selectedBudget}
                          onChange={(e, value) => {
                            if (value) {
                              // Immediately update the UI to show the selected budget
                              setSelectedBudget(value);
                              // Then try to update the document budget
                              updateDocumentBudget(value);
                            } else {
                              setSelectedBudget(null);
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
                    {isQuote && (
                      <>
                        {quoteItemValue?.signImageUrl &&
                        quoteItemValue?.signerName ? (
                          <div
                            style={classes.signatureApproval}
                            onClick={onClickOpenSignatureApprovalModal}
                          >
                            {t("sales.cart.signatureApproval")}
                          </div>
                        ) : (
                          <>
                            {!isNewCreation && (
                              <div style={classes.quoteStatusContainer}>
                                {_renderQuoteStatus(
                                  quoteState?.[
                                    isReceipt ? "status" : "documentStatus"
                                  ],
                                  quoteState,
                                  t
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                    {isPurchaseOrder && !isNewCreation && (
                      <div style={classes.quoteStatusContainer}>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                          }}
                          onClick={handleOpenPurchaseStatusMenu}
                        >
                          {currentPurchaseOrderStatusLabel ||
                            t("sales.quote.status")}
                          {isUpdatingPurchaseStatus && (
                            <CircularProgress size={16} />
                          )}
                        </span>
                        <GoMakeMenu
                          open={isPurchaseStatusMenuOpen}
                          anchorEl={purchaseStatusAnchorEl}
                          handleClose={handleClosePurchaseStatusMenu}
                          noListPadding
                        >
                          {purchaseOrderStatusOptions.map((option) => (
                            <MenuItem
                              key={option.value}
                              selected={
                                option.value === currentPurchaseOrderStatus
                              }
                              onClick={() =>
                                handleSelectPurchaseStatus(option.value)
                              }
                              disabled={isUpdatingPurchaseStatus}
                            >
                              {option.label}
                            </MenuItem>
                          ))}
                        </GoMakeMenu>
                      </div>
                    )}
                    {!isQuote && !isNewCreation && renderCreateNewButton()}
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
                  <DateField
                    label={t("sales.quote.creationDate")}
                    date={creationDate}
                    handleChange={handleChangeCreationDate}
                    isEditable={
                      (isInvoice || isPurchaseInvoice || isDeliveryNote) &&
                      quoteItemValue?.isEditable
                    }
                    inputRef={creationDateRef}
                  />
                  {documentType !== DOCUMENT_TYPE.purchaseOrder &&
                    (isQuote &&
                    !selectDate &&
                    (!CheckPreferenceValue(
                      EPreferences.DELIVERY_DATE_REQUIRED_IN_QUOTE
                    ) ||
                      quoteItemValue?.dueDateUpdatedByUser) ? (
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
                        isEditable={
                          quoteItemValue?.isEditable ||
                          (isNewCreation && isReceipt)
                        }
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
                  {(documentType === DOCUMENT_TYPE.order ||
                    documentType === DOCUMENT_TYPE.quote) &&
                    estimatedProductionDate && (
                      <DateField
                        label={t("sales.quote.estimatedProductionDate")}
                        // date={estimatedProductionDate}
                        date={convertUtcToLocalIsoString(
                          estimatedProductionDate
                        )}
                        handleChange={handleChangeCreationDate}
                        isEditable={false}
                        inputRef={creationDateRef}
                        withTime={true}
                      />
                    )}
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
                  checkPurchaseNumber={checkPurchaseNumber}
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
                  reCalculateItem={reCalculateItem}
                  isQuoteConfirmation={isQuoteConfirmation}
                  isPrePaymentPage={isPrePaymentPage}
                  onChangeSelectedItemRowForQoute={
                    onChangeSelectedItemRowForQoute
                  }
                  isMaterialPurchaseOrder={isMaterialPurchaseOrder}
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
                onClickOpenAddAttachmentsPurchaseModal={
                  onOpenAddAttachmentsPurchaseModal
                }
                onClickOpenDeleteDeliveryModal={onClickOpenDeleteDeliveryModal}
                AddCustomerModal={AddCustomerModal}
                handleSaveDraftBtnClick={handleSaveDraftBtnClick}
                modalCallback={modalCallback}
                receiptSendModal={receiptSendModal}
                openReceiptModal={openReceiptModal}
                clientType={
                  isPurchaseDocument
                    ? CLIENT_TYPE.SUPPLIER
                    : CLIENT_TYPE.CUSTOMER
                }
                deliveryDate={selectDate}
                handleExportToExcel={handleExportToExcel}
                isCanIntake={isCanIntake}
                onClickOpenInventoryIntakeModal={
                  onClickOpenInventoryIntakeModal
                }
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
        isMaterial={isMaterial}
        isNewCreation={isNewCreation}
        isPurchaseOrder={documentType === DOCUMENT_TYPE.purchaseOrder}
        isCanIntake={isCanIntake}
      />
      <InventoryIntakeModal
        open={openInventoryIntakeModal}
        onClose={onClickCloseInventoryIntakeModal}
        inventoryData={inventoryData}
        loading={inventoryLoading}
        purchaseOrderId={router.query?.Id as string}
      />
      <PurchaseOrderTypeModal
        open={openPurchaseOrderTypeModal}
        onClose={onClosePurchaseOrderTypeModal}
        onSelectProduct={() => handleSelectPurchaseOrderType(false)}
        onSelectMaterial={() => handleSelectPurchaseOrderType(true)}
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
        // !here for branch 5062957516
        onClickSendEmailViaComposer={onClickSendEmailViaComposer}
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
            : isSelectedCLoseAsProformaInvoice
            ? "customers.modal.closeOrderAsProformaInvoice"
            : "customers.modal.closeOrderAsInvoice"
        }
        subTitle={"customers.modal.thisOrderIsAlreadyInProcess"}
        yesBtn={
          isSelectedCLoseAsDeliveryNote
            ? t("customers.modal.closeAsDeliveryNote")
            : isSelectedCLoseAsProformaInvoice
            ? t("customers.modal.closeAsProformaInvoice")
            : t("customers.modal.closeAsInvoice")
        }
        openModal={openChangeProductionStatusModal}
        onClose={onClickCloseChangeProductionStatusModal}
        onClickDelete={
          isMoveToReady
            ? () => moveOrderToReady(moveToReadyOption === "withMessage")
            : () => {
                if (isSelectedCLoseAsDeliveryNote) {
                  navigate(
                    `/deliveryNote?isNewCreation=true&orderId=${selectedDocument?.id}`
                  );
                } else if (isSelectedCLoseAsProformaInvoice) {
                  const path =
                    documentType === DOCUMENT_TYPE.order
                      ? `/proformaInvoice?isNewCreation=true&orderId=${selectedDocument?.id}`
                      : `/proformaInvoice?isNewCreation=true&deliveryNoteId=${selectedDocument?.id}`;
                  navigate(path);
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
          {isMoveToReady && (
            <RadioGroup
              row
              value={moveToReadyOption}
              onChange={handleRadioChange}
              style={{ marginTop: 8 }}
            >
              <FormControlLabel
                value="withoutMessage"
                control={
                  <Radio
                    sx={{ transform: "scale(0.8)", p: 0.5 }}
                    style={{ color: primaryColor(300) }}
                  />
                }
                label={t("sales.moveToReadyWithoutMessage")}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    ...FONT_FAMILY.Lexend(500, 13),
                  },
                }}
              />
              <FormControlLabel
                value="withMessage"
                control={
                  <Radio
                    sx={{ transform: "scale(0.8)", p: 0.5 }}
                    style={{ color: primaryColor(300) }}
                  />
                }
                label={t("sales.moveToReadyWithMessage")}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    ...FONT_FAMILY.Lexend(500, 13),
                  },
                }}
              />
            </RadioGroup>
          )}
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
        documentId={quoteItemValue?.id}
        onSuccess={getQuote}
        docType={documentType}
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        openModal={openReferenceModal}
        onClose={onClickCloseReferenceModal}
        title={t("sales.quote.titleReferenceModal")}
        yesBtn={t("sales.documentDeliveries.continue")}
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
        openModal={openVatMismatchModal}
        onClose={onCloseVatMismatchModal}
        onClickConfirm={onConfirmVatMismatchModal}
        subTitle="modal.alertDifferentVat"
        yesBtn="modal.ok"
        withCancelBtn={false}
      />
      <AddAttachmentsModal
        openModal={openAddAttachmentsModal}
        onClose={onCloseAddAttachmentsModal}
        documentType={documentType}
        getQuote={isQuoteConfirmation ? () => {} : getQuote}
        isQuoteConfirmation={isQuoteConfirmation}
        quoteConfirm={quoteState}
        onFileUploadStart={onFileUploadStart}
        onFileUploadComplete={onFileUploadComplete}
      />
      <AddAttachmentsPurchaseModal
        openModal={openAddAttachmentsPurchaseModal}
        onClose={onCloseAddAttachmentsPurchaseModal}
        documentType={documentType}
        getQuote={getQuote}
        quoteConfirm={quoteState}
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
            purchaseNumber: originalPurchaseNumber || prev.purchaseNumber,
          }));
          setPendingPurchaseNumber(null);
          setOriginalPurchaseNumber(null);
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
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("sales.quote.titleModal")}
        subTitle={t("sales.quote.subTitleModal")}
        yesBtn={t("sales.quote.changeStatus")}
        openModal={openChangeStatusModal}
        onClose={onClickCloseChangeStatusModal}
        onClickDelete={() => updateQuoteStatus()}
      />
      {/* FrontDesk Email Composer */}
      {isEmailComposerOpen && (
        <FrontDeskEmailComposerWrapper
          open={isEmailComposerOpen}
          onClose={closeEmailComposer}
          emailData={emailData}
          documentId={quoteItemValue?.id}
          documentType={documentType}
        />
      )}
    </>
  );
};

export { QuoteNewPageWidget };
