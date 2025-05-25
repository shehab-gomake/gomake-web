import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { HeaderTitle } from "@/widgets/header-title";
import { BusinessWidget } from "./business";
import { ContactsWidget } from "./contacts";

const InfoContainer = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={{ ...classes.mainContainer, marginTop: "16px" }}>
      <HeaderTitle
        title={t("sales.list.debtPaymentDetails")}
        marginBottom={1}
        marginTop={1}
        color="rgba(241, 53, 163, 1)"
      />
      <div style={classes.borderContainer} />
      <BusinessWidget />
      <div style={classes.borderContainer} />
      <ContactsWidget />
      <div style={classes.borderContainer} />
    </div>
  );
};

export { InfoContainer };
