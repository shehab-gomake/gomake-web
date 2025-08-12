import { CustomerAuthLayout } from "@/layouts";
import { PriceListPageWidget } from "@/pages-components/products/digital-offset-price/digital-offset-price";
import { EWidgetProductType } from "@/pages-components/products/digital-offset-price/enums";
import { useMediaQuery } from "@mui/material";

export default function DigitalOffsetPrice() {
  const isMobileScreen = useMediaQuery("(max-width:768px)");

  return (
    <CustomerAuthLayout staticPageTitle={"calculation errors"} backgroundColor={"#f6f6f6"}>
      <PriceListPageWidget
        widgetType={EWidgetProductType.CALCULATION_ERROR}
        isMobileScreen={isMobileScreen}
      />
    </CustomerAuthLayout>
  );
}
