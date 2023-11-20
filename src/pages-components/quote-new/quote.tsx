import { HeaderTitle } from "@/widgets";
import { useStyle } from "./style";
import { useQuoteNew } from "./use-quote";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";
import { useEffect, useRef, useState } from "react";
import { BusinessNewWidget } from "@/widgets/quote-new/business-widget";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { ContactNewWidget } from "@/widgets/quote-new/contact-widget";

const QuoteNewPageWidget = () => {
  const { clasess } = useStyle();
  const { selectDate, setSelectDate, updateDueDate, getQuote, t } =
    useQuoteNew();
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
  console.log("quoteItemValue", quoteItemValue);

  return (
    <>
      {quoteItemValue && (
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
          <BusinessNewWidget values={quoteItemValue} getQuote={getQuote} />
          <ContactNewWidget values={quoteItemValue} getQuote={getQuote} />
        </div>
      )}
    </>
  );
};

export { QuoteNewPageWidget };
