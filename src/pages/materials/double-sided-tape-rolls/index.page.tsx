import { useEffect } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { useDoubleSidedTapeRolls } from "./use-Double-sided-tape-rolls";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function DoubleSidedTapeRolls() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    allDoubleSidedTapeRolls,
    tabelHeaders,
    setAllDoubleSidedTapeRolls,
    getAllDoubleSidedTapeRolls,
    onChangeSupplier,
  } = useDoubleSidedTapeRolls();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getAllDoubleSidedTapeRolls(),
    });
  }, [supplierId]);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.doubleSidedTapeRolls.title")} />
      <HeaderFilter
        setAllDoubleSidedTapeRolls={setAllDoubleSidedTapeRolls}
        onChangeSupplier={onChangeSupplier}
        allDoubleSidedTapeRolls={allDoubleSidedTapeRolls}
      />
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={tabelHeaders}
          tableRows={allDoubleSidedTapeRolls}
        />
      </div>
    </CustomerAuthLayout>
  );
}
