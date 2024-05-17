import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

const QuickSetupWelcomeMobileWidget = ({ isMobile }) => {

    const { classes } = useStyle();
    const { t } = useTranslation();

    return (
        <div >
            Mobile Page coming soon ...
        </div>
    )
}

export { QuickSetupWelcomeMobileWidget }