import { useEffect } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { useColors } from "./use-magnets";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Magneta() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    allMagnets,
    tabelHeaders,
    setAllMagnets,
    getAllMagnets,
    onChangeSupplier,
  } = useColors();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getAllMagnets(),
    });
  }, [supplierId]);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.magnets.title")} />
      <HeaderFilter
        setAllMagnets={setAllMagnets}
        onChangeSupplier={onChangeSupplier}
        allMagnets={allMagnets}
      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={allMagnets} />
      </div>
    </CustomerAuthLayout>
  );
}
