import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { useEffect } from "react";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";

const HeaderFilter = ({
  setFoilsSizes,
  onChangeSupplier,
  onChangeCategory,
  foilsCategories,
  categoryName,
  foilsSizes,
}: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { getSupplier, getSupplierCurrencies, suppliers } = useSupplier();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setFoilsSizes(foilsSizes);
  }, [foilsSizes]);
  return (
    <div style={clasess.filterContainer}>
      {foilsCategories?.length > 0 ? (
        <GoMakeAutoComplate
          options={foilsCategories}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.foils.category")}
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
          placeholder={t("materials.foils.supplier")}
          onChange={onChangeSupplier}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { HeaderFilter };
