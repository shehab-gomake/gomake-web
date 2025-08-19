import { CustomerAuthLayout } from "@/layouts";
import { Permissions } from "../../components/CheckPermission/enum";
import { PriceProfitWidget } from "@/widgets/price-profit-widge";

export default function PriceProfit() {
  return (
    <CustomerAuthLayout
      staticPageTitle={"pricing profile"}
      permissionEnumValue={Permissions.TRANSLATION_ADMIN}
    >
      <PriceProfitWidget />
    </CustomerAuthLayout>
  );
}
