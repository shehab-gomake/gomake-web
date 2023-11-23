import { HeaderTitle } from "@/widgets";
import { useStyle } from "./style";
import { useQuoteNew } from "./use-quote";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";
import { useCallback, useEffect, useRef, useState } from "react";
import { BusinessNewWidget } from "@/widgets/quote-new/business-widget";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { ContactNewWidget } from "@/widgets/quote-new/contact-widget";
import { QuoteForPriceTable } from "@/widgets/quote-new/quote-table";
import { WriteCommentComp } from "@/widgets/quote-new/write-comment";
import { ButtonsContainer } from "@/widgets/quote-new/buttons-container";
import { AddNewItemModal } from "@/widgets/quote/modals-widgets/add-new-item-modal";
import { DuplicateItemModal } from "@/widgets/quote/modals-widgets/duplicate-item-modal";
import { GoMakeDeleteModal } from "@/components";
import lodashClonedeep from "lodash.clonedeep";
import { navStatusState } from "@/store/nav-status";

const QuoteNewPageWidget = () => {
  const { clasess } = useStyle();
  const navStatus = useRecoilValue(navStatusState);
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
  } = useQuoteNew();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const dateRef = useRef(null);
  const [activeClickAway, setActiveClickAway] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        if (activeClickAway) {
          updateDueDate();
          setActiveClickAway(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dateRef, activeClickAway, quoteItemValue, selectDate]);
  const handleClickSelectDate = () => {
    dateRef?.current?.showPicker();
  };
  useEffect(() => {
    setSelectDate(quoteItemValue?.dueDate);
  }, [quoteItemValue]);
  const tableHeaders = [
    "#",
    "Item code",
    "Item name",
    "Details",
    "Amount",
    "Discount",
    "Unit price",
    "Final price",
    "More",
  ];
  const columnWidths = ["5%", "8%", "12%", "33%", "8%", "8%", "8%", "8%"];
  const headerHeight = "44px";
  const [priceListItems, setPriceListItems] = useState<any>([]);
  useEffect(() => {
    setPriceListItems(quoteItemValue?.priceListItems);
  }, [quoteItemValue]);

  const changepriceListItems = (
    index: number,
    filedName: string,
    value: any
  ) => {
    let temp = [...priceListItems];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setPriceListItems(temp);
  };

  const changepriceListItemsChild = (
    parentIndex: number,
    childInex: number,
    filedName: string,
    value: any
  ) => {
    let temp = lodashClonedeep(priceListItems);
    temp[parentIndex].childsQuoteItems[childInex] = {
      ...temp[parentIndex].childsQuoteItems[childInex],
      [filedName]: value,
    };
    setPriceListItems(temp);
  };

  const [quoteItems, setquoteItems] = useState<any>([]);
  const changeQuoteItems = useCallback(
    (filedName: string, value: any) => {
      setquoteItems((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [quoteItems]
  );
  useEffect(() => {
    setquoteItems(quoteItemValue);
  }, [quoteItemValue]);
  return (
    <>
      {quoteItemValue?.id && (
        <div style={clasess.mainContainer}>
          <div style={{ width: "100%" }}>
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
            <div style={clasess.datesContainer}>
              <div style={clasess.deleverdDate} onClick={handleClickSelectDate}>
                {t("sales.quote.dateOfReference")}{" "}
                {selectDate ? DateFormatterDDMMYYYY(selectDate) : "select date"}
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

          <div
            style={{
              position: "fixed",
              bottom: 0,
              width: navStatus?.isClosed ? "91.407%" : "85.16%",
            }}
          >
            <WriteCommentComp />
            <ButtonsContainer onOpenNewItem={onOpenNewItem} />
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
        title="Delete Item"
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteItemModal}
        onClose={onCloseDeleteItemModal}
        subTitle="Are you sure to delete this item?"
        onClickDelete={deleteQuoteItem}
      />
    </>
  );
};

export { QuoteNewPageWidget };
