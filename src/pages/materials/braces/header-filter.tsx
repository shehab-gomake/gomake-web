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
    braceSuppliers,
    braceSizes,
    onChangeCategory,
    onChangeSupplier,
  } = useBrace();
  useEffect(() => {
    setbraceSizes(braceSizes);
  }, [braceSizes]);
  return (
    <div style={clasess.filterContainer}>
      {braceCategores?.length > 0 && (
        <GoMakeAutoComplate
          options={braceCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.brace.category")}
          onChange={onChangeCategory}
          value={categoryName}
        />
      )}
      {braceSuppliers?.length > 0 && (
        <GoMakeAutoComplate
          options={braceSuppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.brace.supplier")}
          onChange={onChangeSupplier}
        />
      )}
    </div>
  );
};
export { HeaderFilter };
