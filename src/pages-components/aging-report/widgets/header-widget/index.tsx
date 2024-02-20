import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useState } from "react";


const AgingReportHeaderWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation()
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.statusFilterContainer}>
        <h3 style={clasess.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
        <div style={{ width: "100%" }}>
          <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
        </div>
      </div>
    </div>
  );
};
export { AgingReportHeaderWidget };
