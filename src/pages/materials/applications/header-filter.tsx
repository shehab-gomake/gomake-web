import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { useApplications } from "./use-applications";
import { useStyle } from "./style";
import { Skeleton } from "@mui/material";

const HeaderFilter = ({ setAllSizes }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { suppliers, getSupplier, getSupplierCurrencies } = useSupplier();
  const {
    applicationCategories,
    categoryName,
    allSizes,
    onChangeCategory,
    onChangeSupplier,
  } = useApplications();
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
