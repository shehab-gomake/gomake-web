import { useStyle } from "./style";
import { SignupCompanyForm } from "../company/signup-company-form";

const QuickSetipMobileWidget = ({ isMobile }) => {

    const { classes } = useStyle();

    return (
        <div style={classes.mainMobileContainer}>
            <SignupCompanyForm isMobile={isMobile} />
        </div>
    )
}

export { QuickSetipMobileWidget }