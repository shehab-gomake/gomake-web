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
    onChangeSupplier,
    onChangeCategory,
    canvasFramesCategories,
    categoryName,
    canvasFramesSizes,
  } = useCanvasFrames({});
  const { getSupplier, getSupplierCurrencies, suppliers } = useSupplier();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setAllAdditions(canvasFramesSizes);
  }, [canvasFramesSizes]);
  return (
    <div style={clasess.filterContainer}>
      {canvasFramesCategories?.length > 0 ? (
        <GoMakeAutoComplate
          options={canvasFramesCategories}
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
