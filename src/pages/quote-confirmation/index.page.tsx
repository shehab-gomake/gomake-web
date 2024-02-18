import { CustomerAuthLayout } from "@/layouts/customer-auth-layout";
import { QuoteConfirmationPageWidget } from "@/pages-components/quote-confirmation";


export default function QuoteConfirmation() {
  
  return (
      <CustomerAuthLayout allowAnonymous={true} >
          <QuoteConfirmationPageWidget />
      </CustomerAuthLayout>
  );
}
