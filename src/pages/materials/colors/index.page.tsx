import { useEffect } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { useColors } from "./use-colors";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Colors() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    allColors,
    tabelHeaders,
    setAllColors,
    getAllColors,
    onChangeSupplier,
  } = useColors();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getAllColors(),
    });
  }, [supplierId]);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.colors.title")} />
      <HeaderFilter
        setAllColors={setAllColors}
        onChangeSupplier={onChangeSupplier}
        allColors={allColors}
      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={allColors} />
      </div>
    </CustomerAuthLayout>
  );
}
