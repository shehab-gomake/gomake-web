import { useTranslation } from "react-i18next";
import { useEffect } from "react";

import { GoMakeAutoComplate } from "@/components";
import { Skeleton } from "@mui/material";
import { useSupplier } from "@/hooks";

import { useStyle } from "./style";

const HeaderFilter = ({
  setAllSizes,
  applicationCategories,
  categoryName,
  allSizes,
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
    setAllSizes(allSizes);
  }, [allSizes]);

  return (
    <div style={clasess.filterContainer}>
      {applicationCategories?.length > 0 ? (
        <GoMakeAutoComplate
          options={applicationCategories}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.applications.category")}
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
