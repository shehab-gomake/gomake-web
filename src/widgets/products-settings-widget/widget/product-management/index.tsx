import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { GoMakeAutoComplate } from "@/components";
import { useProductManagement } from "./use-product-management";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { PrimaryTable } from "@/components/tables/primary-table";

const ProductManagementWidget = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    tableHeaders,
    allProducts,
    term,
    productSearched,
    setTerm,
    allProductSKU,
  } = useProductManagement();
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.subHeaderContainer}>
        <div style={clasess.subHeaderLeftSide}>
          <div style={clasess.selectProductContainer}>
            <div style={clasess.selectProductTextStyle}>
              {t("products.productManagement.admin.selectProduct")}
            </div>
            <div style={{ width: "100%" }}>
              <GoMakeAutoComplate
                options={allProductSKU}
                placeholder={t("products.addProduct.admin.modalProductSKU")}
                style={clasess.dropDownListStyle}
                getOptionLabel={(option: any) => option.name}
                onChange={(e: any, value: any) => {
                  setTerm(value?.code);
                }}
              />
            </div>
          </div>
          {/* <GomakePrimaryButton
            style={clasess.cleanUpContainer}
            onClick={() => {
              setTerm("");
            }}
          >
            {t("products.productManagement.admin.cleanUp")}
          </GomakePrimaryButton>
          <GomakePrimaryButton style={clasess.searchContainer}>
            {t("products.productManagement.admin.search")}
          </GomakePrimaryButton> */}
        </div>
        <div style={clasess.subHeaderRightSide}>
          <SearchInputComponent onChange={setTerm} />
        </div>
      </div>
      {term ? (
        <PrimaryTable rows={productSearched} headers={tableHeaders} />
      ) : (
        <PrimaryTable rows={allProducts} headers={tableHeaders} />
      )}
      {/* <div style={clasess.filtersSwichContainer}>
        <div style={clasess.filterSwichContainer}>
          <SecondSwitch />
          <div style={clasess.labelTextContainer}>
            Price correction 1 for quantities
          </div>
        </div>
        <div style={clasess.filterSwichContainer}>
          <SecondSwitch />
          <div style={clasess.labelTextContainer}>
            Price correction 2 for quantities
          </div>
        </div>
        <div style={clasess.filterSwichContainer}>
          <SecondSwitch />
          <div style={clasess.labelTextContainer}>
            Takes a maximum for the quantity in purchase orders
          </div>
        </div>
      </div> */}
    </div>
  );
};

export { ProductManagementWidget };
