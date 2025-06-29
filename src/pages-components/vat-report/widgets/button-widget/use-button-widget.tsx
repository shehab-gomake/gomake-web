import { useTranslation } from "react-i18next";

import { useStyle } from "./style";


const useVatReportHeader = () => {
    const { classes } = useStyle();
    const { t } = useTranslation()

    return {
        classes, t
    };
};

export { useVatReportHeader }; 