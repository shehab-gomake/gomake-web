import { useRecoilValue } from "recoil";
import { DuplicateItemModal } from "@/widgets/quote/modals-widgets/duplicate-item-modal";
import { AddNewItemModal } from "@/widgets/quote/modals-widgets/add-new-item-modal";
import { ButtonsContainer } from "@/widgets/quote-new/buttons-container";
import { BusinessNewWidget } from "@/widgets/quote-new/business-widget";
import { ContactNewWidget } from "@/widgets/quote-new/contact-widget";
import { QuoteForPriceTable } from "@/widgets/quote-new/quote-table";
import { WriteCommentComp } from "@/widgets/quote-new/write-comment";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";
import { GoMakeDeleteModal } from "@/components";
import { HeaderTitle } from "@/widgets";
import { SettingNewIcon } from "@/icons";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useQuoteNew } from "./use-quote";
import { quoteConfirmationState, quoteItemState } from "@/store";
import { useStyle } from "./style";
import { CancelBtnMenu } from "@/widgets/quote-new/cancel-btn-menu";
import { SendBtnMenu } from "@/widgets/quote-new/send-btn-menu";
import { OtherReasonModal } from "@/widgets/quote/total-price-and-vat/other-reason-modal";
import { QuoteStatuses } from "@/widgets/quote/total-price-and-vat/enums";
import { _renderQuoteStatus } from "@/utils/constants";
import { IconButton } from "@mui/material";
import { SettingQuoteMenu } from "@/widgets/quote-new/setting-quote-menu";
import { AddDeliveryModal } from "@/widgets/quote-new/modals-widgets/add-delivery-modal/add-delivery-modal";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { ButtonsConfirmContainer } from "@/widgets/quote-new/buttons-cofirm-container";
import { CopyFromOrderModal } from "@/widgets/quote-new/modals-widgets/copy-from-order-modal/copy-from-order-modal";
import { ReceiptsTable } from "@/widgets/quote-new/receipts-table";
import { useRouter } from "next/router";
import { usePaymentsTable } from "@/widgets/quote-new/receipts-table/use-payments-table";
import { useEffect } from "react";

