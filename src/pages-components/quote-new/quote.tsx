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

import { useQuoteNew } from "./use-quote";
import { quoteItemState } from "@/store";
import { useStyle } from "./style";

const QuoteNewPageWidget = () => {
  const { clasess } = useStyle();
  const {
    selectDate,
    selectBusiness,
    isUpdateBusinessName,
    isUpdatePurchaseNumer,
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
    priceListItems,
    tableHeaders,
    columnWidths,
    headerHeight,
    quoteItems,
    dateRef,
    activeClickAway,
    changepriceListItems,
    changeQuoteItems,
    changepriceListItemsChild,
    getCalculateQuote,
    onCloseDeleteItemModal,
    deleteQuoteItem,
    onCloseDuplicateWithDifferentQTY,
    setAmountValue,
    onOpenNewItem,
    onCloseNewItem,
    setSelectDate,
    updateDueDate,
    setIsUpdateBusinessName,
    setSelectBusiness,
    setIsUpdateAddress,
    setIsUpdatePurchaseNumer,
    setIsUpdateBusinessCode,
    onBlurBusinessName,
    onBlurPurchaseNumer,
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
  } = useQuoteNew();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);

  return (
    <>
      {quoteItemValue?.id && (
        <div style={clasess.mainContainer}>
          <div style={clasess.secondContainer}>
            <div>
              <div style={clasess.titleSettingContainer}>
                <div style={clasess.titleQuateContainer}>
                  <HeaderTitle
                    title={t("sales.quote.title")}
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
                    Waiting for manager approval
                  </div>
                  <SettingNewIcon />
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
                  setSelectBusiness={setSelectBusiness}
                  onBlurPurchaseNumer={onBlurPurchaseNumer}
                  isUpdatePurchaseNumer={isUpdatePurchaseNumer}
                  setIsUpdatePurchaseNumer={setIsUpdatePurchaseNumer}
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
            <div style={{ flex: 0.9, overflow: "auto" }}>
              <QuoteForPriceTable
                priceListItems={priceListItems}
                tableHeaders={tableHeaders}
                columnWidths={columnWidths}
                headerHeight={headerHeight}
                changepriceListItems={changepriceListItems}
                getCalculateQuoteItem={getCalculateQuoteItem}
                onClickDuplicateWithDifferentQTY={
                  onClickDuplicateWithDifferentQTY
                }
                onClickDeleteQouteItem={onClickDeleteQouteItem}
                quoteItems={quoteItems}
                changeQuoteItems={changeQuoteItems}
                getCalculateQuote={getCalculateQuote}
                changepriceListItemsChild={changepriceListItemsChild}
              />
            </div>
            <div style={{ width: "100%", flex: 0.1 }}>
              <WriteCommentComp />
              <ButtonsContainer onOpenNewItem={onOpenNewItem} />
            </div>
          </div>
        </div>
      )}

      <AddNewItemModal
        openModal={openAddNewItemModal}
        onClose={onCloseNewItem}
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
    </>
  );
};

export { QuoteNewPageWidget };
