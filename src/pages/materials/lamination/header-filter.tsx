import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { useStyle } from "./style";
import { Skeleton } from "@mui/material";

const HeaderFilter = ({
  setLaminatioSizes,
  laminationSizes,
  laminationCategores,
  categoryName,
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
    setLaminatioSizes(laminationSizes);
  }, [laminationSizes]);

  return (
    <div style={clasess.filterContainer}>
      {laminationCategores?.length > 0 ? (
        <GoMakeAutoComplate
          options={laminationCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.lamination.category")}
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
