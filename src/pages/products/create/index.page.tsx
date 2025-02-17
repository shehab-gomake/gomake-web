import { CustomerAuthLayout } from "@/layouts";
import { PriceListPageWidget } from "@/pages-components/products/digital-offset-price/digital-offset-price";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";
import { useMediaQuery } from "react-responsive";

export default function DigitalOffsetPrice() {
  const isMobileScreen = useMediaQuery({ query: "(max-width: 700px)" });

  return (
    <CustomerAuthLayout
      disableHeaderSideMenu={isMobileScreen}
      backgroundColor={"#f6f6f6"}
    >
      <PriceListPageWidget
        widgetType={EWidgetProductType.CREATE}
        isMobileScreen={isMobileScreen}
      />
    </CustomerAuthLayout>
  );
}
