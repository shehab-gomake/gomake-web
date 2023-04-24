import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";

import { useStyle } from "./style";
import { useEffect } from "react";
import { useSupplier } from "@/hooks";
import { Skeleton } from "@mui/material";

const HeaderFilter = ({
  setTubesssSizes,
  categoryName,
  tubesCategores,
  tubesSizes,
  onChangeCategory,
  onChangeSupplier,
}: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { getSupplier, getSupplierCurrencies, suppliers } = useSupplier();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setTubesssSizes(tubesSizes);
  }, [tubesSizes]);

  return (
    <div style={clasess.filterContainer}>
      {tubesCategores?.length > 0 ? (
        <GoMakeAutoComplate
          options={tubesCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.tubes.category")}
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
          placeholder={t("materials.tubes.supplier")}
          onChange={onChangeSupplier}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { HeaderFilter };
