import { HeaderTitle } from "@/widgets";
import { useStyle } from "./style";
import { useQuoteNew } from "./use-quote";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";
import { useEffect, useRef, useState } from "react";
import { BusinessNewWidget } from "@/widgets/quote-new/business-widget";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { ContactNewWidget } from "@/widgets/quote-new/contact-widget";
import { QuoteForPriceTable } from "@/widgets/quote-new/quote-table";

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
    isUpdateContactName,
    items,
    displayedItems,
    isUpdateContactEmail,
    isUpdateContactMobile,
    selectedContactById,
    openDeleteModalContact,
    selectedContact,
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
  ];
  const columnWidths = ["5%", "8%", "12%", "33%", "8%", "8%", "8%", "8%"];
  const headerHeight = "44px";
  return (
    <>
      {quoteItemValue?.id && (
        <div style={clasess.mainContainer}>
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
            {/* <div style={clasess.lineDateStyle} /> */}
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
              isUpdateContactName={isUpdateContactName}
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
            priceListItems={quoteItemValue?.priceListItems}
            tableHeaders={tableHeaders}
            columnWidths={columnWidths}
            headerHeight={headerHeight}
          />
        </div>
      )}
    </>
  );
};

export { QuoteNewPageWidget };
