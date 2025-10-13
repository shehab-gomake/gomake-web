import { useStyle } from "../style";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { DateRangePicker } from "rsuite";
import { useEffect, useRef, useState } from "react";
import { predefinedRanges } from "@/utils/dateRanges";
import { FONT_FAMILY } from "@/utils/font-family";
import { useSnackBar } from "@/hooks";
import { PrimaryButton } from "@/components/button/primary-button";
import {
  productionCreationDateState,
  productionDeliveryDateState,
} from "@/store/production-dashboard-dates";

const ProductionDashboardFilters = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const { alertFault } = useSnackBar();

  // Recoil state
  const [deliveryDate, setDeliveryDate] = useRecoilState(
    productionDeliveryDateState
  );
  const [creationDate, setCreationDate] = useRecoilState(
    productionCreationDateState
  );

  // Local state for delivery date
  const deliveryPickerRef = useRef(null);
  const [deliveryFromDate, setDeliveryFromDate] = useState<Date | null>(null);
  const [deliveryToDate, setDeliveryToDate] = useState<Date | null>(null);

  // Local state for creation date
  const creationPickerRef = useRef(null);
  const [creationFromDate, setCreationFromDate] = useState<Date | null>(null);
  const [creationToDate, setCreationToDate] = useState<Date | null>(null);

  // Error state

  // Initialize local state from Recoil on mount
  useEffect(() => {
    if (creationDate.dates.startDate && creationDate.dates.endDate) {
      setCreationFromDate(creationDate.dates.startDate);
      setCreationToDate(creationDate.dates.endDate);
    }
    if (deliveryDate.dates.startDate && deliveryDate.dates.endDate) {
      setDeliveryFromDate(deliveryDate.dates.startDate);
      setDeliveryToDate(deliveryDate.dates.endDate);
    }
  }, []);

  // Delivery date handlers
  const handleDeliveryDateChange = (dateRange: [Date, Date] | null) => {
    if (dateRange && dateRange.length === 2) {
      setDeliveryFromDate(dateRange[0]);
      setDeliveryToDate(dateRange[1]);
    } else if (dateRange === null) {
      // Allow clearing the date
      setDeliveryFromDate(null);
      setDeliveryToDate(null);
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
    } else if (dateRange === null) {
      // Allow clearing the date
      setCreationFromDate(null);
      setCreationToDate(null);
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

  // Search button handler
  const handleSearch = () => {
    // Validate: at least one date range must be selected
    const hasDeliveryDates = deliveryFromDate && deliveryToDate;
    const hasCreationDates = creationFromDate && creationToDate;

    if (!hasDeliveryDates && !hasCreationDates) {
      alertFault(t("productionReport.selectAtLeastOneDate"));
      return;
    }

    // Update delivery date state
    setDeliveryDate({
      ...deliveryDate,
      dates: {
        startDate: deliveryFromDate || undefined,
        endDate: deliveryToDate || undefined,
      },
    });

    // Update creation date state
    setCreationDate({
      dates: {
        startDate: creationFromDate || undefined,
        endDate: creationToDate || undefined,
      },
    });
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
      <PrimaryButton
        variant="contained"
        onClick={handleSearch}
        style={classes.searchBtnStyle}
      >
        {t("sales.quote.search")}
      </PrimaryButton>
    </div>
  );
};

export { ProductionDashboardFilters };
