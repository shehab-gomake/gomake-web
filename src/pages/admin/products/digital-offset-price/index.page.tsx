import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useDigitalOffsetPrice } from "./use-digital-offset-price";

import { useStyle } from "./style";

export default function Profits() {
  const { clasess } = useStyle();
  const { t, tabs } = useDigitalOffsetPrice();

  return (
    <AdminAuthLayout>
      <div style={clasess.mainContainer}>
        <HeaderTitle title={t("products.offsetPrice.admin.title2")} />
        <div style={clasess.mainRowContainer}>
          <div style={clasess.leftSideContainer}>
            <div style={clasess.tabsContainer}>
              {tabs.map((item) => {
                return (
                  <div style={clasess.tabContainer}>
                    <div style={{ height: 22 }}>{item.icon}</div>
                    <div style={clasess.tabNameStyle}>{item.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={clasess.rightSideContainer}>f</div>
        </div>
      </div>
    </AdminAuthLayout>
  );
}
