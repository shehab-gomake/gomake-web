import { useRecoilValue } from "recoil";
import { QuoteForPriceTable } from "@/widgets/quote-new/quote-table";
import { HeaderTitle } from "@/widgets";
import { quoteConfirmationState } from "@/store";
import { useStyle } from "./style";
import { _renderQuoteStatus } from "@/utils/constants";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { CreditCardPaySection } from "@/widgets/quote-confirmation-mobile/components/credit-card-pay-section";
import { QuoteNewPageSkeletonWidget } from "../quote-new/quote-skeleton";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { DisabledContactMapping } from "@/widgets/quote-new/contact-widget/disabled-contact-mapping";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { DebtPaymentMobileWidget } from "@/widgets/debt-payment-mobile-widget";
import { QuoteConfirmationMobileSkeltonWidget } from "@/widgets/quote-confirmation-mobile/components/quote-confirmation-mobile-skelton";

interface IProps {
  documentType: DOCUMENT_TYPE;
  isMobile: boolean;
}

const DebtPaymentWidget = ({ documentType, isMobile = false }: IProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle(true);
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);

  const columnWidths = ["5%", "25%", "20%", "25%", "25%"];
  const tableHeaders = [
    "#",
    t("payment.documentDate"),
    t("payment.documentNumber"),
    t("payment.documentType"),
    t("payment.sum"),
  ];

  const [debtItems, setDebtItems] = useState<any>([]);

  useEffect(() => {
    setDebtItems(quoteConfirm?.debtsToPay || []);
  }, [quoteConfirm]);

  return (
    <>
      {!quoteConfirm?.client?.id ? (
        isMobile ? (
          <QuoteConfirmationMobileSkeltonWidget />
        ) : (
          <QuoteNewPageSkeletonWidget />
        )
      ) : isMobile ? (
        <DebtPaymentMobileWidget />
      ) : (
        <div data-tour={"quoteStep1"} style={classes.mainContainer}>
          <div style={classes.secondContainer}>
            <div style={{ paddingLeft: 20, paddingRight: 12 }}>
              <div style={classes.titleQuoteContainer}>
                <HeaderTitle
                  title={t("sales.list.debtPaymentDetails")}
                  marginBottom={1}
                  marginTop={1}
                  color="rgba(241, 53, 163, 1)"
                />
              </div>
              <div style={classes.firstBorder} />
              <div
                style={classes.borderSecondContainer}
                className="custom-scrollbar"
              >
                <ClientAutocomplete
                  uiType="updated"
                  value={quoteConfirm?.client?.name}
                  isUpdate={false}
                  setIsUpdate={() => {}}
                  getOptionLabel={(item) => item.text}
                  isFromCartPage={true}
                  options={[]}
                />
                <DisabledContactMapping
                  item={{
                    contactEmail: quoteConfirm.contactEmail,
                    contactPhone: quoteConfirm.contactPhone,
                    contactName: quoteConfirm.contactName,
                  }}
                />
              </div>
            </div>
            <div
              style={{
                flex: 0.9,
                overflow: "auto",
                paddingLeft: 20,
                paddingRight: 12,
              }}
            >
              <QuoteForPriceTable
                documentType={documentType}
                documentItems={debtItems}
                isPrePaymentPage={true}
                tableHeaders={tableHeaders}
                columnWidths={columnWidths}
                isDebtPayments={true}
              />
              <div style={classes.borderContainer} />
              <div style={classes.titleStyle}>
                {t("payment.paymentDetails")}
              </div>
              <CreditCardPaySection
                isFromBigScreen={true}
                documentType={documentType}
                isDebtPayments={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { DebtPaymentWidget };
