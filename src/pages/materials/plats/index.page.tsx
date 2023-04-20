import { useEffect, useState } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { usePlats } from "./use-plats";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Braces() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    platsCategores,
    categoryName,
    platsSizes,
    setPlatsSizes,
    getPlatsSizes,
    onChangeCategory,
    onChangeSupplier,
  } = usePlats();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getPlatsSizes(),
    });
  }, [supplierId, categoryName]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.plat.title")} />
      <HeaderFilter
        setPlatsSizes={setPlatsSizes}
        platsSizes={platsSizes}
        categoryName={categoryName}
        platsCategores={platsCategores}
        onChangeCategory={onChangeCategory}
        onChangeSupplier={onChangeSupplier}
      />
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={[
            t("materials.plat.code"),
            t("materials.plat.height"),
            t("materials.plat.width"),
            t("materials.plat.stock"),
            t("materials.plat.price"),
            t("materials.plat.settings"),
          ]}
          tableRows={platsSizes}
        />
      </div>
    </CustomerAuthLayout>
  );
}
