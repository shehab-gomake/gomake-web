import { CustomerAuthLayout } from "@/layouts/customer-auth-layout";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import dynamic from "next/dynamic";
const QuoteConfirmationPageWidget = dynamic(() => import('@/pages-components/quote-confirmation'), { ssr: false })

export default function PrePaymentOrder() {
  return (
    <CustomerAuthLayout allowAnonymous={true} disableHeaderSideMenu={true}>
        <QuoteConfirmationPageWidget
            isPrePaymentPage={true}
            documentType={DOCUMENT_TYPE.order}
        />
    </CustomerAuthLayout>
  );
}
