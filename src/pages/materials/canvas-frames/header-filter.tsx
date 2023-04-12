import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { useCanvasFrames } from "./use-canvas-frames";
import { useEffect } from "react";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";

const HeaderFilter = ({ setAllAdditions }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    allAdditions,
    onChangeSupplier,
    CanvasFramesCategories,
    categoryName,
    onChangeCategory,
  } = useCanvasFrames({});
  const { getSupplier, getSupplierCurrencies, suppliers } = useSupplier();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setAllAdditions(allAdditions);
  }, [allAdditions]);
  return (
    <div style={clasess.filterContainer}>
      {CanvasFramesCategories?.length > 0 ? (
        <GoMakeAutoComplate
          options={CanvasFramesCategories}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.sheetPaper.category")}
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
          placeholder={t("materials.additions.supplier")}
          onChange={onChangeSupplier}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { HeaderFilter };
