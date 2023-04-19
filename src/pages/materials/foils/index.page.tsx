import { useEffect } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { useFoils } from "./use-foils";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Additions() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    foilsSizes,
    categoryName,
    tabelHeaders,
    foilsCategories,
    setFoilsSizes,
    getFoilsSizes,
    onChangeSupplier,
    onChangeCategory,
  } = useFoils();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getFoilsSizes(),
    });
  }, [supplierId, categoryName]);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.foils.title")} />
      <HeaderFilter
        setFoilsSizes={setFoilsSizes}
        onChangeSupplier={onChangeSupplier}
        onChangeCategory={onChangeCategory}
        foilsCategories={foilsCategories}
        categoryName={categoryName}
        foilsSizes={foilsSizes}
      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={foilsSizes} />
      </div>
    </CustomerAuthLayout>
  );
}
