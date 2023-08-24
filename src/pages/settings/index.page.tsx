import { useTranslation } from "react-i18next";
import { InputAdornment } from "@mui/material";

import {
  GoMakeAutoComplate,
  GoMakeTextInputIcon,
  GomakePrimaryButton,
} from "@/components";
import { AddPlusIcon, SearchIcon } from "@/icons";
import { CustomerAuthLayout } from "@/layouts";
import { useGomakeRouter } from "@/hooks";
import { HeaderTitle } from "@/widgets";

import { useSettings } from "./use-settings";
import { Row } from "./widget/row";

import { useStyle } from "./style";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { navigate } = useGomakeRouter();
  const {
    tableHeaders,
    allProducts,
    term,
    productSearched,
    allProductSKU,
    setTerm,
  } = useSettings();
  return (
    <CustomerAuthLayout>
      <div style={clasess.mainContainer}>
        <div style={clasess.mainHeadecontainer}>
          <HeaderTitle
            title={t("products.productManagement.admin.title")}
            marginBottom={40}
          />
          <GomakePrimaryButton
            style={clasess.addProductBtnStyle}
            leftIcon={<AddPlusIcon stroke="#101020" />}
            onClick={() => navigate("/products/add-product")}
          >
            <div></div>
            <div style={clasess.addProductBtnText}>
              {t("products.productManagement.admin.addProduct")}
            </div>
          </GomakePrimaryButton>
        </div>
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
            <GomakePrimaryButton
              style={clasess.cleanUpContainer}
              onClick={() => {
                setTerm("");
              }}
            >
              {t("products.productManagement.admin.cleanUp")}
            </GomakePrimaryButton>
            <GomakePrimaryButton style={clasess.searchContainer}>
              {t("products.productManagement.admin.search")}
            </GomakePrimaryButton>
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
      </div>
    </CustomerAuthLayout>
  );
}
