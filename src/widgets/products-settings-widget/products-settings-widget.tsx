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

const ProductsSettingsWidget = () => {
  const { clasess } = useStyle();
  const { tabs, value, navigate, handleChange, setValue, t } =
    useProductsSettings();
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
        <AddButton
          label={t("products.productManagement.admin.addProduct")}
          onClick={() => setValue(3)}
        />
      </div>
      <CustomTabPanel value={value} index={0}>
        <ProductManagementWidget />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        "coming soon"
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        coming soon
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <AddProductWidget />
      </CustomTabPanel>
    </div>
  );
};

export { ProductsSettingsWidget };
