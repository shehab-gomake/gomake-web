import { useEffect } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { useGlues } from "./use-glues";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Glues() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    allGlues,
    tabelHeaders,
    setAllGlues,
    getAllGlues,
    onChangeSupplier,
  } = useGlues();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getAllGlues(),
    });
  }, [supplierId]);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.glues.title")} />
      <HeaderFilter
        setAllGlues={setAllGlues}
        onChangeSupplier={onChangeSupplier}
        allGlues={allGlues}
      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={allGlues} />
      </div>
    </CustomerAuthLayout>
  );
}
