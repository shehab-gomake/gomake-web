import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { GraphicWidget, ParameterWidget, SettingsWidget } from "@/widgets";
import { PrimaryButton } from "@/components/button/primary-button";

import { useAddProduct } from "./use-add-product";
import { useStyle } from "./style";

const EditProductWidget = () => {
  const { clasess } = useStyle();
  const {
    t,
    tabs,
    activeTab,
    onClickParametersTab,
    onChangeStateProduct,
    productState,
    router,
    dir,
    handleGoBack,
  } = useAddProduct();

  return (
    <>
      <div style={clasess.mainContainer}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 5,
            marginBottom: 30,
          }}
        >
          <PrimaryButton
            variant={"text"}
            onClick={handleGoBack}
            startIcon={dir === "ltr" ? <ArrowBackIcon /> : <ArrowForwardIcon />}
            style={clasess.backButtonStyle}
          >
            {t("materials.buttons.back")}
          </PrimaryButton>
          <h1 style={clasess.header}>
            {t("products.addProduct.admin.editProduct")}
          </h1>
          {router?.query?.productName && (
            <h4 style={clasess.subHeader}>/ {router?.query?.productName}</h4>
          )}
        </div>
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
        {activeTab === t("products.addProduct.admin.settings") ? (
          <SettingsWidget
            onClickParametersTab={onClickParametersTab}
            onChangeStateProduct={onChangeStateProduct}
            productState={productState}
            isUpdate={true}
          />
        ) : activeTab === t("products.addProduct.admin.parameters") ? (
          <ParameterWidget />
        ) : (
          <GraphicWidget />
        )}
      </div>
    </>
  );
};

export { EditProductWidget };
