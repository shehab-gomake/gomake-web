import { Stack } from "@mui/material";
import { NoDataIcon } from "./icons/no-data-icon";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

interface NoDataComponentProps {
    subNoDataText: string;
}

const NoDataComponent = ({ subNoDataText }: NoDataComponentProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();

    return (
        <Stack justifyContent={"center"} alignItems={"center"} gap={"16px"}>
            <NoDataIcon />
            <Stack alignItems={"center"} gap={"3px"}>
                <span style={classes.noDataText} >{t("skeleton.noData")}</span>
                <span style={classes.noDataSubText} >{subNoDataText}</span>
            </Stack>
        </Stack>
    );
};

export { NoDataComponent };
