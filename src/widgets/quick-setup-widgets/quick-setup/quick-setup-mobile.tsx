import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

const QuickSetipMobileWidget = ({ isMobile }) => {

    const { classes } = useStyle();
    const { t } = useTranslation();

    return (
        <div style={classes.mainMobileContainer}>
            Mobile Page coming soon ...
        </div>
    )
}

export { QuickSetipMobileWidget }