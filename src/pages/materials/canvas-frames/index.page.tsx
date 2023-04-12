import { useEffect, useState } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { useCanvasFrames } from "./use-canvas-frames";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Additions() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { allAdditions, tabelHeaders, setAllAdditions, getAllAddition } =
    useCanvasFrames({});
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getAllAddition({}),
    });
  }, []);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.additions.title")} />
      <HeaderFilter setAllAdditions={setAllAdditions} />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={allAdditions} />
      </div>
    </CustomerAuthLayout>
  );
}
