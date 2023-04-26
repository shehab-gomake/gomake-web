import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useApplications } from "./use-applications";
import { HeaderFilter } from "./header-filter";

export default function SheetPaper() {
  const { t } = useTranslation();
  const {
    onChangeCategory,
    onChangeSupplier,
    setAllSizes,
    applicationCategories,
    allSizes,
    categoryName,
    headerTable,
  } = useApplications();
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.applications.title")} />
      <HeaderFilter
        setAllSizes={setAllSizes}
        allSizes={allSizes}
        applicationCategories={applicationCategories}
        categoryName={categoryName}
        onChangeCategory={onChangeCategory}
        onChangeSupplier={onChangeSupplier}
      />
      <Table tableHeaders={headerTable} tableRows={allSizes} />
    </CustomerAuthLayout>
  );
}
