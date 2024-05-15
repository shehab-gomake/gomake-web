import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { SignupCompanyForm } from "../company/signup-company-form";
import Image from "next/image";

const QuickSetipWidget = () => {

    const { classes } = useStyle();
    const { t } = useTranslation();

    return (
        <div style={classes.mainContainer}>
            <div style={classes.leftSide}>
                <SignupCompanyForm />
            </div>
            <div style={classes.rightSide}>
                <Image src={"https://s3-alpha-sig.figma.com/img/dfc6/85bf/bd8addec32eb0ed5a0633bb7cb8d8196?Expires=1716768000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FVKwtQWnFWFb8kMP5ZWX023Eb0oboo-MzXoQb~9VyauhOPrM1t1mgN2jL4LCRhMd9XDHDyDkKhRr31-gN0fEzPDYChYkUJ2o-EJFJ5cjnXxL6Y-eK5ZtzbitAHIi2ofRHtYo13fuCMa42lbMsbXkNDpe5GxFgb8lJamSiWzJ7tK72~Rlaa~JHmJTGqxQAHpTMrSWiTavflnvbJg7ZnoPriVFMtskK4C8Rhsklf5BJTptzpri~fqR3T7gcy9JBy2zsjD-CpWDcQSrje9FoX9xQ7Xy~20cZp-BVgjBdGUkqE4ksBBcFNSOjsFliSzQm5OKdWBeAjh5IIHrbxK1vASg3w__"} alt="" width={550} height={415} />
                <div style={classes.titleStyle}>Let’s get personal. Share your details with us!</div>
                <div style={classes.joinNowStyle}>Join Gomake now!</div>
            </div>
        </div>
    )
}

export { QuickSetipWidget }