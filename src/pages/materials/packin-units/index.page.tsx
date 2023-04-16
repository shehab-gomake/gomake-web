import { useEffect } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { usePackInDrums } from "./use-packin-drums";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Additions() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    packInUnitsSizes,
    categoryName,
    tabelHeaders,
    packInUnitsCategories,
    setPackInDrumsSizes,
    getPackInDrumsSizes,
    onChangeSupplier,
    onChangeCategory,
  } = usePackInDrums();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getPackInDrumsSizes(),
    });
  }, [supplierId, categoryName]);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.packinUnits.title")} />
      <HeaderFilter
        setPackInDrumsSizes={setPackInDrumsSizes}
        onChangeSupplier={onChangeSupplier}
        onChangeCategory={onChangeCategory}
        packInUnitsCategories={packInUnitsCategories}
        categoryName={categoryName}
        packInUnitsSizes={packInUnitsSizes}
      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={packInUnitsSizes} />
      </div>
    </CustomerAuthLayout>
  );
}
