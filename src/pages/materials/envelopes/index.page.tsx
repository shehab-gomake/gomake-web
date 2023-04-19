import { useEffect, useState } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useEnvelops } from "./use-envelops";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Envelopes() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    categoryName,
    envelopsCategores,
    envelopsSizes,
    onChangeCategory,
    onChangeSupplier,
    setEnvelopsSizes,
    getEnvelopsSizes,
  } = useEnvelops();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getEnvelopsSizes(),
    });
  }, [supplierId, categoryName]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.envelops.title")} />
      <HeaderFilter
        setEnvelopsSizes={setEnvelopsSizes}
        envelopsSizes={envelopsSizes}
        categoryName={categoryName}
        envelopsCategores={envelopsCategores}
        onChangeCategory={onChangeCategory}
        onChangeSupplier={onChangeSupplier}
      />

      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={[
            t("materials.envelops.category"),
            t("materials.envelops.height"),
            t("materials.envelops.width"),
            t("materials.envelops.quantityInPackage"),
            t("materials.envelops.withWindow"),
            t("materials.envelops.stock"),
            t("materials.envelops.price"),
            t("materials.envelops.settings"),
          ]}
          tableRows={envelopsSizes}
        />
      </div>
    </CustomerAuthLayout>
  );
}
