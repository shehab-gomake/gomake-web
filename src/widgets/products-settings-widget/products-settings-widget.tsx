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

const ProductsSettingsWidget = () => {
  const { clasess } = useStyle();
  const { tabs, value, handleChange, setValue, t } = useProductsSettings();
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.mainHeadecontainer}>
        <UsersSettingsTabs
          value={value}
          onChange={handleChange}
          aria-label="tabs example"
        >
          {tabs?.map((tab) => {
            return <UsersSettingsTab label={tab.name} />;
          })}
        </UsersSettingsTabs>
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
        ) : (
          <AddButton
            label={t("products.productManagement.admin.addProduct")}
            onClick={() => setValue(EWidgetProductSettingsTabs.ADD_PRODUCT)}
          />
        )}
      </div>
      <CustomTabPanel
        value={value}
        index={EWidgetProductSettingsTabs.PRODUCT_MANAGMENT}
      >
        <ProductManagementWidget />
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={EWidgetProductSettingsTabs.SHIPMENTS_SETTING}
      >
        "coming soon"
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
    </div>
  );
};

export { ProductsSettingsWidget };
