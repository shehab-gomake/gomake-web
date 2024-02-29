import { CustomerAuthLayout } from "@/layouts";
import { DepositsListPageWidget } from "@/pages-components/deposits/deposits";


export default function Deposits() {
  return (
    <CustomerAuthLayout>
        <DepositsListPageWidget/>
    </CustomerAuthLayout>
  );
}
