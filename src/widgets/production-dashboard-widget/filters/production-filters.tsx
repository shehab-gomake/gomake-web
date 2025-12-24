import { useStyle } from "../style";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useMemo } from "react";
import { useSnackBar, useGomakeAxios } from "@/hooks";
import { PrimaryButton } from "@/components/button/primary-button";
import {
  productionCreationDateState,
  productionDeliveryDateState,
  productionActivityDateState,
  productionStatusesState,
} from "@/store/production-dashboard-dates";
import { ControlledDateRangePicker } from "@/components/datepicker";
import { subMonths, startOfDay, endOfDay } from "date-fns";
import { MultiSelectDropdown } from "@/components/multi-select/multi-select-drop-down";
import { getAllBoardMissionStatusApi } from "@/services/api-service/board-missions/board-mission-station-filter-groups";
import { IProductionStatus } from "@/widgets/production-floor/interfaces/production-floor-status";
import { FONT_FAMILY } from "@/utils/font-family";

const ProductionDashboardFilters = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { alertFault } = useSnackBar();
  const { callApi } = useGomakeAxios();

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
  const [selectedStatuses, setSelectedStatuses] = useRecoilState(
    productionStatusesState
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

  // Local state for statuses
  const [statusItems, setStatusItems] = useState<
    Array<{ id: string; label: string; readOnly?: boolean }>
  >([]);
  const [statusesLoading, setStatusesLoading] = useState(false);
  const [localSelectedStatuses, setLocalSelectedStatuses] = useState<string[]>(
    []
  );

  // Done status ID constant
  const DONE_STATUS_ID = "done";

  // Fetch statuses on mount
  useEffect(() => {
    const fetchStatuses = async () => {
      setStatusesLoading(true);
      try {
        const response = await getAllBoardMissionStatusApi(callApi, () => {});
        if (response?.success && response?.data) {
          const statuses: IProductionStatus[] = response.data;
          const items = statuses.map((status) => ({
            id: status.id,
            label: t(`productionStatuses.${status.key}`) || status.name,
          }));

          // Add "done" status as read-only option
          const doneItem = {
            id: DONE_STATUS_ID,
            label: t("boardMissions.done") || "Done",
            readOnly: true,
          };

          setStatusItems([...items, doneItem]);
        }
      } catch (error) {
        console.error("Error fetching statuses:", error);
      } finally {
        setStatusesLoading(false);
      }
    };

    fetchStatuses();
  }, [callApi]);

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

    // Initialize local statuses from Recoil, ensure "done" is always included
    const initialStatuses =
      selectedStatuses.length > 0 ? selectedStatuses : [DONE_STATUS_ID];
    if (!initialStatuses.includes(DONE_STATUS_ID)) {
      initialStatuses.unshift(DONE_STATUS_ID);
    }
    setLocalSelectedStatuses(initialStatuses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Status toggle handlers
  const toggleStatus = (statusId: string) => {
    // Prevent unselecting "done" status (read-only)
    if (statusId === DONE_STATUS_ID) {
      return;
    }

    setLocalSelectedStatuses((prev) => {
      // Ensure "done" is always in the selection
      const otherStatuses = prev.filter((id) => id !== DONE_STATUS_ID);

      if (otherStatuses.includes(statusId)) {
        return [
          DONE_STATUS_ID,
          ...otherStatuses.filter((id) => id !== statusId),
        ];
      } else {
        return [DONE_STATUS_ID, ...otherStatuses, statusId];
      }
    });
  };

  const toggleAllStatuses = () => {
    // Exclude read-only "done" from toggle all logic
    const selectableItems = statusItems.filter((item) => !item.readOnly);
    const selectableIds = selectableItems.map((item) => item.id);
    const currentSelectable = localSelectedStatuses.filter(
      (id) => id !== DONE_STATUS_ID
    );

    if (currentSelectable.length === selectableIds.length) {
      // Deselect all (but keep "done")
      setLocalSelectedStatuses([DONE_STATUS_ID]);
    } else {
      // Select all (including "done")
      setLocalSelectedStatuses([DONE_STATUS_ID, ...selectableIds]);
    }
  };

  // Compute button label with selected status names
  const statusButtonLabel = useMemo(() => {
    if (statusesLoading) {
      return t("common.loading") || "Loading...";
    }
    if (localSelectedStatuses.length === 0) {
      return t("dashboard-widget.status") || "Statuses";
    }
    const selectedStatusNames = localSelectedStatuses
      .map((id) => {
        const item = statusItems.find((item) => item.id === id);
        return item?.label || "";
      })
      .filter((name) => name !== "")
      .join(", ");
    // Truncate if too long
    return selectedStatusNames.length > 50
      ? `${selectedStatusNames.substring(0, 50)}...`
      : selectedStatusNames;
  }, [statusesLoading, localSelectedStatuses, statusItems, t]);

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

    // Update statuses state
    setSelectedStatuses(localSelectedStatuses);
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
      <div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 8,
            ...FONT_FAMILY.Lexend(500, 15),
          }}
        >
          <span>{t("dashboard-widget.status") || "Status"}</span>
        </label>
        <MultiSelectDropdown
          items={statusItems}
          selectedIds={localSelectedStatuses}
          onToggle={toggleStatus}
          onToggleAll={toggleAllStatuses}
          buttonLabel={statusButtonLabel}
          buttonStyle={{
            height: "40px",
          }}
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
