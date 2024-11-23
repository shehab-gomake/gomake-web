import { CustomerAuthLayout } from "@/layouts";
import { Permissions } from "../../components/CheckPermission/enum";
import { PriceProfitWidge } from "@/widgets/price-profit-widge";

export default function PriceProfit() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.TRANSLATION_ADMIN}>
      <PriceProfitWidge />
    </CustomerAuthLayout>
  );
}
