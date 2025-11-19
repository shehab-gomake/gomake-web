import { useStyle } from "../style";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSnackBar } from "@/hooks";
import { PrimaryButton } from "@/components/button/primary-button";
import {
  productionCreationDateState,
  productionDeliveryDateState,
  productionActivityDateState,
} from "@/store/production-dashboard-dates";
import { ControlledDateRangePicker } from "@/components/datepicker";
import { subMonths, startOfDay, endOfDay } from "date-fns";

const ProductionDashboardFilters = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { alertFault } = useSnackBar();

  // Recoil state
  const [deliveryDate, setDeliveryDate] = useRecoilState(
    productionDeliveryDateState
  );
  const [creationDate, setCreationDate] = useRecoilState(
    productionCreationDateState
  );
  const [activityDate, setActivityDate] = useRecoilState(
    productionActivityDateState
  );

  // Default date range for Activity Date only: Today
  const defaultStartDate = startOfDay(new Date());
  const defaultEndDate = endOfDay(new Date());

  // Local state for dates
  const [deliveryFromDate, setDeliveryFromDate] = useState<Date | null>(null);
  const [deliveryToDate, setDeliveryToDate] = useState<Date | null>(null);
  const [creationFromDate, setCreationFromDate] = useState<Date | null>(null);
  const [creationToDate, setCreationToDate] = useState<Date | null>(null);
  const [fromInDate, setFromInDate] = useState<Date | null>(defaultStartDate);
  const [toInDate, setToInDate] = useState<Date | null>(defaultEndDate);

  // Initialize local state from Recoil on mount
  useEffect(() => {
    // Set default activity date if not already set in Recoil
    if (!activityDate.dates.startDate || !activityDate.dates.endDate) {
      setActivityDate({
        dates: {
          startDate: defaultStartDate,
          endDate: defaultEndDate,
        },
      });
    } else {
      setFromInDate(activityDate.dates.startDate);
      setToInDate(activityDate.dates.endDate);
    }

    if (deliveryDate.dates.startDate && deliveryDate.dates.endDate) {
      setDeliveryFromDate(deliveryDate.dates.startDate);
      setDeliveryToDate(deliveryDate.dates.endDate);
    }
    if (creationDate.dates.startDate && creationDate.dates.endDate) {
      setCreationFromDate(creationDate.dates.startDate);
      setCreationToDate(creationDate.dates.endDate);
    }
  }, []);

  // Date change handlers
  const handleCreationDateChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setCreationFromDate(startDate);
    setCreationToDate(endDate);
  };

  const handleDeliveryDateChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setDeliveryFromDate(startDate);
    setDeliveryToDate(endDate);
  };

  const handleActivityDateChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setFromInDate(startDate);
    setToInDate(endDate);
  };

  // Search button handler
  const handleSearch = () => {
    // Validate: at least one date range must be selected
    const hasDeliveryDates = deliveryFromDate && deliveryToDate;
    const hasCreationDates = creationFromDate && creationToDate;
    const hasActivityDates = fromInDate && toInDate;

    if (!hasDeliveryDates && !hasCreationDates && !hasActivityDates) {
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

    // Update activity date state
    setActivityDate({
      dates: {
        startDate: fromInDate || undefined,
        endDate: toInDate || undefined,
      },
    });
  };

  return (
    <div style={classes.datesContainer}>
      <ControlledDateRangePicker
        label={t("sales.quote.creationDate") || "Creation Date"}
        startDate={creationFromDate}
        endDate={creationToDate}
        onChange={handleCreationDateChange}
        dateFormat="MMM d, yyyy"
      />
      <ControlledDateRangePicker
        label={t("sales.quote.deliveryDate") || "Delivery Date"}
        startDate={deliveryFromDate}
        endDate={deliveryToDate}
        onChange={handleDeliveryDateChange}
        dateFormat="MMM d, yyyy"
      />
      <ControlledDateRangePicker
        label={t("productionReport.activityDate") || "Activity Date"}
        startDate={fromInDate}
        endDate={toInDate}
        onChange={handleActivityDateChange}
        dateFormat="MMM d, yyyy"
        tooltip={t("productionReport.activityDateTooltip")}
      />
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
