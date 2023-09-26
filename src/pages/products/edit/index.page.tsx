import { CustomerAuthLayout } from "@/layouts";
import { PriceListPageWidget } from "@/pages-components/products/digital-offset-price/digital-offset-price";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";

export default function DigitalOffsetPrice() {
  return (
    <CustomerAuthLayout>
      <PriceListPageWidget widgetType={EWidgetProductType.EDIT} />
    </CustomerAuthLayout>
  );
}
