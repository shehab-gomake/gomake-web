import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { HeaderFilter } from "./header-filter";
import { useColors } from "./use-colors";
import { useStyle } from "./style";

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
