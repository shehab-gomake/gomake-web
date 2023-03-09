import { useStyle } from "./style";
import rocket from "./rocket.png";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const LoginRightSide = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div style={clasess.rightContainer}>
      <div style={clasess.welcomeLbl}>{t("login.welcome")}</div>
      <div style={clasess.descriptionLbl}>{t("login.weAreExcited")}</div>
      <div>
        <Image src={rocket} alt="gomake" priority />
      </div>
      <div style={clasess.poweredContainer}>
        <div style={clasess.poweredByLbl}>{t("login.poweredBy")}</div>
        <div style={clasess.gomakeByLbl}>{t("login.GoMake")}</div>
      </div>
    </div>
  );
};
export { LoginRightSide };
