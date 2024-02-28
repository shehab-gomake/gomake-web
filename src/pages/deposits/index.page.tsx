import { CustomerAuthLayout } from "@/layouts";
import { DepositsListPageWidget } from "@/pages-components/deposits/deposits";


export default function Invoices() {
  return (
    <CustomerAuthLayout>
        <DepositsListPageWidget/>
    </CustomerAuthLayout>
  );
}
