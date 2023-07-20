import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useAddProduct } from "./use-add-product";

import { useStyle } from "./style";
import SettingsWidget from "@/widgets/shared-admin-customers/add-product/settings/settings-widget";
import ParameterWidget from "@/widgets/shared-admin-customers/add-product/parameters/parameters";
import GraphicWidget from "@/widgets/shared-admin-customers/add-product/graphic/graphic";

export default function EditProduct() {
  const { clasess } = useStyle();
  const {
    t,
    tabs,
    activeTab,
    onClickParametersTab,
    onChangeStateProduct,
    productState,
  } = useAddProduct();

  return (
    <CustomerAuthLayout>
      <div style={clasess.mainContainer}>
        <HeaderTitle title={t("products.addProduct.admin.editProduct")} />
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
          <SettingsWidget
            onClickParametersTab={onClickParametersTab}
            onChangeStateProduct={onChangeStateProduct}
            productState={productState}
            isUpdate={true}
          />
        ) : activeTab === "Parameters" ? (
          <ParameterWidget />
        ) : (
          <GraphicWidget />
        )}
      </div>
    </CustomerAuthLayout>
  );
}
