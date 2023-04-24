import { useEffect } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { useColors } from "./use-varnishs";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Varnishs() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    allVarnishs,
    tabelHeaders,
    setAllVarnishs,
    getAllVarnishs,
    onChangeSupplier,
  } = useColors();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getAllVarnishs(),
    });
  }, [supplierId]);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.varnishs.title")} />
      <HeaderFilter
        setAllVarnishs={setAllVarnishs}
        onChangeSupplier={onChangeSupplier}
        allVarnishs={allVarnishs}
      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={allVarnishs} />
      </div>
    </CustomerAuthLayout>
  );
}
