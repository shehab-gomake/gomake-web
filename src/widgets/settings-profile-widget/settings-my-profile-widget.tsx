import { useTranslation } from "react-i18next";
import { UserProfile } from "@/widgets/settings-profile-widget/components/profiles/user-profile";
import { HeaderTitle } from "../header-title";
import { useStyle } from "./style";

const SettingsMyProfileWidget = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  // const {} = useEmployee();
  // const {
  //   getCurrenciesApi,
  //   getProfile,
  //   checkPrintHouseTaxLogin,
  //   taxLoginInfo,
  //   printHouseTaxLogout,
  // } = useCompanyProfile();

  // useEffect(() => {
  //   checkPrintHouseTaxLogin();
  //   getCurrenciesApi().then(() => {
  //     getProfile();
  //   });
  // }, []);

  return (
    <div style={classes.mainContainer}>
      <HeaderTitle marginTop={"0px"} title={t("profileSettings.profileTab")} />
      <UserProfile />
    </div>
  );
};

export { SettingsMyProfileWidget };
