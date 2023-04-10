import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useSheetPaper } from "./use-hardboards";
import { HeaderFilter } from "./header-filter";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { tabelHeaders } = useSheetPaper();
  const [hardboardsSizes, setHardboardsSizes] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.hardboards.title")} />
      <HeaderFilter setHardboardsSizes={setHardboardsSizes} />
      <Table tableHeaders={tabelHeaders} tableRows={hardboardsSizes} />
    </CustomerAuthLayout>
  );
}
