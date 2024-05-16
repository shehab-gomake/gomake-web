import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { SignupCompanyForm } from "../company/signup-company-form";

const QuickSetipMobileWidget = ({ isMobile }) => {

    const { classes } = useStyle();
    const { t } = useTranslation();

    return (
        <div style={classes.mainMobileContainer}>
            <SignupCompanyForm isMobile={isMobile} />
        </div>
    )
}

export { QuickSetipMobileWidget }