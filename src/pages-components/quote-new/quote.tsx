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
import { quoteItemState } from "@/store";
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

interface IProps {
  documentType: DOCUMENT_TYPE;
}
const QuoteNewPageWidget = ({ documentType }: IProps) => {
  const { clasess } = useStyle();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
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
    openIrreleventCancelModal,
    openPriceCancelModal,
    openDeliveryTimeCancelModal,
    anchorElSettingMenu,
    openSettingMenu,
    handleSettingMenuClick,
    handleSettingMenuClose,
    onClcikClosePriceModal,
    onClcikOpenDeliveryTimeModal,
    onClcikOpenPriceModal,
    onClcikOpenIrreleventModal,
    onClcikCloseModal,
    onClcikOpenModal,
    onClcikCloseDeliveryTimeModal,
    onClcikCloseIrreleventModal,
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
  } = useQuoteNew(documentType);

  return (
    <>
      {quoteItemValue?.id && (
        <div style={clasess.mainContainer}>
          <div style={clasess.secondContainer}>
            <div style={{ paddingLeft: 20, paddingRight: 12 }}>
              <div style={clasess.titleSettingContainer}>
                <div style={clasess.titleQuateContainer}>
                  <HeaderTitle
                    title={documentTitle}
                    //  title={t("sales.quote.title")}
                    marginBottom={1}
                    marginTop={1}
                    color="rgba(241, 53, 163, 1)"
                  />
                  <div style={clasess.quoteNumberStyle}>
                    {" - "} {quoteItemValue?.number}
                  </div>
                </div>
                <div style={clasess.settingsStatusContainer}>
                  <div style={clasess.quoteStatusContainer}>
                    {_renderQuoteStatus(
                      quoteItemValue?.documentStatus,
                      quoteItemValue,
                      t
                    )}
                  </div>
                  <IconButton
                    style={{ marginRight: 4 }}
                    onClick={handleSettingMenuClick}
                  >
                    <SettingNewIcon />
                  </IconButton>
                </div>
              </div>
              <div style={clasess.datesContainer}>
                <div
                  style={clasess.deleverdDate}
                  onClick={handleClickSelectDate}
                >
                  {t("sales.quote.dateOfReference")}{" "}
                  {selectDate
                    ? DateFormatterDDMMYYYY(selectDate)
                    : "select date"}
                  <div style={clasess.datePickerContainer}>
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
                {/* <div style={clasess.lineDateStyle} /> Don't Delete */}
              </div>
              <div style={clasess.bordersecondContainer}>
                <BusinessNewWidget
                  values={quoteItemValue}
                  selectBusiness={selectBusiness}
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
                  updatePurchaseNumber={updatePurchaseNumber}
                  updateClientAddress={updateClientAddress}
                  onClickDeleteAddress={onClickDeleteAddress}
                  documentType={documentType}
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
              <QuoteForPriceTable
                documentItems={documentItems}
                tableHeaders={tableHeaders}
                columnWidths={columnWidths}
                headerHeight={headerHeight}
                changedocumentItems={changedocumentItems}
                getCalculateQuoteItem={getCalculateQuoteItem}
                onClickDuplicateWithDifferentQTY={
                  onClickDuplicateWithDifferentQTY
                }
                onClickDeleteQouteItem={onClickDeleteQouteItem}
                quoteItems={quoteItems}
                changeQuoteItems={changeQuoteItems}
                getCalculateQuote={getCalculateQuote}
                changedocumentItemsChild={changedocumentItemsChild}
                documentType={documentType}
              />
            </div>
            <div style={{ width: "100%", flex: 0.1 }}>
              <WriteCommentComp />
              <ButtonsContainer
                onOpenNewItem={onOpenNewItem}
                onOpenDeliveryModal={onOpenDeliveryModal}
                handleCancelBtnClick={handleCancelBtnClick}
                handleSaveBtnClick={handleSaveBtnClick}
                handleSendBtnClick={handleSendBtnClick}
                documentType={documentType}
              />
            </div>
          </div>
        </div>
      )}

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
      />
      <CancelBtnMenu
        handleClose={handleCancelBtnClose}
        open={openCancelBtn}
        anchorEl={anchorElCancelBtn}
        onClcikOpenDeliveryTimeModal={onClcikOpenDeliveryTimeModal}
        onClcikOpenPriceModal={onClcikOpenPriceModal}
        onClcikOpenIrreleventModal={onClcikOpenIrreleventModal}
        onClcikOpenModal={onClcikOpenModal}
      />
      <OtherReasonModal
        openModal={openOtherReasonModal}
        onClose={onClcikCloseModal}
        setReasonText={setReasonText}
        onClickCancelOffer={onClickCancelOffer}
      />
      <GoMakeDeleteModal
        icon={
          <WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />
        }
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openIrreleventCancelModal}
        onClose={onClcikCloseIrreleventModal}
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
        onClose={onClcikClosePriceModal}
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
        onClose={onClcikCloseDeliveryTimeModal}
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
