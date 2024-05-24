import { useStyle } from "./style";
import { SignupCompanyForm } from "../company/signup-company-form";
import Image from "next/image";
import rocket2 from "./rocket2.png";

const QuickSetipWidget = () => {

    const { classes } = useStyle();

    return (
        <div style={classes.mainContainer}>
            <div style={classes.leftSide}>
                <SignupCompanyForm />
            </div>
            <div style={classes.rightSide}>
                <Image src={rocket2} alt="gomake" priority />
                {/* <Image src={"https://gomake-contents.s3.eu-west-3.amazonaws.com/quick-setup.png"} alt="" width={550} height={415} /> */}
                {/* <div style={classes.titleStyle}>Let’s get personal. Share your details with us!</div> */}
                <div style={classes.joinNowStyle}>Join Gomake now!</div>
            </div>
        </div>
    )
}

export { QuickSetipWidget }