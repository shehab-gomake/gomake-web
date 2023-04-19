import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useSupplier } from "@/hooks";

import { useLamination } from "./use-lamination";
import { useStyle } from "./style";
import { Skeleton } from "@mui/material";
import { HeaderFilter } from "./header-filter";

export default function Lamination() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    onChangeSupplier,
    onChangeCategory,
    setLaminatioSizes,
    laminationCategores,
    laminationSizes,
    categoryName,
    headerTable,
  } = useLamination();

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.lamination.title")} />
      <HeaderFilter
        setLaminatioSizes={setLaminatioSizes}
        laminationSizes={laminationSizes}
        laminationCategores={laminationCategores}
        categoryName={categoryName}
        onChangeCategory={onChangeCategory}
        onChangeSupplier={onChangeSupplier}
      />
      <Table tableHeaders={headerTable} tableRows={laminationSizes} />
    </CustomerAuthLayout>
  );
}
