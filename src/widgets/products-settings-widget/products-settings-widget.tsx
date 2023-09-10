import { AddPlusIcon } from "@/icons";

import { useProductsSettings } from "./use-products-settings";
import { ProductManagementWidget } from "./widget/product-management";
import {
  CustomTabPanel,
  UsersSettingsTab,
  UsersSettingsTabs,
} from "../settings-users/tabs";
import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components";
import { AddProductWidget } from "./widget/add-product";

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
        <GomakePrimaryButton
          style={clasess.addProductBtnStyle}
          leftIcon={<AddPlusIcon stroke="#101020" />}
          onClick={() => setValue(3)}
        >
          <div style={clasess.addProductBtnText}>
            {t("products.productManagement.admin.addProduct")}
          </div>
        </GomakePrimaryButton>
        {/* <div
          style={clasess.addProductBtnStyle}
          onClick={() => navigate("/products/add-product")}
        >
          <AddPlusIcon stroke="#101020" />
          <div style={clasess.addProductBtnText}>
            {t("products.productManagement.admin.addProduct")}
          </div>
        </div> */}
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
