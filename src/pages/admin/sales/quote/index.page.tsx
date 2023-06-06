import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useQuote } from "./use-quote";

import { useStyle } from "./style";
import { AddPlusIcon, UploadIcon } from "@/icons";
import { BusinessWidget } from "./widget/business-widget";
import { ContactWidget } from "./widget/contact-widget";
import { AddressWidget } from "./widget/address-widget";
import { CustomTableWidget } from "./widget/custom-table-widget";
import { TotalPriceAndVatWidit } from "./widget/total-price-and-vat";
import { quoteState } from "./store/quote";
import { useSetRecoilState } from "recoil";
import { useEffect, useRef, useState } from "react";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";

export default function Quote() {
  const { clasess } = useStyle();
  const setQuoteState = useSetRecoilState<any>(quoteState);
  const [selectDate, setSelectDate] = useState("");
  console.log("selectDate", selectDate);
  const dateRef = useRef(null);
  const handleClickSelectDate = () => {
    dateRef.current.showPicker();
  };
  const { data, tableHeaders, tableRowPercent, customersListValue, t } =
    useQuote();
  useEffect(() => {
    setQuoteState({
      data,
      tableHeaders,
      tableRowPercent,
      customersListValue,
      t,
    });
  }, [data, tableHeaders, tableRowPercent, customersListValue, t]);
  return (
    <AdminAuthLayout>
      <div style={clasess.mainContainer}>
        <div style={clasess.headerContainer}>
          <HeaderTitle
            title={t("sales.quote.title")}
            marginBottom={1}
            marginTop={1}
          />
          <div style={clasess.rightSideHeaderContainer}>
            <div style={clasess.deleverdDate} onClick={handleClickSelectDate}>
              {t("sales.quote.deliverOn")}{" "}
              {selectDate ? DateFormatterDDMMYYYY(selectDate) : "select dae"}
              <div style={clasess.datePickerContainer}>
                <input
                  type="datetime-local"
                  onChange={(e) => setSelectDate(e.target.value)}
                  ref={dateRef}
                  hidden
                  // style={{
                  //   display: "flex",
                  //   position: "absolute",
                  //   top: 0,
                  //   right: 20,
                  // }}
                  // style={clasess.datePickerContainer}
                />
              </div>
            </div>

            <div style={clasess.uploadContainer}>
              <UploadIcon />
              <div style={clasess.uploadTextStyle}>
                {t("sales.quote.upload")}
              </div>
            </div>
          </div>
        </div>
        <BusinessWidget />
        <div style={clasess.scrollContainer}>
          <ContactWidget />
          <AddressWidget />
          <div style={clasess.tableContainer}>
            <CustomTableWidget
              headerTitle={"Order review"}
              tableHeaders={tableHeaders}
              headerWidth={tableRowPercent}
              tableRowPercent={tableRowPercent}
              data={data}
            />
          </div>
        </div>
        <div style={clasess.btnsContainer}>
          <div style={clasess.btnContainer}>
            <AddPlusIcon />
            <div style={clasess.btnTitle}>add new item</div>
          </div>
          <div style={clasess.btnContainer}>
            <AddPlusIcon />
            <div style={clasess.btnTitle}>add exist item</div>
          </div>
          <div style={clasess.btnContainer}>
            <AddPlusIcon />
            <div style={clasess.btnTitle}>add delivery</div>
          </div>
        </div>
        <TotalPriceAndVatWidit />
      </div>
    </AdminAuthLayout>
  );
}
