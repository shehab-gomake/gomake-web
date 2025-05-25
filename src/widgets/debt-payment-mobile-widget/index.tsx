import { useStyle } from "./style";
import { InfoContainer } from "./components/info-container";
import { DebtItems } from "./components/debt-items";
import { useTranslation } from "react-i18next";
import { CreditCardPaySection } from "../quote-confirmation-mobile/components/credit-card-pay-section";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const DebtPaymentMobileWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={classes.mainContainer}>
      <InfoContainer />
      <DebtItems />
      <div style={classes.borderContainer} />
      <div style={classes.titleStyle}>{t("payment.paymentDetails")}</div>
      <CreditCardPaySection
        documentType={DOCUMENT_TYPE.quote}
        isDebtPayments={true}
      />
    </div>
  );
};

export { DebtPaymentMobileWidget };
