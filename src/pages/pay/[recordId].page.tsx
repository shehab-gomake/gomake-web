import { CustomerAuthLayout } from "@/layouts/customer-auth-layout";
import { QuoteConfirmationPageWidget } from "@/pages-components/quote-confirmation";


export default function PrePayment() {

  return (
    <CustomerAuthLayout allowAnonymous={true} disableHeaderSideMenu={true}>
      <QuoteConfirmationPageWidget isPrePaymentPage={true} />
    </CustomerAuthLayout>
  );
}
