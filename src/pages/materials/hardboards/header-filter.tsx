import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { Skeleton } from "@mui/material";
import { useSupplier } from "@/hooks";

import { useStyle } from "./style";

const HeaderFilter = ({
  hardboardsSizes,
  hardboardsCategores,
  categoryName,
  setHardboardSizes,
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
    setHardboardSizes(hardboardsSizes);
  }, [hardboardsSizes]);

  return (
    <div style={clasess.filterContainer}>
      {hardboardsCategores?.length > 0 ? (
        <GoMakeAutoComplate
          options={hardboardsCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.hardboards.category")}
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
          placeholder={t("materials.hardboards.supplier")}
          onChange={onChangeSupplier}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { HeaderFilter };
