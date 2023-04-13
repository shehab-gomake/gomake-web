import { useEffect } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { useCanvasFrames } from "./use-canvas-frames";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Additions() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    canvasFramesSizes,
    tabelHeaders,
    setCanvasFramesSizes,
    getCanvasFrameSizes,
    supplierId,
    categoryName,
    onChangeSupplier,
    onChangeCategory,
    canvasFramesCategories,
  } = useCanvasFrames();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getCanvasFrameSizes(),
    });
  }, [supplierId, categoryName]);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.canvasFrames.title")} />
      <HeaderFilter
        setAllCanvasFrame={setCanvasFramesSizes}
        onChangeSupplier={onChangeSupplier}
        onChangeCategory={onChangeCategory}
        canvasFramesCategories={canvasFramesCategories}
        categoryName={categoryName}
        canvasFramesSizes={canvasFramesSizes}
      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={canvasFramesSizes} />
      </div>
    </CustomerAuthLayout>
  );
}
