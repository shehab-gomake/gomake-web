import { useEffect } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { usePackings } from "./use-packings";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Packings() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    packingsVolumes,
    categoryName,
    tabelHeaders,
    packingsCategories,
    setPackingsVolumes,
    getPackingsVolumes,
    onChangeSupplier,
    onChangeCategory,
  } = usePackings();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getPackingsVolumes(),
    });
  }, [supplierId, categoryName]);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.packings.title")} />
      <HeaderFilter
        setPackingsVolumes={setPackingsVolumes}
        onChangeSupplier={onChangeSupplier}
        onChangeCategory={onChangeCategory}
        packingsCategories={packingsCategories}
        categoryName={categoryName}
        packingsVolumes={packingsVolumes}
      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={packingsVolumes} />
      </div>
    </CustomerAuthLayout>
  );
}
