import { Autocomplete, Box, Select, Typography } from "@mui/material";
import { useStyle } from "./style";
import { VatReportHeaderWidgetProps } from "./use-header-widget";


import { DateRangePicker } from "rsuite";
import { predefinedRanges } from "@/utils/dateRanges";
import { useTranslation } from "react-i18next";
import { createGlobalStyle } from "styled-components";

import { DateField } from "@/components/date-picker/date-filed";
import { formatDateToISOString } from "@/components/date-time/date-time-component";

const VatReportHeaderWidget = ({
    fromDate,
    toDate,
    handleFromDateChange,
    handleToDateChange
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
                <Box display="flex" gap={2} width="100%">
                    <DateField
                        label={t("general.startDate")}
                        date={formatDateToISOString(fromDate)}
                        handleChange={handleFromDateChange}
                        isEditable={true}
                        withTime={false}
                        inputWidth="100%"
                        direction="column"
                        compactMode={true}
                    />
                    <DateField
                        label={t("general.endDate")}
                        date={formatDateToISOString(toDate)}
                        handleChange={handleToDateChange}
                        isEditable={true}
                        withTime={false}
                        inputWidth="100%"
                        direction="column"
                        compactMode={true}
                    />
                </Box>
            </div>
        </div>
    );
};

export { VatReportHeaderWidget }; 