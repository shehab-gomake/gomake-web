import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import {
  GoMakeAutoComplate,
  GoMakeTextInputIcon,
  SecondSwitch,
} from "@/components";
import { InputAdornment } from "@mui/material";
import { SearchIcon } from "@/icons";
import { Row } from "../row";
import { useProductManagement } from "./use-product-management";

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
                placeholder={"Product SKU"}
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
          <GoMakeTextInputIcon
            style={clasess.searchInputContainer}
            placeholder={t("header.search")}
            onChange={(e) => {
              setTerm(e.target.value);
            }}
            startAdornment={
              <InputAdornment position="start">
                <div style={clasess.iconStyle}>
                  <SearchIcon />
                </div>
              </InputAdornment>
            }
          />
        </div>
      </div>
      <div style={clasess.tableHeaderStyle}>
        {tableHeaders?.map((item) => {
          return <div style={clasess.headerNameStyle}>{item}</div>;
        })}
      </div>
      {term ? (
        <div style={clasess.row}>
          {productSearched?.map((row: any, index: number) => {
            return (
              <div key={`body_row${index}`} style={{ width: "100%" }}>
                <Row row={row} index={index} />
              </div>
            );
          })}
        </div>
      ) : (
        <div style={clasess.row}>
          {allProducts?.map((row: any, index: number) => {
            return (
              <div key={`body_row${index}`} style={{ width: "100%" }}>
                <Row row={row} index={index} />
              </div>
            );
          })}
        </div>
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
