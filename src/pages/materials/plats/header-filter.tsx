import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { usePlats } from "./use-plats";
import { useEffect } from "react";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";

const HeaderFilter = ({ setbraceSizes }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    braceCategores,
    categoryName,
    braceSizes,
    onChangeCategory,
    onChangeSupplier,
  } = usePlats();
  const { getSupplier, getSupplierCurrencies, suppliers } = useSupplier();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setbraceSizes(braceSizes);
  }, [braceSizes]);
  return (
    <div style={clasess.filterContainer}>
      {braceCategores?.length > 0 ? (
        <GoMakeAutoComplate
          options={braceCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.plat.category")}
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
          placeholder={t("materials.plat.supplier")}
          onChange={onChangeSupplier}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { HeaderFilter };
