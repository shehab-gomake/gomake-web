import { useStyle } from "../style";
import { useRecoilState } from "recoil";
import { dashboardDateState, productionCreationDateState } from "@/store";
import { useTranslation } from "react-i18next";
import { DateRangePicker } from "rsuite";
import { useRef, useState } from "react";
import { predefinedRanges } from "@/utils/dateRanges";
import { FONT_FAMILY } from "@/utils/font-family";

const ProductionDashboardFilters = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  // Delivery date state
  const [dashboardDate, setDashboardDate] = useRecoilState(dashboardDateState);
  const deliveryPickerRef = useRef(null);
  const [deliveryFromDate, setDeliveryFromDate] = useState<Date | null>(
    dashboardDate.dates.startDate || null
  );
  const [deliveryToDate, setDeliveryToDate] = useState<Date | null>(
    dashboardDate.dates.endDate || null
  );

  // Creation date state
  const [creationDate, setCreationDate] = useRecoilState(
    productionCreationDateState
  );
  const creationPickerRef = useRef(null);
  const [creationFromDate, setCreationFromDate] = useState<Date | null>(
    creationDate.dates.startDate || null
  );
  const [creationToDate, setCreationToDate] = useState<Date | null>(
    creationDate.dates.endDate || null
  );

  // Delivery date handlers
  const handleDeliveryDateChange = (dateRange: [Date, Date] | null) => {
    if (dateRange && dateRange.length === 2) {
      setDeliveryFromDate(dateRange[0]);
      setDeliveryToDate(dateRange[1]);
      setDashboardDate({
        ...dashboardDate,
        dates: {
          startDate: dateRange[0],
          endDate: dateRange[1],
        },
      });
    }
  };

  const handleDeliverySelect = (date: Date) => {
    if (!deliveryFromDate) {
      setDeliveryFromDate(date);
    } else if (!deliveryToDate) {
      setDeliveryToDate(date);
      handleDeliveryDateChange([deliveryFromDate, date]);
      deliveryPickerRef.current?.close();
    }
  };

  // Creation date handlers
  const handleCreationDateChange = (dateRange: [Date, Date] | null) => {
    if (dateRange && dateRange.length === 2) {
      setCreationFromDate(dateRange[0]);
      setCreationToDate(dateRange[1]);
      setCreationDate({
        dates: {
          startDate: dateRange[0],
          endDate: dateRange[1],
        },
      });
    }
  };

  const handleCreationSelect = (date: Date) => {
    if (!creationFromDate) {
      setCreationFromDate(date);
    } else if (!creationToDate) {
      setCreationToDate(date);
      handleCreationDateChange([creationFromDate, date]);
      creationPickerRef.current?.close();
    }
  };

  return (
    <div style={classes.datesContainer}>
      <div>
        <label
          style={{
            display: "block",
            marginBottom: 8,
            ...FONT_FAMILY.Lexend(500, 15),
          }}
        >
          {t("sales.quote.deliveryDate") || "Delivery Date"}
        </label>
        <DateRangePicker
          ref={deliveryPickerRef}
          onChange={handleDeliveryDateChange}
          onSelect={handleDeliverySelect}
          value={
            deliveryFromDate && deliveryToDate
              ? [deliveryFromDate, deliveryToDate]
              : null
          }
          ranges={predefinedRanges}
          placement={isRTL ? "bottomEnd" : "bottomStart"}
          style={{ direction: dir }}
        />
      </div>
      <div>
        <label
          style={{
            display: "block",
            marginBottom: 8,
            ...FONT_FAMILY.Lexend(500, 15),
          }}
        >
          {t("sales.quote.creationDate") || "Creation Date"}
        </label>
        <DateRangePicker
          ref={creationPickerRef}
          onChange={handleCreationDateChange}
          onSelect={handleCreationSelect}
          value={
            creationFromDate && creationToDate
              ? [creationFromDate, creationToDate]
              : null
          }
          ranges={predefinedRanges}
          placement={isRTL ? "bottomEnd" : "bottomStart"}
          style={{ direction: dir }}
        />
      </div>
    </div>
  );
};

export { ProductionDashboardFilters };
