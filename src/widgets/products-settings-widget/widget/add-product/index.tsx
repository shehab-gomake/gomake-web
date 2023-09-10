import { useAddProduct } from "./use-add-product";
import {
  GraphicWidget,
  HeaderTitle,
  ParameterWidget,
  SettingsWidget,
} from "@/widgets";
import { useStyle } from "./style";

const AddProductWidget = () => {
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
    <div style={clasess.mainContainer}>
      <HeaderTitle
        title={t("products.addProduct.admin.title")}
        marginTop={-29}
        marginBottom={20}
      />
      <div style={clasess.headerTabsContainer}>
        {tabs?.map((item, index) => {
          return (
            <div key={index} style={clasess.headerTabContainer}>
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
        />
      ) : activeTab === "Parameters" ? (
        <ParameterWidget />
      ) : (
        <GraphicWidget />
      )}
    </div>
  );
};

export { AddProductWidget };
