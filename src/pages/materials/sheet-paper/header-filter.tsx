import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { useSheetPaper } from "./use-sheet-paper";
import { useStyle } from "./style";
import { Skeleton } from "@mui/material";

const HeaderFilter = ({ setAllWeights }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { suppliers, getSupplier, getSupplierCurrencies } = useSupplier();
  const {
    sheetCategories,
    categoryName,
    allWeights,
    onChangeCategory,
    onChangeSupplier,
  } = useSheetPaper();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setAllWeights(allWeights);
  }, [allWeights]);

  return (
    <div style={clasess.filterContainer}>
      {sheetCategories?.length > 0 ? (
        <GoMakeAutoComplate
          options={sheetCategories}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.sheetPaper.category")}
          onChange={onChangeCategory}
          value={categoryName}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
      {suppliers?.length > 0 ? (
        <GoMakeAutoComplate
          options={suppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.sheetPaper.supplier")}
          onChange={onChangeSupplier}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { HeaderFilter };
