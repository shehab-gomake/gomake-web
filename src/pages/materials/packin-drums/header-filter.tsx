import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { useEffect } from "react";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";

const HeaderFilter = ({
  setPackInDrumsSizes,
  onChangeSupplier,
  onChangeCategory,
  packInDrumsCategories,
  categoryName,
  packInDrumsSizes,
}: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { getSupplier, getSupplierCurrencies, suppliers } = useSupplier();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setPackInDrumsSizes(packInDrumsSizes);
  }, [packInDrumsSizes]);
  return (
    <div style={clasess.filterContainer}>
      {packInDrumsCategories?.length > 0 ? (
        <GoMakeAutoComplate
          options={packInDrumsCategories}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.packinDrums.category")}
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
          placeholder={t("materials.packinDrums.supplier")}
          onChange={onChangeSupplier}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { HeaderFilter };
