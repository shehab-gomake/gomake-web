import { AddPlusIcon } from "@/icons";

import { useProductsSettings } from "./use-products-settings";
import { useStyle } from "./style";
import { ProductManagementWidget } from "./widget/product-management";

const ProductsSettingsWidget = () => {
  const { clasess } = useStyle();
  const { tabs, activeTab, setActiveTab, navigate, t } = useProductsSettings();
  const _renderActiveWidget = (tabName: string) => {
    if (tabName === "Product management") {
      return <ProductManagementWidget />;
    } else if (tabName === "Shipments setting") {
      return "coming soon";
    } else if (tabName === "Pricing setting") {
      return "coming soon";
    }
  };
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.mainHeadecontainer}>
        <div style={clasess.tabsContainer}>
          {tabs?.map((tab) => {
            return (
              <>
                {tab.name === activeTab ? (
                  <div
                    onClick={() => setActiveTab(tab.name)}
                    style={clasess.tabActiveContainer}
                  >
                    {tab.name}
                  </div>
                ) : (
                  <div
                    onClick={() => setActiveTab(tab.name)}
                    style={clasess.tabUnActiveContainer}
                  >
                    {tab.name}
                  </div>
                )}
              </>
            );
          })}
        </div>
        <div
          style={clasess.addProductBtnStyle}
          onClick={() => navigate("/products/add-product")}
        >
          <AddPlusIcon stroke="#101020" />
          <div style={clasess.addProductBtnText}>
            {t("products.productManagement.admin.addProduct")}
          </div>
        </div>
      </div>
      {_renderActiveWidget(activeTab)}
    </div>
  );
};

export { ProductsSettingsWidget };
