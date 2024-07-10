import { useStyle } from "./style";
import { SignUpCompanyForm } from "../company/signup-company-form";

const QuickSetupMobileWidget = ({ isMobile }) => {

    const { classes } = useStyle();

    return (
        <div style={classes.mainMobileContainer}>
            <SignUpCompanyForm isMobile={isMobile} />
        </div>
    )
}

export { QuickSetupMobileWidget }