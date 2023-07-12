import { AdminAuthLayout } from "@/layouts";
import { CategoriesTable } from "@/widgets/materials/categories-table";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";
import { AddIcon, AddPlusIcon, SearchIcon } from "@/icons";
import { GoMakeAutoComplate, GoMakeTextInputIcon } from "@/components";
import { InputAdornment } from "@mui/material";
import { Row } from "../products/actions/widget/row";
import { useSettings } from "./use-settings";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { tableHeaders, allProducts } = useSettings();
  return (
    <AdminAuthLayout>
      <div style={clasess.mainContainer}>
        <div style={clasess.mainHeadecontainer}>
          <HeaderTitle title={t("products.productManagement.admin.title")} />
          <div style={clasess.addProductBtnStyle}>
            <AddPlusIcon stroke="#101020" />
            <div style={clasess.addProductBtnText}>
              {t("products.productManagement.admin.addProduct")}
            </div>
          </div>
        </div>
        <div style={clasess.subHeaderContainer}>
          <div style={clasess.subHeaderLeftSide}>
            <div style={clasess.selectProductContainer}>
              <div style={clasess.selectProductTextStyle}>
                {t("products.productManagement.admin.selectProduct")}
              </div>
              <div style={{ width: "100%" }}>
                <GoMakeAutoComplate
                  options={["a", "b", "c", "d", "e", "f", "g", "h", "i"]}
                  placeholder={"Product SKU"}
                  style={clasess.dropDownListStyle}
                />
              </div>
            </div>
            <div style={clasess.cleanUpContainer}>
              {t("products.productManagement.admin.cleanUp")}
            </div>
            <div style={clasess.searchContainer}>
              {t("products.productManagement.admin.search")}
            </div>
          </div>
          <div style={clasess.subHeaderRightSide}>
            <GoMakeTextInputIcon
              style={clasess.searchInputContainer}
              placeholder={t("header.search")}
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
        <div style={clasess.row}>
          {allProducts?.map((row: any, index: number) => {
            return (
              <div key={`body_row${index}`} style={{ width: "100%" }}>
                <Row row={row} index={index} />
              </div>
            );
          })}
        </div>
      </div>
    </AdminAuthLayout>
  );
}
