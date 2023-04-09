import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { useBrace } from "./use-brace";
import { useStyle } from "./style";
import { useEffect } from "react";

const HeaderFilter = ({ setbraceSizes }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    braceCategores,
    categoryName,
    braceSizes,
    onChangeCategory,
    onChangeSupplier,
  } = useBrace();
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
      {braceCategores?.length > 0 && (
        <GoMakeAutoComplate
          options={braceCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.plat.category")}
          onChange={onChangeCategory}
          value={categoryName}
        />
      )}
      {suppliers?.length > 0 && (
        <GoMakeAutoComplate
          options={suppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.plat.supplier")}
          onChange={onChangeSupplier}
        />
      )}
    </div>
  );
};
export { HeaderFilter };
