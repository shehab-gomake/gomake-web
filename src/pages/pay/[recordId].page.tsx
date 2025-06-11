import { CustomerAuthLayout } from "@/layouts/customer-auth-layout";
import { QuoteConfirmationPageWidget } from "@/pages-components/quote-confirmation";

export default function DebtPayments() {
  return (
    <CustomerAuthLayout staticPageTitle={"payment"} allowAnonymous={true} disableHeaderSideMenu={true}>
      <QuoteConfirmationPageWidget
        isDebtPayments={true}
        isPrePaymentPage={true}
      />
    </CustomerAuthLayout>
  );
}
