import { CustomerAuthLayout } from "@/layouts/customer-auth-layout";
import dynamic from "next/dynamic";
const QuoteConfirmationPageWidget = dynamic(() => import('@/pages-components/quote-confirmation'), { ssr: false })

export default function QuoteConfirmation() {

  return (
    <CustomerAuthLayout allowAnonymous={true} disableHeaderSideMenu={true}>
        <QuoteConfirmationPageWidget />
    </CustomerAuthLayout>
  );
}