interface IProps {
  documentType: DOCUMENT_TYPE;
  isQuoteConfirmation?: boolean;
}
const QuoteNewPageWidget = ({ documentType, isQuoteConfirmation = false }: IProps) => {
  const { classes } = useStyle(isQuoteConfirmation);
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const quoteState = isQuoteConfirmation ? quoteConfirm : quoteItemValue;
  const {
    selectDate,
    selectBusiness,
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
    handleSettingMenuClick,
    handleSettingMenuClose,
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
    changedocumentItems,
    changeQuoteItems,
    changedocumentItemsChild,
    getCalculateQuote,
    onCloseDeleteItemModal,
    deleteQuoteItem,
    onCloseDuplicateWithDifferentQTY,
    setAmountValue,
    onOpenNewItem,
    onCloseNewItem,
    setSelectDate,
    setIsUpdateBusinessName,
    setSelectBusiness,
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
    handleClickSelectDate,
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
    onClickDuplicateWithDifferentQTY,
    duplicateQuoteItemWithAnotherQuantity,
    onClickDeleteQouteItem,
    setActiveClickAway,
    setReasonText,
    onClickCancelOffer,
    updateCancelQuote,
    onClickSendQuoteToClient,
    onChangeSelectBusiness,
    updatePurchaseNumber,
    updateClientAddress,
    onClickDeleteAddress,
    onOpenDeliveryModal,
    openAddDeliveryModal,
    onCloseDeliveryModal,
    onAddDelivery,
    handleSaveBtnClick,
    documentTitle,
    onBlurExchangeRate,
    setIsUpdateExchangeRate,
    isUpdateExchangeRate,
    onBlurCurrency,
    setIsUpdateCurrency,
    isUpdateCurrency,
    updateCurrency,
    refreshExchangeRate,
    getQuote,
    selectConfirmBusiness,
    handleSaveBtnClickForDocument
  } = useQuoteNew({ docType: documentType, isQuoteConfirmation: isQuoteConfirmation });
  const { resetReceiptState } = usePaymentsTable();
  const router = useRouter();

  useEffect(() => {
    if (documentType === DOCUMENT_TYPE.receipt)
      resetReceiptState();
  }, [])

  return (
    <>
      {quoteState?.id && (
        <div style={classes.mainContainer}>
          <div style={classes.secondContainer}>
            <div style={{ paddingLeft: 20, paddingRight: 12 }}>
              <div style={classes.titleSettingContainer}>
                <div style={classes.titleQuateContainer}>
                  <HeaderTitle
                    title={router?.query?.isNewCreation ? `${t("sales.quote.createNew")} ${documentTitle.toLowerCase()}` : documentTitle}
                    marginBottom={1}
                    marginTop={1}
                    color="rgba(241, 53, 163, 1)"
                  />
                  {!router?.query?.isNewCreation && <div style={classes.quoteNumberStyle}>
                    {" - "} {quoteState?.number}
                  </div>}

                </div>
                {!isQuoteConfirmation && <div style={classes.settingsStatusContainer}>
                  <div style={classes.quoteStatusContainer}>
                    {_renderQuoteStatus(
                      quoteState?.documentStatus,
                      quoteState,
                      t
                    )}
                  </div>
                  <IconButton
                    style={{ marginRight: 4 }}
                    onClick={handleSettingMenuClick}
                  >
                    <SettingNewIcon />
                  </IconButton>
                </div>}
              </div>
              <div style={classes.datesContainer}>
                <div
                  style={classes.deleverdDate}
                  onClick={handleClickSelectDate}
                >
                  {t("sales.quote.dateOfReference")}{" "}
                  {selectDate
                    ? DateFormatterDDMMYYYY(selectDate)
                    : "select date"}
                  <div style={classes.datePickerContainer}>
                    <input
                      type="datetime-local"
                      onChange={(e) => {
                        setSelectDate(e.target.value);
                        setActiveClickAway(true);
                      }}
                      ref={dateRef}
                    />
                  </div>
                </div>
                {/* <div style={classes.lineDateStyle} /> Don't Delete */}
              </div>
              <div style={classes.bordersecondContainer}>
                <BusinessNewWidget
                  values={quoteState}
                  selectBusiness={selectBusiness}
                  selectConfirmBusiness={selectConfirmBusiness}
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
              {documentType !== DOCUMENT_TYPE.receipt && <QuoteForPriceTable
                documentItems={isQuoteConfirmation ? quoteConfirm?.documentItems : documentItems}
                tableHeaders={tableHeaders}
                columnWidths={columnWidths}
                headerHeight={headerHeight}
                changedocumentItems={changedocumentItems}
                getCalculateQuoteItem={getCalculateQuoteItem}
                onClickDuplicateWithDifferentQTY={
                  onClickDuplicateWithDifferentQTY
                }
                onClickDeleteQouteItem={onClickDeleteQouteItem}
                quoteItems={isQuoteConfirmation ? quoteConfirm : quoteItems}
                changeQuoteItems={changeQuoteItems}
                getCalculateQuote={getCalculateQuote}
                changedocumentItemsChild={changedocumentItemsChild}
                documentType={documentType}
                getQuote={getQuote}
                isQuoteConfirmation={isQuoteConfirmation}
              />
              }
              {
                documentType === DOCUMENT_TYPE.receipt &&
                <ReceiptsTable />
              }
            </div>
            <WriteCommentComp getQuote={getQuote} isQuoteConfirmation={isQuoteConfirmation} />
          </div>
          {!isQuoteConfirmation &&
            <ButtonsContainer
              onOpenNewItem={onOpenNewItem}
              onOpenDeliveryModal={onOpenDeliveryModal}
              handleCancelBtnClick={handleCancelBtnClick}
              handleSaveBtnClick={handleSaveBtnClick}
              handleSendBtnClick={handleSendBtnClick}
              documentType={documentType}
              onOpenCopyFromOrder={onOpenCopyFromOrder}
              handleSaveBtnClickForDocument={handleSaveBtnClickForDocument}
            />
          }
        </div>
      )}
      {(isQuoteConfirmation && !quoteConfirm?.isConfirmed) && <ButtonsConfirmContainer />}
      <AddNewItemModal
        openModal={openAddNewItemModal}
        onClose={onCloseNewItem}
        documentType={documentType}
      />
      <AddDeliveryModal
        openModal={openAddDeliveryModal}
        onClose={onCloseDeliveryModal}
        onClickAdd={onAddDelivery}
      />
      <CopyFromOrderModal
        openModal={openCopyFromOrderModal}
        onClose={onCloseCopyFromOrder}
        documentType={documentType}
      />
      <DuplicateItemModal
        openModal={openDuplicateWithDifferentQTYModal}
        onClose={onCloseDuplicateWithDifferentQTY}
        setAmountValue={setAmountValue}
        duplicateQuoteItemWithAnotherQuantity={
          duplicateQuoteItemWithAnotherQuantity
        }
      />
      <GoMakeDeleteModal
        title={t("sales.quote.deleteItem")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteItemModal}
        onClose={onCloseDeleteItemModal}
        subTitle={t("sales.quote.areYouSureDeleteItem")}
        onClickDelete={deleteQuoteItem}
      />
      <SendBtnMenu
        handleClose={handleSendBtnClose}
        open={openSendBtn}
        anchorEl={anchorElSendBtn}
        onClickSendQuoteToClient={onClickSendQuoteToClient}
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
        onClickRefresh={refreshExchangeRate}
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
      <GoMakeDeleteModal
        icon={
          <WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />
        }
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
        icon={
          <WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />
        }
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openPriceCancelModal}
        onClose={onClickClosePriceModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={() => updateCancelQuote(QuoteStatuses.CANCELED_PRICE)}
      />
      <GoMakeDeleteModal
        icon={
          <WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />
        }
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
    </>
  );
};

export { QuoteNewPageWidget };