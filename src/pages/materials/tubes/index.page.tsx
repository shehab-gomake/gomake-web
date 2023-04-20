import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { useEffect, useState } from "react";
import { Table } from "@/widgets/table/table";
import { useTubess } from "./use-tubes";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    categoryName,
    tubesCategores,
    tubesSizes,
    getTubessSizes,
    setTubesssSizes,
    onChangeCategory,
    onChangeSupplier,
  } = useTubess();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getTubessSizes(),
    });
  }, [supplierId, categoryName]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.tubes.title")} />
      <HeaderFilter
        setTubesssSizes={setTubesssSizes}
        onChangeCategory={onChangeCategory}
        onChangeSupplier={onChangeSupplier}
        categoryName={categoryName}
        tubesCategores={tubesCategores}
        tubesSizes={tubesSizes}
      />
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={[
            t("materials.tubes.code"),
            t("materials.tubes.lenght"),
            t("materials.tubes.diameter"),
            t("materials.tubes.weight"),
            t("materials.tubes.stock"),
            t("materials.tubes.price"),
            t("materials.tubes.settings"),
          ]}
          tableRows={tubesSizes}
        />
      </div>
    </CustomerAuthLayout>
  );
}
