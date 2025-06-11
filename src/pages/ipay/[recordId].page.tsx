import { CustomerAuthLayout } from "@/layouts/customer-auth-layout";
import { QuoteConfirmationPageWidget } from "@/pages-components/quote-confirmation";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

export default function PrePaymentInvoice() {
  return (
    <CustomerAuthLayout staticPageTitle={"payment"} allowAnonymous={true} disableHeaderSideMenu={true}>
      <QuoteConfirmationPageWidget
        isPrePaymentPage={true}
        documentType={DOCUMENT_TYPE.invoice}
      />
    </CustomerAuthLayout>
  );
}
