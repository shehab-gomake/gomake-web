import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { useSheetPaper } from "./use-hardboards";
import { useStyle } from "./style";

const HeaderFilter = ({ setHardboardsSizes }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { suppliers, getSupplier, getSupplierCurrencies } = useSupplier();
  const {
    categoryName,
    hardboardsCategores,
    hardboardsSizes,
    onChangeCategory,
    onChangeSupplier,
  } = useSheetPaper();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setHardboardsSizes(hardboardsSizes);
  }, [hardboardsSizes]);

  return (
    <div style={clasess.filterContainer}>
      {hardboardsCategores?.length > 0 && (
        <GoMakeAutoComplate
          options={hardboardsCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.hardboards.category")}
          onChange={onChangeCategory}
          value={categoryName}
        />
      )}
      {suppliers?.length > 0 && (
        <GoMakeAutoComplate
          options={suppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.hardboards.supplier")}
          onChange={onChangeSupplier}
        />
      )}
    </div>
  );
};
export { HeaderFilter };
