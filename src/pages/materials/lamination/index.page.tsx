import { useTranslation } from "react-i18next";

import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useLamination } from "./use-lamination";
import { HeaderFilter } from "./header-filter";

export default function Lamination() {
  const { t } = useTranslation();
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
