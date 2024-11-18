import { useProductsSettings } from "./use-products-settings";
import { ProductManagementWidget } from "./widget/product-management";
import {
  CustomTabPanel,
  UsersSettingsTab,
  UsersSettingsTabs,
} from "../settings-users/tabs";
import { useStyle } from "./style";
import { AddProductWidget } from "./widget/add-product";
import { AddButton } from "@/components/button/add-button";
import { GomakePrimaryButton } from "@/components";
import { LeftArrowIcon } from "@/icons";
import { EWidgetProductSettingsTabs } from "./enums";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";
import { ShipmentsSetting } from "./widget/shipments-setting";
import { AddShipmentModal } from "./widget/shipments-setting/add-shipment-modal";

const ProductsSettingsWidget = () => {
  const { clasess } = useStyle();
  const router = useRouter();
  const {
    t,
    tabs,
    value,
    handleChange,
    setValue,
    openModal,
    handleCloseModal,
    handleOpenModal,
    tableHeaders,
    allShipmentTypes,
    getAllShipmentTypes,
  } = useProductsSettings();

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.mainHeadecontainer}>
        <PermissionCheck userPermission={Permissions.SHOW_PRODUCTS}>
          <UsersSettingsTabs
            value={value}
            onChange={handleChange}
            aria-label="tabs example"
          >
            {tabs?.map((tab) => {
              return <UsersSettingsTab label={tab?.name} />;
            })}
          </UsersSettingsTabs>
        </PermissionCheck>
        {!router.query.productId && (
          <>
            {value === 3 ? (
              <GomakePrimaryButton
                style={clasess.gobackBtnStyle}
                leftIcon={<LeftArrowIcon />}
                onClick={() =>
                  setValue(EWidgetProductSettingsTabs.PRODUCT_MANAGMENT)
                }
              >
                {t("products.productManagement.admin.goBack")}
              </GomakePrimaryButton>
            ) : value === 1 ? (
              <PermissionCheck userPermission={Permissions.SHOW_SHIPMENT_TYPES}>
                <AddButton
                  style={{ textTransform: "inherit" }}
                  label={t("shipmentTypes.addNewShipmentType")}
                  onClick={handleOpenModal}
                />
              </PermissionCheck>
            ) : (
              <PermissionCheck userPermission={Permissions.ADD_PRODUCT}>
                <AddButton
                  label={t("products.productManagement.admin.addProduct")}
                  onClick={() =>
                    setValue(EWidgetProductSettingsTabs.ADD_PRODUCT)
                  }
                />
              </PermissionCheck>
            )}
          </>
        )}
      </div>
      <CustomTabPanel
        value={value}
        index={EWidgetProductSettingsTabs.PRODUCT_MANAGMENT}
      >
        <PermissionCheck userPermission={Permissions.SHOW_PRODUCTS}>
          <Stack data-tour={"productsSettingsWidget"}>
            <ProductManagementWidget />
          </Stack>
        </PermissionCheck>
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={EWidgetProductSettingsTabs.SHIPMENTS_SETTING}
      >
        <ShipmentsSetting
          getAllShipmentTypes={getAllShipmentTypes}
          tableHeaders={tableHeaders}
          allShipmentTypes={allShipmentTypes}
        />
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={EWidgetProductSettingsTabs.PRICING_SETTING}
      >
        coming soon
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={EWidgetProductSettingsTabs.ADD_PRODUCT}
      >
        <AddProductWidget />
      </CustomTabPanel>
      <AddShipmentModal
        openModal={openModal}
        onClose={handleCloseModal}
        getAllShipmentTypes={getAllShipmentTypes}
      />
    </div>
  );
};

export { ProductsSettingsWidget };
