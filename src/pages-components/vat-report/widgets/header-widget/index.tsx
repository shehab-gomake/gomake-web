import { Autocomplete, Box, Select, Typography } from "@mui/material";
import { useStyle } from "./style";
import { VatReportHeaderWidgetProps } from "./use-header-widget";


import { DateRangePicker } from "rsuite";
import { predefinedRanges } from "@/utils/dateRanges";
import { useTranslation } from "react-i18next";
import { createGlobalStyle } from "styled-components";

const VatReportHeaderWidget = ({
    fromDate,
    toDate,
    handleDateChange
}: VatReportHeaderWidgetProps) => {
    const { classes } = useStyle();
    const { t } = useTranslation();

    const dir: "rtl" | "ltr" = t("direction");
    const RTL = dir === "rtl";
    const GlobalStyle = createGlobalStyle`
    .rs-picker-popup-daterange {
      left: ${({ RTL }: any) => (RTL ? "auto" : "150px")} !important;
      right: ${({ RTL }: any) => (RTL ? "150px" : "auto")} !important;
    }
  `;

    return (
        <div style={classes.mainContainer}>
            <div style={classes.date1FilterContainer}>
                <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
                <div style={{ width: "100%" }}>
                    <GlobalStyle RTL={RTL} />
                    <DateRangePicker
                        onChange={handleDateChange}
                        value={fromDate && toDate ? [fromDate, toDate] : null}
                        ranges={predefinedRanges}
                    />
                </div>
            </div>
        </div>
    );
};

export { VatReportHeaderWidget }; 