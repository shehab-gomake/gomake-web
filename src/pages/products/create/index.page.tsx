import { CustomerAuthLayout } from "@/layouts";
import { PriceListPageWidget } from "@/pages-components/products/digital-offset-price/digital-offset-price";

export default function DigitalOffsetPrice() {
  return (
    <CustomerAuthLayout>
      <PriceListPageWidget widgetType="create" />
    </CustomerAuthLayout>
  );
}
