import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { refetchMaterialDataState } from "@/store/refetch-material-data";
import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { HeaderFilter } from "./header-filter";
import { useAdditions } from "./use-additions";
import { useStyle } from "./style";

export default function Additions() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { allAdditions, tabelHeaders, setAllAdditions, getAllAddition } =
    useAdditions({});
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
