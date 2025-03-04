import { useStyle } from "./style";
import rocket from "./rocket.png";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { companyProfileState } from "@/store/company-profile";

const LoginRightSide = () => {
  const { classes } = useStyle();
  const userProfile = useRecoilValue(companyProfileState);
  const { t } = useTranslation();

  return (
    <div style={classes.rightContainer}>
      <div style={classes.welcomeLbl}>{userProfile?.name}</div>
      <div style={classes.descriptionLbl}>{t("login.weAreExcited")}</div>
      <div>
        <Image src={rocket} alt="gomake" priority />
      </div>
      <div style={classes.poweredContainer}>
        <div style={classes.poweredByLbl}>{t("login.poweredBy")}</div>
        <div style={classes.gomakeByLbl}>{t("login.GoMake")}</div>
      </div>
    </div>
  );
};
export { LoginRightSide };
