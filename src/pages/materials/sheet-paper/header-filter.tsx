import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { useSheetPaper } from "./use-sheet-paper";
import { useStyle } from "./style";
import { useEffect } from "react";

const HeaderFilter = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { suppliers, getSupplier, getSupplierCurrencies } = useSupplier();
  const { sheetCategories, categoryName, onChangeCategory, onChangeSupplier } =
    useSheetPaper();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  return (
    <div style={clasess.filterContainer}>
      {sheetCategories?.length > 0 && (
        <GoMakeAutoComplate
          options={sheetCategories}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.sheetPaper.category")}
          onChange={onChangeCategory}
          value={categoryName}
        />
      )}
      {suppliers?.length > 0 && (
        <GoMakeAutoComplate
          options={suppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.sheetPaper.supplier")}
          onChange={onChangeSupplier}
        />
      )}
    </div>
  );
};
export { HeaderFilter };
