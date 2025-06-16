import { useProductsSettings } from "./use-products-settings";
import { CustomTabPanel } from "../settings-users/tabs";
import { useStyle } from "./style";
import { AddProductWidget } from "./widget/add-product";
import { AddButton } from "@/components/button/add-button";
import { GomakePrimaryButton } from "@/components";
import { LeftArrowIcon } from "@/icons";
import { EWidgetProductSettingsTabs } from "./enums";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useRouter } from "next/router";
import { AddShipmentModal } from "./widget/shipments-setting/add-shipment-modal";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { Stack } from "@mui/material";
import { HeaderTitle } from "../header-title";
import Head from "next/head";

const ProductsSettingsWidget = () => {
  const { classes } = useStyle();
  const router = useRouter();
  const {
    t,
    tabs,
    value,
    setValue,
    openModal,
    handleCloseModal,
    handleOpenModal,
    getAllShipmentTypes,
  } = useProductsSettings();

  const renderActionButton = (index: number) => {
    switch (index) {
      case EWidgetProductSettingsTabs.PRODUCT_MANAGMENT:
        return (
          <PermissionCheck userPermission={Permissions.ADD_PRODUCT}>
            <AddButton
              label={t("products.productManagement.admin.addProduct")}
              onClick={() => setValue(EWidgetProductSettingsTabs.ADD_PRODUCT)}
            />
          </PermissionCheck>
        );
      case EWidgetProductSettingsTabs.SHIPMENTS_SETTING:
        return (
          <PermissionCheck userPermission={Permissions.SHOW_SHIPMENT_TYPES}>
            <AddButton
              label={t("shipmentTypes.addNewShipmentType")}
              onClick={handleOpenModal}
              style={{ textTransform: "inherit" }}
            />
          </PermissionCheck>
        );
      default:
        return null;
    }
  };

  return (
    <div style={classes.mainContainer}>
        <Head>
            <title>{t("settings.products")}</title>
        </Head>
      <div style={classes.mainHeadecontainer}>
        {value !== EWidgetProductSettingsTabs.ADD_PRODUCT && (
          <PrimaryTabsComponent
            tabs={tabs}
            selectedTabIndex={value}
            onSelectTab={(newIndex) => {
              setValue(newIndex);
            }}
          >
            {!router.query.productId && <div>{renderActionButton(value)}</div>}
          </PrimaryTabsComponent>
        )}
        {!router.query.productId &&
          value === EWidgetProductSettingsTabs.ADD_PRODUCT && (
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <HeaderTitle
                title={t("products.addProduct.admin.title")}
                marginTop={10}
                marginBottom={20}
              />
              <GomakePrimaryButton
                style={classes.goBackBtnStyle}
                leftIcon={<LeftArrowIcon />}
                onClick={() =>
                  setValue(EWidgetProductSettingsTabs.PRODUCT_MANAGMENT)
                }
              >
                {t("products.productManagement.admin.goBack")}
              </GomakePrimaryButton>
            </Stack>
          )}
        {value === EWidgetProductSettingsTabs.ADD_PRODUCT && (
          <CustomTabPanel
            value={value}
            index={EWidgetProductSettingsTabs.ADD_PRODUCT}
          >
            <AddProductWidget />
          </CustomTabPanel>
        )}
      </div>
      <AddShipmentModal
        openModal={openModal}
        onClose={handleCloseModal}
        getAllShipmentTypes={getAllShipmentTypes}
      />
    </div>
  );
};

export { ProductsSettingsWidget };
