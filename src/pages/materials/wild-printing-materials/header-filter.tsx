import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { useWildPrintingMaterials } from "./use-wild-printing-materials";
import { useStyle } from "./style";
import { Skeleton } from "@mui/material";

const HeaderFilter = ({
  allTypes,
  WildPrintingMaterialCategories,
  categoryName,
  setAllTypes,
  onChangeCategory,
  onChangeSupplier,
}: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { suppliers, getSupplier, getSupplierCurrencies } = useSupplier();

  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setAllTypes(allTypes);
  }, [allTypes]);

  return (
    <div style={clasess.filterContainer}>
      {WildPrintingMaterialCategories?.length > 0 ? (
        <GoMakeAutoComplate
          options={WildPrintingMaterialCategories}
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
