import { Box, } from "@mui/material";
import { useStyle } from "./style";
import { VatReportHeaderWidgetProps } from "./use-header-widget";


import { useTranslation } from "react-i18next";

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