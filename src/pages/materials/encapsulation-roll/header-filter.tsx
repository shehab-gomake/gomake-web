import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { useEncapsulationRoll } from "./use-encapsulation-roll";
import { useStyle } from "./style";
import { Skeleton } from "@mui/material";

const HeaderFilter = ({
  setAllThickness,
  onChangeCategory,
  onChangeSupplier,
  encapsulationRollCategories,
  allThickness,
  categoryName,
}: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { suppliers, getSupplier, getSupplierCurrencies } = useSupplier();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setAllThickness(allThickness);
  }, [allThickness]);

  return (
    <div style={clasess.filterContainer}>
      {encapsulationRollCategories?.length > 0 ? (
        <GoMakeAutoComplate
          options={encapsulationRollCategories}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.encapsulationRoll.category")}
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
          placeholder={t("materials.encapsulationRoll.supplier")}
          onChange={onChangeSupplier}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { HeaderFilter };
