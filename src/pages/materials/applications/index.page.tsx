import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useApplications } from "./use-applications";
import { HeaderFilter } from "./header-filter";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { headerTable } = useApplications();
  const [allSizes, setAllSizes] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.applications.title")} />
      <HeaderFilter setAllSizes={setAllSizes} />
      <Table tableHeaders={headerTable} tableRows={allSizes} />
    </CustomerAuthLayout>
  );
}
