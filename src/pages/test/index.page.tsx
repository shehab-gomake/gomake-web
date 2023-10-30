
import { CustomerAuthLayout } from "@/layouts";
import { ConfirmQuote } from "@/pages-components/quote/confirm";


export default function Home() {
 
  return (
    <CustomerAuthLayout>
        <ConfirmQuote/>
    </CustomerAuthLayout>
  );
}