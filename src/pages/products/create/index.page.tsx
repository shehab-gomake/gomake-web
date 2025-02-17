import { CustomerAuthLayout } from "@/layouts";
import { PriceListPageWidget } from "@/pages-components/products/digital-offset-price/digital-offset-price";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";
import { useMediaQuery } from "react-responsive";

//!here
export default function DigitalOffsetPrice() {
  const isMobileScreen = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <CustomerAuthLayout disableHeaderSideMenu={isMobileScreen}>
      <PriceListPageWidget
        widgetType={EWidgetProductType.CREATE}
        isMobileScreen={isMobileScreen}
      />
    </CustomerAuthLayout>
  );
}
