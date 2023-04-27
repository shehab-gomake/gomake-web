import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { refetchMaterialDataState } from "@/store/refetch-material-data";
import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useCanvasFrames } from "./use-canvas-frames";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";

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
