import { useStyle } from "./style";
import { SignUpCompanyForm } from "../company/signup-company-form";
import Image from "next/image";
import rocket2 from "./rocket2.png";

const QuickSetUpWidget = () => {

    const { classes } = useStyle();

    return (
        <div style={classes.mainContainer}>
            <div style={classes.leftSide}>
                <SignUpCompanyForm />
            </div>
            <div style={classes.rightSide}>
                <Image src={rocket2} alt="gomake" priority />
                <div style={classes.joinNowStyle}>Join Gomake now!</div>
            </div>
        </div>
    )
}

export { QuickSetUpWidget }