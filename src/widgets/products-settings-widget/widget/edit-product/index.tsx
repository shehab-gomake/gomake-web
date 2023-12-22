import {
  GraphicWidget,
  HeaderTitle,
  ParameterWidget,
  SettingsWidget,
} from "@/widgets";
import { useStyle } from "./style";
import { useAddProduct } from "./use-add-product";

const EditProductWidget = () => {
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
    <>
      <div style={clasess.mainContainer}>
        <HeaderTitle
          title={t("products.addProduct.admin.editProduct")}
          marginTop={1}
          marginBottom={20}
        />
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
    </>
  );
};

export { EditProductWidget };
