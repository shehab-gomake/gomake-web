import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { GraphicWidget, ParameterWidget, SettingsWidget } from "@/widgets";
import { PrimaryButton } from "@/components/button/primary-button";

import { useAddProduct } from "./use-add-product";
import { useStyle } from "./style";
import { WorkFlowsWidget } from "@/widgets/shared-admin-customers/add-product/work-flows-widget";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { HotFolderWidget } from "@/widgets/shared-admin-customers/add-product/hot-folder-widget";

const EditProductWidget = () => {
  const { classes } = useStyle();
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
    getProductById,
  } = useAddProduct();
  // const WorkFlowsTab = {
  //   id: "c66465de-95d6-4ea3-bd3f-7efe6664cb0555",
  //   name: t("pricingWidget.workFlow"),
  //   icon: "pricing",
  // };
  return (
    <>
      <div style={classes.mainContainer}>
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
            style={classes.backButtonStyle}
          >
            {t("materials.buttons.back")}
          </PrimaryButton>
          <h1 style={classes.header}>
            {t("products.addProduct.admin.editProduct")}
          </h1>
          {router?.query?.productName && (
            <h4 style={classes.subHeader}>/ {router?.query?.productName}</h4>
          )}
        </div>
        <div style={classes.headerTabsContainer}>
          {tabs
            ?.filter((item) => item.permission)
            ?.map((item, index) => {
              return (
                <div
                  key={index}
                  style={classes.headerTabContainer}
                  onClick={item.onclick()}
                >
                  <div>
                    {item?.name === activeTab ? item.activeIcon : item?.icon}
                  </div>
                  <div
                    style={
                      item.name === activeTab
                        ? classes.activeStyle
                        : classes.unActiveStyle
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
        ) : activeTab === t("pricingWidget.workFlow") ? (
          <PermissionCheck
            userPermission={Permissions.ADD_WORK_FLOW_TO_PRODUCT}
          >
            <WorkFlowsWidget
              productState={productState}
              getProductById={getProductById}
            />
          </PermissionCheck>
        ) : activeTab === t("pricingWidget.hotFolder") ? (
          <PermissionCheck
            userPermission={Permissions.ADD_HOT_FOLDER_TO_PRODUCT}
          >
            <HotFolderWidget />
          </PermissionCheck>
        ) : (
          <GraphicWidget />
        )}
      </div>
    </>
  );
};

export { EditProductWidget };
