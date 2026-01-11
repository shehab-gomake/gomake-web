import { useStyle } from "./style";
import rocket from "./rocket.png";
import hpRocket from "./hp-rocket.png";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { companyProfileState } from "@/store/company-profile";
import { useTheme } from "@/contexts/theme";

const LoginRightSide = () => {
  const { classes } = useStyle();
  const userProfile = useRecoilValue(companyProfileState);
  const { t } = useTranslation();
  const { currentTheme } = useTheme();
  const isHpClient = currentTheme === "hp-client";

  return (
    <div style={classes.rightContainer}>
      <div style={classes.welcomeLbl}>{userProfile?.name}</div>
      <div style={classes.descriptionLbl}>{t("login.weAreExcited")}</div>
      <div>
        <Image
          src={isHpClient ? hpRocket : rocket}
          alt="gomake"
          priority
          width={280}
          height={420}
        />
      </div>
      <div style={classes.poweredContainer}>
        <div style={classes.poweredByLbl}>{t("login.poweredBy")}</div>
        <div style={classes.gomakeByLbl}>{t("login.GoMake")}</div>
      </div>
    </div>
  );
};
export { LoginRightSide };
