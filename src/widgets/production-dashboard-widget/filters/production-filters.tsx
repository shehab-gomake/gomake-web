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

  // Default date range: Last month to today
  const defaultStartDate = startOfDay(subMonths(new Date(), 1));
  const defaultEndDate = endOfDay(new Date());

  // Local state for dates
  const [deliveryFromDate, setDeliveryFromDate] = useState<Date | null>(null);
  const [deliveryToDate, setDeliveryToDate] = useState<Date | null>(null);
  const [creationFromDate, setCreationFromDate] = useState<Date | null>(
    defaultStartDate
  );
  const [creationToDate, setCreationToDate] = useState<Date | null>(
    defaultEndDate
  );
  const [fromInDate, setFromInDate] = useState<Date | null>(null);
  const [toInDate, setToInDate] = useState<Date | null>(null);

  // Initialize local state from Recoil on mount
  useEffect(() => {
    // Set default creation date if not already set in Recoil
    if (!creationDate.dates.startDate || !creationDate.dates.endDate) {
      setCreationDate({
        dates: {
          startDate: defaultStartDate,
          endDate: defaultEndDate,
        },
      });
    } else {
      setCreationFromDate(creationDate.dates.startDate);
      setCreationToDate(creationDate.dates.endDate);
    }

    if (deliveryDate.dates.startDate && deliveryDate.dates.endDate) {
      setDeliveryFromDate(deliveryDate.dates.startDate);
      setDeliveryToDate(deliveryDate.dates.endDate);
    }
    if (activityDate.dates.startDate && activityDate.dates.endDate) {
      setFromInDate(activityDate.dates.startDate);
      setToInDate(activityDate.dates.endDate);
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
      />

      <ControlledDateRangePicker
        label={t("sales.quote.deliveryDate") || "Delivery Date"}
        startDate={deliveryFromDate}
        endDate={deliveryToDate}
        onChange={handleDeliveryDateChange}
      />

      <ControlledDateRangePicker
        label={t("productionReport.activityDate") || "Activity Date"}
        startDate={fromInDate}
        endDate={toInDate}
        onChange={handleActivityDateChange}
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
