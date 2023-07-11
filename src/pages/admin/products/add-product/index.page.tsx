import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useAddProduct } from "./use-add-product";

import { useStyle } from "./style";
import SettingsWidget from "./widgets/settings/index.page";
import ParameterWidget from "./widgets/parameters/index.page";
import GraphicWidget from "./widgets/graphic/index.page";

export default function AddProduct() {
  const { clasess } = useStyle();
  const { t, tabs, activeTab } = useAddProduct();

  return (
    <AdminAuthLayout>
      <div style={clasess.mainContainer}>
        <HeaderTitle title={t("products.addProduct.admin.title")} />
        <div style={clasess.headerTabsContainer}>
          {tabs?.map((item, index) => {
            return (
              <div
                key={index}
                style={clasess.headerTabContainer}
                onClick={item.onclick()}
              >
                <div>
                  {item?.name === activeTab ? item.activeIcon : item?.icon}
                </div>
                <div
                  style={
                    item.name === activeTab
                      ? clasess.activeStyle
                      : clasess.unActiveStyle
                  }
                >
                  {item?.name}
                </div>
              </div>
            );
          })}
        </div>
        {activeTab === "Settings" ? (
          <SettingsWidget />
        ) : activeTab === "Parameters" ? (
          <ParameterWidget />
        ) : (
          <GraphicWidget />
        )}
      </div>
    </AdminAuthLayout>
  );
}
