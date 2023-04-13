import { useEffect } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { useCanvasFrames } from "./use-frames";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Additions() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    framesSizes,
    categoryName,
    tabelHeaders,
    framesCategories,
    setFramesSizes,
    getFramesSizes,
    onChangeSupplier,
    onChangeCategory,
  } = useCanvasFrames();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getFramesSizes(),
    });
  }, [supplierId, categoryName]);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.frames.title")} />
      <HeaderFilter
        setFramesSizes={setFramesSizes}
        onChangeSupplier={onChangeSupplier}
        onChangeCategory={onChangeCategory}
        framesCategories={framesCategories}
        categoryName={categoryName}
        framesSizes={framesSizes}
      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={framesSizes} />
      </div>
    </CustomerAuthLayout>
  );
}
